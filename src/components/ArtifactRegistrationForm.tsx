import React, { useMemo, useState } from 'react';
import {
  Camera,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Download,
  FileJson,
  FileText,
  Globe,
  PlusCircle,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { COMPARISON_STRINGS } from '../i18n/comparisonStrings';
import { CONSERVATION_STRINGS } from '../i18n/conservationStrings';
import {
  getDirectionLabel,
  PRESET_METADATA,
} from '../i18n/domainTranslations';
import { UI_STRINGS } from '../i18n/uiStrings';
import { TEAM_CREDITS_I18N } from './TeamCreditsModal';
import {
  ArtifactConditionGrade,
  ArtifactEnvironmentalProfile,
  ArtifactFormState,
  CapturedAngleImage,
  CulturalCorridorId,
  DirectMoistureStatus,
  DocumentedArtifact,
  LocaleCode,
  MaterialConservationClass,
  SurfaceMetrics,
} from '../types/artifact';
import {
  ConservationStatusLevel,
  evaluateEnvironmentalProfile,
  MATERIAL_CONSERVATION_PRESETS,
} from '../utils/conservationEngine';
import { exportHeritagePassportPng } from '../utils/imageAnalysis';
import { exportArtifactOfficialPdfReport } from '../utils/pdfReportGenerator';
import {
  getCountryDisplayName,
  getSortedWorldCountries,
} from '../utils/worldCountries';

interface ArtifactRegistrationFormProps {
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
  onJumpToVerification?: () => void;
  archiveCount: number;
}

export const ArtifactRegistrationForm: React.FC<
  ArtifactRegistrationFormProps
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
  onJumpToVerification,
  archiveCount,
}) => {
  const t = UI_STRINGS[locale];
  const c = CONSERVATION_STRINGS[locale];
  const cs = COMPARISON_STRINGS[locale];
  const isRtl = locale === 'ar';

  const worldCountries = useMemo(
    () => getSortedWorldCountries(locale),
    [locale]
  );

  const [saveFeedback, setSaveFeedback] = useState<
    { kind: 'err' } | { kind: 'ok'; code: string } | null
  >(null);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [isExportingPng, setIsExportingPng] = useState<boolean>(false);
  const [showResearcherDetails, setShowResearcherDetails] =
    useState<boolean>(false);

  const env = formState.environmental;
  const meetsMinimum = angles.length >= 3;

  const evaluation = useMemo(() => evaluateEnvironmentalProfile(env), [env]);

  const statusMeta = (level: ConservationStatusLevel) => {
    if (level === 'nominal') {
      return { text: c.badgeSafe, cls: 'text-emerald-800 font-semibold' };
    }
    if (level === 'warning') {
      return { text: c.badgeAlert, cls: 'text-amber-800 font-semibold' };
    }
    return { text: c.badgeRisk, cls: 'text-rose-800 font-bold' };
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetsMinimum) {
      setSaveFeedback({ kind: 'err' });
      return;
    }
    const saved = onSaveArtifact();
    if (saved) {
      setSaveFeedback({ kind: 'ok', code: saved.accessionCode });
    }
  };

  const buildTempArtifactForExport = (): DocumentedArtifact => {
    const parsedCultures = formState.meetingCulturesText
      .split(/[،,、]/)
      .map((s) => s.trim())
      .filter(Boolean);

    return {
      id: `export-${Date.now()}`,
      accessionCode: `SG-2026-${String(archiveCount + 1).padStart(3, '0')}`,
      inventoryNumber:
        formState.inventoryNumber.trim() ||
        `INV-2026-${String(archiveCount + 1).padStart(3, '0')}`,
      titleAr: formState.titleAr.trim() || t.fieldArtifactName,
      periodAr: formState.periodAr.trim() || t.fieldPeriod,
      materialAr:
        formState.materialAr.trim() || c.materialClasses[env.materialClass],
      dimensionsCm: formState.dimensionsCm.trim() || '24 × 20 cm',
      weightGrams: formState.weightGrams.trim() || '1200',
      conditionGrade: formState.conditionGrade,
      countryCode: formState.countryCode || 'BH',
      discoveryRegionAr: formState.discoveryRegionAr.trim() || t.fieldRegion,
      corridorId: CulturalCorridorId.IncenseRoute,
      meetingCulturesAr: parsedCultures,
      curatorialNotesAr: formState.curatorialNotesAr.trim(),
      teamNameAr:
        formState.teamNameAr.trim() ||
        PRESET_METADATA.incense_burner[locale].defaultTeam,
      createdAtIso: new Date().toISOString(),
      angles,
      metrics,
      environmentalProfile: env,
    };
  };

  const handleExportCurrentPdf = async () => {
    if (!meetsMinimum) {
      setSaveFeedback({ kind: 'err' });
      return;
    }
    setIsExportingPdf(true);
    try {
      const tempRecord = buildTempArtifactForExport();
      await exportArtifactOfficialPdfReport(tempRecord, locale);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportCurrentPng = async () => {
    if (!meetsMinimum) {
      setSaveFeedback({ kind: 'err' });
      return;
    }
    setIsExportingPng(true);
    try {
      const tempRecord = buildTempArtifactForExport();
      await exportHeritagePassportPng(tempRecord, locale);
    } finally {
      setIsExportingPng(false);
    }
  };

  const handleExportCurrentJson = () => {
    if (!meetsMinimum) {
      setSaveFeedback({ kind: 'err' });
      return;
    }
    const payload = {
      platform: 'Smart Guardian | الحارس الذكي',
      institution: TEAM_CREDITS_I18N[locale].prominentStatement,
      language: locale,
      exportedAt: new Date().toISOString(),
      artifact: {
        name: formState.titleAr,
        materialClass: c.materialClasses[env.materialClass],
        period: formState.periodAr,
        countryCode: formState.countryCode || 'BH',
        country: getCountryDisplayName(formState.countryCode || 'BH', locale),
        location: formState.discoveryRegionAr,
        team: formState.teamNameAr,
        note: formState.curatorialNotesAr,
      },
      climateBenchmark: {
        suitableTempRangeC: [env.tempSafeMinC, env.tempSafeMaxC],
        currentTempC: env.tempCurrentC,
        suitableRhRangePct: [env.rhSafeMinPct, env.rhSafeMaxPct],
        currentRhPct: env.rhCurrentPct,
        safeIndicatorsCount: `${evaluation.nominalCount}/4`,
      },
      environmentalIndicators: env,
      angles: angles.map((a) => ({
        direction: getDirectionLabel(locale, a.direction),
        sharpnessScore: a.sharpnessScore,
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart-guardian-dossier-${locale}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Simple visual bar percentages
  const clampPct = (val: number, minS: number, maxS: number) =>
    Math.max(0, Math.min(100, ((val - minS) / (maxS - minS)) * 100));

  const tempStart = clampPct(env.tempSafeMinC, 0, 45);
  const tempWidth = Math.max(3, clampPct(env.tempSafeMaxC, 0, 45) - tempStart);
  const tempPin = clampPct(env.tempCurrentC, 0, 45);

  const rhStart = clampPct(env.rhSafeMinPct, 0, 100);
  const rhWidth = Math.max(3, clampPct(env.rhSafeMaxPct, 0, 100) - rhStart);
  const rhPin = clampPct(env.rhCurrentPct, 0, 100);

  const inputCls = 'input-guardian text-sm px-3.5 py-2.5';
  const compactNumCls =
    'input-guardian w-24 text-sm font-mono tabular-nums px-2.5 py-1.5';
  const compactSelectCls =
    'input-guardian max-w-[270px] text-xs font-medium px-2.5 py-1.5';

  const indicatorIds = [1, 2, 3, 4] as const;

  return (
    <section
      id="artifact-registration"
      className="py-14 border-b border-[#DED4C3] bg-[#FBF9F5]"
    >
      <div className="max-w-[1160px] mx-auto px-6">
        {/* Clean, Simple Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold text-[#0F4C45] mb-1">
              {c.sec3Kicker}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1814] balance-text">
              {c.sec3Title}
            </h2>
            <p className="text-sm text-[#5C5247] mt-1 max-w-2xl">
              {c.sec3Subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSaveFeedback(null);
              onResetNewArtifactForm();
            }}
            className="btn-guardian-secondary px-4 py-2 text-xs self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#9E6E24] shrink-0" />
            <span>{c.newBlankBtn}</span>
          </button>
        </div>

        {/* Calm 3-Sub-Stage Registration Guide & Photo Readiness Strip */}
        <div className="mb-6 bg-white border border-[#DED4C3] rounded-2xl overflow-hidden shadow-[0_1px_6px_rgba(28,24,20,0.03)]">
          <div className="px-5 py-3.5 border-b border-[#EAE1D2] flex flex-wrap items-center justify-between gap-3">
            <span
              className={`text-xs sm:text-sm font-mono tabular-nums ${
                meetsMinimum
                  ? 'text-[#0F4C45] font-semibold'
                  : 'text-[#92400E] font-semibold'
              }`}
            >
              {meetsMinimum
                ? c.anglesReadyShort(angles.length)
                : c.anglesNeededShort(angles.length)}
            </span>
            {!meetsMinimum && (
              <button
                type="button"
                onClick={onJumpToCapture}
                className="btn-guardian-primary px-4 py-1.5 text-xs"
              >
                <Camera className="w-3.5 h-3.5 text-[#F3D28C] shrink-0" />
                <span>{c.addPhotosBtn}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x rtl:md:divide-x-reverse divide-[#EAE1D2] bg-[#FAF7F1]">
            <div className="px-5 py-3 flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-[#9E6E24] tabular-nums shrink-0">
                {cs.regSubStep1Code}
              </span>
              <span className="text-xs font-semibold text-[#1C1814]">
                {cs.regSubStep1Label}
              </span>
            </div>
            <div className="px-5 py-3 flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-[#9E6E24] tabular-nums shrink-0">
                {cs.regSubStep2Code}
              </span>
              <span className="text-xs font-semibold text-[#1C1814]">
                {cs.regSubStep2Label}
              </span>
            </div>
            <div className="px-5 py-3 flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-[#0F4C45] tabular-nums shrink-0">
                {cs.regSubStep3Code}
              </span>
              <span className="text-xs font-semibold text-[#1C1814]">
                {cs.regSubStep3Label}
              </span>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleFormSubmit}
          className="card-guardian overflow-hidden divide-y divide-[#E5DDD0]"
        >
          {/* BLOCK 1 (3A): Symmetrical 3x3 Essential Artifact Identity, Country, Inventory & Mass */}
          <div className="p-6">
            <div className="mb-4">
              <span className="text-xs font-mono font-bold text-[#9E6E24] tabular-nums block mb-0.5">
                {cs.regSubStep1Code} · {cs.regSubStep1Label}
              </span>
              <h3 className="text-lg font-bold text-stone-950">
                {c.basicInfoTitle}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="simple-title"
                  className="block text-xs font-semibold text-stone-700 mb-1"
                >
                  {c.lblArtifactName}
                </label>
                <input
                  id="simple-title"
                  type="text"
                  required
                  value={formState.titleAr}
                  onChange={(e) => onChangeBasicField('titleAr', e.target.value)}
                  className={inputCls}
                />
              </div>

              <div>
                <label
                  htmlFor="simple-material"
                  className="block text-xs font-semibold text-[#0F4C45] mb-1"
                >
                  {c.lblMaterialClass}
                </label>
                <select
                  id="simple-material"
                  value={env.materialClass}
                  onChange={(e) =>
                    onApplyMaterialPreset(
                      e.target.value as MaterialConservationClass
                    )
                  }
                  className={inputCls}
                >
                  {(
                    Object.keys(
                      MATERIAL_CONSERVATION_PRESETS
                    ) as MaterialConservationClass[]
                  ).map((matKey) => (
                    <option key={matKey} value={matKey}>
                      {c.materialClasses[matKey]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="simple-period"
                  className="block text-xs font-semibold text-stone-700 mb-1"
                >
                  {c.lblPeriod}
                </label>
                <input
                  id="simple-period"
                  type="text"
                  required
                  value={formState.periodAr}
                  onChange={(e) =>
                    onChangeBasicField('periodAr', e.target.value)
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label
                  htmlFor="simple-country"
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#0F4C45] mb-1"
                >
                  <Globe className="w-3.5 h-3.5 text-[#0F4C45] shrink-0" />
                  <span>{cs.lblCountryField}</span>
                </label>
                <div className="flex items-center gap-2">
                  <span
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#0F4C45]/10 border border-[#0F4C45]/25 text-[#0F4C45] shrink-0"
                    title={cs.countrySortedHint}
                    aria-hidden="true"
                  >
                    <Globe className="w-4 h-4" />
                  </span>
                  <select
                    id="simple-country"
                    value={formState.countryCode || 'BH'}
                    onChange={(e) =>
                      onChangeBasicField('countryCode', e.target.value)
                    }
                    aria-label={`${cs.lblCountryField} — ${cs.countrySortedHint}`}
                    className={`${inputCls} flex-1 min-w-0`}
                  >
                    {worldCountries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name} ({country.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="simple-location"
                  className="block text-xs font-semibold text-stone-700 mb-1"
                >
                  {c.lblLocation}
                </label>
                <input
                  id="simple-location"
                  type="text"
                  value={formState.discoveryRegionAr}
                  onChange={(e) => {
                    onChangeBasicField('discoveryRegionAr', e.target.value);
                    onChangeEnvField('galleryStorageLocation', e.target.value);
                  }}
                  className={inputCls}
                />
              </div>

              <div>
                <label
                  htmlFor="simple-team"
                  className="block text-xs font-semibold text-stone-700 mb-1"
                >
                  {c.lblTeam}
                </label>
                <input
                  id="simple-team"
                  type="text"
                  value={formState.teamNameAr}
                  onChange={(e) =>
                    onChangeBasicField('teamNameAr', e.target.value)
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label
                  htmlFor="simple-inventory"
                  className="block text-xs font-semibold text-[#0F4C45] mb-1"
                >
                  {c.lblInventoryNumber}
                </label>
                <input
                  id="simple-inventory"
                  type="text"
                  value={formState.inventoryNumber}
                  onChange={(e) =>
                    onChangeBasicField('inventoryNumber', e.target.value)
                  }
                  className={`${inputCls} font-mono tabular-nums`}
                />
              </div>

              <div>
                <label
                  htmlFor="simple-weight"
                  className="block text-xs font-semibold text-[#0F4C45] mb-1"
                >
                  {c.lblWeightGrams}
                </label>
                <input
                  id="simple-weight"
                  type="text"
                  value={formState.weightGrams}
                  onChange={(e) =>
                    onChangeBasicField('weightGrams', e.target.value)
                  }
                  className={`${inputCls} font-mono tabular-nums`}
                />
              </div>

              <div>
                <label
                  htmlFor="simple-condition"
                  className="block text-xs font-semibold text-stone-700 mb-1"
                >
                  {c.lblConditionGrade}
                </label>
                <select
                  id="simple-condition"
                  value={formState.conditionGrade}
                  onChange={(e) =>
                    onChangeBasicField(
                      'conditionGrade',
                      e.target.value as ArtifactConditionGrade
                    )
                  }
                  className={inputCls}
                >
                  {(
                    Object.keys(c.conditionGrades) as ArtifactConditionGrade[]
                  ).map((gradeKey) => (
                    <option key={gradeKey} value={gradeKey}>
                      {c.conditionGrades[gradeKey]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label
                  htmlFor="simple-note"
                  className="block text-xs font-semibold text-stone-700 mb-1"
                >
                  {c.lblShortNote}
                </label>
                <input
                  id="simple-note"
                  type="text"
                  placeholder={c.lblShortNotePlaceholder}
                  value={formState.curatorialNotesAr}
                  onChange={(e) =>
                    onChangeBasicField('curatorialNotesAr', e.target.value)
                  }
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* BLOCK 2 (3B): Suitable Temperature & Humidity Benchmark (2 Clean Cards) */}
          <div className="p-6 bg-[#F4EEE3]/70">
            <div className="mb-4">
              <span className="text-xs font-mono font-bold text-[#9E6E24] tabular-nums block mb-0.5">
                {cs.regSubStep2Code} · {cs.regSubStep2Label}
              </span>
              <h3 className="text-lg font-bold text-[#1C1814]">
                {c.benchmarkTitle}
              </h3>
              <p className="text-xs text-[#6E6357] mt-0.5">{c.benchmarkSub}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Temperature Benchmark Card */}
              <div className="p-4 rounded-xl bg-white border border-[#DED4C3]">
                <div className="flex items-baseline justify-between gap-2 mb-3">
                  <span className="text-sm font-bold text-[#1C1814]">
                    {c.tempCardTitle}
                  </span>
                  <span
                    className={`text-xs font-mono tabular-nums ${
                      evaluation.tempDeltaFromSafeC === 0
                        ? 'text-[#0F4C45] font-semibold'
                        : 'text-rose-800 font-bold'
                    }`}
                  >
                    {evaluation.tempDeltaFromSafeC === 0
                      ? c.statusWithinRange
                      : evaluation.tempDeltaFromSafeC > 0
                      ? c.statusAboveRange(`${evaluation.tempDeltaFromSafeC}°C`)
                      : c.statusBelowRange(`${evaluation.tempDeltaFromSafeC}°C`)}
                  </span>
                </div>

                {/* Simple Visual Safe Bar */}
                <div dir="ltr" className="relative h-3 rounded-full bg-[#EFE9DC] border border-[#D4C7B0] mb-3.5 overflow-hidden">
                  <div
                    className="absolute inset-y-0 bg-[#0F4C45]/20 border-x border-[#0F4C45]"
                    style={{ left: `${tempStart}%`, width: `${tempWidth}%` }}
                  />
                  <div
                    className={`absolute inset-y-0 w-1.5 -ml-0.5 ${
                      evaluation.tempDeltaFromSafeC === 0
                        ? 'bg-[#0F4C45]'
                        : 'bg-rose-700'
                    }`}
                    style={{ left: `${tempPin}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6E6357] mb-1">
                      {c.lblSafeMin}
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={env.tempSafeMinC}
                      onChange={(e) =>
                        onChangeEnvField('tempSafeMinC', Number(e.target.value))
                      }
                      className={`${inputCls} font-mono tabular-nums py-1.5 text-xs`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6E6357] mb-1">
                      {c.lblSafeMax}
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={env.tempSafeMaxC}
                      onChange={(e) =>
                        onChangeEnvField('tempSafeMaxC', Number(e.target.value))
                      }
                      className={`${inputCls} font-mono tabular-nums py-1.5 text-xs`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#0F4C45] mb-1">
                      {c.lblCurrentReading}
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={env.tempCurrentC}
                      onChange={(e) =>
                        onChangeEnvField('tempCurrentC', Number(e.target.value))
                      }
                      className={`${inputCls} font-mono tabular-nums py-1.5 text-xs border-[#0F4C45]/50 bg-white`}
                    />
                  </div>
                </div>
              </div>

              {/* Relative Humidity Benchmark Card */}
              <div className="p-4 rounded-xl bg-white border border-[#DED4C3]">
                <div className="flex items-baseline justify-between gap-2 mb-3">
                  <span className="text-sm font-bold text-[#1C1814]">
                    {c.rhCardTitle}
                  </span>
                  <span
                    className={`text-xs font-mono tabular-nums ${
                      evaluation.rhDeltaFromSafePct === 0
                        ? 'text-[#0F4C45] font-semibold'
                        : 'text-rose-800 font-bold'
                    }`}
                  >
                    {evaluation.rhDeltaFromSafePct === 0
                      ? c.statusWithinRange
                      : evaluation.rhDeltaFromSafePct > 0
                      ? c.statusAboveRange(`${evaluation.rhDeltaFromSafePct}%`)
                      : c.statusBelowRange(`${evaluation.rhDeltaFromSafePct}%`)}
                  </span>
                </div>

                <div dir="ltr" className="relative h-3 rounded-full bg-[#EFE9DC] border border-[#D4C7B0] mb-3.5 overflow-hidden">
                  <div
                    className="absolute inset-y-0 bg-[#0F4C45]/20 border-x border-[#0F4C45]"
                    style={{ left: `${rhStart}%`, width: `${rhWidth}%` }}
                  />
                  <div
                    className={`absolute inset-y-0 w-1.5 -ml-0.5 ${
                      evaluation.rhDeltaFromSafePct === 0
                        ? 'bg-[#0F4C45]'
                        : 'bg-rose-700'
                    }`}
                    style={{ left: `${rhPin}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6E6357] mb-1">
                      {c.lblSafeMin}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={env.rhSafeMinPct}
                      onChange={(e) =>
                        onChangeEnvField('rhSafeMinPct', Number(e.target.value))
                      }
                      className={`${inputCls} font-mono tabular-nums py-1.5 text-xs`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6E6357] mb-1">
                      {c.lblSafeMax}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={env.rhSafeMaxPct}
                      onChange={(e) =>
                        onChangeEnvField('rhSafeMaxPct', Number(e.target.value))
                      }
                      className={`${inputCls} font-mono tabular-nums py-1.5 text-xs`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#0F4C45] mb-1">
                      {c.lblCurrentReading}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={env.rhCurrentPct}
                      onChange={(e) =>
                        onChangeEnvField('rhCurrentPct', Number(e.target.value))
                      }
                      className={`${inputCls} font-mono tabular-nums py-1.5 text-xs border-[#0F4C45]/50 bg-white`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BLOCK 3 (3C): Concise 9-Row Essential Environmental Summary Table */}
          <div>
            <div className="px-6 py-4 flex flex-wrap items-end justify-between gap-2 border-b border-[#E5DDD0]">
              <div>
                <span className="text-xs font-mono font-bold text-[#0F4C45] tabular-nums block mb-0.5">
                  {cs.regSubStep3Code} · {cs.regSubStep3Label}
                </span>
                <h3 className="text-lg font-bold text-[#1C1814]">
                  {c.envTableTitle}
                </h3>
              </div>
              <span className="text-xs font-mono tabular-nums font-semibold text-[#0F4C45]">
                {c.envTableSub(evaluation.nominalCount)}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F4EEE3] border-b border-[#E5DDD0] text-xs font-bold text-[#4A423A]">
                    <th
                      className={`py-3.5 px-5 ${
                        isRtl ? 'text-right' : 'text-left'
                      }`}
                    >
                      {c.colIndicator}
                    </th>
                    <th
                      className={`py-3.5 px-5 ${
                        isRtl ? 'text-right' : 'text-left'
                      }`}
                    >
                      {c.colKeyValue}
                    </th>
                    <th
                      className={`py-3.5 px-5 ${
                        isRtl ? 'text-right' : 'text-left'
                      }`}
                    >
                      {c.colWhatItDetects}
                    </th>
                    <th
                      className={`py-3.5 px-5 whitespace-nowrap ${
                        isRtl ? 'text-right' : 'text-left'
                      }`}
                    >
                      {c.colStatus}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE1D2]">
                  {indicatorIds.map((id) => {
                    const rowCopy = c.indicators[id];
                    const diag = evaluation.indicators[id];
                    const st = statusMeta(diag.level);

                    return (
                      <tr key={id} className="hover:bg-[#FAF7F1] align-middle">
                        <td className="py-3.5 px-5 font-bold text-[#1C1814] whitespace-nowrap">
                          <span className="font-mono text-[#9E6E24] tabular-nums">
                            {rowCopy.num}.
                          </span>{' '}
                          <span>{rowCopy.title}</span>
                        </td>

                        <td className="py-3 px-5">
                          {id === 1 && (
                            <div className="flex items-center gap-2 flex-wrap text-xs font-mono tabular-nums text-stone-700">
                              <strong className="text-stone-950 text-sm">
                                {env.tempCurrentC}°C
                              </strong>
                              <span className="text-stone-500">
                                ({c.safeRangeSummary(env.tempSafeMinC, env.tempSafeMaxC, '°C')})
                              </span>
                            </div>
                          )}

                          {id === 2 && (
                            <div className="flex items-center gap-2 flex-wrap text-xs font-mono tabular-nums text-stone-700">
                              <strong className="text-stone-950 text-sm">
                                {env.rhCurrentPct}% RH
                              </strong>
                              <span className="text-stone-500">
                                ({c.safeRangeSummary(env.rhSafeMinPct, env.rhSafeMaxPct, '%')})
                              </span>
                            </div>
                          )}

                          {id === 3 && (
                            <select
                              aria-label={rowCopy.title}
                              value={env.directMoistureStatus}
                              onChange={(e) =>
                                onChangeEnvField(
                                  'directMoistureStatus',
                                  e.target.value as DirectMoistureStatus
                                )
                              }
                              className={compactSelectCls}
                            >
                              {(
                                Object.keys(
                                  c.moistureStatuses
                                ) as DirectMoistureStatus[]
                              ).map((k) => (
                                <option key={k} value={k}>
                                  {c.moistureStatuses[k]}
                                </option>
                              ))}
                            </select>
                          )}

                          {id === 4 && (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                step="0.1"
                                aria-label={rowCopy.title}
                                value={env.vibrationPeakMmPerSec}
                                onChange={(e) =>
                                  onChangeEnvField(
                                    'vibrationPeakMmPerSec',
                                    Number(e.target.value)
                                  )
                                }
                                className={compactNumCls}
                              />
                              <span className="text-xs text-stone-500 whitespace-nowrap">
                                {c.unitVibration}
                              </span>
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-5 text-xs text-stone-600">
                          {rowCopy.shortPurpose}
                        </td>

                        <td className="py-3 px-5 whitespace-nowrap text-xs font-mono tabular-nums">
                          <span className={st.cls}>{st.text}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Optional Researcher Detailed Documentary Parameters (Collapsed by Default) */}
          <div className="bg-[#FAF7F1]">
            <button
              type="button"
              onClick={() => setShowResearcherDetails((prev) => !prev)}
              aria-expanded={showResearcherDetails}
              className="w-full px-6 py-4 flex items-center justify-between gap-4 text-start hover:bg-[#F4EEE3]/70 transition-colors cursor-pointer"
            >
              <div className="flex items-start sm:items-center gap-3">
                <SlidersHorizontal className="w-4 h-4 text-[#9E6E24] shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#1C1814]">
                    {c.researcherToggleTitle}
                  </p>
                  <p className="text-xs text-[#6E6357] mt-0.5">
                    {c.researcherToggleSub}
                  </p>
                </div>
              </div>
              {showResearcherDetails ? (
                <ChevronUp className="w-4 h-4 text-[#0F4C45] shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#0F4C45] shrink-0" />
              )}
            </button>

            {showResearcherDetails && (
              <div className="px-6 pb-6 pt-2 border-t border-[#EAE1D2] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {c.lblDimensionsCm}
                  </label>
                  <input
                    type="text"
                    value={formState.dimensionsCm}
                    onChange={(e) =>
                      onChangeBasicField('dimensionsCm', e.target.value)
                    }
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {c.lblTempDriftRate}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={env.tempChangeRateCPerDay}
                    onChange={(e) =>
                      onChangeEnvField(
                        'tempChangeRateCPerDay',
                        Number(e.target.value)
                      )
                    }
                    className={`${inputCls} font-mono tabular-nums`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {c.lblRhDailyFluctuation}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={env.rhDailyFluctuationPct}
                    onChange={(e) =>
                      onChangeEnvField(
                        'rhDailyFluctuationPct',
                        Number(e.target.value)
                      )
                    }
                    className={`${inputCls} font-mono tabular-nums`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {c.lblRhOutOfRangeHours}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={env.rhOutOfRangeHours}
                    onChange={(e) =>
                      onChangeEnvField(
                        'rhOutOfRangeHours',
                        Number(e.target.value)
                      )
                    }
                    className={`${inputCls} font-mono tabular-nums`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {c.lblMoistureDurationHours}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={env.directMoistureDurationHours}
                    onChange={(e) =>
                      onChangeEnvField(
                        'directMoistureDurationHours',
                        Number(e.target.value)
                      )
                    }
                    className={`${inputCls} font-mono tabular-nums`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {c.lblMoistureNotes}
                  </label>
                  <input
                    type="text"
                    value={env.directMoistureNotes}
                    onChange={(e) =>
                      onChangeEnvField('directMoistureNotes', e.target.value)
                    }
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {c.lblShockEventsCount}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={env.shockEventsCount}
                    onChange={(e) =>
                      onChangeEnvField(
                        'shockEventsCount',
                        Number(e.target.value)
                      )
                    }
                    className={`${inputCls} font-mono tabular-nums`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {c.lblVibrationPattern}
                  </label>
                  <input
                    type="text"
                    value={env.vibrationFrequencyDuration}
                    onChange={(e) =>
                      onChangeEnvField(
                        'vibrationFrequencyDuration',
                        e.target.value
                      )
                    }
                    className={inputCls}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sculpted Curatorial Action & Finale Step-04 Handoff Bar */}
          <div className="px-6 py-5 bg-[#F4EEE3] space-y-3.5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="submit"
                  disabled={!meetsMinimum}
                  className="btn-guardian-primary px-5 py-2.5 text-xs"
                >
                  <PlusCircle className="w-4 h-4 text-[#F3D28C] shrink-0" />
                  <span>{t.saveToArchiveBtn(angles.length)}</span>
                </button>

                <button
                  type="button"
                  disabled={!meetsMinimum || isExportingPdf}
                  onClick={handleExportCurrentPdf}
                  className="btn-guardian-brass px-4 py-2.5 text-xs"
                >
                  <FileText className="w-4 h-4 text-[#9E6E24] shrink-0" />
                  <span>
                    {isExportingPdf ? t.exportingPdfBtn : t.exportPdfBtn}
                  </span>
                </button>

                <button
                  type="button"
                  disabled={!meetsMinimum || isExportingPng}
                  onClick={handleExportCurrentPng}
                  className="btn-guardian-secondary px-3.5 py-2.5 text-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#9E6E24] shrink-0" />
                  <span>{isExportingPng ? t.exportingBtn : t.exportPngBtn}</span>
                </button>

                <button
                  type="button"
                  disabled={!meetsMinimum}
                  onClick={handleExportCurrentJson}
                  className="btn-guardian-secondary px-3.5 py-2.5 text-xs"
                >
                  <FileJson className="w-3.5 h-3.5 text-[#9E6E24] shrink-0" />
                  <span>{t.exportJsonBtn}</span>
                </button>
              </div>

              {onJumpToVerification && (
                <button
                  type="button"
                  onClick={onJumpToVerification}
                  className="btn-guardian-secondary px-4 py-2.5 text-xs border-[#0F4C45]/40 text-[#0F4C45]"
                >
                  <ClipboardCheck className="w-4 h-4 text-[#0F4C45] shrink-0" />
                  <span>{cs.jumpToVerifyBtn}</span>
                </button>
              )}
            </div>

            <div className="pt-2.5 border-t border-[#DED4C3] flex flex-wrap items-center justify-between gap-2 text-xs text-[#5C5247]">
              <span>{cs.regNextStepHint}</span>
              {saveFeedback && (
                <span
                  className={`font-semibold ${
                    saveFeedback.kind === 'err'
                      ? 'text-rose-800'
                      : 'text-[#0F4C45]'
                  }`}
                >
                  {saveFeedback.kind === 'err'
                    ? t.errNeed3BeforeSave
                    : t.savedSuccessMsg(saveFeedback.code)}
                </span>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};
