import {
  ArtifactEnvironmentalProfile,
  LocaleCode,
  MaterialConservationClass,
  PresetId,
} from '../types/artifact';

export interface MaterialThresholdSpec {
  tempSafeMinC: number;
  tempSafeMaxC: number;
  rhSafeMinPct: number;
  rhSafeMaxPct: number;
}

export const MATERIAL_CONSERVATION_PRESETS: Record<
  MaterialConservationClass,
  MaterialThresholdSpec
> = {
  stone_limestone: {
    tempSafeMinC: 18,
    tempSafeMaxC: 24,
    rhSafeMinPct: 40,
    rhSafeMaxPct: 55,
  },
  metals_bronze: {
    tempSafeMinC: 16,
    tempSafeMaxC: 22,
    rhSafeMinPct: 30,
    rhSafeMaxPct: 42,
  },
  ceramics_glass: {
    tempSafeMinC: 18,
    tempSafeMaxC: 23,
    rhSafeMinPct: 42,
    rhSafeMaxPct: 55,
  },
  manuscripts_pigments: {
    tempSafeMinC: 16,
    tempSafeMaxC: 20,
    rhSafeMinPct: 45,
    rhSafeMaxPct: 52,
  },
  organic_wood_textile: {
    tempSafeMinC: 18,
    tempSafeMaxC: 21,
    rhSafeMinPct: 48,
    rhSafeMaxPct: 56,
  },
};

const DEFAULT_ENV_NOTES: Record<
  LocaleCode,
  {
    moistureNote: string;
    vibrationFreq: string;
    location: string;
  }
> = {
  ar: {
    moistureNote: 'جاف تماماً — لا يوجد تسرب أو تكاثف سطحي',
    vibrationFreq: 'منخفض ومتقطع أثناء ساعات الزيارة فقط',
    location: 'القاعة المتحفية الرئيسية — جناح التراث الأثري',
  },
  'en-US': {
    moistureNote: 'Completely dry — zero seepage or surface condensation',
    vibrationFreq: 'Low intermittent footfall during gallery hours only',
    location: 'Main Conservation Gallery — Heritage Wing',
  },
  fr: {
    moistureNote: 'Parfaitement sec — aucune infiltration ni condensation',
    vibrationFreq: 'Faible et intermittent durant les heures de visite',
    location: 'Galerie principale — Pavillon du Patrimoine',
  },
  zh: {
    moistureNote: '完全干燥 — 无渗水、结露或受潮现象',
    vibrationFreq: '低幅间歇微振（仅限展厅开放时段）',
    location: '主恒温展厅 — 文物保护专区',
  },
  ru: {
    moistureNote: 'Полностью сухо — протечек и конденсата не выявлено',
    vibrationFreq: 'Низкая прерывистая вибрация только в часы посещения',
    location: 'Главный зал — Сектор археологического наследия',
  },
};

export function createDefaultEnvironmentalProfile(
  locale: LocaleCode,
  materialClass: MaterialConservationClass = 'stone_limestone'
): ArtifactEnvironmentalProfile {
  const spec = MATERIAL_CONSERVATION_PRESETS[materialClass];
  const notes = DEFAULT_ENV_NOTES[locale];
  const midTemp = Number(((spec.tempSafeMinC + spec.tempSafeMaxC) / 2).toFixed(1));
  const midRh = Math.round((spec.rhSafeMinPct + spec.rhSafeMaxPct) / 2);

  return {
    materialClass,
    tempCurrentC: midTemp,
    tempSafeMinC: spec.tempSafeMinC,
    tempSafeMaxC: spec.tempSafeMaxC,
    tempChangeRateCPerDay: 0.6,

    rhCurrentPct: midRh,
    rhSafeMinPct: spec.rhSafeMinPct,
    rhSafeMaxPct: spec.rhSafeMaxPct,
    rhDailyFluctuationPct: 2.0,
    rhOutOfRangeHours: 0,

    directMoistureStatus: 'dry_none',
    directMoistureDurationHours: 0,
    directMoistureNotes: notes.moistureNote,

    vibrationPeakMmPerSec: 0.35,
    vibrationFrequencyDuration: notes.vibrationFreq,
    shockEventsCount: 0,

    galleryStorageLocation: notes.location,
  };
}

export function createPresetEnvironmentalProfile(
  presetId: PresetId,
  locale: LocaleCode
): ArtifactEnvironmentalProfile {
  if (presetId === 'incense_burner') {
    const base = createDefaultEnvironmentalProfile(locale, 'stone_limestone');
    return {
      ...base,
      tempCurrentC: 20.5,
      tempSafeMinC: 18,
      tempSafeMaxC: 23,
      tempChangeRateCPerDay: 0.7,
      rhCurrentPct: 44,
      rhSafeMinPct: 38,
      rhSafeMaxPct: 50,
      rhDailyFluctuationPct: 2.2,
      vibrationPeakMmPerSec: 0.4,
    };
  }

  if (presetId === 'astrolabe') {
    const base = createDefaultEnvironmentalProfile(locale, 'metals_bronze');
    return {
      ...base,
      tempCurrentC: 19.2,
      tempSafeMinC: 16,
      tempSafeMaxC: 22,
      tempChangeRateCPerDay: 0.5,
      rhCurrentPct: 36,
      rhSafeMinPct: 30,
      rhSafeMaxPct: 42,
      rhDailyFluctuationPct: 1.5,
      vibrationPeakMmPerSec: 0.25,
    };
  }

  const base = createDefaultEnvironmentalProfile(locale, 'ceramics_glass');
  return {
    ...base,
    tempCurrentC: 20.0,
    tempSafeMinC: 18,
    tempSafeMaxC: 23,
    tempChangeRateCPerDay: 0.6,
    rhCurrentPct: 48,
    rhSafeMinPct: 42,
    rhSafeMaxPct: 55,
    rhDailyFluctuationPct: 2.0,
    vibrationPeakMmPerSec: 0.3,
  };
}

export type ConservationStatusLevel = 'nominal' | 'warning' | 'critical';

export interface IndicatorDiagnostic {
  index: number; // 1..4
  level: ConservationStatusLevel;
  stabilityScorePct: number; // 0..100
  deviationValue: number;
}

export interface EnvironmentalEvaluationResult {
  effectiveTempC: number;
  effectiveRhPct: number;
  tempDeltaFromSafeC: number;
  rhDeltaFromSafePct: number;
  indicators: Record<number, IndicatorDiagnostic>;
  nominalCount: number;
  warningCount: number;
  criticalCount: number;
  overallStabilityPct: number;
  overallLevel: ConservationStatusLevel;
}

export function evaluateEnvironmentalProfile(
  profile: ArtifactEnvironmentalProfile,
  simDeltaTempC = 0,
  simDeltaRhPct = 0
): EnvironmentalEvaluationResult {
  const effectiveTempC = Number((profile.tempCurrentC + simDeltaTempC).toFixed(1));
  const effectiveRhPct = Math.max(
    0,
    Math.min(100, Number((profile.rhCurrentPct + simDeltaRhPct).toFixed(1)))
  );

  // 1. Temperature
  let tempDeltaFromSafeC = 0;
  if (effectiveTempC < profile.tempSafeMinC) {
    tempDeltaFromSafeC = Number((effectiveTempC - profile.tempSafeMinC).toFixed(1));
  } else if (effectiveTempC > profile.tempSafeMaxC) {
    tempDeltaFromSafeC = Number((effectiveTempC - profile.tempSafeMaxC).toFixed(1));
  }
  const absTempOut = Math.abs(tempDeltaFromSafeC);
  let ind1Level: ConservationStatusLevel = 'nominal';
  let ind1Score = 96;
  if (absTempOut > 2.5 || profile.tempChangeRateCPerDay > 3.0) {
    ind1Level = 'critical';
    ind1Score = Math.max(22, Math.round(65 - absTempOut * 7));
  } else if (absTempOut > 0 || profile.tempChangeRateCPerDay > 1.5) {
    ind1Level = 'warning';
    ind1Score = Math.max(52, Math.round(82 - absTempOut * 8));
  }

  // 2. Relative Humidity
  let rhDeltaFromSafePct = 0;
  if (effectiveRhPct < profile.rhSafeMinPct) {
    rhDeltaFromSafePct = Number((effectiveRhPct - profile.rhSafeMinPct).toFixed(1));
  } else if (effectiveRhPct > profile.rhSafeMaxPct) {
    rhDeltaFromSafePct = Number((effectiveRhPct - profile.rhSafeMaxPct).toFixed(1));
  }
  const absRhOut = Math.abs(rhDeltaFromSafePct);
  let ind2Level: ConservationStatusLevel = 'nominal';
  let ind2Score = 96;
  if (
    absRhOut > 7 ||
    effectiveRhPct >= 65 ||
    profile.rhDailyFluctuationPct > 8 ||
    profile.rhOutOfRangeHours > 12
  ) {
    ind2Level = 'critical';
    ind2Score = Math.max(20, Math.round(62 - absRhOut * 2.5));
  } else if (
    absRhOut > 0 ||
    profile.rhDailyFluctuationPct > 4 ||
    profile.rhOutOfRangeHours > 2
  ) {
    ind2Level = 'warning';
    ind2Score = Math.max(54, Math.round(82 - absRhOut * 3));
  }

  // 3. Direct Water & Moisture
  let ind3Level: ConservationStatusLevel = 'nominal';
  let ind3Score = 98;
  if (
    profile.directMoistureStatus === 'active_seepage' ||
    profile.directMoistureDurationHours >= 4
  ) {
    ind3Level = 'critical';
    ind3Score = 24;
  } else if (
    profile.directMoistureStatus === 'condensation_trace' ||
    profile.directMoistureDurationHours > 0
  ) {
    ind3Level = 'warning';
    ind3Score = 60;
  }

  // 4. Vibration & Shocks
  let ind4Level: ConservationStatusLevel = 'nominal';
  let ind4Score = 95;
  if (profile.vibrationPeakMmPerSec > 2.5 || profile.shockEventsCount > 1) {
    ind4Level = 'critical';
    ind4Score = 32;
  } else if (profile.vibrationPeakMmPerSec > 1.2 || profile.shockEventsCount === 1) {
    ind4Level = 'warning';
    ind4Score = 66;
  }

  const indicators: Record<number, IndicatorDiagnostic> = {
    1: { index: 1, level: ind1Level, stabilityScorePct: ind1Score, deviationValue: tempDeltaFromSafeC },
    2: { index: 2, level: ind2Level, stabilityScorePct: ind2Score, deviationValue: rhDeltaFromSafePct },
    3: { index: 3, level: ind3Level, stabilityScorePct: ind3Score, deviationValue: profile.directMoistureDurationHours },
    4: { index: 4, level: ind4Level, stabilityScorePct: ind4Score, deviationValue: profile.vibrationPeakMmPerSec },
  };

  const list = Object.values(indicators);
  const nominalCount = list.filter((i) => i.level === 'nominal').length;
  const warningCount = list.filter((i) => i.level === 'warning').length;
  const criticalCount = list.filter((i) => i.level === 'critical').length;
  const overallStabilityPct = Math.round(
    list.reduce((sum, item) => sum + item.stabilityScorePct, 0) / list.length
  );

  let overallLevel: ConservationStatusLevel = 'nominal';
  if (criticalCount > 0) {
    overallLevel = 'critical';
  } else if (warningCount > 0) {
    overallLevel = 'warning';
  }

  return {
    effectiveTempC,
    effectiveRhPct,
    tempDeltaFromSafeC,
    rhDeltaFromSafePct,
    indicators,
    nominalCount,
    warningCount,
    criticalCount,
    overallStabilityPct,
    overallLevel,
  };
}
