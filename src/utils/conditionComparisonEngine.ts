import { COMPARISON_STRINGS } from '../i18n/comparisonStrings';
import { CONSERVATION_STRINGS } from '../i18n/conservationStrings';
import { PRESET_METADATA } from '../i18n/domainTranslations';
import {
  ArtifactComparisonReport,
  ArtifactConditionGrade,
  ArtifactEnvironmentalProfile,
  ArtifactInspectionInput,
  AuthenticityVerdictStatus,
  ComparisonParameterRow,
  DocumentedArtifact,
  LocaleCode,
  PredictiveRiskHorizon,
  RiskSeverity,
  UrgentRecommendationItem,
} from '../types/artifact';
import {
  createDefaultEnvironmentalProfile,
  evaluateEnvironmentalProfile,
} from './conservationEngine';
import { getCountryDisplayName } from './worldCountries';

export type InspectionScenarioMode = 'safe' | 'hazard' | 'auth_mismatch';

const CONDITION_RANK: Record<ArtifactConditionGrade, number> = {
  stable_excellent: 0,
  good_minor_wear: 1,
  fragile_sensitive: 2,
  requires_intervention: 3,
};

export function getRegisteredInventoryCode(
  artifact: DocumentedArtifact
): string {
  const code = (artifact.inventoryNumber || artifact.accessionCode || '').trim();
  return code || 'INV-2026-001';
}

export function getRegisteredWeightGrams(artifact: DocumentedArtifact): number {
  const parsed = Number(
    String(artifact.weightGrams || '').replace(/[^0-9.]/g, '')
  );
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : 1200;
}

export function getBaselineProfileForArtifact(
  artifact: DocumentedArtifact,
  locale: LocaleCode
): ArtifactEnvironmentalProfile {
  return (
    artifact.environmentalProfile ??
    createDefaultEnvironmentalProfile(locale, 'stone_limestone')
  );
}

export function createInspectionInputFromArtifact(
  artifact: DocumentedArtifact,
  locale: LocaleCode,
  scenarioOrBool: InspectionScenarioMode | boolean = 'safe'
): ArtifactInspectionInput {
  const mode: InspectionScenarioMode =
    typeof scenarioOrBool === 'boolean'
      ? scenarioOrBool
        ? 'hazard'
        : 'safe'
      : scenarioOrBool;

  const cs = COMPARISON_STRINGS[locale];
  const base = getBaselineProfileForArtifact(artifact, locale);
  const presetMeta = artifact.presetKey
    ? PRESET_METADATA[artifact.presetKey]?.[locale]
    : undefined;

  const baseLocation =
    presetMeta?.region ||
    artifact.discoveryRegionAr ||
    base.galleryStorageLocation;
  const baseCountry = artifact.countryCode || 'BH';
  const baseCond: ArtifactConditionGrade =
    artifact.conditionGrade ?? 'stable_excellent';
  const regCode = getRegisteredInventoryCode(artifact);
  const regWeight = getRegisteredWeightGrams(artifact);

  if (mode === 'safe') {
    return {
      inspectorName: cs.defaultInspectorName,
      countryCode: baseCountry,
      currentLocation: baseLocation,
      observedCondition: baseCond,
      verifiedInventoryCode: regCode,
      measuredWeightGrams: regWeight,
      visualFingerprintMatch: 'authentic_verified',
      fieldNotes: cs.defaultFieldNoteSafe,
      tempCurrentC: base.tempCurrentC,
      tempChangeRateCPerDay: base.tempChangeRateCPerDay,
      rhCurrentPct: base.rhCurrentPct,
      rhOutOfRangeHours: 0,
      directMoistureStatus: 'dry_none',
      vibrationPeakMmPerSec: base.vibrationPeakMmPerSec,
      shockEventsCount: 0,
    };
  }

  if (mode === 'auth_mismatch') {
    return {
      inspectorName: cs.defaultInspectorName,
      countryCode: baseCountry,
      currentLocation: baseLocation,
      observedCondition: baseCond,
      verifiedInventoryCode: `${regCode}-ALT`,
      measuredWeightGrams: Math.max(50, Math.round(regWeight * 0.855)),
      visualFingerprintMatch: 'mismatch_suspected',
      fieldNotes: cs.defaultFieldNoteAuthAlert,
      tempCurrentC: base.tempCurrentC,
      tempChangeRateCPerDay: base.tempChangeRateCPerDay,
      rhCurrentPct: base.rhCurrentPct,
      rhOutOfRangeHours: 0,
      directMoistureStatus: 'dry_none',
      vibrationPeakMmPerSec: base.vibrationPeakMmPerSec,
      shockEventsCount: 0,
    };
  }

  // 'hazard' mode: Authentic artifact experiencing essential microclimate, moisture & vibration hazards
  return {
    inspectorName: cs.defaultInspectorName,
    countryCode: baseCountry,
    currentLocation: baseLocation,
    observedCondition:
      baseCond === 'stable_excellent' ? 'fragile_sensitive' : baseCond,
    verifiedInventoryCode: regCode,
    measuredWeightGrams: regWeight,
    visualFingerprintMatch: 'authentic_verified',
    fieldNotes: cs.defaultFieldNoteHazard,
    tempCurrentC: Number((base.tempSafeMaxC + 4.2).toFixed(1)),
    tempChangeRateCPerDay: 3.4,
    rhCurrentPct: Math.min(92, base.rhSafeMaxPct + 16),
    rhOutOfRangeHours: 14,
    directMoistureStatus: 'condensation_trace',
    vibrationPeakMmPerSec: 1.8,
    shockEventsCount: 1,
  };
}

function formatSigned(val: number, unit: string): string {
  const rounded = Number(val.toFixed(1));
  if (rounded === 0) return `0${unit}`;
  return rounded > 0 ? `+${rounded}${unit}` : `${rounded}${unit}`;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function compareArtifactCondition(
  artifact: DocumentedArtifact,
  current: ArtifactInspectionInput,
  locale: LocaleCode
): ArtifactComparisonReport {
  const cs = COMPARISON_STRINGS[locale];
  const c = CONSERVATION_STRINGS[locale];
  const presetMeta = artifact.presetKey
    ? PRESET_METADATA[artifact.presetKey]?.[locale]
    : undefined;
  const displayTitle = presetMeta ? presetMeta.title : artifact.titleAr;

  const baseEnv = getBaselineProfileForArtifact(artifact, locale);
  const baseEval = evaluateEnvironmentalProfile(baseEnv);

  const currentSyntheticEnv: ArtifactEnvironmentalProfile = {
    ...baseEnv,
    galleryStorageLocation: current.currentLocation,
    tempCurrentC: current.tempCurrentC,
    tempChangeRateCPerDay: current.tempChangeRateCPerDay,
    rhCurrentPct: current.rhCurrentPct,
    rhOutOfRangeHours: current.rhOutOfRangeHours,
    directMoistureStatus: current.directMoistureStatus,
    directMoistureDurationHours:
      current.directMoistureStatus === 'dry_none' ? 0 : 4,
    vibrationPeakMmPerSec: current.vibrationPeakMmPerSec,
    shockEventsCount: current.shockEventsCount,
  };

  const currEval = evaluateEnvironmentalProfile(currentSyntheticEnv);
  const matClass = baseEnv.materialClass;

  const rows: ComparisonParameterRow[] = [];
  const recommendations: UrgentRecommendationItem[] = [];

  // =========================================================================
  // A. ARTIFACT AUTHENTICITY & PROVENANCE VERIFICATION
  // =========================================================================
  const regCode = getRegisteredInventoryCode(artifact);
  const enteredCode = (current.verifiedInventoryCode || '').trim() || '—';
  const codeMatches =
    enteredCode.toUpperCase() === regCode.toUpperCase() ||
    enteredCode.toUpperCase() === (artifact.accessionCode || '').trim().toUpperCase();

  const regWeight = getRegisteredWeightGrams(artifact);
  const measWeight = Math.max(0, Number(current.measuredWeightGrams) || 0);
  const weightDeltaPctNum =
    regWeight > 0 ? ((measWeight - regWeight) / regWeight) * 100 : 0;
  const absWeightPct = Math.abs(weightDeltaPctNum);
  const signedWeightPct = formatSigned(weightDeltaPctNum, '%');

  const regCountryCode = artifact.countryCode || 'BH';
  const currCountryCode = current.countryCode || regCountryCode;
  const countryChanged = currCountryCode !== regCountryCode;
  const regCountryLabel = getCountryDisplayName(regCountryCode, locale);
  const currCountryLabel = getCountryDisplayName(currCountryCode, locale);

  let authScore = 100;
  const mismatchReasons: string[] = [];

  if (!codeMatches) {
    authScore -= 38;
    mismatchReasons.push(cs.authReasonCodeMismatch(enteredCode, regCode));
  }
  if (absWeightPct > 3.5) {
    authScore -= 34;
    mismatchReasons.push(cs.authReasonMassMismatch(signedWeightPct));
  } else if (absWeightPct > 1.2) {
    authScore -= 12;
  }

  if (current.visualFingerprintMatch === 'mismatch_suspected') {
    authScore -= 42;
    mismatchReasons.push(cs.authReasonVisualMismatch);
  } else if (current.visualFingerprintMatch === 'minor_surface_variance') {
    authScore -= 14;
  }

  if (countryChanged) {
    authScore -= 10;
  }

  const authenticityScorePct = clamp(Math.round(authScore), 8, 100);
  let authenticityStatus: AuthenticityVerdictStatus = 'verified';
  let authSeverity: RiskSeverity = 'safe';
  let authenticityVerdictText = cs.authVerdictVerified;
  let authenticityDetailText = cs.authDetailVerified(regCode, regWeight);
  let authDeltaCell = cs.deltaMatched;

  if (
    !codeMatches ||
    absWeightPct > 3.5 ||
    current.visualFingerprintMatch === 'mismatch_suspected'
  ) {
    authenticityStatus = 'alert_mismatch';
    authSeverity = 'hazard';
    authenticityVerdictText = cs.authVerdictMismatch;
    authenticityDetailText = cs.authDetailMismatch(mismatchReasons.join(' · '));
    authDeltaCell = `${authenticityScorePct}% (${signedWeightPct})`;
  } else if (
    absWeightPct > 1.2 ||
    current.visualFingerprintMatch === 'minor_surface_variance' ||
    countryChanged
  ) {
    authenticityStatus = 'review_needed';
    authSeverity = 'caution';
    authenticityVerdictText = cs.authVerdictReview;
    const cNote = countryChanged
      ? cs.authReasonCountryChange(currCountryLabel, regCountryLabel)
      : '';
    authenticityDetailText = cs.authDetailReview(signedWeightPct, cNote);
    authDeltaCell = `${authenticityScorePct}% (${signedWeightPct})`;
  }

  const authRowLabel = locale === 'ar' ? 'أ' : locale === 'ru' ? 'А' : 'A';
  rows.push({
    key: 'authenticity',
    numLabel: authRowLabel,
    parameterTitle: cs.rowAuthenticityTitle,
    baselineValueText: `${regCode} · ${regWeight}g`,
    currentValueText: `${enteredCode} · ${measWeight}g (${authenticityScorePct}%)`,
    deltaText: authDeltaCell,
    severity: authSeverity,
    riskSummaryText:
      authSeverity === 'hazard'
        ? cs.badgeHazardRed
        : authSeverity === 'caution'
        ? cs.badgeCautionAmber
        : cs.badgeSafeGreen,
  });

  if (authSeverity !== 'safe') {
    recommendations.push({
      id: 'rec-auth',
      severity: authSeverity,
      priorityBadge:
        authSeverity === 'hazard'
          ? cs.priorityCriticalRed
          : cs.priorityPreventiveAmber,
      responseWindow:
        authSeverity === 'hazard'
          ? cs.windowImmediate30m
          : cs.windowPreventive24h,
      indicatorTitle: cs.rowAuthenticityTitle,
      deviationDetail: `${enteredCode} (${measWeight}g) vs ${regCode} (${regWeight}g)`,
      potentialDamage: cs.authMismatchDamage,
      urgentAction: cs.authMismatchAction,
    });
  }

  // =========================================================================
  // 0. PHYSICAL CONDITION GRADE COMPARISON
  // =========================================================================
  const baseCond: ArtifactConditionGrade =
    artifact.conditionGrade ?? 'stable_excellent';
  const condDiff =
    CONDITION_RANK[current.observedCondition] - CONDITION_RANK[baseCond];
  let condSeverity: RiskSeverity = 'safe';
  let condDeltaText = cs.deltaMatched;
  if (
    condDiff > 0 ||
    current.observedCondition === 'requires_intervention' ||
    current.observedCondition === 'fragile_sensitive'
  ) {
    if (
      condDiff >= 1 ||
      current.observedCondition === 'requires_intervention'
    ) {
      condSeverity = 'hazard';
      condDeltaText = cs.deltaDegraded;
    } else {
      condSeverity = 'caution';
      condDeltaText = cs.deltaDegraded;
    }
  } else if (condDiff < 0) {
    condDeltaText = cs.deltaImproved;
  }

  rows.push({
    key: 'physical_condition',
    numLabel: '0',
    parameterTitle: cs.rowConditionTitle,
    baselineValueText: c.conditionGrades[baseCond],
    currentValueText: c.conditionGrades[current.observedCondition],
    deltaText: condDeltaText,
    severity: condSeverity,
    riskSummaryText:
      condSeverity === 'hazard'
        ? cs.badgeHazardRed
        : condSeverity === 'caution'
        ? cs.badgeCautionAmber
        : cs.badgeSafeGreen,
  });

  if (condSeverity !== 'safe') {
    recommendations.push({
      id: 'rec-cond',
      severity: condSeverity,
      priorityBadge:
        condSeverity === 'hazard'
          ? cs.priorityCriticalRed
          : cs.priorityPreventiveAmber,
      responseWindow:
        condSeverity === 'hazard' ? cs.windowUrgent2h : cs.windowPreventive24h,
      indicatorTitle: cs.rowConditionTitle,
      deviationDetail: `${c.conditionGrades[baseCond]} ← ${c.conditionGrades[current.observedCondition]}`,
      potentialDamage: cs.condDamage,
      urgentAction: cs.condAction,
    });
  }

  // =========================================================================
  // 1–9. ENVIRONMENTAL INDICATORS COMPARISON
  // =========================================================================

  // 1. Temperature
  let tempOut = 0;
  if (current.tempCurrentC > baseEnv.tempSafeMaxC) {
    tempOut = Number((current.tempCurrentC - baseEnv.tempSafeMaxC).toFixed(1));
  } else if (current.tempCurrentC < baseEnv.tempSafeMinC) {
    tempOut = Number((current.tempCurrentC - baseEnv.tempSafeMinC).toFixed(1));
  }
  const tempDiffFromReg = Number(
    (current.tempCurrentC - baseEnv.tempCurrentC).toFixed(1)
  );
  let tempSeverity: RiskSeverity = 'safe';
  if (Math.abs(tempOut) > 0 || current.tempChangeRateCPerDay > 2.5) {
    tempSeverity = 'hazard';
  } else if (
    current.tempChangeRateCPerDay > 1.5 ||
    Math.abs(tempDiffFromReg) >= 2.0
  ) {
    tempSeverity = 'caution';
  }

  rows.push({
    key: 'temp',
    numLabel: c.indicators[1].num,
    parameterTitle: c.indicators[1].title,
    baselineValueText: `${baseEnv.tempCurrentC}°C (${baseEnv.tempSafeMinC}–${baseEnv.tempSafeMaxC}°C)`,
    currentValueText: `${current.tempCurrentC}°C (±${current.tempChangeRateCPerDay}°C/d)`,
    deltaText:
      tempOut !== 0
        ? `${formatSigned(tempOut, '°C')} (${formatSigned(tempDiffFromReg, '°C')})`
        : formatSigned(tempDiffFromReg, '°C'),
    severity: tempSeverity,
    riskSummaryText:
      tempSeverity === 'hazard'
        ? cs.badgeHazardRed
        : tempSeverity === 'caution'
        ? cs.badgeCautionAmber
        : cs.badgeSafeGreen,
  });

  if (tempSeverity !== 'safe') {
    const isLow = tempOut < 0;
    recommendations.push({
      id: 'rec-temp',
      severity: tempSeverity,
      priorityBadge:
        tempSeverity === 'hazard'
          ? cs.priorityCriticalRed
          : cs.priorityPreventiveAmber,
      responseWindow:
        tempSeverity === 'hazard'
          ? cs.windowPriority6h
          : cs.windowPreventive24h,
      indicatorTitle: c.indicators[1].title,
      deviationDetail: `${current.tempCurrentC}°C vs ${baseEnv.tempSafeMinC}–${baseEnv.tempSafeMaxC}°C (±${current.tempChangeRateCPerDay}°C/d)`,
      potentialDamage: isLow ? cs.tempLowDamage : cs.tempHighDamage[matClass],
      urgentAction: isLow
        ? cs.tempLowAction(baseEnv.tempSafeMinC, baseEnv.tempSafeMaxC)
        : cs.tempHighAction(baseEnv.tempSafeMinC, baseEnv.tempSafeMaxC),
    });
  }

  // 2. Relative Humidity
  let rhOut = 0;
  if (current.rhCurrentPct > baseEnv.rhSafeMaxPct) {
    rhOut = Number((current.rhCurrentPct - baseEnv.rhSafeMaxPct).toFixed(1));
  } else if (current.rhCurrentPct < baseEnv.rhSafeMinPct) {
    rhOut = Number((current.rhCurrentPct - baseEnv.rhSafeMinPct).toFixed(1));
  }
  const rhDiffFromReg = Number(
    (current.rhCurrentPct - baseEnv.rhCurrentPct).toFixed(1)
  );
  let rhSeverity: RiskSeverity = 'safe';
  if (Math.abs(rhOut) > 0 || current.rhOutOfRangeHours >= 6) {
    rhSeverity = 'hazard';
  } else if (current.rhOutOfRangeHours > 0 || Math.abs(rhDiffFromReg) >= 5) {
    rhSeverity = 'caution';
  }

  rows.push({
    key: 'rh',
    numLabel: c.indicators[2].num,
    parameterTitle: c.indicators[2].title,
    baselineValueText: `${baseEnv.rhCurrentPct}% (${baseEnv.rhSafeMinPct}–${baseEnv.rhSafeMaxPct}% RH)`,
    currentValueText: `${current.rhCurrentPct}% RH (${current.rhOutOfRangeHours}h)`,
    deltaText:
      rhOut !== 0
        ? `${formatSigned(rhOut, '%')} (${formatSigned(rhDiffFromReg, '%')})`
        : formatSigned(rhDiffFromReg, '%'),
    severity: rhSeverity,
    riskSummaryText:
      rhSeverity === 'hazard'
        ? cs.badgeHazardRed
        : rhSeverity === 'caution'
        ? cs.badgeCautionAmber
        : cs.badgeSafeGreen,
  });

  if (rhSeverity !== 'safe') {
    const isLowRh = rhOut < 0;
    recommendations.push({
      id: 'rec-rh',
      severity: rhSeverity,
      priorityBadge:
        rhSeverity === 'hazard'
          ? cs.priorityCriticalRed
          : cs.priorityPreventiveAmber,
      responseWindow:
        rhSeverity === 'hazard' ? cs.windowUrgent2h : cs.windowPreventive24h,
      indicatorTitle: c.indicators[2].title,
      deviationDetail: `${current.rhCurrentPct}% RH vs ${baseEnv.rhSafeMinPct}–${baseEnv.rhSafeMaxPct}% RH`,
      potentialDamage: isLowRh
        ? cs.rhLowDamage[matClass]
        : cs.rhHighDamage[matClass],
      urgentAction: isLowRh
        ? cs.rhLowAction(baseEnv.rhSafeMinPct, baseEnv.rhSafeMaxPct)
        : cs.rhHighAction(baseEnv.rhSafeMinPct, baseEnv.rhSafeMaxPct),
    });
  }

  // 3. Direct Water & Moisture
  let moistSeverity: RiskSeverity = 'safe';
  if (
    current.directMoistureStatus === 'active_seepage' ||
    current.directMoistureStatus === 'condensation_trace'
  ) {
    moistSeverity = 'hazard';
  }

  rows.push({
    key: 'moisture',
    numLabel: c.indicators[3].num,
    parameterTitle: c.indicators[3].title,
    baselineValueText: c.moistureStatuses[baseEnv.directMoistureStatus],
    currentValueText: c.moistureStatuses[current.directMoistureStatus],
    deltaText:
      moistSeverity === 'safe'
        ? cs.deltaMatched
        : c.moistureStatuses[current.directMoistureStatus],
    severity: moistSeverity,
    riskSummaryText:
      moistSeverity === 'hazard' ? cs.badgeHazardRed : cs.badgeSafeGreen,
  });

  if (moistSeverity !== 'safe') {
    recommendations.push({
      id: 'rec-moisture',
      severity: moistSeverity,
      priorityBadge: cs.priorityCriticalRed,
      responseWindow: cs.windowImmediate30m,
      indicatorTitle: c.indicators[3].title,
      deviationDetail: c.moistureStatuses[current.directMoistureStatus],
      potentialDamage: cs.moistureDamage,
      urgentAction: cs.moistureAction,
    });
  }

  // 4. Vibration & Shocks
  const vibDiff = Number(
    (current.vibrationPeakMmPerSec - baseEnv.vibrationPeakMmPerSec).toFixed(2)
  );
  let vibSeverity: RiskSeverity = 'safe';
  if (current.vibrationPeakMmPerSec > 1.5 || current.shockEventsCount >= 1) {
    vibSeverity = 'hazard';
  } else if (current.vibrationPeakMmPerSec > 1.0) {
    vibSeverity = 'caution';
  }

  rows.push({
    key: 'vibration',
    numLabel: c.indicators[4].num,
    parameterTitle: c.indicators[4].title,
    baselineValueText: `${baseEnv.vibrationPeakMmPerSec} mm/s · 0`,
    currentValueText: `${current.vibrationPeakMmPerSec} mm/s · ${current.shockEventsCount}`,
    deltaText: `${formatSigned(vibDiff, ' mm/s')} (${current.shockEventsCount})`,
    severity: vibSeverity,
    riskSummaryText:
      vibSeverity === 'hazard'
        ? cs.badgeHazardRed
        : vibSeverity === 'caution'
        ? cs.badgeCautionAmber
        : cs.badgeSafeGreen,
  });

  if (vibSeverity !== 'safe') {
    recommendations.push({
      id: 'rec-vib',
      severity: vibSeverity,
      priorityBadge:
        vibSeverity === 'hazard'
          ? cs.priorityCriticalRed
          : cs.priorityPreventiveAmber,
      responseWindow:
        vibSeverity === 'hazard' ? cs.windowUrgent2h : cs.windowPreventive24h,
      indicatorTitle: c.indicators[4].title,
      deviationDetail: `${current.vibrationPeakMmPerSec} mm/s · Shocks: ${current.shockEventsCount}`,
      potentialDamage: cs.vibrationDamage,
      urgentAction: cs.vibrationAction,
    });
  }

  // Sort recommendations so Red Hazards ('hazard') always appear first
  recommendations.sort((a, b) => {
    const rank = { hazard: 0, caution: 1, safe: 2 };
    return rank[a.severity] - rank[b.severity];
  });

  if (recommendations.length === 0) {
    recommendations.push({
      id: 'rec-nominal',
      severity: 'safe',
      priorityBadge: cs.priorityRoutineSafe,
      responseWindow: cs.windowRoutine30d,
      indicatorTitle: cs.verdictSafeTitle,
      deviationDetail: `${regCode} · ${baseEnv.tempSafeMinC}–${baseEnv.tempSafeMaxC}°C · ${baseEnv.rhSafeMinPct}–${baseEnv.rhSafeMaxPct}% RH`,
      potentialDamage: cs.allSafeDamageNote,
      urgentAction: cs.allSafeActionNote(
        baseEnv.tempSafeMinC,
        baseEnv.tempSafeMaxC,
        baseEnv.rhSafeMinPct,
        baseEnv.rhSafeMaxPct
      ),
    });
  }

  // =========================================================================
  // PREDICTIVE 3-HORIZON RISK FORECAST ENGINE (72h · 30d · 12m)
  // =========================================================================
  const materialSensitivityBoost =
    matClass === 'manuscripts_pigments' || matClass === 'organic_wood_textile'
      ? 1.18
      : matClass === 'metals_bronze'
      ? 1.12
      : 1.0;

  // Horizon 1: Immediate 24–72 Hours (Acute physical, moisture & microclimate shock)
  let risk72h = 5;
  if (moistSeverity === 'hazard') risk72h += 44;
  if (vibSeverity === 'hazard') risk72h += 26;
  else if (vibSeverity === 'caution') risk72h += 12;
  if (current.tempChangeRateCPerDay > 2.5 || Math.abs(tempOut) >= 3) risk72h += 20;
  else if (tempSeverity !== 'safe') risk72h += 10;
  if (Math.abs(rhOut) >= 10) risk72h += 18;
  else if (rhSeverity !== 'safe') risk72h += 9;
  if (authSeverity === 'hazard') risk72h += 35;
  risk72h = clamp(Math.round(risk72h * materialSensitivityBoost), 4, 96);

  const sev72h: RiskSeverity =
    risk72h >= 50 ? 'hazard' : risk72h >= 24 ? 'caution' : 'safe';
  const driver72h =
    moistSeverity === 'hazard' || vibSeverity === 'hazard'
      ? cs.driverMoistureShock
      : tempSeverity !== 'safe' || rhSeverity !== 'safe'
      ? cs.driverThermalRhDrift
      : cs.driverNominal;

  // Horizon 2: Medium 30 Days (Hygroscopic stress, corrosion & salt cycling)
  let risk30d = 7;
  if (rhSeverity === 'hazard') risk30d += 38;
  else if (rhSeverity === 'caution') risk30d += 16;
  if (moistSeverity === 'hazard') risk30d += 28;
  if (tempSeverity === 'hazard') risk30d += 18;
  else if (tempSeverity === 'caution') risk30d += 9;
  if (vibSeverity === 'hazard') risk30d += 14;
  else if (vibSeverity === 'caution') risk30d += 6;
  if (condSeverity === 'hazard') risk30d += 12;
  risk30d = clamp(Math.round(risk30d * materialSensitivityBoost), 6, 97);

  const sev30d: RiskSeverity =
    risk30d >= 50 ? 'hazard' : risk30d >= 24 ? 'caution' : 'safe';
  const driver30d =
    rhOut > 0 &&
    (matClass === 'manuscripts_pigments' ||
      matClass === 'organic_wood_textile')
      ? cs.driverBioHumidity
      : rhSeverity !== 'safe' || moistSeverity !== 'safe'
      ? cs.driverSaltMetalCorrosion
      : tempSeverity !== 'safe' || vibSeverity !== 'safe'
      ? cs.driverThermalRhDrift
      : cs.driverNominal;

  // Horizon 3: Cumulative 12 Months (Chronic Arrhenius thermal & mechanical fatigue)
  let risk12m = 8;
  if (tempSeverity === 'hazard') risk12m += 32;
  else if (tempSeverity === 'caution') risk12m += 15;
  if (rhSeverity === 'hazard') risk12m += 30;
  else if (rhSeverity === 'caution') risk12m += 14;
  if (moistSeverity === 'hazard') risk12m += 22;
  if (vibSeverity === 'hazard') risk12m += 16;
  else if (vibSeverity === 'caution') risk12m += 8;
  if (condSeverity === 'hazard') risk12m += 12;
  risk12m = clamp(Math.round(risk12m * materialSensitivityBoost), 7, 98);

  const sev12m: RiskSeverity =
    risk12m >= 50 ? 'hazard' : risk12m >= 24 ? 'caution' : 'safe';
  const driver12m =
    tempSeverity !== 'safe' || rhSeverity !== 'safe'
      ? cs.driverChronicThermalAging
      : moistSeverity !== 'safe' || vibSeverity !== 'safe'
      ? cs.driverMoistureShock
      : cs.driverNominal;

  const riskHorizons: PredictiveRiskHorizon[] = [
    {
      id: 'short_72h',
      horizonLabel: cs.horizon72hLabel,
      timeframeBadge: cs.horizon72hBadge,
      riskProbabilityPct: risk72h,
      projectedStabilityPct: clamp(100 - Math.round(risk72h * 0.85), 9, 98),
      severity: sev72h,
      primaryDriver: driver72h,
      predictedOutcome:
        sev72h === 'hazard'
          ? cs.outcome72hHazard
          : sev72h === 'caution'
          ? cs.outcome72hCaution
          : cs.outcome72hSafe,
    },
    {
      id: 'medium_30d',
      horizonLabel: cs.horizon30dLabel,
      timeframeBadge: cs.horizon30dBadge,
      riskProbabilityPct: risk30d,
      projectedStabilityPct: clamp(100 - Math.round(risk30d * 0.88), 8, 97),
      severity: sev30d,
      primaryDriver: driver30d,
      predictedOutcome:
        sev30d === 'hazard'
          ? cs.outcome30dHazard[matClass]
          : sev30d === 'caution'
          ? cs.outcome30dCaution
          : cs.outcome30dSafe,
    },
    {
      id: 'long_12m',
      horizonLabel: cs.horizon12mLabel,
      timeframeBadge: cs.horizon12mBadge,
      riskProbabilityPct: risk12m,
      projectedStabilityPct: clamp(100 - Math.round(risk12m * 0.9), 6, 96),
      severity: sev12m,
      primaryDriver: driver12m,
      predictedOutcome:
        sev12m === 'hazard'
          ? cs.outcome12mHazard[matClass]
          : sev12m === 'caution'
          ? cs.outcome12mCaution
          : cs.outcome12mSafe,
    },
  ];

  const predictedDegradationIndexPct = Math.round(
    risk72h * 0.35 + risk30d * 0.35 + risk12m * 0.3
  );

  // =========================================================================
  // OVERALL SUMMARY METRICS
  // =========================================================================
  const hazardCount = rows.filter((r) => r.severity === 'hazard').length;
  const cautionCount = rows.filter((r) => r.severity === 'caution').length;
  const safeCount = rows.filter((r) => r.severity === 'safe').length;

  let overallSeverity: RiskSeverity = 'safe';
  let generalVerdictTitle = cs.verdictSafeTitle;
  let generalVerdictSummary = cs.verdictSafeDesc(displayTitle);

  if (hazardCount > 0) {
    overallSeverity = 'hazard';
    generalVerdictTitle = cs.verdictHazardTitle(hazardCount);
    generalVerdictSummary = cs.verdictHazardDesc(displayTitle, hazardCount);
  } else if (cautionCount > 0) {
    overallSeverity = 'caution';
    generalVerdictTitle = cs.verdictCautionTitle(cautionCount);
    generalVerdictSummary = cs.verdictCautionDesc(displayTitle);
  }

  const condPenalty =
    condSeverity === 'hazard' ? 14 : condSeverity === 'caution' ? 6 : 0;
  const authPenalty =
    authSeverity === 'hazard' ? 18 : authSeverity === 'caution' ? 5 : 0;
  const currentStabilityPct = Math.max(
    10,
    currEval.overallStabilityPct - condPenalty - authPenalty
  );

  return {
    overallSeverity,
    authenticityStatus,
    authenticityScorePct,
    authenticityVerdictText,
    authenticityDetailText,
    baselineStabilityPct: baseEval.overallStabilityPct,
    currentStabilityPct,
    predictedDegradationIndexPct,
    hazardCount,
    cautionCount,
    safeCount,
    generalVerdictTitle,
    generalVerdictSummary,
    riskHorizons,
    rows,
    recommendations,
  };
}
