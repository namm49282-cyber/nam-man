import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  Award,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Eye,
  FileText,
  Fingerprint,
  Flame,
  Globe,
  MapPin,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  TrendingUp,
  Volume2,
} from 'lucide-react';
import { COMPARISON_STRINGS } from '../i18n/comparisonStrings';
import { CONSERVATION_STRINGS } from '../i18n/conservationStrings';
import { getDirectionLabel } from '../i18n/domainTranslations';
import { UI_STRINGS } from '../i18n/uiStrings';
import {
  ArtifactConditionGrade,
  ArtifactEnvironmentalProfile,
  ArtifactFormState,
  ArtifactInspectionInput,
  CapturedAngleImage,
  DirectMoistureStatus,
  DocumentedArtifact,
  LocaleCode,
  MaterialConservationClass,
  SurfaceMetrics,
  VisualFingerprintMatch,
} from '../types/artifact';
import { exportComparisonAndRecommendationsPdf } from '../utils/comparisonPdfGenerator';
import {
  compareArtifactCondition,
  createInspectionInputFromArtifact,
  getBaselineProfileForArtifact,
  getRegisteredInventoryCode,
  getRegisteredWeightGrams,
  InspectionScenarioMode,
} from '../utils/conditionComparisonEngine';
import {
  getCountryDisplayName,
  getSortedWorldCountries,
} from '../utils/worldCountries';
import { exportArtifactOfficialPdfReport } from '../utils/pdfReportGenerator';
import {
  getArtifactDisplayTitle,
  getArtifactSiteDisplayName,
  primeSpeechSynthesisOnUserGesture,
} from '../utils/voiceBriefing';
import { ArtifactRegistrationForm } from './ArtifactRegistrationForm';
import { VerificationCameraVoicePanel } from './VerificationCameraVoicePanel';

interface ArtifactConditionVerifierSectionProps {
  locale: LocaleCode;
  angles: CapturedAngleImage[];
  metrics: SurfaceMetrics;
  formState: ArtifactFormState;
  onChangeBasicField: <
    K extends Exclude<keyof ArtifactFormState, 'environmental'>
  >(
    field: K,
    value: ArtifactFormState[K]
  ) => void;
  onChangeEnvField: <K extends keyof ArtifactEnvironmentalProfile>(
    field: K,
    value: ArtifactEnvironmentalProfile[K]
  ) => void;
  onApplyMaterialPreset: (matClass: MaterialConservationClass) => void;
  onSaveArtifact: () => DocumentedArtifact | null;
  onResetNewArtifactForm: () => void;
  onJumpToCapture: () => void;
  registeredArtifacts: DocumentedArtifact[];
  onLoadRegisteredArtifactTo3D: (artifact: DocumentedArtifact) => void;
  onDeleteRegisteredArtifact: (id: string) => void;
  verifyCameraTrigger?: number;
  onTriggerVerifyCamera?: () => void;
}

export const ArtifactConditionVerifierSection: React.FC<
  ArtifactConditionVerifierSectionProps
> = ({
  locale,
  angles,
  metrics,
  formState,
  onChangeBasicField,
  onChangeEnvField,
  onApplyMaterialPreset,
  onSaveArtifact,
  onResetNewArtifactForm,
  onJumpToCapture,
  registeredArtifacts,
  onLoadRegisteredArtifactTo3D,
  onDeleteRegisteredArtifact,
  verifyCameraTrigger = 0,
  onTriggerVerifyCamera,
}) => {
  const t = UI_STRINGS[locale];
  const c = CONSERVATION_STRINGS[locale];
  const cs = COMPARISON_STRINGS[locale];
  const isRtl = locale === 'ar';

  const worldCountries = useMemo(
    () => getSortedWorldCountries(locale),
    [locale]
  );

  const [selectedArtifactId, setSelectedArtifactId] = useState<string>('');
  const [scenarioMode, setScenarioMode] =
    useState<InspectionScenarioMode>('hazard');
  const [inspection, setInspection] = useState<ArtifactInspectionInput | null>(
    null
  );
  const [isExportingUrgentPdf, setIsExportingUrgentPdf] =
    useState<boolean>(false);
  const [isExportingFullDossierPdf, setIsExportingFullDossierPdf] =
    useState<boolean>(false);
  const [isVerifyCameraOpen, setIsVerifyCameraOpen] = useState<boolean>(false);
  const [localCameraSignal, setLocalCameraSignal] = useState<number>(0);

  const reportBlockRef = useRef<HTMLDivElement | null>(null);
  const cameraBlockRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (verifyCameraTrigger > 0) {
      setIsVerifyCameraOpen(true);
    }
  }, [verifyCameraTrigger]);

  const selectedArtifact = useMemo(() => {
    if (registeredArtifacts.length === 0) return null;
    return (
      registeredArtifacts.find((item) => item.id === selectedArtifactId) ??
      registeredArtifacts[0]
    );
  }, [registeredArtifacts, selectedArtifactId]);

  useEffect(() => {
    if (!selectedArtifact) {
      if (selectedArtifactId !== '') {
        setSelectedArtifactId('');
      }
      if (inspection !== null) {
        setInspection(null);
      }
      return;
    }
    if (
      !selectedArtifactId ||
      !registeredArtifacts.some((a) => a.id === selectedArtifactId)
    ) {
      setSelectedArtifactId(selectedArtifact.id);
      setInspection(
        createInspectionInputFromArtifact(
          selectedArtifact,
          locale,
          scenarioMode
        )
      );
    }
  }, [
    selectedArtifact,
    selectedArtifactId,
    inspection,
    registeredArtifacts,
    locale,
    scenarioMode,
  ]);

  // Refresh localized text defaults smoothly when switching among the 5 languages
  useEffect(() => {
    if (!selectedArtifact) return;
    setInspection((prev) => {
      if (!prev) {
        return createInspectionInputFromArtifact(
          selectedArtifact,
          locale,
          scenarioMode
        );
      }
      const nextDefaults = createInspectionInputFromArtifact(
        selectedArtifact,
        locale,
        scenarioMode
      );
      return {
        ...prev,
        inspectorName: nextDefaults.inspectorName,
        currentLocation: nextDefaults.currentLocation,
        fieldNotes: nextDefaults.fieldNotes,
      };
    });
  }, [locale, selectedArtifact, scenarioMode]);

  const handleSelectArtifact = (nextId: string) => {
    setSelectedArtifactId(nextId);
    const found = registeredArtifacts.find((a) => a.id === nextId);
    if (found) {
      setInspection(
        createInspectionInputFromArtifact(found, locale, scenarioMode)
      );
    }
  };

  const applyScenarioPreset = (nextMode: InspectionScenarioMode) => {
    if (!selectedArtifact) return;
    setScenarioMode(nextMode);
    setInspection(
      createInspectionInputFromArtifact(selectedArtifact, locale, nextMode)
    );
  };

  const handleSaveAndSelectForVerification = (): DocumentedArtifact | null => {
    const saved = onSaveArtifact();
    if (saved) {
      setSelectedArtifactId(saved.id);
      setScenarioMode('safe');
      setInspection(createInspectionInputFromArtifact(saved, locale, 'safe'));
    }
    return saved;
  };

  const handleJumpToVerifyFromSave = () => {
    primeSpeechSynthesisOnUserGesture();
    setIsVerifyCameraOpen(true);
    setLocalCameraSignal((n) => n + 1);
    onTriggerVerifyCamera?.();
    document
      .getElementById('condition-verification')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenCameraDirectly = () => {
    primeSpeechSynthesisOnUserGesture();
    setIsVerifyCameraOpen(true);
    setLocalCameraSignal((n) => n + 1);
    window.setTimeout(() => {
      cameraBlockRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }, 50);
  };

  const updateInspectionField = <K extends keyof ArtifactInspectionInput>(
    field: K,
    value: ArtifactInspectionInput[K]
  ) => {
    setInspection((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const comparisonReport = useMemo(() => {
    if (!selectedArtifact || !inspection) return null;
    return compareArtifactCondition(selectedArtifact, inspection, locale);
  }, [selectedArtifact, inspection, locale]);

  const handleExportUrgentPdf = async () => {
    if (!selectedArtifact || !inspection || !comparisonReport) return;
    setIsExportingUrgentPdf(true);
    try {
      await exportComparisonAndRecommendationsPdf(
        selectedArtifact,
        inspection,
        comparisonReport,
        locale
      );
    } finally {
      setIsExportingUrgentPdf(false);
    }
  };

  const handleExportFullCertifiedDossierPdf = async () => {
    if (!selectedArtifact) return;
    setIsExportingFullDossierPdf(true);
    try {
      await exportArtifactOfficialPdfReport(selectedArtifact, locale);
    } finally {
      setIsExportingFullDossierPdf(false);
    }
  };

  const localeCollator = useMemo(() => {
    try {
      const collatorTag =
        locale === 'zh'
          ? 'zh-CN-u-co-pinyin'
          : locale === 'ar'
          ? 'ar'
          : locale === 'fr'
          ? 'fr'
          : locale === 'ru'
          ? 'ru'
          : 'en-US';
      return new Intl.Collator(collatorTag, {
        usage: 'sort',
        sensitivity: 'base',
        ignorePunctuation: true,
      });
    } catch {
      return null;
    }
  }, [locale]);

  const compareAlpha = (a: string, b: string) =>
    localeCollator ? localeCollator.compare(a, b) : a.localeCompare(b);

  // Cascading Step 1: Registered Countries sorted alphabetically
  const registeredCountries = useMemo(() => {
    const map = new Map<string, string>();
    for (const art of registeredArtifacts) {
      const code = (art.countryCode || 'BH').toUpperCase();
      if (!map.has(code)) {
        map.set(code, getCountryDisplayName(code, locale));
      }
    }
    return Array.from(map.entries())
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => compareAlpha(a.name, b.name));
  }, [registeredArtifacts, locale, localeCollator]);

  const activeCountryCode = (selectedArtifact?.countryCode || 'BH').toUpperCase();

  // Cascading Step 2: Registered Sites inside the selected Country sorted alphabetically
  const sitesInSelectedCountry = useMemo(() => {
    const inCountry = registeredArtifacts.filter(
      (art) => (art.countryCode || 'BH').toUpperCase() === activeCountryCode
    );
    const uniqueSites = Array.from(
      new Set(inCountry.map((art) => getArtifactSiteDisplayName(art, locale)))
    );
    return uniqueSites.sort(compareAlpha);
  }, [registeredArtifacts, activeCountryCode, locale, localeCollator]);

  const activeSiteName = selectedArtifact
    ? getArtifactSiteDisplayName(selectedArtifact, locale)
    : sitesInSelectedCountry[0] ?? '';

  // Cascading Step 3: Registered Artifacts inside (Selected Country + Selected Site)
  const artifactsInSelectedSite = useMemo(() => {
    return registeredArtifacts.filter(
      (art) =>
        (art.countryCode || 'BH').toUpperCase() === activeCountryCode &&
        getArtifactSiteDisplayName(art, locale) === activeSiteName
    );
  }, [registeredArtifacts, activeCountryCode, activeSiteName, locale]);

  const handleCascadeCountryChange = (nextCountryCode: string) => {
    if (isVerifyCameraOpen) {
      primeSpeechSynthesisOnUserGesture();
    }
    const matchingCountry = registeredArtifacts.filter(
      (art) => (art.countryCode || 'BH').toUpperCase() === nextCountryCode
    );
    if (matchingCountry.length === 0) return;

    const sortedSites = Array.from(
      new Set(
        matchingCountry.map((art) => getArtifactSiteDisplayName(art, locale))
      )
    ).sort(compareAlpha);
    const firstSite = sortedSites[0];
    const firstArt =
      matchingCountry.find(
        (art) => getArtifactSiteDisplayName(art, locale) === firstSite
      ) ?? matchingCountry[0];

    handleSelectArtifact(firstArt.id);
  };

  const handleCascadeSiteChange = (nextSiteName: string) => {
    if (isVerifyCameraOpen) {
      primeSpeechSynthesisOnUserGesture();
    }
    const firstArtInSite = registeredArtifacts.find(
      (art) =>
        (art.countryCode || 'BH').toUpperCase() === activeCountryCode &&
        getArtifactSiteDisplayName(art, locale) === nextSiteName
    );
    if (firstArtInSite) {
      handleSelectArtifact(firstArtInSite.id);
    }
  };

  const handleCascadeArtifactChange = (nextArtifactId: string) => {
    if (isVerifyCameraOpen) {
      primeSpeechSynthesisOnUserGesture();
    }
    handleSelectArtifact(nextArtifactId);
  };

  const baseProfile = selectedArtifact
    ? getBaselineProfileForArtifact(selectedArtifact, locale)
    : null;

  const displayArtifactTitle = selectedArtifact
    ? getArtifactDisplayTitle(selectedArtifact, locale)
    : '';

  const baselineCountryName = getCountryDisplayName(
    selectedArtifact?.countryCode || 'BH',
    locale
  );

  const regInventoryCode = selectedArtifact
    ? getRegisteredInventoryCode(selectedArtifact)
    : 'INV-2026-001';
  const regWeightGrams = selectedArtifact
    ? getRegisteredWeightGrams(selectedArtifact)
    : 1200;

  const inputCls = 'input-guardian text-sm px-3.5 py-2';
  const numInputCls =
    'input-guardian text-sm font-mono tabular-nums px-3 py-2';

  return (
    <>
      {/* Stage 03: Harmonized Artifact Registration (3 Sub-Steps + World Country Dropdown + Essential Environmental Indicators) */}
      <ArtifactRegistrationForm
        locale={locale}
        angles={angles}
        metrics={metrics}
        formState={formState}
        onChangeBasicField={onChangeBasicField}
        onChangeEnvField={onChangeEnvField}
        onApplyMaterialPreset={onApplyMaterialPreset}
        onSaveArtifact={handleSaveAndSelectForVerification}
        onResetNewArtifactForm={onResetNewArtifactForm}
        onJumpToCapture={onJumpToCapture}
        onJumpToVerification={handleJumpToVerifyFromSave}
        archiveCount={registeredArtifacts.length}
      />

      {/* Stage 04 (Crowning Finale): Authenticity Verification, 3-Horizon Risk Prediction & World-Class Recommendations Export */}
      <section
        id="condition-verification"
        className="py-14 bg-[#EFE7D8] border-b border-[#DED4C3]"
      >
        <div className="max-w-[1160px] mx-auto px-6">
          {/* Finale Section Header */}
          <div className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[#0F4C45] mb-1 tabular-nums">
                {cs.sec4Kicker(registeredArtifacts.length)}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1814] balance-text">
                {cs.sec4Title}
              </h2>
              <p className="text-sm text-[#5C5247] mt-1.5 max-w-3xl leading-relaxed">
                {cs.sec4Subtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (isVerifyCameraOpen) {
                  setIsVerifyCameraOpen(false);
                } else {
                  handleOpenCameraDirectly();
                }
              }}
              className={
                isVerifyCameraOpen
                  ? 'btn-guardian-secondary px-4 py-2.5 text-xs self-start lg:self-auto shrink-0'
                  : 'btn-guardian-primary px-5 py-2.5 text-xs self-start lg:self-auto shrink-0'
              }
            >
              <Camera
                className={`w-4 h-4 shrink-0 ${
                  isVerifyCameraOpen ? 'text-[#0F4C45]' : 'text-[#F3D28C]'
                }`}
              />
              <span>
                {isVerifyCameraOpen
                  ? cs.closeVerifyCameraBtn
                  : cs.openVerifyCameraBtn}
              </span>
            </button>
          </div>

          {/* Empty State when NO artifacts have been registered yet */}
          {!selectedArtifact && (
            <div className="space-y-6">
              <div ref={cameraBlockRef}>
                <VerificationCameraVoicePanel
                  locale={locale}
                  artifact={null}
                  isOpen={isVerifyCameraOpen}
                  autoOpenSignal={verifyCameraTrigger + localCameraSignal}
                  onClose={() => setIsVerifyCameraOpen(false)}
                  onExportFullCertifiedDossierPdf={
                    handleExportFullCertifiedDossierPdf
                  }
                  isExportingFullDossierPdf={isExportingFullDossierPdf}
                  onExportVerificationPdf={handleExportUrgentPdf}
                  isExportingVerificationPdf={isExportingUrgentPdf}
                  onJumpToCapture={onJumpToCapture}
                />
              </div>

              <div className="card-guardian p-8 sm:p-10 bg-white text-center max-w-3xl mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-[#F4EEE3] border border-[#D8CCB7] flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-6 h-6 text-[#0F4C45]" />
                </div>
                <h3 className="font-display-heritage text-xl sm:text-2xl font-bold text-[#1C1814] mb-2.5 balance-text">
                  {cs.emptyArchiveTitle}
                </h3>
                <p className="text-sm text-[#5C5247] leading-relaxed max-w-2xl mx-auto mb-6">
                  {cs.emptyArchiveDesc}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={onJumpToCapture}
                    className="btn-guardian-primary px-5 py-2.5 text-xs sm:text-sm"
                  >
                    <Camera className="w-4 h-4 text-[#F3D28C] shrink-0" />
                    <span>{cs.emptyArchiveGoStep1Btn}</span>
                  </button>
                  <a
                    href="#artifact-registration"
                    className="btn-guardian-secondary px-5 py-2.5 text-xs sm:text-sm"
                  >
                    <ClipboardCheck className="w-4 h-4 text-[#0F4C45] shrink-0" />
                    <span>{cs.emptyArchiveGoStep3Btn}</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {selectedArtifact &&
            inspection &&
            baseProfile &&
            comparisonReport && (
              <div className="space-y-6">
                {/* 1. Cascading Country -> Site -> Artifact Selector & Certified Baseline Dossier */}
                <div className="card-guardian p-5 sm:p-6 bg-white space-y-5">
                  <div>
                    <div className="mb-3.5">
                      <h3 className="text-sm sm:text-base font-bold text-[#0F4C45]">
                        {cs.selectArtifactLabel}
                      </h3>
                      <p className="text-xs text-[#6E6357] mt-0.5">
                        {cs.cascadeSelectHint}
                      </p>
                    </div>

                    {/* 3 Cascading Dropdowns: 1. Country -> 2. Site -> 3. Artifact */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* 1. Country Dropdown */}
                      <div>
                        <label
                          htmlFor="verify-country-select"
                          className="flex items-center gap-1.5 text-xs font-bold text-[#0F4C45] mb-1.5"
                        >
                          <Globe className="w-3.5 h-3.5 text-[#9E6E24] shrink-0" />
                          <span>{cs.cascadeStep1Country}</span>
                        </label>
                        <select
                          id="verify-country-select"
                          value={activeCountryCode}
                          onChange={(e) =>
                            handleCascadeCountryChange(e.target.value)
                          }
                          className="input-guardian text-sm font-semibold px-3.5 py-2.5"
                        >
                          {registeredCountries.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.name} ({country.code})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 2. Site / Location Dropdown */}
                      <div>
                        <label
                          htmlFor="verify-site-select"
                          className="flex items-center gap-1.5 text-xs font-bold text-[#0F4C45] mb-1.5"
                        >
                          <MapPin className="w-3.5 h-3.5 text-[#9E6E24] shrink-0" />
                          <span>{cs.cascadeStep2Site}</span>
                        </label>
                        <select
                          id="verify-site-select"
                          value={activeSiteName}
                          onChange={(e) =>
                            handleCascadeSiteChange(e.target.value)
                          }
                          className="input-guardian text-sm font-semibold px-3.5 py-2.5"
                        >
                          {sitesInSelectedCountry.map((siteName) => (
                            <option key={siteName} value={siteName}>
                              {siteName}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 3. Registered Artifact Dropdown */}
                      <div>
                        <label
                          htmlFor="verify-artifact-select"
                          className="flex items-center gap-1.5 text-xs font-bold text-[#0F4C45] mb-1.5"
                        >
                          <Award className="w-3.5 h-3.5 text-[#9E6E24] shrink-0" />
                          <span>{cs.cascadeStep3Artifact}</span>
                        </label>
                        <select
                          id="verify-artifact-select"
                          value={selectedArtifact.id}
                          onChange={(e) =>
                            handleCascadeArtifactChange(e.target.value)
                          }
                          className="input-guardian text-sm font-semibold px-3.5 py-2.5"
                        >
                          {artifactsInSelectedSite.map((art) => {
                            const aTitle = getArtifactDisplayTitle(art, locale);
                            return (
                              <option key={art.id} value={art.id}>
                                {art.accessionCode} — {aTitle}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Certified Registered Baseline Summary Strip */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-[#FAF7F1] border border-[#E5DDD0]">
                    <div className="flex items-center gap-3.5 min-w-0">
                      {selectedArtifact.angles[0] && (
                        <img
                          src={selectedArtifact.angles[0].dataUrl}
                          alt={`${displayArtifactTitle} - ${getDirectionLabel(
                            locale,
                            selectedArtifact.angles[0].direction
                          )}`}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-lg object-cover border border-[#C89E54] shrink-0 bg-[#EAE1D0]"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#9E6E24]">
                          {cs.baselineCardTitle} · {activeSiteName}
                        </p>
                        <h3 className="font-display-heritage text-lg font-bold text-[#1C1814] truncate">
                          {displayArtifactTitle}
                        </h3>
                        <p className="text-xs text-[#5C5247] mt-0.5 tabular-nums">
                          {cs.baselineMetaLine(
                            selectedArtifact.accessionCode,
                            regInventoryCode,
                            String(regWeightGrams),
                            baselineCountryName,
                            c.materialClasses[baseProfile.materialClass]
                          )}
                        </p>
                        <p className="text-xs font-mono tabular-nums text-[#0F4C45] font-semibold mt-1">
                          {cs.baselineSafeClimate(
                            baseProfile.tempSafeMinC,
                            baseProfile.tempSafeMaxC,
                            baseProfile.rhSafeMinPct,
                            baseProfile.rhSafeMaxPct,
                            comparisonReport.baselineStabilityPct
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleOpenCameraDirectly}
                        className="btn-guardian-primary px-3.5 py-2 text-xs"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-[#F3D28C] shrink-0" />
                        <span>{cs.openVerifyCameraBtn}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onLoadRegisteredArtifactTo3D(selectedArtifact);
                          document
                            .getElementById('spatial-studio')
                            ?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="btn-guardian-secondary px-3.5 py-2 text-xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#0F4C45] shrink-0" />
                        <span>{t.inspectIn3DBtn}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDeleteRegisteredArtifact(selectedArtifact.id)
                        }
                        className="btn-guardian-secondary px-3 py-2 text-xs hover:text-rose-800 hover:border-rose-300"
                      >
                        <Trash2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{cs.deleteArtifactBtn}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 1B. Live Optical Verification Camera & Concise Voice Summary Panel (Auto-opens on Verify & Risk command) */}
                <div ref={cameraBlockRef}>
                  <VerificationCameraVoicePanel
                    locale={locale}
                    artifact={selectedArtifact}
                    isOpen={isVerifyCameraOpen}
                    autoOpenSignal={verifyCameraTrigger + localCameraSignal}
                    onClose={() => setIsVerifyCameraOpen(false)}
                    onExportFullCertifiedDossierPdf={
                      handleExportFullCertifiedDossierPdf
                    }
                    isExportingFullDossierPdf={isExportingFullDossierPdf}
                    onExportVerificationPdf={handleExportUrgentPdf}
                    isExportingVerificationPdf={isExportingUrgentPdf}
                    onJumpToCapture={onJumpToCapture}
                  />
                </div>

                {/* 2. Authenticity Verification & Current Environmental Readings Input Card */}
                <div className="card-guardian p-6 bg-white">
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 mb-5 border-b border-[#E5DDD0]">
                    <div>
                      <h3 className="text-lg font-bold text-[#1C1814]">
                        {cs.inputPanelTitle}
                      </h3>
                      <p className="text-xs text-[#6E6357] mt-0.5">
                        {cs.inputPanelSub}
                      </p>
                    </div>

                    {/* 3 Instant Demonstration Presets */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => applyScenarioPreset('hazard')}
                        className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                          scenarioMode === 'hazard'
                            ? 'border-[#DC2626] bg-[#FEF2F2] text-[#991B1B]'
                            : 'border-red-200 bg-white text-red-800 hover:bg-red-50'
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
                        <span>{cs.presetSimulateHazardBtn}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => applyScenarioPreset('auth_mismatch')}
                        className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                          scenarioMode === 'auth_mismatch'
                            ? 'border-[#991B1B] bg-[#FEE2E2] text-[#7F1D1D]'
                            : 'border-[#DED4C3] bg-[#FAF7F1] text-[#5C5247] hover:text-[#991B1B]'
                        }`}
                      >
                        <Fingerprint className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
                        <span>{cs.presetSimulateAuthAlertBtn}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => applyScenarioPreset('safe')}
                        className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                          scenarioMode === 'safe'
                            ? 'border-[#0F4C45] bg-[#E6F4EF] text-[#0F4C45]'
                            : 'border-[#DED4C3] bg-white text-[#1C1814] hover:border-[#0F4C45]/50'
                        }`}
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-[#0F4C45] shrink-0" />
                        <span>{cs.presetMatchSafeBtn}</span>
                      </button>
                    </div>
                  </div>

                  {/* SUB-PANEL A: Artifact Authenticity & Provenance Verification */}
                  <div className="mb-6 pb-6 border-b border-[#E5DDD0]">
                    <div className="mb-3.5 flex items-center gap-2">
                      <Fingerprint className="w-4 h-4 text-[#0F4C45] shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-[#0F4C45]">
                          {cs.authInputGroupTitle}
                        </h4>
                        <p className="text-xs text-[#6E6357]">
                          {cs.authInputGroupSub}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="auth-inv-code"
                          className="block text-xs font-semibold text-[#1C1814] mb-1"
                        >
                          {cs.lblVerifiedInventoryCode(regInventoryCode)}
                        </label>
                        <input
                          id="auth-inv-code"
                          type="text"
                          value={inspection.verifiedInventoryCode}
                          onChange={(e) =>
                            updateInspectionField(
                              'verifiedInventoryCode',
                              e.target.value
                            )
                          }
                          className={numInputCls}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="auth-weight-grams"
                          className="block text-xs font-semibold text-[#1C1814] mb-1"
                        >
                          {cs.lblMeasuredWeightGrams(regWeightGrams)}
                        </label>
                        <input
                          id="auth-weight-grams"
                          type="number"
                          min="1"
                          step="1"
                          value={inspection.measuredWeightGrams}
                          onChange={(e) =>
                            updateInspectionField(
                              'measuredWeightGrams',
                              Number(e.target.value)
                            )
                          }
                          className={numInputCls}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="auth-fingerprint"
                          className="block text-xs font-semibold text-[#1C1814] mb-1"
                        >
                          {cs.lblVisualFingerprint}
                        </label>
                        <select
                          id="auth-fingerprint"
                          value={inspection.visualFingerprintMatch}
                          onChange={(e) =>
                            updateInspectionField(
                              'visualFingerprintMatch',
                              e.target.value as VisualFingerprintMatch
                            )
                          }
                          className={inputCls}
                        >
                          {(
                            Object.keys(
                              cs.visualFingerprintOptions
                            ) as VisualFingerprintMatch[]
                          ).map((optKey) => (
                            <option key={optKey} value={optKey}>
                              {cs.visualFingerprintOptions[optKey]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* SUB-PANEL B: Custody Site, Condition & Essential Environmental Readings */}
                  <div>
                    <h4 className="text-sm font-bold text-[#1C1814] mb-3.5">
                      {cs.envInputGroupTitle}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5 pb-5 border-b border-[#EFE8DA]">
                      <div>
                        <label
                          htmlFor="insp-country"
                          className="flex items-center gap-1.5 text-xs font-semibold text-[#0F4C45] mb-1"
                        >
                          <Globe className="w-3.5 h-3.5 text-[#9E6E24] shrink-0" />
                          <span>{cs.lblCurrentCountry}</span>
                        </label>
                        <select
                          id="insp-country"
                          value={inspection.countryCode}
                          onChange={(e) =>
                            updateInspectionField('countryCode', e.target.value)
                          }
                          className={inputCls}
                        >
                          {worldCountries.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="insp-location"
                          className="block text-xs font-semibold text-stone-700 mb-1"
                        >
                          {cs.lblCurrentLocation}
                        </label>
                        <input
                          id="insp-location"
                          type="text"
                          value={inspection.currentLocation}
                          onChange={(e) =>
                            updateInspectionField(
                              'currentLocation',
                              e.target.value
                            )
                          }
                          className={inputCls}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="insp-condition"
                          className="block text-xs font-semibold text-stone-700 mb-1"
                        >
                          {cs.lblObservedCondition}
                        </label>
                        <select
                          id="insp-condition"
                          value={inspection.observedCondition}
                          onChange={(e) =>
                            updateInspectionField(
                              'observedCondition',
                              e.target.value as ArtifactConditionGrade
                            )
                          }
                          className={inputCls}
                        >
                          {(
                            Object.keys(
                              c.conditionGrades
                            ) as ArtifactConditionGrade[]
                          ).map((ck) => (
                            <option key={ck} value={ck}>
                              {c.conditionGrades[ck]}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="insp-inspector"
                          className="block text-xs font-semibold text-stone-700 mb-1"
                        >
                          {cs.lblInspectorName}
                        </label>
                        <input
                          id="insp-inspector"
                          type="text"
                          value={inspection.inspectorName}
                          onChange={(e) =>
                            updateInspectionField(
                              'inspectorName',
                              e.target.value
                            )
                          }
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          {cs.lblCurrTemp(
                            baseProfile.tempSafeMinC,
                            baseProfile.tempSafeMaxC
                          )}
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={inspection.tempCurrentC}
                          onChange={(e) =>
                            updateInspectionField(
                              'tempCurrentC',
                              Number(e.target.value)
                            )
                          }
                          className={numInputCls}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          {cs.lblCurrTempDrift}
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.2"
                          value={inspection.tempChangeRateCPerDay}
                          onChange={(e) =>
                            updateInspectionField(
                              'tempChangeRateCPerDay',
                              Number(e.target.value)
                            )
                          }
                          className={numInputCls}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          {cs.lblCurrRh(
                            baseProfile.rhSafeMinPct,
                            baseProfile.rhSafeMaxPct
                          )}
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={inspection.rhCurrentPct}
                          onChange={(e) =>
                            updateInspectionField(
                              'rhCurrentPct',
                              Number(e.target.value)
                            )
                          }
                          className={numInputCls}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          {cs.lblCurrRhHours}
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={inspection.rhOutOfRangeHours}
                          onChange={(e) =>
                            updateInspectionField(
                              'rhOutOfRangeHours',
                              Number(e.target.value)
                            )
                          }
                          className={numInputCls}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          {cs.lblCurrMoisture}
                        </label>
                        <select
                          value={inspection.directMoistureStatus}
                          onChange={(e) =>
                            updateInspectionField(
                              'directMoistureStatus',
                              e.target.value as DirectMoistureStatus
                            )
                          }
                          className={inputCls}
                        >
                          {(
                            Object.keys(
                              c.moistureStatuses
                            ) as DirectMoistureStatus[]
                          ).map((mk) => (
                            <option key={mk} value={mk}>
                              {c.moistureStatuses[mk]}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          {cs.lblCurrVibration}
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={inspection.vibrationPeakMmPerSec}
                          onChange={(e) =>
                            updateInspectionField(
                              'vibrationPeakMmPerSec',
                              Number(e.target.value)
                            )
                          }
                          className={numInputCls}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          {cs.lblCurrShocks}
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={inspection.shockEventsCount}
                          onChange={(e) =>
                            updateInspectionField(
                              'shockEventsCount',
                              Number(e.target.value)
                            )
                          }
                          className={numInputCls}
                        />
                      </div>

                      <div className="sm:col-span-2 lg:col-span-4">
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          {cs.lblFieldNotes}
                        </label>
                        <input
                          type="text"
                          value={inspection.fieldNotes}
                          onChange={(e) =>
                            updateInspectionField('fieldNotes', e.target.value)
                          }
                          className={inputCls}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#EAE1D2] flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        reportBlockRef.current?.scrollIntoView({
                          behavior: 'smooth',
                        })
                      }
                      className="btn-guardian-primary px-5 py-2.5 text-xs"
                    >
                      <ClipboardCheck className="w-4 h-4 text-[#F3D28C] shrink-0" />
                      <span>{cs.runComparisonBtn}</span>
                    </button>

                    <button
                      type="button"
                      disabled={isExportingUrgentPdf}
                      onClick={handleExportUrgentPdf}
                      className={`px-5 py-2.5 text-xs font-bold rounded-xl inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        comparisonReport.hazardCount > 0
                          ? 'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-sm'
                          : 'btn-guardian-brass'
                      }`}
                    >
                      <FileText className="w-4 h-4 shrink-0" />
                      <span>
                        {isExportingUrgentPdf
                          ? cs.exportingUrgentPdfBtn
                          : cs.exportUrgentPdfBtn}
                      </span>
                    </button>
                  </div>
                </div>

                {/* 3. Unified Authenticity Verdict, 3-Horizon Risk Prediction, Red Comparison & Creative Recommendations */}
                <div
                  ref={reportBlockRef}
                  className="card-guardian overflow-hidden bg-white"
                >
                  {/* A. Executive Verdict & 5-Metric Masthead */}
                  <div
                    className={`p-6 border-b ${
                      comparisonReport.overallSeverity === 'hazard'
                        ? 'bg-[#FEF2F2] border-[#FCA5A5]'
                        : comparisonReport.overallSeverity === 'caution'
                        ? 'bg-amber-50/90 border-amber-300'
                        : 'bg-[#ECFDF5]/80 border-[#A7F3D0]'
                    }`}
                  >
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
                      <div className="flex items-start gap-3.5">
                        {comparisonReport.overallSeverity === 'hazard' ? (
                          <AlertOctagon className="w-7 h-7 text-[#DC2626] shrink-0 mt-0.5" />
                        ) : comparisonReport.overallSeverity === 'caution' ? (
                          <AlertTriangle className="w-7 h-7 text-amber-700 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-7 h-7 text-[#0F4C45] shrink-0 mt-0.5" />
                        )}
                        <div>
                          <h3
                            className={`text-lg sm:text-xl font-bold ${
                              comparisonReport.overallSeverity === 'hazard'
                                ? 'text-[#991B1B]'
                                : comparisonReport.overallSeverity === 'caution'
                                ? 'text-amber-900'
                                : 'text-[#0F4C45]'
                            }`}
                          >
                            {comparisonReport.generalVerdictTitle}
                          </h3>
                          <p
                            className={`text-sm mt-1 max-w-3xl leading-relaxed ${
                              comparisonReport.overallSeverity === 'hazard'
                                ? 'text-[#7F1D1D]'
                                : 'text-stone-700'
                            }`}
                          >
                            {comparisonReport.generalVerdictSummary}
                          </p>

                          {/* Authenticity Verification Summary Line */}
                          <div className="mt-2.5 pt-2.5 border-t border-black/10 flex items-center gap-2 flex-wrap text-xs">
                            {comparisonReport.authenticityStatus ===
                            'alert_mismatch' ? (
                              <ShieldAlert className="w-4 h-4 text-[#DC2626] shrink-0" />
                            ) : (
                              <ShieldCheck className="w-4 h-4 text-[#0F4C45] shrink-0" />
                            )}
                            <span
                              className={`font-bold ${
                                comparisonReport.authenticityStatus ===
                                'alert_mismatch'
                                  ? 'text-[#DC2626]'
                                  : comparisonReport.authenticityStatus ===
                                    'review_needed'
                                  ? 'text-amber-900'
                                  : 'text-[#0F4C45]'
                              }`}
                            >
                              {comparisonReport.authenticityVerdictText}
                            </span>
                            <span aria-hidden="true" className="text-stone-400">
                              ·
                            </span>
                            <span className="text-stone-700 font-medium">
                              {comparisonReport.authenticityDetailText}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 5-Metric Executive Readout Strip */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 shrink-0">
                        <div
                          className={`px-3 py-2.5 rounded-xl bg-white border text-center ${
                            comparisonReport.authenticityStatus ===
                            'alert_mismatch'
                              ? 'border-2 border-[#DC2626]'
                              : 'border-stone-200'
                          }`}
                        >
                          <span className="block text-[11px] font-semibold text-stone-600">
                            {cs.kpiAuthenticityScore}
                          </span>
                          <span
                            className={`font-mono text-lg font-bold tabular-nums ${
                              comparisonReport.authenticityStatus ===
                              'alert_mismatch'
                                ? 'text-[#DC2626]'
                                : 'text-[#0F4C45]'
                            }`}
                          >
                            {comparisonReport.authenticityScorePct}%
                          </span>
                        </div>

                        <div className="px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-center">
                          <span className="block text-[11px] font-semibold text-stone-600">
                            {cs.kpiBaselineScore}
                          </span>
                          <span className="font-mono text-lg font-bold text-[#0F4C45] tabular-nums">
                            {comparisonReport.baselineStabilityPct}%
                          </span>
                        </div>

                        <div
                          className={`px-3 py-2.5 rounded-xl bg-white border text-center ${
                            comparisonReport.overallSeverity === 'hazard'
                              ? 'border-[#DC2626]'
                              : 'border-stone-200'
                          }`}
                        >
                          <span className="block text-[11px] font-semibold text-stone-600">
                            {cs.kpiCurrentScore}
                          </span>
                          <span
                            className={`font-mono text-lg font-bold tabular-nums ${
                              comparisonReport.overallSeverity === 'hazard'
                                ? 'text-[#DC2626]'
                                : 'text-[#0F4C45]'
                            }`}
                          >
                            {comparisonReport.currentStabilityPct}%
                          </span>
                        </div>

                        <div
                          className={`px-3 py-2.5 rounded-xl bg-white border text-center ${
                            comparisonReport.predictedDegradationIndexPct >= 45
                              ? 'border-[#DC2626]'
                              : 'border-stone-200'
                          }`}
                        >
                          <span className="block text-[11px] font-semibold text-stone-600">
                            {cs.kpiPredictedRiskIndex}
                          </span>
                          <span
                            className={`font-mono text-lg font-bold tabular-nums ${
                              comparisonReport.predictedDegradationIndexPct >=
                              45
                                ? 'text-[#DC2626]'
                                : comparisonReport.predictedDegradationIndexPct >=
                                  24
                                ? 'text-amber-800'
                                : 'text-[#0F4C45]'
                            }`}
                          >
                            {comparisonReport.predictedDegradationIndexPct}%
                          </span>
                        </div>

                        <div
                          className={`col-span-2 sm:col-span-1 px-3 py-2.5 rounded-xl border text-center ${
                            comparisonReport.hazardCount > 0
                              ? 'bg-[#DC2626] border-[#991B1B] text-white'
                              : 'bg-white border-stone-200 text-stone-800'
                          }`}
                        >
                          <span
                            className={`block text-[11px] font-semibold ${
                              comparisonReport.hazardCount > 0
                                ? 'text-red-100'
                                : 'text-stone-600'
                            }`}
                          >
                            {cs.kpiRedHazardsCount}
                          </span>
                          <span className="font-mono text-lg font-bold tabular-nums">
                            {comparisonReport.hazardCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* B. Innovative 3-Horizon Predictive Risk Matrix (72h · 30d · 12m) */}
                  <div className="p-6 bg-[#FAF7F1] border-b border-[#DED4C3]">
                    <div className="mb-4 flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-[#1C1814] flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-[#9E6E24] shrink-0" />
                          <span>{cs.forecastSectionTitle}</span>
                        </h4>
                        <p className="text-xs text-[#5C5247] mt-0.5 max-w-3xl">
                          {cs.forecastSectionSub}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {comparisonReport.riskHorizons.map((horizon, idx) => {
                        const isHzRed = horizon.severity === 'hazard';
                        const isHzAmber = horizon.severity === 'caution';
                        return (
                          <div
                            key={horizon.id}
                            className={`rounded-xl p-5 flex flex-col justify-between ${
                              isHzRed
                                ? 'bg-[#FFF5F5] border-2 border-[#DC2626]'
                                : isHzAmber
                                ? 'bg-amber-50/70 border border-amber-400'
                                : 'bg-white border border-[#DED4C3]'
                            }`}
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2 pb-3 border-b border-black/10">
                                <div>
                                  <span className="text-[11px] font-mono font-bold text-[#6E6357] tabular-nums block">
                                    0{idx + 1} · {horizon.timeframeBadge}
                                  </span>
                                  <h5
                                    className={`text-sm sm:text-base font-bold mt-0.5 ${
                                      isHzRed
                                        ? 'text-[#991B1B]'
                                        : 'text-[#1C1814]'
                                    }`}
                                  >
                                    {horizon.horizonLabel}
                                  </h5>
                                </div>

                                {isHzRed ? (
                                  <AlertOctagon className="w-5 h-5 text-[#DC2626] shrink-0" />
                                ) : isHzAmber ? (
                                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                                ) : (
                                  <CheckCircle2 className="w-5 h-5 text-[#0F4C45] shrink-0" />
                                )}
                              </div>

                              {/* Probability & Stability Readouts */}
                              <div className="mt-3.5 flex items-baseline justify-between gap-2 text-xs">
                                <div>
                                  <span className="text-[#5C5247] block">
                                    {cs.lblRiskProbability}
                                  </span>
                                  <span
                                    className={`font-mono text-xl font-bold tabular-nums ${
                                      isHzRed
                                        ? 'text-[#DC2626]'
                                        : isHzAmber
                                        ? 'text-amber-800'
                                        : 'text-[#0F4C45]'
                                    }`}
                                  >
                                    {horizon.riskProbabilityPct}%
                                  </span>
                                </div>

                                <div className={isRtl ? 'text-left' : 'text-right'}>
                                  <span className="text-[#5C5247] block">
                                    {cs.lblProjectedStability}
                                  </span>
                                  <span className="font-mono text-base font-bold text-[#1C1814] tabular-nums">
                                    {horizon.projectedStabilityPct}%
                                  </span>
                                </div>
                              </div>

                              {/* Visual Forecast Risk Bar */}
                              <div
                                dir="ltr"
                                className="mt-2 h-2.5 w-full rounded-full bg-[#EAE1D2] overflow-hidden"
                              >
                                <div
                                  className={`h-full rounded-full ${
                                    isHzRed
                                      ? 'bg-[#DC2626]'
                                      : isHzAmber
                                      ? 'bg-amber-600'
                                      : 'bg-[#0F4C45]'
                                  }`}
                                  style={{
                                    width: `${horizon.riskProbabilityPct}%`,
                                  }}
                                />
                              </div>

                              <div className="mt-3.5 space-y-2 text-xs">
                                <div>
                                  <span className="font-bold text-[#4A423A]">
                                    {cs.lblPrimaryDriver}{' '}
                                  </span>
                                  <span className="text-[#1C1814] font-medium">
                                    {horizon.primaryDriver}
                                  </span>
                                </div>

                                <div className="pt-2 border-t border-black/5">
                                  <span
                                    className={`font-bold block mb-0.5 ${
                                      isHzRed
                                        ? 'text-[#DC2626]'
                                        : 'text-[#0F4C45]'
                                    }`}
                                  >
                                    {cs.lblPredictedOutcome}
                                  </span>
                                  <p
                                    className={`leading-relaxed font-medium ${
                                      isHzRed
                                        ? 'text-[#991B1B]'
                                        : 'text-[#3D352E]'
                                    }`}
                                  >
                                    {horizon.predictedOutcome}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* C. Comprehensive 6-Row Comparison Matrix (Authenticity + Condition + Essential Environmental Indicators) */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h4 className="text-base sm:text-lg font-bold text-[#1C1814]">
                        {cs.reportHeaderTitle}
                      </h4>
                      <p className="text-xs text-[#6E6357] mt-0.5">
                        {cs.reportHeaderSub}
                      </p>
                    </div>

                    <div className="overflow-x-auto border border-[#DED4C3] rounded-xl">
                      <table
                        className={`w-full border-collapse text-sm ${
                          isRtl ? 'text-right' : 'text-left'
                        }`}
                      >
                        <thead>
                          <tr className="bg-[#EFE8DA] border-b border-[#D5C7AE] text-xs font-bold text-[#3D352E]">
                            <th className="py-3 px-3.5">{cs.colParam}</th>
                            <th className="py-3 px-3.5">{cs.colRegistered}</th>
                            <th className="py-3 px-3.5">{cs.colCurrent}</th>
                            <th className="py-3 px-3.5">{cs.colDelta}</th>
                            <th className="py-3 px-3.5 whitespace-nowrap">
                              {cs.colRiskStatus}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EAE1D2]">
                          {comparisonReport.rows.map((row) => {
                            const isHazard = row.severity === 'hazard';
                            const isCaution = row.severity === 'caution';
                            return (
                              <tr
                                key={row.key}
                                className={
                                  isHazard
                                    ? 'bg-[#FEF2F2] hover:bg-[#FEE2E2]/70 transition-colors'
                                    : isCaution
                                    ? 'bg-amber-50/50'
                                    : 'bg-white'
                                }
                              >
                                <td
                                  className={`py-3 px-3.5 font-bold ${
                                    isHazard
                                      ? 'text-[#991B1B]'
                                      : row.key === 'authenticity'
                                      ? 'text-[#0F4C45]'
                                      : 'text-[#1C1814]'
                                  }`}
                                >
                                  <span className="font-mono text-xs opacity-75 me-1.5">
                                    {row.numLabel}.
                                  </span>
                                  {row.parameterTitle}
                                </td>
                                <td className="py-3 px-3.5 text-xs sm:text-sm text-[#4A423A] font-mono tabular-nums">
                                  {row.baselineValueText}
                                </td>
                                <td
                                  className={`py-3 px-3.5 text-xs sm:text-sm font-mono tabular-nums font-bold ${
                                    isHazard
                                      ? 'text-[#DC2626]'
                                      : 'text-[#1C1814]'
                                  }`}
                                >
                                  {row.currentValueText}
                                </td>
                                <td
                                  className={`py-3 px-3.5 text-xs font-mono tabular-nums font-bold ${
                                    isHazard
                                      ? 'text-[#DC2626]'
                                      : isCaution
                                      ? 'text-amber-800'
                                      : 'text-[#0F4C45]'
                                  }`}
                                >
                                  {row.deltaText}
                                </td>
                                <td className="py-3 px-3.5 whitespace-nowrap">
                                  <span
                                    className={`text-xs font-bold ${
                                      isHazard
                                        ? 'text-[#DC2626] underline decoration-[#DC2626]/50 underline-offset-4'
                                        : isCaution
                                        ? 'text-amber-800'
                                        : 'text-[#0F4C45]'
                                    }`}
                                  >
                                    {row.riskSummaryText}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* D. Creative International Conservation Recommendations & Crowning PDF Export Showcase */}
                  <div className="p-6 bg-[#FAF7F1] border-t border-[#DED4C3] space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-[#1C1814] flex items-center gap-2">
                        <ShieldAlert
                          className={`w-5 h-5 shrink-0 ${
                            comparisonReport.hazardCount > 0
                              ? 'text-[#DC2626]'
                              : 'text-[#0F4C45]'
                          }`}
                        />
                        <span>{cs.urgentSectionTitle}</span>
                      </h4>
                      <p className="text-xs text-[#5C5247] mt-1 max-w-3xl">
                        {cs.urgentSectionSub}
                      </p>
                    </div>

                    {/* Structured Conservation Protocol Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {comparisonReport.recommendations.map((rec, idx) => {
                        const isRed = rec.severity === 'hazard';
                        const isAmber = rec.severity === 'caution';
                        return (
                          <div
                            key={rec.id}
                            className={`rounded-xl p-5 flex flex-col justify-between ${
                              isRed
                                ? 'bg-[#FFF5F5] border-2 border-[#DC2626]'
                                : isAmber
                                ? 'bg-amber-50/70 border border-amber-400'
                                : 'bg-white border border-[#0F4C45]/35'
                            }`}
                          >
                            <div>
                              <div className="flex items-start justify-between gap-3 pb-3 mb-3 border-b border-black/10">
                                <div>
                                  <div className="font-bold text-sm sm:text-base">
                                    <span
                                      className={`font-mono me-1.5 tabular-nums ${
                                        isRed
                                          ? 'text-[#DC2626]'
                                          : 'text-[#0F4C45]'
                                      }`}
                                    >
                                      {String(idx + 1).padStart(2, '0')}.
                                    </span>
                                    <span
                                      className={
                                        isRed
                                          ? 'text-[#991B1B]'
                                          : 'text-[#1C1814]'
                                      }
                                    >
                                      {rec.indicatorTitle}
                                    </span>
                                  </div>
                                  <span className="block text-xs font-mono tabular-nums text-stone-600 mt-0.5">
                                    {rec.deviationDetail}
                                  </span>
                                </div>

                                <div
                                  className={`text-xs shrink-0 ${
                                    isRtl ? 'text-left' : 'text-right'
                                  }`}
                                >
                                  <span
                                    className={`font-bold block ${
                                      isRed
                                        ? 'text-[#DC2626]'
                                        : isAmber
                                        ? 'text-amber-800'
                                        : 'text-[#0F4C45]'
                                    }`}
                                  >
                                    {rec.priorityBadge}
                                  </span>
                                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#5C5247] mt-0.5">
                                    <Clock className="w-3 h-3 shrink-0" />
                                    <span>{rec.responseWindow}</span>
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-3 text-xs sm:text-sm">
                                <div>
                                  <span
                                    className={`font-bold block mb-0.5 ${
                                      isRed
                                        ? 'text-[#DC2626]'
                                        : 'text-stone-700'
                                    }`}
                                  >
                                    {cs.lblPotentialDamage}
                                  </span>
                                  <p
                                    className={`leading-relaxed font-medium ${
                                      isRed
                                        ? 'text-[#991B1B]'
                                        : 'text-stone-700'
                                    }`}
                                  >
                                    {rec.potentialDamage}
                                  </p>
                                </div>

                                <div className="pt-2.5 border-t border-black/5">
                                  <span className="font-bold text-[#0F4C45] block mb-0.5">
                                    {cs.lblImmediateAction}
                                  </span>
                                  <p className="text-[#1C1814] leading-relaxed font-medium">
                                    {rec.urgentAction}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Crowning Finale Banner: Creative World-Class Dossier & Recommendations PDF Export */}
                    <div
                      className={`rounded-2xl p-6 sm:p-7 border ${
                        comparisonReport.hazardCount > 0
                          ? 'bg-[#6F1414] border-[#FCA5A5] text-white'
                          : 'bg-[#0D3F39] border-[#C89E54] text-white'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="space-y-2 max-w-2xl">
                          <div className="flex items-center gap-2 text-xs font-mono tracking-wide text-[#F3D28C]">
                            <Award className="w-4 h-4 shrink-0" />
                            <span>{cs.exportShowcaseKicker}</span>
                          </div>

                          <h5 className="font-display-heritage text-xl sm:text-2xl font-bold text-white leading-snug balance-text">
                            {cs.exportShowcaseTitle}
                          </h5>

                          <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                            {cs.exportShowcaseDesc}
                          </p>

                          <p className="text-xs font-mono text-[#F3D28C] pt-1">
                            {cs.exportShowcaseFeatures}
                          </p>
                        </div>

                        <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3">
                          <button
                            type="button"
                            disabled={isExportingUrgentPdf}
                            onClick={handleExportUrgentPdf}
                            className={`px-6 py-3.5 text-xs sm:text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                              comparisonReport.hazardCount > 0
                                ? 'bg-white text-[#991B1B] hover:bg-red-50'
                                : 'bg-[#F3D28C] text-[#1C1814] hover:bg-[#E7C171]'
                            }`}
                          >
                            <FileText className="w-4 h-4 shrink-0" />
                            <span>
                              {isExportingUrgentPdf
                                ? cs.exportingUrgentPdfBtn
                                : cs.exportUrgentPdfBtn}
                            </span>
                          </button>

                          <span className="text-[11px] font-mono tabular-nums text-white/80 text-center">
                            {selectedArtifact.accessionCode} ·{' '}
                            {cs.kpiAuthenticityScore}:{' '}
                            {comparisonReport.authenticityScorePct}% ·{' '}
                            {cs.kpiPredictedRiskIndex}:{' '}
                            {comparisonReport.predictedDegradationIndexPct}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </section>
    </>
  );
};
