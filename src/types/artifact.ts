export type LocaleCode = 'ar' | 'en-US' | 'fr' | 'zh' | 'ru';

export type PresetId = 'incense_burner' | 'astrolabe' | 'silk_ewer';

export enum CaptureDirection {
  Front = 'front',
  Right = 'right',
  Back = 'back',
  Left = 'left',
  Oblique = 'oblique',
  Top = 'top',
}

export interface DirectionSpec {
  id: CaptureDirection;
  azimuthDeg: number;
  elevationDeg: number;
}

export interface LocalizedDirectionSpec extends DirectionSpec {
  label: string;
  shortLabel: string;
  instruction: string;
}

export interface CapturedAngleImage {
  id: string;
  direction: CaptureDirection;
  labelAr: string;
  azimuthDeg: number;
  elevationDeg: number;
  dataUrl: string;
  source: 'camera' | 'upload' | 'preset';
  width: number;
  height: number;
  capturedAt: string;
  sharpnessScore: number;
  brightnessPct: number;
}

export interface SurfaceMetrics {
  totalAngles: number;
  uniqueDirections: number;
  angularCoveragePct: number;
  meanSharpness: number;
  illuminationConsistencyPct: number;
  edgeReliefDensityPct: number;
}

export enum CulturalCorridorId {
  IncenseRoute = 'incense_route',
  SilkRoad = 'silk_road',
  MediterraneanAndalus = 'mediterranean_andalus',
  MesopotamiaGulf = 'mesopotamia_gulf',
}

export interface CulturalCorridor {
  id: CulturalCorridorId;
  title: string;
  eraSpan: string;
  connectedCivilizations: string[];
  sharedTechniques: string[];
  summary: string;
  mapCoordinates: Array<{ name: string; x: number; y: number; role: string }>;
}

export type MaterialConservationClass =
  | 'stone_limestone'
  | 'metals_bronze'
  | 'ceramics_glass'
  | 'manuscripts_pigments'
  | 'organic_wood_textile';

export type DirectMoistureStatus =
  | 'dry_none'
  | 'condensation_trace'
  | 'active_seepage';

export type ArtifactConditionGrade =
  | 'stable_excellent'
  | 'good_minor_wear'
  | 'fragile_sensitive'
  | 'requires_intervention';

export interface ArtifactEnvironmentalProfile {
  materialClass: MaterialConservationClass;

  // 1. Temperature (°C)
  tempCurrentC: number;
  tempSafeMinC: number;
  tempSafeMaxC: number;
  tempChangeRateCPerDay: number;

  // 2. Relative Humidity (% RH)
  rhCurrentPct: number;
  rhSafeMinPct: number;
  rhSafeMaxPct: number;
  rhDailyFluctuationPct: number;
  rhOutOfRangeHours: number;

  // 3. Direct Water & Moisture
  directMoistureStatus: DirectMoistureStatus;
  directMoistureDurationHours: number;
  directMoistureNotes: string;

  // 4. Vibration & Shocks
  vibrationPeakMmPerSec: number;
  vibrationFrequencyDuration: string;
  shockEventsCount: number;

  // Storage / Gallery Location
  galleryStorageLocation: string;
}

export interface ArtifactFormState {
  titleAr: string;
  countryCode: string;
  inventoryNumber: string;
  periodAr: string;
  materialAr: string;
  dimensionsCm: string;
  weightGrams: string;
  conditionGrade: ArtifactConditionGrade;
  discoveryRegionAr: string;
  meetingCulturesText: string;
  curatorialNotesAr: string;
  teamNameAr: string;
  environmental: ArtifactEnvironmentalProfile;
}

export interface DocumentedArtifact {
  id: string;
  accessionCode: string;
  countryCode?: string;
  inventoryNumber?: string;
  presetKey?: PresetId;
  titleAr: string;
  periodAr: string;
  materialAr: string;
  dimensionsCm: string;
  weightGrams?: string;
  conditionGrade?: ArtifactConditionGrade;
  discoveryRegionAr: string;
  corridorId: CulturalCorridorId;
  meetingCulturesAr: string[];
  curatorialNotesAr: string;
  teamNameAr: string;
  createdAtIso: string;
  angles: CapturedAngleImage[];
  metrics: SurfaceMetrics;
  environmentalProfile?: ArtifactEnvironmentalProfile;
}

export type RiskSeverity = 'safe' | 'caution' | 'hazard';

export type VisualFingerprintMatch =
  | 'authentic_verified'
  | 'minor_surface_variance'
  | 'mismatch_suspected';

export type AuthenticityVerdictStatus =
  | 'verified'
  | 'review_needed'
  | 'alert_mismatch';

export interface ArtifactInspectionInput {
  inspectorName: string;
  countryCode: string;
  currentLocation: string;
  observedCondition: ArtifactConditionGrade;
  fieldNotes: string;

  // Authenticity & Provenance Verification Inputs
  verifiedInventoryCode: string;
  measuredWeightGrams: number;
  visualFingerprintMatch: VisualFingerprintMatch;

  // Current measured readings across the essential environmental indicators
  tempCurrentC: number;
  tempChangeRateCPerDay: number;
  rhCurrentPct: number;
  rhOutOfRangeHours: number;
  directMoistureStatus: DirectMoistureStatus;
  vibrationPeakMmPerSec: number;
  shockEventsCount: number;
}

export interface PredictiveRiskHorizon {
  id: 'short_72h' | 'medium_30d' | 'long_12m';
  horizonLabel: string;
  timeframeBadge: string;
  riskProbabilityPct: number;
  projectedStabilityPct: number;
  severity: RiskSeverity;
  primaryDriver: string;
  predictedOutcome: string;
}

export interface ComparisonParameterRow {
  key: string;
  numLabel: string;
  parameterTitle: string;
  baselineValueText: string;
  currentValueText: string;
  deltaText: string;
  severity: RiskSeverity;
  riskSummaryText: string;
}

export interface UrgentRecommendationItem {
  id: string;
  severity: RiskSeverity;
  priorityBadge: string;
  responseWindow: string;
  indicatorTitle: string;
  deviationDetail: string;
  potentialDamage: string;
  urgentAction: string;
}

export interface ArtifactComparisonReport {
  overallSeverity: RiskSeverity;
  authenticityStatus: AuthenticityVerdictStatus;
  authenticityScorePct: number;
  authenticityVerdictText: string;
  authenticityDetailText: string;
  baselineStabilityPct: number;
  currentStabilityPct: number;
  predictedDegradationIndexPct: number;
  hazardCount: number;
  cautionCount: number;
  safeCount: number;
  generalVerdictTitle: string;
  generalVerdictSummary: string;
  riskHorizons: PredictiveRiskHorizon[];
  rows: ComparisonParameterRow[];
  recommendations: UrgentRecommendationItem[];
}


