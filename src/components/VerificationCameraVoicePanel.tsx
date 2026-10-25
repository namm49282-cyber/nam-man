import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Camera,
  CheckCircle2,
  FileText,
  Play,
  Printer,
  RefreshCw,
  Square,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { COMPARISON_STRINGS } from '../i18n/comparisonStrings';
import { UI_STRINGS } from '../i18n/uiStrings';
import { DocumentedArtifact, LocaleCode } from '../types/artifact';
import {
  analyzeCanvasOrMediaFrame,
  loadImageElement,
} from '../utils/imageAnalysis';
import {
  buildArtifactVoiceBriefing,
  isSpeechSynthesisSupported,
  playDetectionChime,
  primeSpeechSynthesisOnUserGesture,
  speakArtifactBriefing,
  stopArtifactBriefing,
} from '../utils/voiceBriefing';

interface VerificationCameraVoicePanelProps {
  locale: LocaleCode;
  artifact: DocumentedArtifact | null;
  isOpen: boolean;
  autoOpenSignal: number;
  onClose: () => void;
  onExportFullCertifiedDossierPdf: () => void;
  isExportingFullDossierPdf: boolean;
  onExportVerificationPdf: () => void;
  isExportingVerificationPdf: boolean;
  onJumpToCapture?: () => void;
}

export const VerificationCameraVoicePanel: React.FC<
  VerificationCameraVoicePanelProps
> = ({
  locale,
  artifact,
  isOpen,
  autoOpenSignal,
  onClose,
  onExportFullCertifiedDossierPdf,
  isExportingFullDossierPdf,
  onExportVerificationPdf,
  isExportingVerificationPdf,
  onJumpToCapture,
}) => {
  const cs = COMPARISON_STRINGS[locale];
  const t = UI_STRINGS[locale];

  const [hardwareCameraActive, setHardwareCameraActive] =
    useState<boolean>(false);
  const [opticalFallbackActive, setOpticalFallbackActive] =
    useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>(
    'environment'
  );
  const [detectionPhase, setDetectionPhase] = useState<'scanning' | 'detected'>(
    'scanning'
  );
  const [liveTelemetry, setLiveTelemetry] = useState<{
    sharpness: number;
    brightness: number;
  }>({ sharpness: 86, brightness: 68 });

  const [autoVoiceEnabled, setAutoVoiceEnabled] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [hasSpokenCurrent, setHasSpokenCurrent] = useState<boolean>(false);
  const [speechSupported] = useState<boolean>(() =>
    isSpeechSynthesisSupported()
  );

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const opticalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cachedArtifactImgRef = useRef<HTMLImageElement | null>(null);
  const detectionTimeoutRef = useRef<number | null>(null);
  const lastNarratedKeyRef = useRef<string>('');

  const briefing = useMemo(
    () => (artifact ? buildArtifactVoiceBriefing(artifact, locale) : null),
    [artifact, locale]
  );

  const stopStream = useCallback(() => {
    if (detectionTimeoutRef.current !== null) {
      window.clearTimeout(detectionTimeoutRef.current);
      detectionTimeoutRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setHardwareCameraActive(false);
    setOpticalFallbackActive(false);
  }, []);

  const triggerBriefingSpeech = useCallback(
    (scriptToSpeak: string, targetLocale: LocaleCode) => {
      if (!isSpeechSynthesisSupported()) return;
      speakArtifactBriefing(scriptToSpeak, targetLocale, {
        onStart: () => {
          setIsSpeaking(true);
          setHasSpokenCurrent(true);
        },
        onEnd: () => {
          setIsSpeaking(false);
        },
        onError: () => {
          setIsSpeaking(false);
        },
      });
    },
    []
  );

  const startVerificationCamera = useCallback(
    async (requestedFacing: 'environment' | 'user' = facingMode) => {
      stopStream();
      setDetectionPhase('scanning');

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setOpticalFallbackActive(true);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: requestedFacing },
            width: { ideal: 1280 },
            height: { ideal: 960 },
          },
          audio: false,
        });
        streamRef.current = stream;
        setHardwareCameraActive(true);
        setOpticalFallbackActive(false);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch {
        setHardwareCameraActive(false);
        setOpticalFallbackActive(true);
      }
    },
    [facingMode, stopStream]
  );

  // Open camera directly whenever panel is opened or autoOpenSignal fires
  useEffect(() => {
    if (!isOpen) {
      stopStream();
      stopArtifactBriefing();
      setIsSpeaking(false);
      lastNarratedKeyRef.current = '';
      return;
    }

    startVerificationCamera(facingMode);

    return () => {
      stopStream();
      stopArtifactBriefing();
    };
  }, [isOpen, autoOpenSignal, facingMode, startVerificationCamera, stopStream]);

  // Attach hardware video stream when video element mounts
  useEffect(() => {
    if (hardwareCameraActive && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [hardwareCameraActive, isOpen]);

  // Preload ONLY the user's registered artifact photo for optical fallback
  useEffect(() => {
    let active = true;
    cachedArtifactImgRef.current = null;
    const primaryUrl = artifact?.angles[0]?.dataUrl;
    if (primaryUrl) {
      loadImageElement(primaryUrl)
        .then((img) => {
          if (active) {
            cachedArtifactImgRef.current = img;
          }
        })
        .catch(() => {});
    }
    return () => {
      active = false;
    };
  }, [artifact]);

  // Live optical viewfinder animation loop when physical webcam is unavailable (zero procedural sample artifacts!)
  useEffect(() => {
    if (!isOpen || !opticalFallbackActive) return;
    let rafId = 0;
    const t0 = performance.now();

    const renderFrame = (now: number) => {
      const canvas = opticalCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const img = cachedArtifactImgRef.current;
        const elapsed = (now - t0) * 0.001;

        if (ctx) {
          const cw = canvas.width;
          const ch = canvas.height;
          ctx.fillStyle = '#141210';
          ctx.fillRect(0, 0, cw, ch);

          if (artifact && img && img.naturalWidth > 0) {
            const zoom = 1.03 + Math.sin(elapsed * 1.3) * 0.018;
            const panX = Math.cos(elapsed * 0.9) * 8;
            const panY = Math.sin(elapsed * 1.1) * 5;

            const imgRatio = img.naturalWidth / img.naturalHeight;
            const canvasRatio = cw / ch;
            let drawW = cw * zoom;
            let drawH = ch * zoom;
            if (imgRatio > canvasRatio) {
              drawH = ch * zoom;
              drawW = drawH * imgRatio;
            } else {
              drawW = cw * zoom;
              drawH = drawW / imgRatio;
            }
            const dx = (cw - drawW) / 2 + panX;
            const dy = (ch - drawH) / 2 + panY;
            ctx.drawImage(img, dx, dy, drawW, drawH);
          } else {
            // Clean empty optical calibration grid (zero sample artifacts)
            ctx.strokeStyle = 'rgba(243, 210, 140, 0.12)';
            ctx.lineWidth = 1;
            for (let gx = 60; gx < cw; gx += 60) {
              ctx.beginPath();
              ctx.moveTo(gx, 0);
              ctx.lineTo(gx, ch);
              ctx.stroke();
            }
            for (let gy = 60; gy < ch; gy += 60) {
              ctx.beginPath();
              ctx.moveTo(0, gy);
              ctx.lineTo(cw, gy);
              ctx.stroke();
            }
          }

          // Gentle optical scan sweep line
          const scanY = ((elapsed * 115) % (ch + 40)) - 20;
          const grad = ctx.createLinearGradient(0, scanY - 18, 0, scanY + 18);
          grad.addColorStop(0, 'rgba(243, 210, 140, 0)');
          grad.addColorStop(0.5, 'rgba(243, 210, 140, 0.28)');
          grad.addColorStop(1, 'rgba(243, 210, 140, 0)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, scanY - 18, cw, 36);
        }
      }
      rafId = requestAnimationFrame(renderFrame);
    };

    rafId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(rafId);
  }, [isOpen, opticalFallbackActive, artifact]);

  // Optical telemetry sampling
  useEffect(() => {
    if (!isOpen || (!hardwareCameraActive && !opticalFallbackActive)) return;
    const interval = window.setInterval(() => {
      if (
        hardwareCameraActive &&
        videoRef.current &&
        videoRef.current.videoWidth > 0
      ) {
        const stats = analyzeCanvasOrMediaFrame(
          videoRef.current,
          videoRef.current.videoWidth,
          videoRef.current.videoHeight
        );
        setLiveTelemetry({
          sharpness: stats.sharpnessScore,
          brightness: stats.brightnessPct,
        });
      } else if (opticalFallbackActive && opticalCanvasRef.current && artifact) {
        const stats = analyzeCanvasOrMediaFrame(
          opticalCanvasRef.current,
          opticalCanvasRef.current.width,
          opticalCanvasRef.current.height
        );
        setLiveTelemetry({
          sharpness: stats.sharpnessScore,
          brightness: stats.brightnessPct,
        });
      }
    }, 450);

    return () => window.clearInterval(interval);
  }, [isOpen, hardwareCameraActive, opticalFallbackActive, artifact]);

  // Detect registered artifact in camera frame & automatically narrate concise voice summary
  useEffect(() => {
    if (
      !isOpen ||
      !artifact ||
      !briefing ||
      (!hardwareCameraActive && !opticalFallbackActive)
    ) {
      setDetectionPhase('scanning');
      setHasSpokenCurrent(false);
      stopArtifactBriefing();
      setIsSpeaking(false);
      return;
    }

    const narrationKey = `${artifact.id}::${locale}::${autoOpenSignal}`;
    setDetectionPhase('scanning');
    setHasSpokenCurrent(false);
    stopArtifactBriefing();
    setIsSpeaking(false);

    const timer = window.setTimeout(() => {
      setDetectionPhase('detected');
      playDetectionChime();

      if (autoVoiceEnabled && lastNarratedKeyRef.current !== narrationKey) {
        lastNarratedKeyRef.current = narrationKey;
        triggerBriefingSpeech(briefing.fullSpokenScript, locale);
      }
    }, 780);

    detectionTimeoutRef.current = timer;
    return () => {
      window.clearTimeout(timer);
    };
  }, [
    isOpen,
    hardwareCameraActive,
    opticalFallbackActive,
    artifact,
    briefing,
    locale,
    autoOpenSignal,
    autoVoiceEnabled,
    triggerBriefingSpeech,
  ]);

  const handleManualRescanAndSpeak = () => {
    if (!artifact || !briefing) return;
    primeSpeechSynthesisOnUserGesture();
    setDetectionPhase('scanning');
    stopArtifactBriefing();
    setIsSpeaking(false);

    window.setTimeout(() => {
      setDetectionPhase('detected');
      playDetectionChime();
      triggerBriefingSpeech(briefing.fullSpokenScript, locale);
    }, 420);
  };

  const handlePlayOrReplay = () => {
    if (!briefing) return;
    primeSpeechSynthesisOnUserGesture();
    triggerBriefingSpeech(briefing.fullSpokenScript, locale);
  };

  const handleStopVoice = () => {
    stopArtifactBriefing();
    setIsSpeaking(false);
  };

  if (!isOpen) return null;

  return (
    <div className="card-guardian overflow-hidden bg-white border-2 border-[#0F4C45]/35">
      {/* Header Strip */}
      <div className="px-5 py-4 bg-[#0F4C45] text-[#FBF9F5] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Camera className="w-5 h-5 text-[#F3D28C] shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] font-mono tracking-wide text-[#F3D28C]">
              {cs.camVerifyKicker}
            </p>
            <h3 className="text-sm sm:text-base font-bold text-white truncate">
              {cs.camVerifyTitle}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {artifact && briefing && (
            <button
              type="button"
              onClick={() => {
                const nextVal = !autoVoiceEnabled;
                setAutoVoiceEnabled(nextVal);
                if (!nextVal) {
                  handleStopVoice();
                } else {
                  primeSpeechSynthesisOnUserGesture();
                  triggerBriefingSpeech(briefing.fullSpokenScript, locale);
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {autoVoiceEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-[#F3D28C] shrink-0" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-white/75 shrink-0" />
              )}
              <span>
                {autoVoiceEnabled ? cs.voiceAutoToggleOn : cs.voiceAutoToggleOff}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              handleStopVoice();
              onClose();
            }}
            aria-label={cs.closeVerifyCameraBtn}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2-Column Body: Camera Viewfinder + Concise Voice Briefing */}
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Column 1 (6 cols): Live Optical Verification Camera */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#141210] border border-[#3B332A] flex items-center justify-center">
              {hardwareCameraActive && (
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  autoPlay
                  className="w-full h-full object-cover"
                />
              )}

              {opticalFallbackActive && !hardwareCameraActive && (
                <canvas
                  ref={opticalCanvasRef}
                  width={760}
                  height={570}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Optical Alignment & Artifact Recognition Reticle */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <svg
                  viewBox="0 0 400 300"
                  className="w-full h-full opacity-85"
                  aria-hidden="true"
                >
                  <rect
                    x="58"
                    y="34"
                    width="284"
                    height="232"
                    rx="12"
                    fill="none"
                    stroke={
                      artifact && detectionPhase === 'detected'
                        ? '#34D399'
                        : '#F3D28C'
                    }
                    strokeWidth="1.5"
                    strokeDasharray={
                      artifact && detectionPhase === 'detected' ? 'none' : '8 5'
                    }
                  />
                  <circle
                    cx="200"
                    cy="150"
                    r="68"
                    fill="none"
                    stroke="#F3D28C"
                    strokeWidth="1"
                    strokeDasharray="5 4"
                  />
                  <line
                    x1="186"
                    y1="150"
                    x2="214"
                    y2="150"
                    stroke="#F3D28C"
                    strokeWidth="1.2"
                  />
                  <line
                    x1="200"
                    y1="136"
                    x2="200"
                    y2="164"
                    stroke="#F3D28C"
                    strokeWidth="1.2"
                  />
                </svg>
              </div>

              {/* Top Detection Status Bar inside Camera */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none flex-wrap">
                <div
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${
                    artifact && detectionPhase === 'detected'
                      ? 'bg-[#09302B]/90 border-[#34D399]/60 text-[#ECFDF5]'
                      : 'bg-[#141210]/85 border-[#F3D28C]/40 text-[#F3D28C]'
                  }`}
                >
                  {artifact && detectionPhase === 'detected' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399] shrink-0" />
                  )}
                  <span>
                    {!artifact
                      ? cs.camEmptyArchiveBadge
                      : detectionPhase === 'detected'
                      ? cs.camDetectedStatus
                      : cs.camScanningStatus}
                  </span>
                </div>

                {hardwareCameraActive && (
                  <div className="px-2.5 py-1 rounded-lg bg-[#141210]/85 border border-white/15 text-[#E7DFD3] text-[11px] font-mono tabular-nums">
                    {t.telemetryLight} {liveTelemetry.brightness}% ·{' '}
                    {t.telemetrySharpness} {liveTelemetry.sharpness}%
                  </div>
                )}
              </div>

              {/* Bottom Caption inside Camera Frame */}
              {artifact && briefing && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-4 py-3 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#FBF9F5] truncate">
                    {artifact.accessionCode} — {briefing.artifactName}
                  </span>
                  <span className="text-[11px] font-mono text-[#F3D28C] shrink-0">
                    {briefing.countryName}
                  </span>
                </div>
              )}
            </div>

            {opticalFallbackActive && !hardwareCameraActive && (
              <p className="mt-2 text-xs text-[#6E6357] leading-relaxed">
                {cs.camOpticalFallbackNote}
              </p>
            )}
          </div>

          {/* Camera Control Strip */}
          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {hardwareCameraActive ? (
                <button
                  type="button"
                  onClick={() => {
                    const next =
                      facingMode === 'environment' ? 'user' : 'environment';
                    setFacingMode(next);
                    startVerificationCamera(next);
                  }}
                  className="btn-guardian-secondary px-3.5 py-2 text-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#9E6E24] shrink-0" />
                  <span>{t.switchLensBtn}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => startVerificationCamera(facingMode)}
                  className="btn-guardian-secondary px-3.5 py-2 text-xs"
                >
                  <Camera className="w-3.5 h-3.5 text-[#0F4C45] shrink-0" />
                  <span>{cs.camRetryHardwareBtn}</span>
                </button>
              )}
            </div>

            {artifact && briefing && (
              <button
                type="button"
                onClick={handleManualRescanAndSpeak}
                className="btn-guardian-primary px-4 py-2 text-xs"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#F3D28C] shrink-0" />
                <span>{cs.camRescanSpeakBtn}</span>
              </button>
            )}
          </div>
        </div>

        {/* Column 2 (6 cols): Concise Voice Summary & Certified Printed Document Card (OR Empty Registration Prompt) */}
        {artifact && briefing ? (
          <div className="lg:col-span-6 rounded-xl bg-[#FAF7F1] border border-[#D8CCB7] p-5 flex flex-col justify-between gap-4">
            <div className="space-y-4">
              {/* Voice Service Status & Audio Controls */}
              <div className="pb-3.5 border-b border-[#E5DDD0] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-lg border shrink-0 ${
                      isSpeaking
                        ? 'bg-[#0F4C45] border-[#09302B] text-[#F3D28C]'
                        : 'bg-white border-[#D8CCB7] text-[#0F4C45]'
                    }`}
                  >
                    <Volume2
                      className={`w-4 h-4 ${isSpeaking ? 'animate-pulse' : ''}`}
                    />
                  </span>
                  <div>
                    <span
                      className={`text-xs font-bold block ${
                        isSpeaking ? 'text-[#0F4C45]' : 'text-[#1C1814]'
                      }`}
                    >
                      {isSpeaking
                        ? cs.voicePanelBadgeSpeaking
                        : cs.voicePanelBadgeReady}
                    </span>
                    {!speechSupported && (
                      <span className="text-[11px] text-[#92400E] block">
                        {cs.voiceUnsupportedHint}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePlayOrReplay}
                    className="btn-guardian-primary px-3.5 py-2 text-xs"
                  >
                    <Play className="w-3.5 h-3.5 text-[#F3D28C] shrink-0" />
                    <span>
                      {hasSpokenCurrent ? cs.voiceReplayBtn : cs.voicePlayBtn}
                    </span>
                  </button>

                  {isSpeaking && (
                    <button
                      type="button"
                      onClick={handleStopVoice}
                      className="btn-guardian-secondary px-3 py-2 text-xs border-rose-300 text-rose-800 hover:bg-rose-50"
                    >
                      <Square className="w-3.5 h-3.5 fill-current shrink-0" />
                      <span>{cs.voiceStopBtn}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Structured Concise Summary Items (Name -> Country -> Ultra-Brief Description) */}
              <dl className="space-y-3 text-sm">
                <div className="pb-2.5 border-b border-[#EAE1D2]">
                  <dt className="text-[11px] font-bold text-[#9E6E24]">
                    {cs.voiceLblArtifact}
                  </dt>
                  <dd className="font-display-heritage text-lg font-bold text-[#1C1814] mt-0.5 leading-snug">
                    {briefing.artifactName}
                  </dd>
                </div>

                <div className="pb-2.5 border-b border-[#EAE1D2]">
                  <dt className="text-[11px] font-bold text-[#9E6E24]">
                    {cs.voiceLblCountryAndSite}
                  </dt>
                  <dd className="text-xs sm:text-sm font-semibold text-[#0F4C45] mt-0.5">
                    {briefing.countryName} · {briefing.siteName}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-bold text-[#9E6E24]">
                    {cs.voiceLblUltraBrief}
                  </dt>
                  <dd className="text-xs sm:text-sm text-[#3D352E] mt-1 leading-relaxed font-medium">
                    {briefing.ultraBriefSummary}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Mandatory Certified Printed Document Notice & One-Click Print/Download Actions */}
            <div className="rounded-xl p-4 bg-[#F5EFE2] border border-[#C89E54] space-y-3">
              <div className="flex items-start gap-2.5">
                <Printer className="w-4 h-4 text-[#9E6E24] shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm font-bold text-[#1C1814] leading-relaxed">
                  {cs.voiceCertifiedDocNotice}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="button"
                  disabled={isExportingFullDossierPdf}
                  onClick={onExportFullCertifiedDossierPdf}
                  className="btn-guardian-primary px-4 py-2 text-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-[#F3D28C] shrink-0" />
                  <span>
                    {isExportingFullDossierPdf
                      ? cs.voiceIssuingFullDocBtn
                      : cs.voicePrintFullDocBtn}
                  </span>
                </button>

                <button
                  type="button"
                  disabled={isExportingVerificationPdf}
                  onClick={onExportVerificationPdf}
                  className="btn-guardian-brass px-3.5 py-2 text-xs"
                >
                  <FileText className="w-3.5 h-3.5 text-[#9E6E24] shrink-0" />
                  <span>
                    {isExportingVerificationPdf
                      ? cs.exportingUrgentPdfBtn
                      : cs.exportUrgentPdfBtn}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-6 rounded-xl bg-[#FAF7F1] border border-dashed border-[#C89E54] p-6 flex flex-col justify-center gap-4">
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-[#9E6E24] block">
                {cs.camEmptyArchiveBadge}
              </span>
              <h4 className="font-display-heritage text-xl font-bold text-[#1C1814] leading-snug">
                {cs.emptyArchiveTitle}
              </h4>
              <p className="text-xs sm:text-sm text-[#4A423A] leading-relaxed">
                {cs.camEmptyArchiveNotice}
              </p>
            </div>

            {onJumpToCapture && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleStopVoice();
                    onClose();
                    onJumpToCapture();
                  }}
                  className="btn-guardian-primary px-5 py-2.5 text-xs"
                >
                  <Camera className="w-4 h-4 text-[#F3D28C] shrink-0" />
                  <span>{cs.emptyArchiveGoStep1Btn}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
