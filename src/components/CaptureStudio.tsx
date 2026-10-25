import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Camera,
  CheckCircle2,
  Compass,
  ImagePlus,
  RefreshCw,
  Trash2,
  Upload,
  X,
  ZoomIn,
} from 'lucide-react';
import {
  getDirectionLabel,
  getLocalizedDirections,
} from '../i18n/domainTranslations';
import { UI_STRINGS } from '../i18n/uiStrings';
import {
  CaptureDirection,
  CapturedAngleImage,
  LocaleCode,
} from '../types/artifact';
import {
  analyzeCanvasOrMediaFrame,
  loadImageElement,
} from '../utils/imageAnalysis';

interface CaptureStudioProps {
  locale: LocaleCode;
  angles: CapturedAngleImage[];
  onAddAngle: (angle: CapturedAngleImage) => void;
  onAddMultipleAngles: (newAngles: CapturedAngleImage[]) => void;
  onUpdateDirection: (id: string, direction: CaptureDirection) => void;
  onRemoveAngle: (id: string) => void;
  onClearAll: () => void;
  onJumpTo3D: () => void;
  externalStopSignal?: number;
}

export const CaptureStudio: React.FC<CaptureStudioProps> = ({
  locale,
  angles,
  onAddAngle,
  onAddMultipleAngles,
  onUpdateDirection,
  onRemoveAngle,
  onClearAll,
  onJumpTo3D,
  externalStopSignal = 0,
}) => {
  const t = UI_STRINGS[locale];
  const isRtl = locale === 'ar';
  const localizedDirections = getLocalizedDirections(locale);

  const [inputMode, setInputMode] = useState<'camera' | 'upload'>('camera');
  const [selectedDirection, setSelectedDirection] = useState<CaptureDirection>(
    CaptureDirection.Front
  );
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [mirrorVideo] = useState<boolean>(false);
  const [showReticle] = useState<boolean>(true);
  const [cameraErrorKind, setCameraErrorKind] = useState<
    'unsupported' | 'permission' | null
  >(null);
  const [shutterFlash, setShutterFlash] = useState<boolean>(false);
  const [liveTelemetry, setLiveTelemetry] = useState<{
    sharpness: number;
    brightness: number;
  }>({ sharpness: 82, brightness: 64 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadNoticeState, setUploadNoticeState] = useState<
    | { kind: 'invalid' }
    | { kind: 'below_min'; added: number; rem: number }
    | { kind: 'complete'; total: number }
    | null
  >(null);
  const [inspectedAngle, setInspectedAngle] = useState<CapturedAngleImage | null>(
    null
  );

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  const startLiveCamera = useCallback(
    async (requestedFacing: 'environment' | 'user' = facingMode) => {
      setCameraErrorKind(null);
      stopCameraStream();

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraErrorKind('unsupported');
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
        setCameraActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch {
        setCameraErrorKind('permission');
      }
    },
    [facingMode, stopCameraStream]
  );

  useEffect(() => {
    if (cameraActive && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraActive, inputMode]);

  useEffect(() => {
    if (externalStopSignal > 0) {
      stopCameraStream();
    }
  }, [externalStopSignal, stopCameraStream]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((tr) => tr.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (inputMode !== 'camera' || !cameraActive) return;

    const timer = window.setInterval(() => {
      if (cameraActive && videoRef.current && videoRef.current.videoWidth > 0) {
        const res = analyzeCanvasOrMediaFrame(
          videoRef.current,
          videoRef.current.videoWidth,
          videoRef.current.videoHeight
        );
        setLiveTelemetry({
          sharpness: res.sharpnessScore,
          brightness: res.brightnessPct,
        });
      }
    }, 450);

    return () => window.clearInterval(timer);
  }, [inputMode, cameraActive]);

  const advanceToNextUncapturedDirection = useCallback(
    (justCapturedDir: CaptureDirection, currentList: CapturedAngleImage[]) => {
      const taken = new Set([
        ...currentList.map((a) => a.direction),
        justCapturedDir,
      ]);
      const next = localizedDirections.find((d) => !taken.has(d.id));
      if (next) {
        setSelectedDirection(next.id);
      }
    },
    [localizedDirections]
  );

  const handleCaptureLiveFrame = () => {
    const spec =
      localizedDirections.find((d) => d.id === selectedDirection) ??
      localizedDirections[0];

    const outCanvas = document.createElement('canvas');
    const outCtx = outCanvas.getContext('2d');
    if (!outCtx) return;

    if (cameraActive && videoRef.current && videoRef.current.videoWidth > 0) {
      const vw = videoRef.current.videoWidth;
      const vh = videoRef.current.videoHeight;
      outCanvas.width = vw;
      outCanvas.height = vh;
      if (mirrorVideo) {
        outCtx.translate(vw, 0);
        outCtx.scale(-1, 1);
      }
      outCtx.drawImage(videoRef.current, 0, 0, vw, vh);
    } else {
      return;
    }

    const stats = analyzeCanvasOrMediaFrame(
      outCanvas,
      outCanvas.width,
      outCanvas.height
    );
    const dataUrl = outCanvas.toDataURL('image/jpeg', 0.92);

    setShutterFlash(true);
    window.setTimeout(() => setShutterFlash(false), 160);

    const newAngle: CapturedAngleImage = {
      id: `cam-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      direction: spec.id,
      labelAr: spec.label,
      azimuthDeg: spec.azimuthDeg,
      elevationDeg: spec.elevationDeg,
      dataUrl,
      source: 'camera',
      width: outCanvas.width,
      height: outCanvas.height,
      capturedAt: new Date().toISOString(),
      sharpnessScore: stats.sharpnessScore,
      brightnessPct: stats.brightnessPct,
    };

    onAddAngle(newAngle);
    advanceToNextUncapturedDirection(spec.id, angles);
  };

  const processUploadedFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) {
      setUploadNoticeState({ kind: 'invalid' });
      return;
    }

    const existingDirs = new Set(angles.map((a) => a.direction));
    const availableSpecs = [
      ...localizedDirections.filter((d) => !existingDirs.has(d.id)),
      ...localizedDirections,
    ];

    const created: CapturedAngleImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error('read error'));
          reader.readAsDataURL(file);
        });

        const img = await loadImageElement(dataUrl);
        const maxDim = 1200;
        let targetW = img.naturalWidth || 800;
        let targetH = img.naturalHeight || 800;
        if (targetW > maxDim || targetH > maxDim) {
          const scale = maxDim / Math.max(targetW, targetH);
          targetW = Math.round(targetW * scale);
          targetH = Math.round(targetH * scale);
        }

        const normCanvas = document.createElement('canvas');
        normCanvas.width = targetW;
        normCanvas.height = targetH;
        const nCtx = normCanvas.getContext('2d');
        if (nCtx) {
          nCtx.drawImage(img, 0, 0, targetW, targetH);
        }
        const normalizedUrl = normCanvas.toDataURL('image/jpeg', 0.9);
        const stats = analyzeCanvasOrMediaFrame(normCanvas, targetW, targetH);
        const assignedSpec = availableSpecs[i % availableSpecs.length];

        created.push({
          id: `up-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
          direction: assignedSpec.id,
          labelAr: assignedSpec.label,
          azimuthDeg: assignedSpec.azimuthDeg,
          elevationDeg: assignedSpec.elevationDeg,
          dataUrl: normalizedUrl,
          source: 'upload',
          width: targetW,
          height: targetH,
          capturedAt: new Date().toISOString(),
          sharpnessScore: stats.sharpnessScore,
          brightnessPct: stats.brightnessPct,
        });
      } catch {
        // Skip unreadable file safely
      }
    }

    if (created.length > 0) {
      const totalAfter = angles.length + created.length;
      if (totalAfter < 3) {
        setUploadNoticeState({
          kind: 'below_min',
          added: created.length,
          rem: 3 - totalAfter,
        });
      } else {
        setUploadNoticeState({ kind: 'complete', total: totalAfter });
      }
      onAddMultipleAngles(created);
    }
  };

  const activeSpec =
    localizedDirections.find((d) => d.id === selectedDirection) ??
    localizedDirections[0];
  const minRequired = 3;
  const remainingForMin = Math.max(0, minRequired - angles.length);
  const meetsMinimum = angles.length >= minRequired;

  const uploadNoticeMessage =
    uploadNoticeState?.kind === 'invalid'
      ? t.invalidFileNotice
      : uploadNoticeState?.kind === 'below_min'
      ? t.addedBelowMinNotice(uploadNoticeState.added, uploadNoticeState.rem)
      : uploadNoticeState?.kind === 'complete'
      ? t.addedCompleteNotice(uploadNoticeState.total)
      : null;

  return (
    <section
      id="capture-studio"
      className="py-14 border-b border-[#DED4C3] bg-[#F4EEE3]"
    >
      <div className="max-w-[1160px] mx-auto px-6">
        {/* Clean Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold text-[#0F4C45] mb-1">
              {t.sec1Kicker1} <span className="text-[#9E6E24]">·</span>{' '}
              {t.sec1Kicker2}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1814] balance-text">
              {t.sec1Title}
            </h2>
          </div>

          <div
            role="tablist"
            aria-label={t.sec1Title}
            className="segmented-track self-start sm:self-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={inputMode === 'camera'}
              onClick={() => setInputMode('camera')}
              className={`segmented-tab px-4 py-2 text-xs ${
                inputMode === 'camera'
                  ? 'segmented-tab-active'
                  : 'segmented-tab-idle'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{t.tabLiveCamera}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={inputMode === 'upload'}
              onClick={() => {
                stopCameraStream();
                setInputMode('upload');
              }}
              className={`segmented-tab px-4 py-2 text-xs ${
                inputMode === 'upload'
                  ? 'segmented-tab-active'
                  : 'segmented-tab-idle'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{t.tabUploadPhotos}</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Capture & Angle Tray Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Primary Column (7 cols): Live Camera Rig OR Multi-File Dropzone */}
          <div className="lg:col-span-7 card-guardian p-6">
            {/* Sculpted Compass Direction Selector */}
            <div className="mb-5">
              <div className="text-xs font-semibold text-[#1C1814] flex items-center gap-1.5 mb-2.5">
                <Compass className="w-4 h-4 text-[#9E6E24]" />
                <span>{t.chooseDirectionLabel}</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {localizedDirections.map((spec) => {
                  const isSelected = selectedDirection === spec.id;
                  const isCaptured = angles.some((a) => a.direction === spec.id);
                  return (
                    <button
                      key={spec.id}
                      type="button"
                      onClick={() => setSelectedDirection(spec.id)}
                      className={`py-2 px-2.5 rounded-full border text-xs font-semibold transition-all duration-150 whitespace-nowrap shrink-0 flex items-center justify-center gap-1 cursor-pointer ${
                        isSelected
                          ? 'bg-[#0F4C45] text-[#FBF9F5] border-[#09302B] shadow-xs'
                          : isCaptured
                          ? 'bg-[#EDF5F3] text-[#0F4C45] border-[#0F4C45]/35'
                          : 'bg-[#FAF7F1] text-[#5C5247] border-[#D8CCB7] hover:border-[#9E6E24] hover:text-[#1C1814]'
                      }`}
                    >
                      {isCaptured && (
                        <CheckCircle2
                          className={`w-3 h-3 shrink-0 ${
                            isSelected ? 'text-[#F3D28C]' : 'text-[#0F4C45]'
                          }`}
                        />
                      )}
                      <span className="truncate">{spec.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {inputMode === 'camera' ? (
              <div>
                {/* Camera Optical Viewport */}
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#141210] border border-[#3B332A] flex items-center justify-center">
                  {cameraActive && (
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      autoPlay
                      className={`w-full h-full object-cover ${
                        mirrorVideo ? 'scale-x-[-1]' : ''
                      }`}
                    />
                  )}

                  {!cameraActive && (
                    <div className="px-6 py-8 text-center max-w-md mx-auto">
                      <Camera className="w-10 h-10 text-[#C89B4F] mx-auto mb-3 stroke-[1.5]" />
                      <h3 className="text-xl font-bold text-[#FBF9F5] mb-2">
                        {t.liveCameraHeading}
                      </h3>
                      <p className="text-xs text-[#C7BEB2] leading-relaxed mb-6">
                        {t.liveCameraDesc}
                      </p>
                      {cameraErrorKind && (
                        <p className="text-xs text-[#F5D08A] mb-4 leading-relaxed">
                          {cameraErrorKind === 'unsupported'
                            ? t.cameraUnsupportedErr
                            : t.cameraPermissionErr}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => startLiveCamera(facingMode)}
                          className="btn-guardian-primary px-5 py-2.5 text-xs"
                        >
                          {t.startLiveCameraBtn}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            stopCameraStream();
                            setInputMode('upload');
                          }}
                          className="btn-guardian-dark px-5 py-2.5 text-xs"
                        >
                          <Upload className="w-3.5 h-3.5 text-[#F3D28C] shrink-0" />
                          <span>{t.tabUploadPhotos}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Optical Alignment Reticle Overlay */}
                  {cameraActive && showReticle && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <svg
                        viewBox="0 0 400 300"
                        className="w-full h-full opacity-75"
                        aria-hidden="true"
                      >
                        <circle
                          cx="200"
                          cy="150"
                          r="92"
                          fill="none"
                          stroke="#F3D28C"
                          strokeWidth="1"
                          strokeDasharray="6 4"
                        />
                        <rect
                          x="76"
                          y="38"
                          width="248"
                          height="224"
                          fill="none"
                          stroke="#FBF9F5"
                          strokeWidth="0.8"
                          strokeOpacity="0.55"
                        />
                        <line
                          x1="185"
                          y1="150"
                          x2="215"
                          y2="150"
                          stroke="#F3D28C"
                          strokeWidth="1.2"
                        />
                        <line
                          x1="200"
                          y1="135"
                          x2="200"
                          y2="165"
                          stroke="#F3D28C"
                          strokeWidth="1.2"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Top Overlay Readout inside Camera Frame */}
                  {cameraActive && (
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
                      <div className="px-3 py-1.5 rounded-lg bg-[#141210]/85 border border-white/10 text-[#FBF9F5] text-xs">
                        <span>{activeSpec.label}</span>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-[#141210]/85 border border-white/10 text-[#E7DFD3] text-xs font-mono tabular-nums">
                        {t.telemetryLight} {liveTelemetry.brightness}% ·{' '}
                        {t.telemetrySharpness} {liveTelemetry.sharpness}%
                      </div>
                    </div>
                  )}

                  {shutterFlash && (
                    <div className="pointer-events-none absolute inset-0 bg-white/85 transition-opacity duration-150" />
                  )}
                </div>

                {/* Clean Camera Action Bar */}
                {cameraActive && (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const next =
                            facingMode === 'environment' ? 'user' : 'environment';
                          setFacingMode(next);
                          startLiveCamera(next);
                        }}
                        className="btn-guardian-secondary px-4 py-2 text-xs"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-[#9E6E24]" />
                        <span>{t.switchLensBtn}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => stopCameraStream()}
                        className="btn-guardian-secondary px-4 py-2 text-xs"
                      >
                        {t.stopStreamBtn}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleCaptureLiveFrame}
                      className="btn-guardian-primary px-5 py-2.5 text-xs"
                    >
                      <Camera className="w-4 h-4 text-[#F3D28C]" />
                      <span>
                        {t.captureAnglePrefix}: {activeSpec.shortLabel}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Multi-Image Upload Zone (>= 3 Photos) */
              <div>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      processUploadedFiles(e.dataTransfer.files);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`aspect-[4/3] w-full rounded-xl border-2 border-dashed transition-colors flex flex-col items-center justify-center p-8 text-center cursor-pointer ${
                    isDragging
                      ? 'border-[#0F4C45] bg-[#0F4C45]/5'
                      : 'border-[#CDBFA7] bg-[#FAF7F1] hover:border-[#9E6E24]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        processUploadedFiles(e.target.files);
                        e.target.value = '';
                      }
                    }}
                    className="hidden"
                  />
                  <ImagePlus className="w-11 h-11 text-[#9E6E24] mb-4 stroke-[1.5]" />
                  <h3 className="text-xl font-bold text-[#1C1814] mb-2">
                    {t.dropzoneTitle}
                  </h3>
                  <p className="text-sm text-[#5C5247] max-w-md leading-relaxed mb-5">
                    {t.dropzoneDesc}
                  </p>
                  <span className="btn-guardian-primary px-5 py-2.5 text-xs">
                    {t.dropzoneBtn}
                  </span>
                </div>

                {uploadNoticeMessage && (
                  <p className="mt-3 text-xs font-medium text-[#0F4C45]">
                    {uploadNoticeMessage}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Secondary Column (5 cols): Minimum-3-Photos Gate & Multi-Angle Tray */}
          <div className="lg:col-span-5 card-guardian p-6">
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#EAE1D2]">
              <div>
                <h3 className="text-xl font-bold text-[#1C1814]">
                  {t.trayTitle}
                </h3>
                <p className="text-xs text-[#6E6357] mt-0.5 tabular-nums">
                  {t.trayCountSub(angles.length)}
                </p>
              </div>
              {angles.length > 0 && (
                <button
                  type="button"
                  onClick={onClearAll}
                  className="btn-guardian-secondary px-3.5 py-1.5 text-xs hover:text-rose-800 hover:border-rose-300"
                >
                  {t.clearAllBtn}
                </button>
              )}
            </div>

            {/* Minimum 3 Photos Progress Meter */}
            <div className="my-5 p-4 rounded-xl bg-[#FAF7F1] border border-[#E2D8C7]">
              <div className="flex items-center justify-between gap-2 text-xs mb-2">
                <span className="font-semibold text-[#1C1814]">
                  {meetsMinimum
                    ? t.minMetStatus
                    : t.minRemainingStatus(remainingForMin)}
                </span>
                <span className="font-mono font-semibold text-[#0F4C45] tabular-nums shrink-0">
                  {Math.min(angles.length, 3)} / 3+
                </span>
              </div>
              <div className="w-full h-2 bg-[#E5DDD0] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-transform duration-200 ${
                    isRtl ? 'origin-right' : 'origin-left'
                  } ${meetsMinimum ? 'bg-[#0F4C45]' : 'bg-[#9E6E24]'}`}
                  style={{
                    transform: `scaleX(${Math.min(1, angles.length / 3)})`,
                  }}
                />
              </div>
              {meetsMinimum && (
                <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-medium text-[#0F4C45]">
                    {t.minUnlockedNote}
                  </span>
                  <button
                    type="button"
                    onClick={onJumpTo3D}
                    className="btn-guardian-primary px-4 py-1.5 text-xs"
                  >
                    {t.open3DStudioBtn}
                  </button>
                </div>
              )}
            </div>

            {/* Captured / Uploaded Slots List */}
            {angles.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-[#D5C9B4] rounded-xl px-4 bg-[#FAF7F1]/50">
                <p className="text-sm font-semibold text-[#4A423A] mb-1">
                  {t.emptyTrayTitle}
                </p>
                <p className="text-xs text-[#6E6357] leading-relaxed">
                  {t.emptyTrayDesc}
                </p>
              </div>
            ) : (
              <div
                className={`space-y-3 max-h-[420px] overflow-y-auto ${
                  isRtl ? 'pl-1' : 'pr-1'
                }`}
              >
                {angles.map((item, index) => {
                  const localizedDirLabel = getDirectionLabel(
                    locale,
                    item.direction
                  );
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-[#E2D8C7] hover:border-[#C89E54] transition-colors bg-[#FAF7F1]/75"
                    >
                      <button
                        type="button"
                        onClick={() => setInspectedAngle(item)}
                        className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#EAE1D0] border border-[#D8CCB7] shrink-0 group cursor-pointer"
                        aria-label={localizedDirLabel}
                      >
                        <img
                          src={item.dataUrl}
                          alt={localizedDirLabel}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ZoomIn className="w-4 h-4 text-white" />
                        </span>
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-xs text-[#6E6357] mb-1 tabular-nums flex-wrap">
                          <span className="font-mono font-semibold text-[#9E6E24]">
                            #{index + 1}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>
                            {item.source === 'camera'
                              ? t.sourceCamera
                              : item.source === 'upload'
                              ? t.sourceUpload
                              : t.sourcePreset}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>
                            {t.telemetrySharpness} {item.sharpnessScore}%
                          </span>
                        </div>

                        <label
                          className="sr-only"
                          htmlFor={`dir-select-${item.id}`}
                        >
                          {t.chooseDirectionLabel}
                        </label>
                        <select
                          id={`dir-select-${item.id}`}
                          value={item.direction}
                          onChange={(e) =>
                            onUpdateDirection(
                              item.id,
                              e.target.value as CaptureDirection
                            )
                          }
                          className="input-guardian text-xs font-semibold bg-white px-2.5 py-1.5"
                        >
                          {localizedDirections.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveAngle(item.id)}
                        aria-label={t.deleteAngleAria}
                        className="p-2 text-[#6E6357] hover:text-rose-800 rounded-full hover:bg-[#EAE1D0] transition-colors shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* High-Resolution Image Inspection Lightbox */}
      {inspectedAngle && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={getDirectionLabel(locale, inspectedAngle.direction)}
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          onClick={() => setInspectedAngle(null)}
        >
          <div
            className="bg-[#FBF9F5] border border-[#D4C7B0] rounded-2xl max-w-2xl w-full p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h4 className="text-lg font-bold text-[#1C1814]">
                  {getDirectionLabel(locale, inspectedAngle.direction)}
                </h4>
                <p className="text-xs text-[#6E6357] tabular-nums">
                  {t.lightboxMeta(
                    inspectedAngle.width,
                    inspectedAngle.height,
                    inspectedAngle.sharpnessScore,
                    inspectedAngle.brightnessPct
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInspectedAngle(null)}
                className="btn-guardian-secondary p-2"
                aria-label={t.closePreviewAria}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-square max-h-[68vh] mx-auto overflow-hidden rounded-xl bg-[#141210] flex items-center justify-center">
              <img
                src={inspectedAngle.dataUrl}
                alt={getDirectionLabel(locale, inspectedAngle.direction)}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
