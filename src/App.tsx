/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Globe } from 'lucide-react';
import { ArtifactConditionVerifierSection } from './components/ArtifactConditionVerifierSection';
import { CaptureStudio } from './components/CaptureStudio';
import { SpatialReconstructionViewport } from './components/SpatialReconstructionViewport';
import {
  TeamCreditsFooterBar,
  TeamCreditsModal,
} from './components/TeamCreditsModal';
import { HERO_SCANNER_IMAGE } from './data/culturalData';
import {
  getLocalizedDirections,
  PRESET_METADATA,
} from './i18n/domainTranslations';
import { SUPPORTED_LANGUAGES, UI_STRINGS } from './i18n/uiStrings';
import {
  ArtifactEnvironmentalProfile,
  ArtifactFormState,
  CaptureDirection,
  CapturedAngleImage,
  CulturalCorridorId,
  DocumentedArtifact,
  LocaleCode,
  MaterialConservationClass,
  SurfaceMetrics,
} from './types/artifact';
import {
  createDefaultEnvironmentalProfile,
  MATERIAL_CONSERVATION_PRESETS,
} from './utils/conservationEngine';
import { computeMultiAngleMetrics } from './utils/imageAnalysis';
import {
  getArtifactDisplayTitle,
  primeSpeechSynthesisOnUserGesture,
} from './utils/voiceBriefing';
import { getCountryDisplayName } from './utils/worldCountries';

const STORAGE_KEY = 'smart_guardian_user_registered_only_v1';
const LEGACY_ARCHIVE_KEYS = [
  'smart_guardian_heritage_archive_v7',
  'smart_guardian_heritage_archive_v6',
  'smart_guardian_heritage_archive_v5',
  'smart_guardian_heritage_archive_v4',
  'smart_guardian_heritage_archive_v3',
  'smart_guardian_heritage_archive_v2',
  'smart_guardian_heritage_archive_v1',
];
const LOCALE_STORAGE_KEY = 'smart_guardian_locale_v2';

const EMPTY_METRICS: SurfaceMetrics = {
  totalAngles: 0,
  uniqueDirections: 0,
  angularCoveragePct: 0,
  meanSharpness: 0,
  illuminationConsistencyPct: 0,
  edgeReliefDensityPct: 0,
};

function makeBlankRegistrationForm(locale: LocaleCode): ArtifactFormState {
  return {
    titleAr: '',
    inventoryNumber: '',
    periodAr: '',
    materialAr: '',
    dimensionsCm: '',
    weightGrams: '',
    conditionGrade: 'stable_excellent',
    countryCode: 'BH',
    discoveryRegionAr: '',
    meetingCulturesText: '',
    curatorialNotesAr: '',
    teamNameAr: '',
    environmental: createDefaultEnvironmentalProfile(locale, 'stone_limestone'),
  };
}

export default function App() {
  const [locale, setLocale] = useState<LocaleCode>(() => {
    try {
      const saved = localStorage.getItem(LOCALE_STORAGE_KEY) as LocaleCode | null;
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
    } catch {
      // Fallback to Arabic default
    }
    return 'ar';
  });

  const [angles, setAngles] = useState<CapturedAngleImage[]>([]);
  const [metrics, setMetrics] = useState<SurfaceMetrics>(EMPTY_METRICS);
  const [heroImgFailed, setHeroImgFailed] = useState<boolean>(false);

  const [formState, setFormState] = useState<ArtifactFormState>(() =>
    makeBlankRegistrationForm(locale)
  );

  const [archive, setArchive] = useState<DocumentedArtifact[]>([]);
  const [isCreditsOpen, setIsCreditsOpen] = useState<boolean>(false);
  const [verifyCameraTrigger, setVerifyCameraTrigger] = useState<number>(0);

  const handleOpenVerificationWithCamera = useCallback(
    (e?: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      if (e) {
        e.preventDefault();
      }
      primeSpeechSynthesisOnUserGesture();
      setVerifyCameraTrigger((prev) => prev + 1);
      window.setTimeout(() => {
        document
          .getElementById('condition-verification')
          ?.scrollIntoView({ behavior: 'smooth' });
      }, 35);
    },
    []
  );

  const t = UI_STRINGS[locale];
  const currentLangSpec =
    SUPPORTED_LANGUAGES.find((l) => l.code === locale) ?? SUPPORTED_LANGUAGES[0];
  const isRtl = currentLangSpec.dir === 'rtl';

  // Sync HTML document lang, dir (RTL/LTR), and runtime document title
  useEffect(() => {
    document.documentElement.lang = currentLangSpec.htmlLang;
    document.documentElement.dir = currentLangSpec.dir;
    document.title = t.pageTitle;
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // Ignore storage error
    }
  }, [locale, currentLangSpec, t.pageTitle]);

  const handleSelectLocale = (nextLocale: LocaleCode) => {
    setLocale(nextLocale);
  };

  useEffect(() => {
    let cancelled = false;
    computeMultiAngleMetrics(angles).then((computed) => {
      if (!cancelled) {
        setMetrics(computed);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [angles]);

  // Purge any legacy pre-seeded archives and load ONLY user-registered artifacts
  useEffect(() => {
    try {
      for (const oldKey of LEGACY_ARCHIVE_KEYS) {
        localStorage.removeItem(oldKey);
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const userRegisteredOnly = parsed.filter(
            (item: DocumentedArtifact) =>
              item &&
              typeof item.id === 'string' &&
              !item.id.startsWith('seed-') &&
              !item.presetKey
          );
          setArchive(userRegisteredOnly);
        }
      }
    } catch {
      setArchive([]);
    }
  }, []);

  const handleAddAngle = (newAngle: CapturedAngleImage) => {
    setAngles((prev) => [...prev, newAngle]);
  };

  const handleAddMultipleAngles = (newAngles: CapturedAngleImage[]) => {
    setAngles((prev) => [...prev, ...newAngles]);
  };

  const handleUpdateDirection = (id: string, direction: CaptureDirection) => {
    const specList = getLocalizedDirections(locale);
    const spec = specList.find((d) => d.id === direction) ?? specList[0];
    setAngles((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              direction: spec.id,
              labelAr: spec.label,
              azimuthDeg: spec.azimuthDeg,
              elevationDeg: spec.elevationDeg,
            }
          : a
      )
    );
  };

  const handleRemoveAngle = (id: string) => {
    setAngles((prev) => prev.filter((a) => a.id !== id));
  };

  const handleClearAll = () => {
    setAngles([]);
    setFormState(makeBlankRegistrationForm(locale));
  };

  const handleResetOnlyForm = () => {
    setFormState(makeBlankRegistrationForm(locale));
  };

  const handleApplyMaterialPreset = (matClass: MaterialConservationClass) => {
    const spec = MATERIAL_CONSERVATION_PRESETS[matClass];
    const midTemp = Number(
      ((spec.tempSafeMinC + spec.tempSafeMaxC) / 2).toFixed(1)
    );
    const midRh = Math.round((spec.rhSafeMinPct + spec.rhSafeMaxPct) / 2);

    setFormState((prev) => ({
      ...prev,
      environmental: {
        ...prev.environmental,
        materialClass: matClass,
        tempSafeMinC: spec.tempSafeMinC,
        tempSafeMaxC: spec.tempSafeMaxC,
        tempCurrentC: midTemp,
        rhSafeMinPct: spec.rhSafeMinPct,
        rhSafeMaxPct: spec.rhSafeMaxPct,
        rhCurrentPct: midRh,
      },
    }));
  };

  const handleSaveArtifact = (): DocumentedArtifact | null => {
    if (angles.length < 3) return null;

    const maxExistingSeq = archive.reduce((maxNum, item) => {
      const m = item.accessionCode.match(/(\d+)$/);
      const parsed = m ? Number(m[1]) : 0;
      return parsed > maxNum ? parsed : maxNum;
    }, 0);
    const nextSeq = String(maxExistingSeq + 1).padStart(3, '0');
    const nextCode = `SG-2026-${nextSeq}`;

    const record: DocumentedArtifact = {
      id: `doc-${Date.now()}`,
      accessionCode: nextCode,
      inventoryNumber:
        formState.inventoryNumber.trim() || `INV-2026-${nextSeq}`,
      titleAr: formState.titleAr.trim() || t.fieldArtifactName,
      periodAr: formState.periodAr.trim() || t.fieldPeriod,
      materialAr: formState.materialAr.trim() || t.fieldMaterial,
      dimensionsCm: formState.dimensionsCm.trim() || '20 × 20 cm',
      weightGrams: formState.weightGrams.trim() || '1200',
      conditionGrade: formState.conditionGrade,
      countryCode: formState.countryCode || 'BH',
      discoveryRegionAr: formState.discoveryRegionAr.trim() || t.fieldRegion,
      corridorId: CulturalCorridorId.IncenseRoute,
      meetingCulturesAr: formState.meetingCulturesText
        .split(/[،,、]/)
        .map((s) => s.trim())
        .filter(Boolean),
      curatorialNotesAr: formState.curatorialNotesAr.trim(),
      teamNameAr:
        formState.teamNameAr.trim() ||
        PRESET_METADATA.incense_burner[locale].defaultTeam,
      createdAtIso: new Date().toISOString(),
      angles,
      metrics,
      environmentalProfile: formState.environmental,
    };

    const updated = [record, ...archive];
    setArchive(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 12)));
    } catch {
      // Ignore storage quota overflow safely
    }
    return record;
  };

  const handleDeleteRegisteredArtifact = (id: string) => {
    const updated = archive.filter((item) => item.id !== id);
    setArchive(updated);
    try {
      if (updated.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 12)));
      }
    } catch {
      // Ignore storage error safely
    }
  };

  const handleLoadArchivedArtifact = (item: DocumentedArtifact) => {
    setAngles(item.angles);
    const sep = locale === 'ar' ? '، ' : locale === 'zh' ? '、' : ', ';
    setFormState({
      titleAr: item.titleAr,
      inventoryNumber: item.inventoryNumber ?? '',
      periodAr: item.periodAr,
      materialAr: item.materialAr,
      dimensionsCm: item.dimensionsCm,
      weightGrams: item.weightGrams ?? '',
      conditionGrade: item.conditionGrade ?? 'stable_excellent',
      countryCode: item.countryCode || 'BH',
      discoveryRegionAr: item.discoveryRegionAr,
      meetingCulturesText: item.meetingCulturesAr.join(sep),
      curatorialNotesAr: item.curatorialNotesAr,
      teamNameAr: item.teamNameAr,
      environmental:
        item.environmentalProfile ??
        createDefaultEnvironmentalProfile(locale, 'stone_limestone'),
    });
  };

  const latestRegistered = archive[0] ?? null;
  const heroPrimaryImage =
    latestRegistered?.angles[0]?.dataUrl ?? HERO_SCANNER_IMAGE;
  const heroPrimaryCaption = latestRegistered
    ? `${latestRegistered.accessionCode} · ${getArtifactDisplayTitle(
        latestRegistered,
        locale
      )} · ${getCountryDisplayName(
        latestRegistered.countryCode || 'BH',
        locale
      )}`
    : t.heroScrimCaption;

  const workflowSteps = [
    {
      num: '01',
      href: '#capture-studio',
      label: t.step1Label,
      title: t.step1Title,
      desc: t.step1Desc,
      liveStatus: t.stepLiveAnglesStatus(angles.length),
      isReady: angles.length >= 3,
    },
    {
      num: '02',
      href: '#spatial-studio',
      label: t.step2Label,
      title: t.step2Title,
      desc: t.step2Desc,
      liveStatus: t.stepLiveCoverageStatus(metrics.angularCoveragePct),
      isReady: angles.length >= 3,
    },
    {
      num: '03',
      href: '#artifact-registration',
      label: t.step3Label,
      title: t.step3Title,
      desc: t.step3Desc,
      liveStatus: `${formState.environmental.tempSafeMinC}–${formState.environmental.tempSafeMaxC}°C · ${formState.environmental.rhSafeMinPct}–${formState.environmental.rhSafeMaxPct}%`,
      isReady: true,
    },
    {
      num: '04',
      href: '#condition-verification',
      label: t.step4Label,
      title: t.step4Title,
      desc: t.step4Desc,
      liveStatus: t.stepLiveArchiveStatus(archive.length),
      isReady: archive.length > 0,
    },
  ];

  const StepArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div
      dir={currentLangSpec.dir}
      className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1814]"
    >
      {/* Strict 3-Zone Top Navigation Bar Contract */}
      <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-xs border-b border-[#DED4C3] px-6 py-3.5">
        <div className="max-w-[1160px] mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#"
            className="font-editorial text-2xl sm:text-[1.7rem] font-bold text-[#1C1814] hover:text-[#0F4C45] transition-colors whitespace-nowrap shrink-0"
          >
            {t.brandName}
          </a>

          {/* Zone 2: 4 concise single-line text navigation links */}
          <nav
            aria-label={t.brandName}
            className="hidden lg:flex items-center gap-7 text-sm font-semibold text-[#4A423A]"
          >
            <a
              href="#capture-studio"
              className="hover:text-[#0F4C45] hover:underline decoration-[#9E6E24] decoration-2 underline-offset-8 transition-colors whitespace-nowrap shrink-0"
            >
              {t.navCapture}
            </a>
            <a
              href="#spatial-studio"
              className="hover:text-[#0F4C45] hover:underline decoration-[#9E6E24] decoration-2 underline-offset-8 transition-colors whitespace-nowrap shrink-0"
            >
              {t.navSpatial}
            </a>
            <a
              href="#artifact-registration"
              className="hover:text-[#0F4C45] hover:underline decoration-[#9E6E24] decoration-2 underline-offset-8 transition-colors whitespace-nowrap shrink-0"
            >
              {t.navCultures}
            </a>
            <a
              href="#condition-verification"
              onClick={handleOpenVerificationWithCamera}
              className="hover:text-[#0F4C45] hover:underline decoration-[#9E6E24] decoration-2 underline-offset-8 transition-colors whitespace-nowrap shrink-0"
            >
              {t.navArchive}
            </a>
          </nav>

          {/* Zone 3: 1 primary action — jumps directly to New Artifact Registration & Environmental Form */}
          <div className="flex items-center shrink-0">
            <a
              href="#artifact-registration"
              onClick={() => handleResetOnlyForm()}
              className="btn-guardian-primary px-5 py-2 text-xs"
            >
              {t.ctaNewArtifact}
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Smart Guardian Simplified Hero & 4-Step Summary */}
        <section className="py-9 lg:py-14 border-b border-[#DED4C3] bg-[#FBF9F5]">
          <div className="max-w-[1160px] mx-auto px-6">
            {/* International 5-Language Switcher Toolbar */}
            <div className="mb-8 pb-4 border-b border-[#E5DDD0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#5C5247]">
                <Globe className="w-4 h-4 text-[#9E6E24] shrink-0" />
                <span>{t.editionLanguageLabel}</span>
              </div>

              <div
                role="group"
                aria-label={t.editionLanguageLabel}
                className="segmented-track"
              >
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isActive = locale === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleSelectLocale(lang.code)}
                      aria-pressed={isActive}
                      className={`segmented-tab px-3.5 py-1.5 text-xs ${
                        isActive ? 'segmented-tab-active' : 'segmented-tab-idle'
                      }`}
                    >
                      {lang.nativeLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-9 items-stretch">
              {/* Primary Editorial Column (6 cols) */}
              <div className="lg:col-span-6 flex flex-col justify-between py-1">
                <div>
                  <div className="text-xs font-medium text-[#6E6357] mb-3 flex items-center gap-2 flex-wrap">
                    <span>{t.heroKicker1}</span>
                    <span aria-hidden="true" className="text-[#9E6E24]">·</span>
                    <span>{t.heroKicker2}</span>
                    <span aria-hidden="true" className="text-[#9E6E24]">·</span>
                    <span>{t.heroKicker3}</span>
                  </div>

                  <p className="text-sm font-bold text-[#0F4C45] mb-2.5">
                    {t.heroBrandLockup}
                  </p>

                  <h1
                    className="font-display-heritage font-bold text-[#1C1814] mb-4 balance-text"
                    style={{ fontSize: 'clamp(2.2rem, 3.5vw, 3.35rem)' }}
                  >
                    {t.heroTitle}
                  </h1>

                  <p className="text-base text-[#4A423A] leading-relaxed max-w-[60ch] mb-7">
                    {t.heroLead}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <a
                    href="#capture-studio"
                    className="btn-guardian-primary px-6 py-3 text-sm"
                  >
                    {t.heroPrimaryBtn}
                  </a>
                  <a
                    href="#condition-verification"
                    onClick={handleOpenVerificationWithCamera}
                    className="btn-guardian-secondary px-6 py-3 text-sm"
                  >
                    {t.heroSecondaryBtn}
                  </a>
                </div>
              </div>

              {/* Hero Media Column (6 cols) — Shows Empty Scanner Rig until User Registers an Artifact */}
              <div className="lg:col-span-6">
                <figure className="h-full flex flex-col">
                  <div className="relative flex-1 min-h-[270px] lg:min-h-[345px] rounded-2xl overflow-hidden border border-[#D4C7B0] bg-[#EAE1D0] shadow-[0_6px_24px_rgba(28,24,20,0.08)]">
                    {!heroImgFailed ? (
                      <img
                        src={heroPrimaryImage}
                        alt={
                          latestRegistered
                            ? getArtifactDisplayTitle(latestRegistered, locale)
                            : t.heroFigCaption
                        }
                        referrerPolicy="no-referrer"
                        onError={() => setHeroImgFailed(true)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#F3EDE1] to-[#DED3BE]">
                        <span className="font-editorial text-2xl font-bold text-[#1C1814] mb-2">
                          {t.heroFallbackTitle}
                        </span>
                        <span className="text-xs text-[#6E6357]">
                          {t.heroFallbackSub}
                        </span>
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5">
                      <p className="text-xs font-medium text-[#FBF9F5]">
                        {heroPrimaryCaption}
                      </p>
                    </div>
                  </div>
                </figure>
              </div>
            </div>

            {/* 4 Harmonized Curatorial Stages Culminating in Step 04 */}
            <div className="mt-12 pt-9 border-t border-[#DED4C3]">
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1814] balance-text">
                  {t.workflowSectionTitle}
                </h2>
                <p className="text-sm text-[#6E6357] mt-1 max-w-2xl">
                  {t.workflowSectionSub}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {workflowSteps.map((step, index) => {
                  const isFinale = index === 3;
                  return (
                    <a
                      key={step.num}
                      href={step.href}
                      onClick={
                        isFinale ? handleOpenVerificationWithCamera : undefined
                      }
                      className={`group rounded-2xl p-5 flex flex-col justify-between border transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C45] ${
                        isFinale
                          ? 'bg-[#F5EFE2] border-[#C89E54] hover:border-[#0F4C45]'
                          : 'card-guardian hover:border-[#0F4C45]/60'
                      }`}
                    >
                      <div>
                        <div className="flex items-baseline justify-between gap-2 pb-3 border-b border-[#E5DDD0]">
                          <div className="flex items-baseline gap-2">
                            <span
                              className={`font-mono text-2xl font-bold tabular-nums leading-none ${
                                isFinale ? 'text-[#0F4C45]' : 'text-[#9E6E24]'
                              }`}
                            >
                              {step.num}
                            </span>
                            <span className="text-[11px] font-semibold text-[#6E6357]">
                              {step.label}
                            </span>
                          </div>
                          <span
                            className={`text-xs font-mono tabular-nums ${
                              step.isReady
                                ? 'text-[#0F4C45] font-semibold'
                                : 'text-[#92400E] font-medium'
                            }`}
                          >
                            {step.liveStatus}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-[#1C1814] mt-3.5 leading-snug">
                          {step.title}
                        </h3>

                        <p className="text-xs text-[#5C5247] mt-1.5 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#E5DDD0] flex items-center justify-between gap-2 text-xs font-bold text-[#0F4C45] group-hover:text-[#9E6E24] transition-colors">
                        <span>{t.stepGoAction}</span>
                        <StepArrowIcon className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 01. Multi-Angle Live Capture & Upload Studio (User's Real Photos Only) */}
        <CaptureStudio
          locale={locale}
          angles={angles}
          onAddAngle={handleAddAngle}
          onAddMultipleAngles={handleAddMultipleAngles}
          onUpdateDirection={handleUpdateDirection}
          onRemoveAngle={handleRemoveAngle}
          onClearAll={handleClearAll}
          onJumpTo3D={() => {
            document
              .getElementById('spatial-studio')
              ?.scrollIntoView({ behavior: 'smooth' });
          }}
          externalStopSignal={verifyCameraTrigger}
        />

        {/* 02. Three.js Spatial Reconstruction & Relief Studio */}
        <SpatialReconstructionViewport
          locale={locale}
          angles={angles}
          metrics={metrics}
        />

        {/* 03 & 04. Essential Artifact Registration + Condition Verification, Cascading Selection, Camera Voice Briefing & PDF Export */}
        <ArtifactConditionVerifierSection
          locale={locale}
          angles={angles}
          metrics={metrics}
          formState={formState}
          onChangeBasicField={(field, value) => {
            setFormState((prev) => ({ ...prev, [field]: value }));
          }}
          onChangeEnvField={(
            field: keyof ArtifactEnvironmentalProfile,
            value
          ) => {
            setFormState((prev) => ({
              ...prev,
              environmental: {
                ...prev.environmental,
                [field]: value,
              },
            }));
          }}
          onApplyMaterialPreset={handleApplyMaterialPreset}
          onSaveArtifact={handleSaveArtifact}
          onResetNewArtifactForm={handleResetOnlyForm}
          onJumpToCapture={() => {
            document
              .getElementById('capture-studio')
              ?.scrollIntoView({ behavior: 'smooth' });
          }}
          registeredArtifacts={archive}
          onLoadRegisteredArtifactTo3D={handleLoadArchivedArtifact}
          onDeleteRegisteredArtifact={handleDeleteRegisteredArtifact}
          verifyCameraTrigger={verifyCameraTrigger}
          onTriggerVerifyCamera={() =>
            setVerifyCameraTrigger((prev) => prev + 1)
          }
        />
      </main>

      {/* Curatorial Footer with Prominent Localized "Design & Programming" Icon Card */}
      <footer className="bg-[#FBF9F5] border-t border-[#DED4C3] py-9 px-6">
        <div className="max-w-[1160px] mx-auto flex flex-col gap-6">
          <TeamCreditsFooterBar
            locale={locale}
            onOpen={() => setIsCreditsOpen(true)}
          />

          <div className="pt-4 border-t border-[#E5DDD0] flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-[#6E6357]">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-editorial text-lg font-bold text-[#1C1814]">
                {t.brandName}
              </span>
              <span aria-hidden="true" className="text-[#9E6E24]">·</span>
              <span>{t.footerTagline}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={`footer-${lang.code}`}
                  type="button"
                  onClick={() => handleSelectLocale(lang.code)}
                  className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    locale === lang.code
                      ? 'font-bold text-[#0F4C45] underline decoration-[#9E6E24] decoration-2 underline-offset-4'
                      : 'text-[#6E6357] hover:text-[#1C1814]'
                  }`}
                >
                  {lang.nativeLabel}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <TeamCreditsModal
        locale={locale}
        isOpen={isCreditsOpen}
        onClose={() => setIsCreditsOpen(false)}
      />
    </div>
  );
}
