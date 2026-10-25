import {
  LocaleCode,
  MaterialConservationClass,
  VisualFingerprintMatch,
} from '../types/artifact';

export interface ComparisonLocalizedStrings {
  lblCountryField: string;
  countrySortedHint: string;
  jumpToVerifyBtn: string;

  // Step 03 Registration Sub-Steps & Calm Handoff
  regSubStep1Code: string;
  regSubStep1Label: string;
  regSubStep2Code: string;
  regSubStep2Label: string;
  regSubStep3Code: string;
  regSubStep3Label: string;
  regNextStepHint: string;

  // Step 04 Header
  sec4Kicker: (registeredCount: number) => string;
  sec4Title: string;
  sec4Subtitle: string;

  selectArtifactLabel: string;
  cascadeSelectHint: string;
  cascadeStep1Country: string;
  cascadeStep2Site: string;
  cascadeStep3Artifact: string;
  openVerifyCameraBtn: string;
  closeVerifyCameraBtn: string;
  camVerifyKicker: string;
  camVerifyTitle: string;
  camScanningStatus: string;
  camDetectedStatus: string;
  camOpticalFallbackNote: string;
  camRetryHardwareBtn: string;
  camRescanSpeakBtn: string;
  voicePanelBadgeSpeaking: string;
  voicePanelBadgeReady: string;
  voicePlayBtn: string;
  voiceReplayBtn: string;
  voiceStopBtn: string;
  voiceAutoToggleOn: string;
  voiceAutoToggleOff: string;
  voiceLblArtifact: string;
  voiceLblCountryAndSite: string;
  voiceLblUltraBrief: string;
  voiceCertifiedDocNotice: string;
  voicePrintFullDocBtn: string;
  voiceIssuingFullDocBtn: string;
  voiceUnsupportedHint: string;
  emptyArchiveTitle: string;
  emptyArchiveDesc: string;
  emptyArchiveGoStep1Btn: string;
  emptyArchiveGoStep3Btn: string;
  camEmptyArchiveBadge: string;
  camEmptyArchiveNotice: string;
  deleteArtifactBtn: string;
  baselineCardTitle: string;
  baselineMetaLine: (
    code: string,
    inv: string,
    weightG: string,
    country: string,
    mat: string
  ) => string;
  baselineSafeClimate: (
    tMin: number,
    tMax: number,
    rhMin: number,
    rhMax: number,
    score: number
  ) => string;

  // Input Panel & Scenario Presets
  inputPanelTitle: string;
  inputPanelSub: string;
  presetMatchSafeBtn: string;
  presetSimulateHazardBtn: string;
  presetSimulateAuthAlertBtn: string;
  runComparisonBtn: string;

  // Sub-panel 1A: Authenticity & Provenance Verification Inputs
  authInputGroupTitle: string;
  authInputGroupSub: string;
  lblVerifiedInventoryCode: (regCode: string) => string;
  lblMeasuredWeightGrams: (regWeight: number) => string;
  lblVisualFingerprint: string;
  visualFingerprintOptions: Record<VisualFingerprintMatch, string>;

  // Sub-panel 1B: Basic & Essential Environmental Inspection Inputs
  envInputGroupTitle: string;
  lblInspectorName: string;
  defaultInspectorName: string;
  lblCurrentCountry: string;
  lblCurrentLocation: string;
  lblObservedCondition: string;
  lblFieldNotes: string;
  defaultFieldNoteHazard: string;
  defaultFieldNoteSafe: string;
  defaultFieldNoteAuthAlert: string;

  lblCurrTemp: (safeMin: number, safeMax: number) => string;
  lblCurrTempDrift: string;
  lblCurrRh: (safeMin: number, safeMax: number) => string;
  lblCurrRhHours: string;
  lblCurrMoisture: string;
  lblCurrVibration: string;
  lblCurrShocks: string;

  // Authenticity Evaluation Texts
  rowAuthenticityTitle: string;
  authVerdictVerified: string;
  authVerdictReview: string;
  authVerdictMismatch: string;
  authDetailVerified: (code: string, weightG: number) => string;
  authDetailReview: (deltaWeightPct: string, countryNote: string) => string;
  authDetailMismatch: (reasons: string) => string;
  authReasonCodeMismatch: (entered: string, expected: string) => string;
  authReasonMassMismatch: (deltaPct: string) => string;
  authReasonVisualMismatch: string;
  authReasonCountryChange: (currCountry: string, regCountry: string) => string;
  authMismatchDamage: string;
  authMismatchAction: string;

  // Predictive Risk Horizon Engine Texts (72h, 30d, 12m)
  forecastSectionTitle: string;
  forecastSectionSub: string;
  kpiAuthenticityScore: string;
  kpiPredictedRiskIndex: string;
  lblRiskProbability: string;
  lblProjectedStability: string;
  lblPrimaryDriver: string;
  lblPredictedOutcome: string;

  horizon72hLabel: string;
  horizon72hBadge: string;
  horizon30dLabel: string;
  horizon30dBadge: string;
  horizon12mLabel: string;
  horizon12mBadge: string;

  driverNominal: string;
  driverMoistureShock: string;
  driverThermalRhDrift: string;
  driverBioHumidity: string;
  driverSaltMetalCorrosion: string;
  driverChronicThermalAging: string;

  outcome72hSafe: string;
  outcome72hCaution: string;
  outcome72hHazard: string;
  outcome30dSafe: string;
  outcome30dCaution: string;
  outcome30dHazard: Record<MaterialConservationClass, string>;
  outcome12mSafe: string;
  outcome12mCaution: string;
  outcome12mHazard: Record<MaterialConservationClass, string>;

  // Comparison Report UI
  reportHeaderTitle: string;
  reportHeaderSub: string;
  kpiBaselineScore: string;
  kpiCurrentScore: string;
  kpiRedHazardsCount: string;
  kpiSafeMatchedCount: string;

  verdictHazardTitle: (hazards: number) => string;
  verdictHazardDesc: (title: string, hazards: number) => string;
  verdictCautionTitle: (cautions: number) => string;
  verdictCautionDesc: (title: string) => string;
  verdictSafeTitle: string;
  verdictSafeDesc: (title: string) => string;

  colParam: string;
  colRegistered: string;
  colCurrent: string;
  colDelta: string;
  colRiskStatus: string;

  badgeHazardRed: string;
  badgeCautionAmber: string;
  badgeSafeGreen: string;

  rowConditionTitle: string;
  deltaMatched: string;
  deltaDegraded: string;
  deltaImproved: string;

  // Urgent Recommendations & Creative International Export Showcase
  urgentSectionTitle: string;
  urgentSectionSub: string;
  lblResponseWindow: string;
  windowImmediate30m: string;
  windowUrgent2h: string;
  windowPriority6h: string;
  windowPreventive24h: string;
  windowRoutine30d: string;

  exportShowcaseKicker: string;
  exportShowcaseTitle: string;
  exportShowcaseDesc: string;
  exportShowcaseFeatures: string;
  exportUrgentPdfBtn: string;
  exportingUrgentPdfBtn: string;

  lblPotentialDamage: string;
  lblImmediateAction: string;
  priorityCriticalRed: string;
  priorityPreventiveAmber: string;
  priorityRoutineSafe: string;

  // Specific Diagnostic Damages & Urgent Actions
  condDamage: string;
  condAction: string;

  tempHighDamage: Record<MaterialConservationClass, string>;
  tempLowDamage: string;
  tempHighAction: (safeMin: number, safeMax: number) => string;
  tempLowAction: (safeMin: number, safeMax: number) => string;

  rhHighDamage: Record<MaterialConservationClass, string>;
  rhLowDamage: Record<MaterialConservationClass, string>;
  rhHighAction: (safeMin: number, safeMax: number) => string;
  rhLowAction: (safeMin: number, safeMax: number) => string;

  moistureDamage: string;
  moistureAction: string;

  vibrationDamage: string;
  vibrationAction: string;

  allSafeDamageNote: string;
  allSafeActionNote: (
    tMin: number,
    tMax: number,
    rhMin: number,
    rhMax: number
  ) => string;

  // PDF Document Specific Copy
  pdfDocKicker: string;
  pdfDocTitle: string;
  pdfDocSubtitle: string;
  pdfSec1Title: string;
  pdfSec2Title: string;
  pdfSec3Title: string;
  pdfSec4Title: string;
  pdfLblArtifact: string;
  pdfLblCodeAndCountry: string;
  pdfLblAuthenticity: string;
  pdfLblScoresComparison: string;
  pdfForecastStripTitle: string;
  pdfRedAlertBanner: (count: number) => string;
  pdfSafeBanner: string;
  pdfSealUrgentMain: string;
  pdfSealSafeMain: string;
  pdfSealSub: string;
  pdfSigInspectorTitle: string;
  pdfSigInspectorSub: string;
  pdfSigConservatorTitle: string;
  pdfSigConservatorSub: string;
  pdfFooterDisclaimer: string;
  pdfPageOf: (c: number, t: number) => string;
}

export const COMPARISON_STRINGS: Record<LocaleCode, ComparisonLocalizedStrings> =
  {
    ar: {
      lblCountryField: 'الدولة',
      countrySortedHint: 'جميع دول العالم مرتبة أبجدياً',
      jumpToVerifyBtn: 'الانتقال للخطوة ٠٤: التحقق والتنبؤ بالمخاطر',

      regSubStep1Code: '٣-أ',
      regSubStep1Label: 'هوية القطعة والدولة والوزن المرجعي',
      regSubStep2Code: '٣-ب',
      regSubStep2Label: 'النطاق المرجعي للحرارة والرطوبة',
      regSubStep3Code: '٣-ج',
      regSubStep3Label: 'المؤشرات البيئية الأساسية والاعتماد',
      regNextStepHint:
        'بعد حفظ سجل القطعة، انتقل مباشرةً إلى الخطوة الختامية (٠٤) للتحقق من صحتها والتنبؤ بالمخاطر وتصدير التوصيات.',

      sec4Kicker: (n) =>
        `الخطوة الختامية ٠٤ · الأصالة والتنبؤ بالمخاطر (${n} قطع مسجلة جاهزة للفحص)`,
      sec4Title:
        '٠٤. التحقق من صحة القطعة الأثرية والتنبؤ بالمخاطر وتصدير التوصيات العالمية',
      sec4Subtitle:
        'محطة ختامية متكاملة تطابق هوية وأصالة القطعة المسجلة (رقم الجرد، الكتلة، والبصمة البصرية)، وتقارن القراءات الحالية للتنبؤ بالمخاطر المستقبلية باللون الأحمر، وتُصدر وثيقة التوصيات بتصميم ابتكاري عالمي بصيغة PDF.',

      selectArtifactLabel:
        'اختر القطعة الأثرية المسجلة للتحقق من صحتها والتنبؤ بمخاطرها:',
      cascadeSelectHint:
        'حدّد بالترتيب من القوائم المنسدلة: أولاً الدولة، ثم الموقع، ثم القطعة الأثرية المسجلة:',
      cascadeStep1Country: '١. الدولة',
      cascadeStep2Site: '٢. الموقع الأثري / المتحفي',
      cascadeStep3Artifact: '٣. القطعة الأثرية المسجلة',
      openVerifyCameraBtn: 'فتح كاميرا التحقق والعرض الصوتي المباشر',
      closeVerifyCameraBtn: 'إغلاق كاميرا التحقق',
      camVerifyKicker: 'عدسة الرصد المباشر · الخدمة الصوتية المعتمدة',
      camVerifyTitle:
        'كاميرا التحقق المباشر والعرض الصوتي الملخص للقطعة الأثرية',
      camScanningStatus: 'جارٍ رصد القطعة الأثرية في الكاميرا...',
      camDetectedStatus:
        'تم ظهور القطعة في الكاميرا — الخدمة الصوتية نشطة',
      camOpticalFallbackNote:
        'تم تفعيل عدسة المعاينة البصرية الذكية تلقائياً لعدم توفر كاميرا خارجية أو إذن العدسة.',
      camRetryHardwareBtn: 'تشغيل الكاميرا الفعلية',
      camRescanSpeakBtn: 'إعادة رصد القطعة وتشغيل الصوت',
      voicePanelBadgeSpeaking: 'جارٍ تقديم العرض الصوتي الملخص...',
      voicePanelBadgeReady: 'الخدمة الصوتية المختصرة مفعّلة',
      voicePlayBtn: 'تشغيل العرض الصوتي الملخص',
      voiceReplayBtn: 'إعادة الاستماع',
      voiceStopBtn: 'إيقاف الصوت',
      voiceAutoToggleOn: 'النطق التلقائي عند الرصد: مفعّل',
      voiceAutoToggleOff: 'النطق التلقائي عند الرصد: متوقف',
      voiceLblArtifact: 'اسم القطعة الأثرية',
      voiceLblCountryAndSite: 'الدولة والموقع',
      voiceLblUltraBrief: 'النبذة التفصيلية باختصار شديد',
      voiceCertifiedDocNotice:
        'يمكنك الحصول على كافة التفاصيل في صورة مستند مطبوع معتمد من المنصة.',
      voicePrintFullDocBtn:
        'إصدار المستند المطبوع المعتمد لكافة التفاصيل (PDF)',
      voiceIssuingFullDocBtn: 'جارٍ إعداد المستند المطبوع المعتمد...',
      voiceUnsupportedHint:
        'متصفحك الحالي لا يدعم النطق الصوتي المباشر؛ يظهر الملخص المعتمد كاملاً أدناه.',
      emptyArchiveTitle: 'لا توجد أي قطع أثرية مسجلة حالياً في المنصة',
      emptyArchiveDesc:
        'لا تعرض المنصة إلا القطع الأثرية التي تقوم بتسجيلها بنفسك فقط. ابدأ بالتقاط أو رفع ٣ صور فأكثر للقطعة في الخطوة (٠١)، ثم أكمل تسجيل بياناتها وحفظها في الخطوة (٠٣) لتظهر هنا تلقائياً في قوائم الدولة والموقع والقطعة وخدمة التحقق الصوتي والتنبؤ بالمخاطر.',
      emptyArchiveGoStep1Btn: '٠١. ابدأ بتصوير أو رفع صور القطعة',
      emptyArchiveGoStep3Btn: '٠٣. الانتقال إلى نموذج تسجيل القطعة',
      camEmptyArchiveBadge: 'بانتظار تسجيل أول قطعة أثرية في المنصة',
      camEmptyArchiveNotice:
        'الكاميرا جاهزة — لا توجد أي قطع أثرية مسجلة حالياً لتشغيل العرض الصوتي لها. يرجى تصوير وتسجيل قطعتك الأثرية أولاً في الخطوات (٠١–٠٣) ليتم عرض وصفها الصوتي ومستندها المعتمد فور ظهورها.',
      deleteArtifactBtn: 'حذف القطعة',
      baselineCardTitle: 'السجل المرجعي المعتمد للقطعة',
      baselineMetaLine: (code, inv, weightG, country, mat) =>
        `القيد: ${code} · الجرد: ${inv} · الوزن: ${weightG}g · الدولة: ${country} · المادة: ${mat}`,
      baselineSafeClimate: (tMin, tMax, rhMin, rhMax, sc) =>
        `النطاق الآمن المسجّل: ${tMin}–${tMax}°C · ${rhMin}–${rhMax}% RH · الاستقرار المرجعي: ${sc}%`,

      inputPanelTitle:
        '١. مدخلات التحقق من صحة القطعة والقراءات البيئية الحالية',
      inputPanelSub:
        'أدخل بيانات التحقق من الأصالة والقراءات الميدانية الحالية، أو جرّب أحد السيناريوهات الفورية لمعاينة التنبؤ بالمخاطر:',
      presetMatchSafeBtn: 'مطابقة آمنة وأصالة موثّقة ١٠٠٪',
      presetSimulateHazardBtn: 'اختبار سيناريو مخاطر وتنبؤ أحمر',
      presetSimulateAuthAlertBtn: 'اختبار اشتباه عدم تطابق الأصالة',
      runComparisonBtn: 'اعتماد التحقق وعرض التنبؤ والتوصيات',

      authInputGroupTitle: 'أولاً: بيانات التحقق من صحة وأصالة القطعة الأثرية',
      authInputGroupSub:
        'مطابقة رقم الجرد المتحفي والكتلة الفيزيائية والبصمة البصرية للنقوش مع السجل الأصلي المعتمد',
      lblVerifiedInventoryCode: (reg) =>
        `رقم الجرد المتحفي المرصود (المسجّل: ${reg})`,
      lblMeasuredWeightGrams: (regW) =>
        `الكتلة المقاسة حالياً بالجرام (المسجّل: ${regW}g)`,
      lblVisualFingerprint: 'مطابقة البصمة البصرية وتضاريس النقوش',
      visualFingerprintOptions: {
        authentic_verified: 'مطابقة تامة للبصمة البصرية والنقوش المسجلة',
        minor_surface_variance: 'تباين سطحي طفيف يستلزم مراجعة توثيقية',
        mismatch_suspected: 'اشتباه عدم تطابق في النقوش أو الهوية البصرية!',
      },

      envInputGroupTitle:
        'ثانياً: بيانات الموقع والحالة والمؤشرات البيئية الأساسية الحالية',
      lblInspectorName: 'اسم المحقق / خبير الحفظ الميداني',
      defaultInspectorName: 'وحدة التحقق والحفظ الوقائي — الحارس الذكي',
      lblCurrentCountry: 'الدولة (موقع التواجد الحالي)',
      lblCurrentLocation: 'القاعة أو موقع الحفظ الحالي',
      lblObservedCondition: 'الحالة الفيزيائية المرصودة',
      lblFieldNotes: 'ملاحظات التحقق والفحص الميداني',
      defaultFieldNoteHazard:
        'أصالة القطعة وهويتها مطابقة للسجل، مع رصد ارتفاع خطر في الرطوبة والحرارة والاهتزاز يرفع مؤشر المخاطر المستقبلية.',
      defaultFieldNoteSafe:
        'تم التحقق من صحة القطعة ومطابقة بصمتها البصرية ووزنها، وكافة المؤشرات البيئية الأساسية ضمن النطاق الآمن المستقر.',
      defaultFieldNoteAuthAlert:
        'تنبيه تحقق: رُصد اختلاف في رقم الجرد والكتلة المقاسة وتباين في البصمة البصرية يستوجب التحقق الجنائي والأمني الفوري.',

      lblCurrTemp: (min, max) =>
        `درجة الحرارة الحالية °C (المسجّل: ${min}–${max}°C)`,
      lblCurrTempDrift: 'معدل التغير الحراري اليومي (°C/يوم)',
      lblCurrRh: (min, max) =>
        `الرطوبة النسبية الحالية % (المسجّل: ${min}–${max}%)`,
      lblCurrRhHours: 'ساعات البقاء خارج نطاق الرطوبة',
      lblCurrMoisture: 'حالة الماء والرطوبة المباشرة',
      lblCurrVibration: 'ذروة الاهتزاز الحالي (mm/s)',
      lblCurrShocks: 'عدد أحداث الصدمات المرصودة',

      rowAuthenticityTitle: 'صحة وأصالة القطعة الأثرية (الجرد والكتلة والبصمة)',
      authVerdictVerified: 'أصالة موثّقة ومطابقة للسجل',
      authVerdictReview: 'تستلزم مراجعة توثيقية للهوية',
      authVerdictMismatch: 'إنذار أحمر: اشتباه عدم تطابق أصالة القطعة!',
      authDetailVerified: (code, w) =>
        `تطابق كامل لرقم الجرد (${code}) والكتلة (${w}g) والبصمة البصرية للنقوش.`,
      authDetailReview: (dw, cNote) =>
        `هامش تباين في الكتلة (${dw})${cNote ? ` · ${cNote}` : ''} — يوصى بتدقيق سجل الاستلام.`,
      authDetailMismatch: (reasons) =>
        `خلل حرج في التحقق من الأصالة: ${reasons}`,
      authReasonCodeMismatch: (ent, exp) =>
        `اختلاف رقم الجرد (${ent} مقابل ${exp})`,
      authReasonMassMismatch: (dp) => `انحراف الكتلة (${dp})`,
      authReasonVisualMismatch: 'عدم تطابق البصمة البصرية للنقوش',
      authReasonCountryChange: (curr, reg) =>
        `تغيّر دولة التواجد (${curr} بدلاً من ${reg})`,
      authMismatchDamage:
        'خطر أمني وتوثيقي حرج: احتمال استبدال غير مصرح به أو خطأ في مطابقة القطعة أو فقدان كتلة مادية من بدن الأثر.',
      authMismatchAction:
        'تحفّظ أمني فوري على القطعة داخل خزنة مقفلة، ومطابقة البصمة ثلاثية الأبعاد وسجل التسليم الرسمي بحضور أمين العهدة المتحفية.',

      forecastSectionTitle:
        '٢. مصفوفة التنبؤ الاستباقي بالمخاطر المستقبلية (٣ آفاق زمنية)',
      forecastSectionSub:
        'نموذج تنبؤ علمي يحسب احتمالية التدهور الفيزيائي والكيميائي بناءً على حساسية مادة الأثر ومقدار الانحراف في المؤشرات الأساسية:',
      kpiAuthenticityScore: 'موثوقية أصالة القطعة',
      kpiPredictedRiskIndex: 'مؤشر الخطر المتوقع',
      lblRiskProbability: 'احتمال الخطر المتوقع',
      lblProjectedStability: 'الاستقرار المتوقع',
      lblPrimaryDriver: 'المحرّك الرئيسي للخطر:',
      lblPredictedOutcome: 'التنبؤ المستقبلي بحالة القطعة:',

      horizon72hLabel: 'المدى العاجل (٢٤ – ٧٢ ساعة)',
      horizon72hBadge: 'تنبؤ فوري قصير المدى',
      horizon30dLabel: 'المدى المتوسط (٣٠ يوماً)',
      horizon30dBadge: 'تنبؤ شهري للتفاعلات النشطة',
      horizon12mLabel: 'المدى التراكمي (١٢ شهراً)',
      horizon12mBadge: 'تنبؤ سنوي للتقادم الحراري والكيميائي',

      driverNominal: 'توازن بيئي مستقر ضمن النطاق المرجعي',
      driverMoistureShock: 'تكاثف رطوبي مباشر وصدمات اهتزازية حادة',
      driverThermalRhDrift: 'تذبذب متسارع في الحرارة والرطوبة النسبية',
      driverBioHumidity: 'رطوبة مرتفعة محفّزة للتآكل والتلف الرطوبي',
      driverSaltMetalCorrosion: 'تبلور أملاح وتفاعل كلوريدي نشط على السطح',
      driverChronicThermalAging: 'إجهاد حراري ورطوبي مزمن يسرّع التقادم الكيميائي',

      outcome72hSafe:
        'ثبات فيزيائي وميكرو-مناخي تام دون مؤشرات إجهاد سطحي طارئ.',
      outcome72hCaution:
        'إجهاد تمدد وتقلص طفيف على الطبقات السطحية في حال استمرار التذبذب اليومي.',
      outcome72hHazard:
        'خطر وشيك لتشققات إجهادية أو ندى سطحي حاد يهدد النقوش خلال أقل من ٧٢ ساعة.',
      outcome30dSafe:
        'استقرار كيميائي وفيزيائي مستدام مع انعدام فرص التآكل أو التشقق.',
      outcome30dCaution:
        'احتمال ضعف تدريجي في استقرار الميكرو-مناخ في حال استمرار التذبذب الحراري والرطوبي.',
      outcome30dHazard: {
        stone_limestone:
          'تنبؤ بتزهّر ملحي نشط وتفتت حبيبي لقشرة الحجر المنحوت خلال ٣٠ يوماً.',
        metals_bronze:
          'تنبؤ بتنشيط بؤر «مرض البرونز» وظهور نقر تآكل خضراء نشطة خلال أسابيع.',
        ceramics_glass:
          'تنبؤ برشح قلوي سطحي وتخلخل في حواف التزجيج التاريخي والترميمات القديمة.',
        manuscripts_pigments:
          'تنبؤ بتموّج الألياف الورقية والرقوق الحساسة وتفكك الحبر التاريخي.',
        organic_wood_textile:
          'تنبؤ بانتفاخ أو التواء الألياف العضوية وتشوه بنية الأخشاب والمنسوجات.',
      },
      outcome12mSafe:
        'حفظ طويل الأمد بمعايير المتاحف العالمية مع ثبات البنية والسطح لعام كامل.',
      outcome12mCaution:
        'تراكم إجهاد حراري وميكانيكي بطيء إذا لم تُضبط الحرارة والرطوبة والاهتزاز.',
      outcome12mHazard: {
        stone_limestone:
          'فقدان تدريجي لمعالم النقوش البارزة وتآكل معماري غير قابل للاسترجاع خلال عام.',
        metals_bronze:
          'فقدان السطح الأصلي (Patina) وتغلغل التآكل الكلوريدي في عمق المعدن الأثري.',
        ceramics_glass:
          'شبكة تشققات شعرية دائمة وتقشّر في طبقات التزجيج التاريخية.',
        manuscripts_pigments:
          'اصفرار وهشاشة حادة في الرق والورق وتفكك دائم في الألياف السطحية.',
        organic_wood_textile:
          'تفلّق هيكلي دائم للأخشاب وضعف شديد في متانة الخيوط النسيجية التاريخية.',
      },

      reportHeaderTitle:
        '٣. جدول المقارنة المرجعية الشامل (تحديد المخاطر باللون الأحمر)',
      reportHeaderSub:
        'مقارنة تفصيلية تجمع أصالة القطعة والحالة الفيزيائية والمؤشرات البيئية الأساسية، مع تمييز كافة التجاوزات باللون الأحمر:',
      kpiBaselineScore: 'الاستقرار المسجّل',
      kpiCurrentScore: 'الاستقرار الحالي',
      kpiRedHazardsCount: 'المخاطر الحمراء',
      kpiSafeMatchedCount: 'المؤشرات المطابقة',

      verdictHazardTitle: (h) =>
        `تحذير عاجل: رُصدت (${h}) مخاطر حمراء تهدد أصالة أو سلامة القطعة الأثرية!`,
      verdictHazardDesc: (title, h) =>
        `أظهر التحقق والمقارنة للقطعة «${title}» وجود (${h}) تجاوزات حرجة باللون الأحمر؛ يلزم تنفيذ بروتوكول التوصيات العاجلة أدناه فوراً.`,
      verdictCautionTitle: (c) =>
        `تنبيه وقائي مبكر: رُصدت (${c}) انحرافات تستدعي الضبط الاستباقي`,
      verdictCautionDesc: (title) =>
        `القطعة «${title}» مستقرة إجمالاً لكن التنبؤ يشير إلى انحرافات طفيفة تستوجب الضبط قبل تحولها إلى مخاطر حمراء.`,
      verdictSafeTitle:
        'أصالة موثّقة وحالة آمنة مستقرة — تطابق كامل مع السجل المرجعي',
      verdictSafeDesc: (title) =>
        `تم التحقق بنجاح من أصالة القطعة «${title}»، وكافة قراءاتها الحالية وتنبؤاتها المستقبلية تقع ضمن النطاق المتحفي الآمن.`,

      colParam: 'البند / المؤشر المرجعي',
      colRegistered: 'السجل المعتمد (المرجع)',
      colCurrent: 'القراءة والتحقق الحالي',
      colDelta: 'الفارق / الانحراف',
      colRiskStatus: 'تقييم الخطر',

      badgeHazardRed: '✖ خطر أحمر حرج',
      badgeCautionAmber: '▲ تنبيه وقائي',
      badgeSafeGreen: '● آمن ومطابق',

      rowConditionTitle: 'الحالة الفيزيائية العامة للقطعة',
      deltaMatched: 'مطابق للمسجّل (0)',
      deltaDegraded: 'تراجع في الحالة الفيزيائية!',
      deltaImproved: 'تحسّن في الحالة',

      urgentSectionTitle:
        '٤. بروتوكول التوصيات الابتكارية العاجلة وتصدير الوثيقة العالمية',
      urgentSectionSub:
        'بطاقات تدخل وقائي مصنّفة حسب الأولوية والإطار الزمني للاستجابة، مع تحديد الأضرار المحتملة باللون الأحمر وتصديرها في تقرير PDF رسمي:',
      lblResponseWindow: 'الإطار الزمني للتنفيذ:',
      windowImmediate30m: 'فوري (< ٣٠ دقيقة)',
      windowUrgent2h: 'عاجل (< ساعتين)',
      windowPriority6h: 'أولوية قصوى (< ٦ ساعات)',
      windowPreventive24h: 'وقائي (< ٢٤ ساعة)',
      windowRoutine30d: 'متابعة دورية (كل ٣٠ يوماً)',

      exportShowcaseKicker:
        'الإصدار الوثائقي الرسمي · INTERNATIONAL CONSERVATION DOSSIER',
      exportShowcaseTitle:
        'تصدير شهادة التحقق من الأصالة والتنبؤ بالمخاطر والتوصيات العاجلة (PDF)',
      exportShowcaseDesc:
        'وثيقة رسمية مبتكرة عالية الدقة (A4 · 200 DPI) تجمع نتيجة التحقق من أصالة القطعة، ومخطط التنبؤ بالمخاطر عبر ٣ آفاق زمنية، وجدول المقارنة بالأحمر، وخطة التدخل المعتمدة بالختم الرسمي.',
      exportShowcaseFeatures:
        'بصمة الأصالة والكتلة · التنبؤ (٧٢ ساعة / ٣٠ يوماً / ١٢ شهراً) · المخاطر باللون الأحمر · ختم الاعتماد الرسمي',
      exportUrgentPdfBtn:
        'تصدير وثيقة الأصالة والتنبؤ والتوصيات العالمية PDF',
      exportingUrgentPdfBtn: 'جارٍ تصميم وإصدار الوثيقة العالمية PDF...',

      lblPotentialDamage: 'الضرر المحتمل على القطعة (تحديد أحمر):',
      lblImmediateAction: 'التوصية الوقائية والإجراء العاجل المبتكر:',
      priorityCriticalRed: 'تدخل عاجل — خطر أحمر',
      priorityPreventiveAmber: 'ضبط وقائي استباقي',
      priorityRoutineSafe: 'استدامة الحفظ الآمن',

      condDamage:
        'تفاقم الشروخ الدقيقة أو الهشاشة السطحية وفقدان أجزاء من النقوش الأصلية للقطعة.',
      condAction:
        'إيقاف أي تحريك أو لمس مباشر للقطعة فوراً، واستدعاء أخصائي الترميم لتثبيت الأجزاء الهشة داخل حاضنة مستقرة.',

      tempHighDamage: {
        stone_limestone:
          'إجهاد تمدد حراري وتسارع تبلور الأملاح المسبب لتقشّر النقوش الحجرية.',
        metals_bronze:
          'تسارع التفاعلات الكيميائية وأكسدة السطح المعدني والبرونز.',
        ceramics_glass:
          'إجهاد حراري لطبقات التزجيج التاريخية وتشققات شعرية دقيقة.',
        manuscripts_pigments:
          'جفاف واصفرار الرق والورق وتسارع التفكك الحراري للألياف السطحية.',
        organic_wood_textile:
          'جفاف حاد وانكماش الألياف العضوية وتشقق الأخشاب الأثرية.',
      },
      tempLowDamage:
        'انكماش فيزيائي بارد وارتفاع خطر تكاثف البخار المائي على سطح القطعة البارد.',
      tempHighAction: (min, max) =>
        `خفض درجة حرارة الخزانة تدريجياً (بمعدل ≤ 1°C/ساعة لتفادي الصدمة الحرارية) حتى تستقر ضمن (${min}–${max}°C) وعزل أي مصدر حراري محيط.`,
      tempLowAction: (min, max) =>
        `رفع التدفئة المتحفية تدريجياً وبهدوء للعودة إلى النطاق المسجّل (${min}–${max}°C) مع مراقبة نقطة الندى.`,

      rhHighDamage: {
        stone_limestone:
          'ذوبان وإعادة تبلور الأملاح داخل المسام الحجرية وتفتت السطح المنحوت.',
        metals_bronze:
          'تنشيط «مرض البرونز» والتآكل الكلوريدي النشط وتآكل المعدن الأثري.',
        ceramics_glass:
          'رشح قلوي («بكاء الزجاج») وتخلخل طبقات التزجيج المذهّب.',
        manuscripts_pigments:
          'نمو سريع للعفن الفطري وتموّج الورق والرق وسيلان الأحبار.',
        organic_wood_textile:
          'انتفاخ وتشوه الأخشاب وتعفّن الأنسجة العضوية التاريخية.',
      },
      rhLowDamage: {
        stone_limestone:
          'تبلور مفاجئ للأملاح الجافة وتقشّر القشرة السطحية للحجر.',
        metals_bronze:
          'تصدع الطبقات الزخرفية المطعّمة المرتبطة بالمعدن.',
        ceramics_glass:
          'تقشّر التزجيج الدقيق في القطع الخزفية والزجاجية الحساسة.',
        manuscripts_pigments:
          'تصلّب وتكسّر الرق وتشقق الطبقات السطحية الدقيقة.',
        organic_wood_textile:
          'انكماش حاد وتفلّق الأخشاب وانقطاع الألياف النسيجية.',
      },
      rhHighAction: (min, max) =>
        `إدخال شرائح السليكا جيل المكيّفة (ProSorb) فوراً وتشغيل خفض الرطوبة التدريجي لإعادة القراءة إلى النطاق الآمن (${min}–${max}% RH).`,
      rhLowAction: (min, max) =>
        `تزويد الحاضنة بمواد منظِّمة للرطوبة مكيّفة مسبقاً لرفع الرطوبة تدريجياً إلى (${min}–${max}% RH) ومنع الجفاف.`,

      moistureDamage:
        'خطر داهم للتآكل السريع وتلف بنية القطعة الأثرية بسبب البلل أو الرطوبة المباشرة.',
      moistureAction:
        'نقل القطعة فوراً وبحذر شديد إلى حاضنة جافة معزولة، وإغلاق مصدر التسرب أو التكاثف نهائياً قبل إعادة العرض.',

      vibrationDamage:
        'تمدد الشقوق الكامنة وتحرك أو انفصال الأجزاء الدقيقة بسبب الاهتزاز أو الصدمات.',
      vibrationAction:
        'تركيب وسائد عزل اهتزازي مطاطية (Elastomeric Isolators) أسفل القاعدة فوراً وإيقاف أي مصدر اهتزاز مجاور.',

      allSafeDamageNote:
        'لا توجد أضرار محتملة مرصودة — أصالة القطعة ومؤشراتها البيئية الأساسية ضمن حدود الأمان.',
      allSafeActionNote: (tMin, tMax, rhMin, rhMax) =>
        `مواصلة الرصد الوقائي الدوري والحفاظ على استقرار الخزانة ضمن (${tMin}–${tMax}°C) و(${rhMin}–${rhMax}% RH) مع توثيق فحص الأصالة فصلياً.`,

      pdfDocKicker:
        'منصة الحارس الذكي · SMART GUARDIAN — وثيقة التحقق من الأصالة والتنبؤ بالمخاطر والتوصيات',
      pdfDocTitle:
        'شهادة التحقق من صحة القطعة الأثرية والتنبؤ بالمخاطر والتوصيات العالمية',
      pdfDocSubtitle:
        'مرجع وثائقي ابتكاري يوثّق أصالة القطعة، ويتنبأ بالمخاطر المستقبلية عبر ٣ آفاق زمنية، ويحدد التجاوزات باللون الأحمر مع خطة التدخل',
      pdfSec1Title:
        'أولاً: بطاقة الأصالة المعتمدة ومؤشر التنبؤ الاستباقي بالمخاطر المستقبلية',
      pdfSec2Title:
        'ثانياً: جدول المقارنة الشامل للأصالة والمؤشرات البيئية (المخاطر باللون الأحمر)',
      pdfSec3Title:
        'ثالثاً: بروتوكول التوصيات الابتكارية العاجلة لحماية القطعة الأثرية',
      pdfSec4Title:
        'رابعاً: الملاحظات الميدانية واعتماد شهادة الحفظ والختم الرسمي',
      pdfLblArtifact: 'القطعة الأثرية والحقبة',
      pdfLblCodeAndCountry: 'رقم القيد والجرد والدولة',
      pdfLblAuthenticity: 'نتيجة التحقق من الأصالة',
      pdfLblScoresComparison: 'الاستقرار والخطر المتوقع',
      pdfForecastStripTitle: 'مصفوفة التنبؤ بالمخاطر المستقبلية:',
      pdfRedAlertBanner: (c) =>
        `إنذار أحمر عاجل: رُصدت (${c}) مخاطر حرجة تهدد أصالة أو سلامة القطعة وتستوجب تنفيذ التوصيات فوراً!`,
      pdfSafeBanner:
        'شهادة مطابقة آمنة: تم التحقق من أصالة القطعة واستقرار كافة مؤشراتها وتنبؤاتها المستقبلية.',
      pdfSealUrgentMain: 'تدخل عاجل',
      pdfSealSafeMain: 'أصالة موثّقة',
      pdfSealSub: 'SMART GUARDIAN',
      pdfSigInspectorTitle: 'توقيع خبير التحقق والفحص الميداني',
      pdfSigInspectorSub: 'إقرار بمطابقة الهوية والقراءات الميدانية المُدخلة',
      pdfSigConservatorTitle: 'اعتماد مسؤول الحفظ الوقائي والتوصيات',
      pdfSigConservatorSub: 'متابعة تنفيذ بروتوكول الحماية وفق الإطار الزمني',
      pdfFooterDisclaimer:
        'وثيقة رسمية للتحقق من الأصالة والتنبؤ بالمخاطر والتوصيات صادرة عبر منصة الحارس الذكي — المخاطر مميّزة باللون الأحمر.',
      pdfPageOf: (c, t) => `صفحة ${c} من ${t}`,
    },

    'en-US': {
      lblCountryField: 'Country',
      countrySortedHint: 'World countries sorted alphabetically (A–Z)',
      jumpToVerifyBtn: 'Proceed to Step 04: Authenticity & Risk Forecast',

      regSubStep1Code: '3A',
      regSubStep1Label: 'Artifact Identity, Country & Baseline Mass',
      regSubStep2Code: '3B',
      regSubStep2Label: 'Safe Temperature & Humidity Benchmarks',
      regSubStep3Code: '3C',
      regSubStep3Label: 'Essential Environmental Indicators & Registration',
      regNextStepHint:
        'Once registered, proceed seamlessly to Finale Step 04 for Authenticity Verification, Predictive Risk Horizons & International PDF Recommendations.',

      sec4Kicker: (n) =>
        `Finale Step 04 · Authenticity & Risk Prediction (${n} Registered Artifacts)`,
      sec4Title:
        '04. Artifact Authenticity Verification, Predictive Risk Horizons & Global Recommendations',
      sec4Subtitle:
        'Verify artifact provenance and physical authenticity (inventory code, mass, and visual relief fingerprint), forecast degradation across 3 future horizons, highlight hazards in red, and export an executive conservation PDF.',

      selectArtifactLabel:
        'Select Registered Artifact for Authenticity & Risk Forecast:',
      cascadeSelectHint:
        'Select in cascading order: first Country, then Site / Location, then Registered Artifact:',
      cascadeStep1Country: '1. Country',
      cascadeStep2Site: '2. Site / Location',
      cascadeStep3Artifact: '3. Registered Artifact',
      openVerifyCameraBtn: 'Open Verification Camera & Voice Summary',
      closeVerifyCameraBtn: 'Close Verification Camera',
      camVerifyKicker: 'LIVE OPTICAL VERIFICATION · CERTIFIED AUDIO BRIEFING',
      camVerifyTitle:
        'Live Verification Camera & Concise Audio Briefing Service',
      camScanningStatus: 'Scanning for artifact in camera frame...',
      camDetectedStatus:
        'Artifact detected in camera — Concise Audio Service active',
      camOpticalFallbackNote:
        'Smart optical viewfinder engaged automatically (physical webcam unavailable or permission not granted).',
      camRetryHardwareBtn: 'Try Physical Camera',
      camRescanSpeakBtn: 'Re-Scan Artifact & Play Audio',
      voicePanelBadgeSpeaking: 'Playing concise audio summary...',
      voicePanelBadgeReady: 'Concise Audio Service Active',
      voicePlayBtn: 'Play Concise Audio Summary',
      voiceReplayBtn: 'Replay Audio',
      voiceStopBtn: 'Stop Audio',
      voiceAutoToggleOn: 'Auto-Voice on Detection: ON',
      voiceAutoToggleOff: 'Auto-Voice on Detection: OFF',
      voiceLblArtifact: 'Artifact Name',
      voiceLblCountryAndSite: 'Country & Site',
      voiceLblUltraBrief: 'Ultra-Brief Summary of Detailed Description',
      voiceCertifiedDocNotice:
        'You can obtain all full details in a certified printed document from the platform.',
      voicePrintFullDocBtn:
        'Issue Certified Printed Document with Full Details (PDF)',
      voiceIssuingFullDocBtn: 'Generating Certified Printed Document...',
      voiceUnsupportedHint:
        'Direct voice synthesis is unavailable in this browser; the complete concise briefing is displayed below.',
      emptyArchiveTitle: 'No Archaeological Artifacts Registered Yet',
      emptyArchiveDesc:
        'This platform strictly displays only the artifacts you register yourself. Capture or upload 3+ angles in Step 01 and save the artifact record in Step 03 so it appears here for Country → Site → Artifact selection, live camera voice briefing, and risk prediction.',
      emptyArchiveGoStep1Btn: '01. Capture or Upload Artifact Photos',
      emptyArchiveGoStep3Btn: '03. Go to Artifact Registration Form',
      camEmptyArchiveBadge: 'Awaiting First Registered Artifact',
      camEmptyArchiveNotice:
        'Camera ready — no artifacts are registered yet for audio matching. Please photograph and register an artifact in Steps 01–03 first to enable its concise audio briefing and certified printed document.',
      deleteArtifactBtn: 'Delete Artifact',
      baselineCardTitle: 'Certified Registered Baseline Dossier',
      baselineMetaLine: (code, inv, weightG, country, mat) =>
        `Accession: ${code} · Inv: ${inv} · Mass: ${weightG}g · Country: ${country} · Material: ${mat}`,
      baselineSafeClimate: (tMin, tMax, rhMin, rhMax, sc) =>
        `Registered Safe Band: ${tMin}–${tMax}°C · ${rhMin}–${rhMax}% RH · Baseline Stability: ${sc}%`,

      inputPanelTitle:
        '1. Authenticity Verification & Current Environmental Inspection Inputs',
      inputPanelSub:
        'Enter current provenance/mass readings and environmental metrics, or test an instant scenario preset below:',
      presetMatchSafeBtn: '100% Verified Authentic & Safe Match',
      presetSimulateHazardBtn: 'Test Red Risk & Degradation Forecast',
      presetSimulateAuthAlertBtn: 'Test Authenticity Mismatch Alert',
      runComparisonBtn: 'Verify Authenticity & Run Risk Forecast',

      authInputGroupTitle:
        'Part A: Artifact Authenticity & Provenance Verification',
      authInputGroupSub:
        'Cross-check museum inventory number, physical mass (g), and 3D surface relief fingerprint against baseline records',
      lblVerifiedInventoryCode: (reg) =>
        `Observed Inventory Code (Registered: ${reg})`,
      lblMeasuredWeightGrams: (regW) =>
        `Measured Mass in Grams (Registered: ${regW}g)`,
      lblVisualFingerprint: '3D Surface Relief Fingerprint Match',
      visualFingerprintOptions: {
        authentic_verified:
          'Full Match with Registered 3D Surface Relief Fingerprint',
        minor_surface_variance:
          'Minor Surface Variance — Curatorial Review Advised',
        mismatch_suspected:
          'Suspected Visual / Relief Fingerprint Mismatch!',
      },

      envInputGroupTitle:
        'Part B: Current Custody Location, Physical Grade & Essential Environmental Readings',
      lblInspectorName: 'Lead Verifier / Conservation Scientist',
      defaultInspectorName:
        'Preventive Conservation & Provenance Unit — Smart Guardian',
      lblCurrentCountry: 'Country (Current Custody Site)',
      lblCurrentLocation: 'Current Gallery or Vault Location',
      lblObservedCondition: 'Observed Physical Condition',
      lblFieldNotes: 'Verification & Field Inspection Notes',
      defaultFieldNoteHazard:
        'Artifact authenticity verified against baseline; elevated humidity, thermal drift, and vibration trigger high future degradation risk.',
      defaultFieldNoteSafe:
        'Artifact authenticity, mass, and visual relief fingerprint verified; all essential environmental indicators remain safely within baseline limits.',
      defaultFieldNoteAuthAlert:
        'URGENT PROVENANCE ALERT: Discrepancy detected in inventory code, measured mass, and surface fingerprint requiring immediate curatorial lock-down.',

      lblCurrTemp: (min, max) =>
        `Current Temperature °C (Baseline: ${min}–${max}°C)`,
      lblCurrTempDrift: 'Daily Thermal Drift (°C/day)',
      lblCurrRh: (min, max) =>
        `Current Relative Humidity % (Baseline: ${min}–${max}%)`,
      lblCurrRhHours: 'Hours Outside Safe RH Band',
      lblCurrMoisture: 'Direct Water & Moisture Status',
      lblCurrVibration: 'Peak Vibration (mm/s)',
      lblCurrShocks: 'Observed Shock Events',

      rowAuthenticityTitle:
        'Artifact Authenticity (Inventory, Mass & Fingerprint)',
      authVerdictVerified: 'Authentic & Verified Match',
      authVerdictReview: 'Curatorial Provenance Review Needed',
      authVerdictMismatch: 'RED ALERT: Suspected Authenticity Mismatch!',
      authDetailVerified: (code, w) =>
        `Exact match on inventory (${code}), mass (${w}g), and visual surface fingerprint.`,
      authDetailReview: (dw, cNote) =>
        `Minor mass variance (${dw})${cNote ? ` · ${cNote}` : ''} — verify custody transfer log.`,
      authDetailMismatch: (reasons) =>
        `Critical authenticity discrepancy: ${reasons}`,
      authReasonCodeMismatch: (ent, exp) =>
        `Inventory code mismatch (${ent} vs ${exp})`,
      authReasonMassMismatch: (dp) => `Mass deviation (${dp})`,
      authReasonVisualMismatch: 'Visual relief fingerprint mismatch',
      authReasonCountryChange: (curr, reg) =>
        `Custody country shift (${curr} vs ${reg})`,
      authMismatchDamage:
        'Critical security & provenance hazard: risk of unauthorized substitution, cataloguing error, or physical fragment loss.',
      authMismatchAction:
        'Secure the artifact immediately in a restricted vault and audit 3D surface scan geometry and chain-of-custody records with the Chief Registrar.',

      forecastSectionTitle:
        '2. Predictive Conservation Risk Horizon Matrix (3 Future Timeframes)',
      forecastSectionSub:
        'Deterministic material degradation forecast modeling physical stress, moisture kinetics, and cumulative thermal aging across essential indicators:',
      kpiAuthenticityScore: 'Authenticity Confidence',
      kpiPredictedRiskIndex: 'Predicted Risk Index',
      lblRiskProbability: 'Predicted Risk Probability',
      lblProjectedStability: 'Projected Stability',
      lblPrimaryDriver: 'Primary Risk Driver:',
      lblPredictedOutcome: 'Predicted Material Outcome:',

      horizon72hLabel: 'Immediate Horizon (24–72 Hours)',
      horizon72hBadge: 'Acute Microclimate & Shock',
      horizon30dLabel: 'Medium Horizon (30 Days)',
      horizon30dBadge: 'Active Moisture & Chemical Kinetics',
      horizon12mLabel: 'Cumulative Horizon (12 Months)',
      horizon12mBadge: 'Annual Thermal & Structural Aging',

      driverNominal: 'Balanced museum microclimate within safe baseline',
      driverMoistureShock: 'Direct surface moisture & mechanical shock events',
      driverThermalRhDrift: 'Rapid daily thermal & relative humidity swings',
      driverBioHumidity: 'Sustained high RH accelerating moisture & salt risk',
      driverSaltMetalCorrosion: 'Active soluble salt cycling & chloride corrosion',
      driverChronicThermalAging: 'Chronic thermal & humidity chemical aging',

      outcome72hSafe:
        'Complete physical and microclimatic equilibrium with zero acute surface stress.',
      outcome72hCaution:
        'Mild hygroscopic expansion/contraction stress if daily drift persists.',
      outcome72hHazard:
        'Imminent risk of micro-fissure propagation or surface condensation damage within 72 hours.',
      outcome30dSafe:
        'Sustained chemical and structural stability with zero moisture or corrosion onset.',
      outcome30dCaution:
        'Gradual microclimate buffering depletion if thermal and RH drift continue.',
      outcome30dHazard: {
        stone_limestone:
          'Predicted soluble salt efflorescence and granular spalling of carved stone within 30 days.',
        metals_bronze:
          'Predicted outbreak of cyclic chloride "bronze disease" pitting within weeks.',
        ceramics_glass:
          'Predicted alkali surface weeping and lifting of fragile historic glaze edges.',
        manuscripts_pigments:
          'Predicted parchment cockling, fiber warping, and historic ink destabilization.',
        organic_wood_textile:
          'Predicted dimensional warping of wood fibers and moisture softening in textiles.',
      },
      outcome12mSafe:
        'International museum-grade preservation maintaining structural and surface integrity year-round.',
      outcome12mCaution:
        'Slow cumulative thermal and mechanical fatigue unless climate and vibration are tightened.',
      outcome12mHazard: {
        stone_limestone:
          'Irreversible loss of fine carved relief definition and progressive crust delamination over 12 months.',
        metals_bronze:
          'Destruction of noble patina and deep structural chloride corrosion penetration.',
        ceramics_glass:
          'Permanent glaze crazing network and progressive flaking of historical glaze.',
        manuscripts_pigments:
          'Severe yellowing, structural embrittlement, and fiber breakdown of archival support.',
        organic_wood_textile:
          'Permanent structural splitting in wood and severe tensile loss in historic textile fibers.',
      },

      reportHeaderTitle:
        '3. Comprehensive Baseline Comparison Matrix (Red Hazard Highlighting)',
      reportHeaderSub:
        'Side-by-side audit across Authenticity, Physical Grade, and Essential Environmental Indicators with critical hazards highlighted in red:',
      kpiBaselineScore: 'Registered Stability',
      kpiCurrentScore: 'Current Stability',
      kpiRedHazardsCount: 'Critical Red Hazards',
      kpiSafeMatchedCount: 'Safe Matched Checks',

      verdictHazardTitle: (h) =>
        `URGENT RED ALERT: ${h} Critical Hazard(s) Threatening Artifact Authenticity or Integrity!`,
      verdictHazardDesc: (title, h) =>
        `Verification and comparison for "${title}" flagged ${h} critical red exceedance(s). Execute the structured conservation protocol below immediately.`,
      verdictCautionTitle: (c) =>
        `Preventive Early Warning: ${c} Deviation(s) Require Proactive Calibration`,
      verdictCautionDesc: (title) =>
        `Artifact "${title}" remains safe overall, but predictive modeling indicates moderate drift requiring early adjustment.`,
      verdictSafeTitle:
        'Verified Authentic & Stable — 100% Conformance with Registered Baseline',
      verdictSafeDesc: (title) =>
        `Authenticity and provenance for "${title}" are verified, and all current readings and future risk horizons remain safely controlled.`,

      colParam: 'Verification / Indicator',
      colRegistered: 'Registered Baseline',
      colCurrent: 'Current Verified Reading',
      colDelta: 'Variance / Delta',
      colRiskStatus: 'Risk Verdict',

      badgeHazardRed: '✖ RED HAZARD',
      badgeCautionAmber: '▲ Caution',
      badgeSafeGreen: '● Verified Safe',

      rowConditionTitle: 'General Physical Condition',
      deltaMatched: 'Matches Baseline (0)',
      deltaDegraded: 'Physical Grade Degraded!',
      deltaImproved: 'Improved Grade',

      urgentSectionTitle:
        '4. Innovative Preventive Recommendations Protocol & Global Dossier Export',
      urgentSectionSub:
        'Prioritized conservation intervention cards with target response windows, red-flagged potential damages, and 1-click official PDF export:',
      lblResponseWindow: 'Response Window:',
      windowImmediate30m: 'Immediate (< 30 min)',
      windowUrgent2h: 'Urgent (< 2 hours)',
      windowPriority6h: 'High Priority (< 6 hours)',
      windowPreventive24h: 'Preventive (< 24 hours)',
      windowRoutine30d: 'Routine Cycle (Every 30 days)',

      exportShowcaseKicker:
        'OFFICIAL ARCHIVAL PUBLICATION · INTERNATIONAL CONSERVATION DOSSIER',
      exportShowcaseTitle:
        'Export Authenticity Certificate, Risk Forecast & Urgent Recommendations (PDF)',
      exportShowcaseDesc:
        'World-class multi-page A4 (200 DPI) official dossier uniting Authenticity Verification, the 3-Horizon Risk Prediction Chart, Red-Highlighted Comparison Matrix, and Certified Conservation Seal.',
      exportShowcaseFeatures:
        'Authenticity & Mass Audit · 72h / 30d / 12m Forecast Bars · Red Hazard Flags · Official Conservation Seal',
      exportUrgentPdfBtn:
        'Export Global Authenticity, Risk Forecast & Recommendations PDF',
      exportingUrgentPdfBtn: 'Designing & Exporting Official PDF...',

      lblPotentialDamage: 'Potential Artifact Damage (Red Risk):',
      lblImmediateAction: 'Innovative Preventive Recommendation & Action:',
      priorityCriticalRed: 'IMMEDIATE INTERVENTION — RED RISK',
      priorityPreventiveAmber: 'Proactive Preventive Calibration',
      priorityRoutineSafe: 'Sustained Safe Preservation',

      condDamage:
        'Propagation of micro-fissures, surface friability, and potential loss of original carved relief layers.',
      condAction:
        'Halt all physical handling immediately and summon a specialist conservator to consolidate fragile zones inside a stabilized chamber.',

      tempHighDamage: {
        stone_limestone:
          'Thermal expansion stress and accelerated salt crystallization spalling carved stone.',
        metals_bronze:
          'Accelerated chemical oxidation kinetics and active surface tarnishing.',
        ceramics_glass:
          'Differential thermal stress across historical glaze layers causing hairline crazing.',
        manuscripts_pigments:
          'Embrittlement, yellowing of parchment/paper, and accelerated thermal fiber decay.',
        organic_wood_textile:
          'Acute desiccation, fiber shrinkage, and structural warping or splitting of wood.',
      },
      tempLowDamage:
        'Cold physical contraction and heightened risk of moisture condensation on chilled artifact surfaces.',
      tempHighAction: (min, max) =>
        `Lower vitrine temperature gradually (≤ 1°C/hour to prevent thermal shock) into the registered band (${min}–${max}°C) and isolate nearby heat loads.`,
      tempLowAction: (min, max) =>
        `Raise gallery HVAC temperature slowly back to the registered band (${min}–${max}°C) while monitoring dew-point margins.`,

      rhHighDamage: {
        stone_limestone:
          'Deliquescence and recrystallization of soluble salts fracturing carved surfaces.',
        metals_bronze:
          'Activation of "bronze disease" (cyclic chloride corrosion) pitting the metal.',
        ceramics_glass:
          'Alkali leaching ("weeping glass") and delamination of gilded glazes.',
        manuscripts_pigments:
          'Rapid fungal mold germination, cockling of parchment, and ink bleeding.',
        organic_wood_textile:
          'Dimensional swelling, joint failure in wood, and microbial rot in textiles.',
      },
      rhLowDamage: {
        stone_limestone:
          'Sudden crystallization of dissolved salts lifting surface stone crusts.',
        metals_bronze:
          'Cracking of inlaid mineral or organic decorative elements on metal.',
        ceramics_glass:
          'Flaking of fragile low-fired glazes and historic restoration adhesives.',
        manuscripts_pigments:
          'Severe parchment stiffening, curling, and surface cracking of delicate folios.',
        organic_wood_textile:
          'Irreversible shrinkage, structural splitting of wood, and brittle textile fibers.',
      },
      rhHighAction: (min, max) =>
        `Deploy pre-conditioned ProSorb silica gel cassettes immediately and ramp dehumidification at ≤ 2% RH/hour back to (${min}–${max}% RH).`,
      rhLowAction: (min, max) =>
        `Introduce conditioned humidity-buffering media into the enclosure to gradually restore RH into (${min}–${max}% RH).`,

      moistureDamage:
        'Imminent rapid metallic corrosion, salt mobilization, and structural softening from direct wetness.',
      moistureAction:
        'Evacuate the artifact immediately to a dry acclimatized conservation chamber and eliminate the leak or condensation source.',

      vibrationDamage:
        'Mechanical propagation of latent cracks, detachment of loose fragments, or shifting on the mount.',
      vibrationAction:
        'Install elastomeric anti-vibration isolators beneath the mount immediately and halt nearby impact or heavy work.',

      allSafeDamageNote:
        'Zero imminent hazards — artifact authenticity and all essential environmental parameters are verified safe.',
      allSafeActionNote: (tMin, tMax, rhMin, rhMax) =>
        `Maintain routine preventive monitoring within ${tMin}–${tMax}°C and ${rhMin}–${rhMax}% RH with quarterly provenance & mass verification.`,

      pdfDocKicker:
        'SMART GUARDIAN PLATFORM — AUTHENTICITY, RISK FORECAST & CONSERVATION DOSSIER',
      pdfDocTitle:
        'Artifact Authenticity Certificate, Risk Prediction & Urgent Recommendations',
      pdfDocSubtitle:
        'World-class diagnostic dossier uniting provenance verification, 3-horizon risk forecasting, red-highlighted deviations, and action protocols',
      pdfSec1Title:
        'I. Certified Authenticity Verdict & 3-Horizon Predictive Risk Forecast',
      pdfSec2Title:
        'II. Comprehensive Baseline Comparison Matrix (Hazards Highlighted in Red)',
      pdfSec3Title:
        'III. Innovative Urgent Conservation Recommendations & Response Windows',
      pdfSec4Title:
        'IV. Field Verification Notes & Official Conservation Sign-Off',
      pdfLblArtifact: 'Artifact & Period',
      pdfLblCodeAndCountry: 'Accession, Inv & Country',
      pdfLblAuthenticity: 'Authenticity Verification',
      pdfLblScoresComparison: 'Stability & Predicted Risk',
      pdfForecastStripTitle: '3-Horizon Degradation Risk Forecast:',
      pdfRedAlertBanner: (c) =>
        `URGENT RED ALERT: ${c} Critical Hazard(s) Flagged Across Authenticity / Environment — Immediate Action Required!`,
      pdfSafeBanner:
        'CERTIFIED SAFE & AUTHENTIC: Provenance, physical mass, and all future conservation horizons verified nominal.',
      pdfSealUrgentMain: 'URGENT ACTION',
      pdfSealSafeMain: 'AUTHENTIC SAFE',
      pdfSealSub: 'SMART GUARDIAN',
      pdfSigInspectorTitle: 'Provenance & Field Verifier Signature',
      pdfSigInspectorSub: 'Attestation of physical identity, mass & field metrics',
      pdfSigConservatorTitle: 'Chief Conservator Authorization',
      pdfSigConservatorSub: 'Execution of scheduled preventive response windows',
      pdfFooterDisclaimer:
        'Official Authenticity, Predictive Risk & Recommendations Dossier generated by Smart Guardian — Critical hazards highlighted in RED.',
      pdfPageOf: (c, t) => `Page ${c} of ${t}`,
    },

    fr: {
      lblCountryField: 'Pays',
      countrySortedHint: 'Pays du monde triés par ordre alphabétique (A–Z)',
      jumpToVerifyBtn: 'Aller à l’Étape 04 : Authenticité & Prévision des Risques',

      regSubStep1Code: '3A',
      regSubStep1Label: 'Identité, Pays & Masse de Référence',
      regSubStep2Code: '3B',
      regSubStep2Label: 'Seuils Sûrs Température & Humidité',
      regSubStep3Code: '3C',
      regSubStep3Label: 'Indicateurs Essentiels & Enregistrement',
      regNextStepHint:
        'Une fois la pièce enregistrée, passez à l’Étape finale 04 pour vérifier son authenticité, prévoir les risques futurs et exporter les recommandations PDF.',

      sec4Kicker: (n) =>
        `Étape Finale 04 · Authenticité & Prévision (${n} pièces enregistrées)`,
      sec4Title:
        '04. Vérification d’Authenticité, Prévision des Risques & Recommandations Globales',
      sec4Subtitle:
        'Contrôlez l’authenticité de la pièce (numéro d’inventaire, masse et empreinte visuelle), anticipez les risques sur 3 horizons temporels, signalez les dangers en rouge et exportez un dossier PDF officiel.',

      selectArtifactLabel:
        'Sélectionner l’artéfact enregistré pour vérifier l’authenticité et les risques :',
      cascadeSelectHint:
        'Sélectionnez dans l’ordre : d’abord le Pays, puis le Site, puis l’Artéfact enregistré :',
      cascadeStep1Country: '1. Pays',
      cascadeStep2Site: '2. Site / Lieu',
      cascadeStep3Artifact: '3. Artéfact Enregistré',
      openVerifyCameraBtn: 'Ouvrir Caméra de Vérification & Résumé Audio',
      closeVerifyCameraBtn: 'Fermer la Caméra',
      camVerifyKicker: 'DÉTECTION OPTIQUE DIRECTE · SERVICE AUDIO CERTIFIÉ',
      camVerifyTitle:
        'Caméra de Vérification en Direct & Service de Résumé Audio Succinct',
      camScanningStatus: 'Détection de l’artéfact dans l’objectif...',
      camDetectedStatus:
        'Artéfact détecté à la caméra — Service audio succinct actif',
      camOpticalFallbackNote:
        'Viseur optique intelligent activé automatiquement (caméra physique absente ou autorisation non accordée).',
      camRetryHardwareBtn: 'Activer Caméra Physique',
      camRescanSpeakBtn: 'Relancer Détection & Audio',
      voicePanelBadgeSpeaking: 'Lecture du résumé audio en cours...',
      voicePanelBadgeReady: 'Service Audio Succinct Actif',
      voicePlayBtn: 'Écouter le Résumé Audio',
      voiceReplayBtn: 'Réécouter',
      voiceStopBtn: 'Arrêter l’Audio',
      voiceAutoToggleOn: 'Audio Auto à la Détection : OUI',
      voiceAutoToggleOff: 'Audio Auto à la Détection : NON',
      voiceLblArtifact: 'Nom de l’Artéfact',
      voiceLblCountryAndSite: 'Pays & Site',
      voiceLblUltraBrief: 'Résumé Très Succinct de la Description Détaillée',
      voiceCertifiedDocNotice:
        'Vous pouvez obtenir tous les détails complets sous forme de document imprimé certifié par la plateforme.',
      voicePrintFullDocBtn:
        'Émettre le Document Imprimé Certifié Complet (PDF)',
      voiceIssuingFullDocBtn: 'Préparation du document imprimé certifié...',
      voiceUnsupportedHint:
        'La synthèse vocale directe n’est pas disponible sur ce navigateur ; le résumé complet s’affiche ci-dessous.',
      emptyArchiveTitle: 'Aucun Artéfact Enregistré sur la Plateforme',
      emptyArchiveDesc:
        'La plateforme affiche exclusivement les artéfacts que vous enregistrez vous-même. Capturez ou importez 3+ photos à l’Étape 01 puis enregistrez la fiche à l’Étape 03 pour activer la sélection Pays → Site → Artéfact, le résumé vocal caméra et la prévision des risques.',
      emptyArchiveGoStep1Btn: '01. Capturer ou Importer des Photos',
      emptyArchiveGoStep3Btn: '03. Aller au Formulaire d’Enregistrement',
      camEmptyArchiveBadge: 'En attente du premier artéfact enregistré',
      camEmptyArchiveNotice:
        'Caméra prête — aucun artéfact n’est encore enregistré pour le résumé vocal. Veuillez d’abord photographier et enregistrer votre artéfact aux Étapes 01–03.',
      deleteArtifactBtn: 'Supprimer l’Artéfact',
      baselineCardTitle: 'Dossier de Référence Certifié',
      baselineMetaLine: (code, inv, weightG, country, mat) =>
        `Cote : ${code} · Inv : ${inv} · Masse : ${weightG}g · Pays : ${country} · Matériau : ${mat}`,
      baselineSafeClimate: (tMin, tMax, rhMin, rhMax, sc) =>
        `Plage sûre : ${tMin}–${tMax}°C · ${rhMin}–${rhMax}% HR · Stabilité de référence : ${sc}%`,

      inputPanelTitle:
        '1. Contrôle d’Authenticité & Mesures Environnementales Actuelles',
      inputPanelSub:
        'Saisissez les données d’authenticité et les mesures actuelles, ou testez un scénario instantané ci-dessous :',
      presetMatchSafeBtn: 'Authenticité 100% & État Sûr',
      presetSimulateHazardBtn: 'Tester Risques Rouges & Prévision',
      presetSimulateAuthAlertBtn: 'Tester Alerte d’Authenticité',
      runComparisonBtn: 'Valider l’Authenticité & Calculer les Prévisions',

      authInputGroupTitle:
        'Volet A : Vérification d’Authenticité & de Provenance',
      authInputGroupSub:
        'Comparaison du numéro d’inventaire, de la masse mesurée (g) et de l’empreinte visuelle des reliefs avec l’enregistrement initial',
      lblVerifiedInventoryCode: (reg) =>
        `Code d’inventaire observé (Enregistré : ${reg})`,
      lblMeasuredWeightGrams: (regW) =>
        `Masse mesurée en grammes (Enregistrée : ${regW}g)`,
      lblVisualFingerprint: 'Correspondance de l’Empreinte 3D des Reliefs',
      visualFingerprintOptions: {
        authentic_verified:
          'Correspondance totale avec l’empreinte 3D des reliefs enregistrée',
        minor_surface_variance:
          'Légère variation de surface — vérification documentaire conseillée',
        mismatch_suspected:
          'Suspicion de non-correspondance visuelle ou matérielle !',
      },

      envInputGroupTitle:
        'Volet B : Lieu Actuel, État Physique & Indicateurs Environnementaux Essentiels',
      lblInspectorName: 'Vérificateur / Conservateur',
      defaultInspectorName:
        'Unité d’Authenticité & Conservation Préventive — Smart Guardian',
      lblCurrentCountry: 'Pays (Lieu de garde actuel)',
      lblCurrentLocation: 'Salle ou réserve actuelle',
      lblObservedCondition: 'État physique observé',
      lblFieldNotes: 'Notes de vérification et d’inspection',
      defaultFieldNoteHazard:
        'Authenticité confirmée ; hausse critique d’humidité, de température et de vibrations augmentant fortement le risque prévisionnel.',
      defaultFieldNoteSafe:
        'Authenticité, masse et empreinte visuelle confirmées ; tous les indicateurs environnementaux essentiels respectent les seuils de sécurité.',
      defaultFieldNoteAuthAlert:
        'ALERTE AUTHENTICITÉ : écart détecté sur le code d’inventaire, la masse et l’empreinte de surface exigeant une mise sous scellés immédiate.',

      lblCurrTemp: (min, max) =>
        `Température actuelle °C (Réf. : ${min}–${max}°C)`,
      lblCurrTempDrift: 'Variation thermique quotidienne (°C/j)',
      lblCurrRh: (min, max) =>
        `Humidité relative actuelle % (Réf. : ${min}–${max}%)`,
      lblCurrRhHours: 'Heures hors plage HR',
      lblCurrMoisture: 'Eau directe & condensation',
      lblCurrVibration: 'Pic de vibration (mm/s)',
      lblCurrShocks: 'Chocs observés',

      rowAuthenticityTitle:
        'Authenticité de l’Artéfact (Inventaire, Masse & Empreinte)',
      authVerdictVerified: 'Authenticité Certifiée & Conforme',
      authVerdictReview: 'Révision Documentaire Requise',
      authVerdictMismatch: 'ALERTE ROUGE : Suspicion de Non-Authenticité !',
      authDetailVerified: (code, w) =>
        `Concordance exacte de l’inventaire (${code}), de la masse (${w}g) et de l’empreinte visuelle.`,
      authDetailReview: (dw, cNote) =>
        `Écart modéré de masse (${dw})${cNote ? ` · ${cNote}` : ''} — contrôler le registre de mouvement.`,
      authDetailMismatch: (reasons) =>
        `Anomalie critique d’authenticité : ${reasons}`,
      authReasonCodeMismatch: (ent, exp) =>
        `Code discordant (${ent} vs ${exp})`,
      authReasonMassMismatch: (dp) => `Écart de masse (${dp})`,
      authReasonVisualMismatch: 'Empreinte visuelle non conforme',
      authReasonCountryChange: (curr, reg) =>
        `Changement de pays (${curr} vs ${reg})`,
      authMismatchDamage:
        'Risque critique de sûreté muséale : substitution non autorisée, erreur d’identification ou perte matérielle de fragment.',
      authMismatchAction:
        'Placer immédiatement l’objet en coffre sécurisé et contrôler le scan 3D ainsi que la chaîne de garde avec le conservateur en chef.',

      forecastSectionTitle:
        '2. Matrice Prédictive des Risques Futurs (3 Horizons Temporels)',
      forecastSectionSub:
        'Modélisation préventive estimant la probabilité de dégradation mécanique, hydrique et thermique selon le matériau :',
      kpiAuthenticityScore: 'Indice d’Authenticité',
      kpiPredictedRiskIndex: 'Indice de Risque Prévu',
      lblRiskProbability: 'Probabilité de Risque',
      lblProjectedStability: 'Stabilité Projetée',
      lblPrimaryDriver: 'Facteur Principal :',
      lblPredictedOutcome: 'Évolution Prévue sur l’Objet :',

      horizon72hLabel: 'Horizon Immédiat (24–72 h)',
      horizon72hBadge: 'Choc Climatique & Mécanique',
      horizon30dLabel: 'Horizon Moyen (30 Jours)',
      horizon30dBadge: 'Cinétique Hydrique & Chimique',
      horizon12mLabel: 'Horizon Cumulatif (12 Mois)',
      horizon12mBadge: 'Vieillissement Thermique & Structurel',

      driverNominal: 'Équilibre microclimatique conforme aux normes',
      driverMoistureShock: 'Humidité directe et chocs vibratoires aigus',
      driverThermalRhDrift: 'Fluctuations rapides de température et d’HR',
      driverBioHumidity: 'Humidité élevée favorisant l’altération hydrique',
      driverSaltMetalCorrosion: 'Cristallisation des sels et corrosion active',
      driverChronicThermalAging: 'Vieillissement chimique thermique et humide',

      outcome72hSafe:
        'Stabilité physique et microclimatique complète sans contrainte aiguë.',
      outcome72hCaution:
        'Légère tension superficielle en cas de maintien des variations diurnes.',
      outcome72hHazard:
        'Risque imminent de microfissuration ou de condensation de surface sous 72 heures.',
      outcome30dSafe:
        'Stabilité chimique et structurelle durable sans altération ni corrosion.',
      outcome30dCaution:
        'Baisse graduelle de la stabilité microclimatique si les écarts persistent.',
      outcome30dHazard: {
        stone_limestone:
          'Efflorescence saline prévue et désagrégation granulaire de la pierre sous 30 jours.',
        metals_bronze:
          'Activation prévue de la « maladie du bronze » (piqûres de chlorures).',
        ceramics_glass:
          'Altération alcaline (« verre pleureur ») et soulèvement des glaçures anciennes.',
        manuscripts_pigments:
          'Gondolement du parchemin et fragilisation des encres anciennes.',
        organic_wood_textile:
          'Gonflement dimensionnel du bois et relâchement des fibres textiles.',
      },
      outcome12mSafe:
        'Conservation muséale optimale préservant l’intégrité et la structure sur 12 mois.',
      outcome12mCaution:
        'Fatigue thermique et mécanique lente si le climat n’est pas stabilisé.',
      outcome12mHazard: {
        stone_limestone:
          'Perte irréversible de finesse des reliefs sculptés et écaillage sur 12 mois.',
        metals_bronze:
          'Altération profonde de la patine noble et corrosion structurelle interne.',
        ceramics_glass:
          'Réseau permanent de tressaillage et écaillage des glaçures historiques.',
        manuscripts_pigments:
          'Jaunissement cassant et fragilisation structurelle permanente des feuillets.',
        organic_wood_textile:
          'Fentes structurelles permanentes du bois et perte de résistance des textiles.',
      },

      reportHeaderTitle:
        '3. Tableau Comparatif Global (Risques Critiques en Rouge)',
      reportHeaderSub:
        'Comparaison détaillée couvrant l’authenticité, l’état physique et les indicateurs environnementaux essentiels avec mise en évidence rouge :',
      kpiBaselineScore: 'Stabilité Réf.',
      kpiCurrentScore: 'Stabilité Actuelle',
      kpiRedHazardsCount: 'Risques Rouges',
      kpiSafeMatchedCount: 'Critères Conformes',

      verdictHazardTitle: (h) =>
        `ALERTE ROUGE URGENTE : ${h} risque(s) critique(s) sur l’authenticité ou la conservation !`,
      verdictHazardDesc: (title, h) =>
        `L’audit de « ${title} » révèle ${h} dépassement(s) critique(s) en rouge. Exécutez immédiatement le protocole de sauvegarde ci-dessous.`,
      verdictCautionTitle: (c) =>
        `Vigilance Préventive : ${c} écart(s) à corriger rapidement`,
      verdictCautionDesc: (title) =>
        `L’artéfact « ${title} » reste globalement protégé mais nécessite un réglage préventif anticipé.`,
      verdictSafeTitle:
        'Authenticité Certifiée & État Sûr — Conformité Totale au Référentiel',
      verdictSafeDesc: (title) =>
        `L’authenticité de « ${title} » est validée et toutes les mesures actuelles et prévisions futures demeurent sûres.`,

      colParam: 'Critère / Indicateur',
      colRegistered: 'Référence Certifiée',
      colCurrent: 'Mesure & Contrôle Actuel',
      colDelta: 'Écart / Variation',
      colRiskStatus: 'Verdict Risque',

      badgeHazardRed: '✖ RISQUE ROUGE',
      badgeCautionAmber: '▲ Vigilance',
      badgeSafeGreen: '● Certifié Sûr',

      rowConditionTitle: 'État physique général',
      deltaMatched: 'Conforme (0)',
      deltaDegraded: 'Dégradation physique !',
      deltaImproved: 'Amélioration',

      urgentSectionTitle:
        '4. Protocole Innovant de Recommandations & Export du Dossier Officiel',
      urgentSectionSub:
        'Fiches d’intervention classées par priorité et délai d’action, dommages potentiels en rouge et export PDF haute définition :',
      lblResponseWindow: 'Délai d’intervention :',
      windowImmediate30m: 'Immédiat (< 30 min)',
      windowUrgent2h: 'Urgent (< 2 heures)',
      windowPriority6h: 'Prioritaire (< 6 heures)',
      windowPreventive24h: 'Préventif (< 24 heures)',
      windowRoutine30d: 'Suivi périodique (30 jours)',

      exportShowcaseKicker:
        'PUBLICATION OFFICIELLE · INTERNATIONAL CONSERVATION DOSSIER',
      exportShowcaseTitle:
        'Exporter le Certificat d’Authenticité, la Prévision des Risques & les Recommandations (PDF)',
      exportShowcaseDesc:
        'Document officiel A4 (200 DPI) réunissant le verdict d’authenticité, le graphique prédictif sur 3 horizons, le tableau comparatif en rouge et le sceau officiel.',
      exportShowcaseFeatures:
        'Audit d’Authenticité · Prévision 72h / 30j / 12m · Risques en Rouge · Sceau Officiel',
      exportUrgentPdfBtn:
        'Exporter Dossier Authenticité, Risques & Recommandations PDF',
      exportingUrgentPdfBtn: 'Génération du dossier officiel PDF...',

      lblPotentialDamage: 'Dommage potentiel encouru (Risque Rouge) :',
      lblImmediateAction: 'Recommandation préventive & action immédiate :',
      priorityCriticalRed: 'INTERVENTION IMMÉDIATE — RISQUE ROUGE',
      priorityPreventiveAmber: 'Ajustement préventif anticipé',
      priorityRoutineSafe: 'Maintien préventif régulier',

      condDamage:
        'Aggravation des microfissures, fragilisation de surface et perte possible de fragments sculptés.',
      condAction:
        'Interdire toute manipulation immédiate et faire intervenir un restaurateur spécialisé en enceinte stabilisée.',

      tempHighDamage: {
        stone_limestone:
          'Dilatation thermique et cristallisation accélérée des sels écaillant la pierre.',
        metals_bronze:
          'Accélération cinétique de l’oxydation et corrosion métallique.',
        ceramics_glass:
          'Tension thermique sur les glaçures anciennes provoquant un tressaillage.',
        manuscripts_pigments:
          'Jaunissement, dessèchement du parchemin et fragilisation thermique des fibres.',
        organic_wood_textile:
          'Dessiccation rapide, retrait des fibres et fendillement du bois.',
      },
      tempLowDamage:
        'Contraction thermique à froid et risque élevé de condensation superficielle.',
      tempHighAction: (min, max) =>
        `Abaisser progressivement la température (≤ 1°C/h sans choc thermique) vers (${min}–${max}°C) et isoler toute source de chaleur.`,
      tempLowAction: (min, max) =>
        `Remonter doucement la température vers (${min}–${max}°C) en surveillant l’absence de point de rosée.`,

      rhHighDamage: {
        stone_limestone:
          'Dissolution et recristallisation des sels solubles pulvérisant le relief.',
        metals_bronze:
          'Activation de la « maladie du bronze » (corrosion active par chlorures).',
        ceramics_glass:
          'Altération alcaline du verre et décollement des décors dorés.',
        manuscripts_pigments:
          'Germination fongique rapide, gondolement du parchemin et migration des encres.',
        organic_wood_textile:
          'Gonflement du bois, déformation des assemblages et moisissure des textiles.',
      },
      rhLowDamage: {
        stone_limestone:
          'Cristallisation brutale des sels soulevant l’épiderme de la pierre.',
        metals_bronze:
          'Fissuration des incrustations associées au support métallique.',
        ceramics_glass:
          'Écaillage des glaçures fragiles et des anciens adhésifs.',
        manuscripts_pigments:
          'Raidissement cassant du parchemin et microfissuration des feuillets anciens.',
        organic_wood_textile:
          'Retrait irréversible, fentes structurelles du bois et cassure des fibres.',
      },
      rhHighAction: (min, max) =>
        `Insérer immédiatement des cassettes ProSorb conditionnées et déshumidifier progressivement vers (${min}–${max}% HR).`,
      rhLowAction: (min, max) =>
        `Introduire un régulateur d’humidité pré-conditionné pour rétablir progressivement (${min}–${max}% HR).`,

      moistureDamage:
        'Danger immédiat de corrosion rapide et d’altération structurelle par mouillage direct.',
      moistureAction:
        'Évacuer immédiatement l’artéfact vers une enceinte sèche acclimatée et éliminer la source d’humidité.',

      vibrationDamage:
        'Propagation mécanique des fissures internes et déplacement d’éléments fragiles.',
      vibrationAction:
        'Installer immédiatement des patins antivibratoires élastomères sous le socle et stopper les vibrations proches.',

      allSafeDamageNote:
        'Aucun risque détecté — authenticité et indicateurs environnementaux essentiels entièrement conformes.',
      allSafeActionNote: (tMin, tMax, rhMin, rhMax) =>
        `Maintenir la surveillance périodique entre ${tMin}–${tMax}°C et ${rhMin}–${rhMax}% HR avec contrôle trimestriel d’authenticité.`,

      pdfDocKicker:
        'PLATEFORME SMART GUARDIAN — CERTIFICAT D’AUTHENTICITÉ, PRÉVISION DES RISQUES & RECOMMANDATIONS',
      pdfDocTitle:
        'Certificat d’Authenticité, Prévision des Risques & Recommandations Urgentes',
      pdfDocSubtitle:
        'Dossier officiel réunissant le contrôle d’authenticité, la prévision sur 3 horizons, les risques en rouge et le plan d’action',
      pdfSec1Title:
        'I. Verdict d’Authenticité & Prévision des Risques sur 3 Horizons',
      pdfSec2Title:
        'II. Tableau Comparatif Complet (Risques Critiques Surlignés en Rouge)',
      pdfSec3Title:
        'III. Protocole de Recommandations Urgentes & Délais d’Intervention',
      pdfSec4Title:
        'IV. Notes de Vérification & Visa Officiel de Conservation',
      pdfLblArtifact: 'Artéfact & Période',
      pdfLblCodeAndCountry: 'Cote, Inv & Pays',
      pdfLblAuthenticity: 'Vérification d’Authenticité',
      pdfLblScoresComparison: 'Stabilité & Risque Prévu',
      pdfForecastStripTitle: 'Prévision des Risques (72h · 30j · 12m) :',
      pdfRedAlertBanner: (c) =>
        `ALERTE ROUGE URGENTE : ${c} risque(s) critique(s) détecté(s) — Intervention immédiate requise !`,
      pdfSafeBanner:
        'CERTIFIÉ AUTHENTIQUE & SÛR : Provenance, masse et horizons de conservation entièrement conformes.',
      pdfSealUrgentMain: 'URGENCE ROUGE',
      pdfSealSafeMain: 'AUTHENTIQUE SÛR',
      pdfSealSub: 'SMART GUARDIAN',
      pdfSigInspectorTitle: 'Signature du Vérificateur / Chercheur',
      pdfSigInspectorSub: 'Attestation d’identité, de masse et des relevés',
      pdfSigConservatorTitle: 'Visa du Conservateur en Chef',
      pdfSigConservatorSub: 'Application des recommandations selon délais',
      pdfFooterDisclaimer:
        'Dossier officiel d’authenticité, prévision des risques et recommandations Smart Guardian — Risques marqués en ROUGE.',
      pdfPageOf: (c, t) => `Page ${c} sur ${t}`,
    },

    zh: {
      lblCountryField: '国家 / 地区',
      countrySortedHint: '全球国家与地区（按字母顺序排列）',
      jumpToVerifyBtn: '前往终章步骤 04：真伪核验与风险预测',

      regSubStep1Code: '3A',
      regSubStep1Label: '文物身份、国家与基准质量',
      regSubStep2Code: '3B',
      regSubStep2Label: '适宜温湿度安全基准区间',
      regSubStep3Code: '3C',
      regSubStep3Label: '核心基础环境指标与建档',
      regNextStepHint:
        '完成建档保存后，可顺畅进入终章步骤（04）开展文物真伪核验、三阶段未来风险预测并导出国际标准保护建议 PDF。',

      sec4Kicker: (n) =>
        `终章步骤 04 · 真伪核验与风险预测（已建档 ${n} 件文物可供核验）`,
      sec4Title:
        '04. 文物真伪核验、未来风险预测与国际级创新保护建议导出',
      sec4Subtitle:
        '综合核验已建档文物的馆藏编号、实测质量与三维纹饰浮雕指纹，预测未来三个时间维度的劣化风险（红标警示），并导出世界级排版 PDF 官方建议书。',

      selectArtifactLabel: '选择需进行真伪核验与风险预测的已建档文物：',
      cascadeSelectHint: '请依次从下拉菜单选择：首先选择国家，再选择遗址/地点，最后选择文物：',
      cascadeStep1Country: '1. 国家 / 地区',
      cascadeStep2Site: '2. 遗址 / 保存地点',
      cascadeStep3Artifact: '3. 已建档文物',
      openVerifyCameraBtn: '开启核验相机与语音简述服务',
      closeVerifyCameraBtn: '关闭核验相机',
      camVerifyKicker: '实时光学识别 · 官方语音简述服务',
      camVerifyTitle: '实时核验取景相机与文物精要语音播报服务',
      camScanningStatus: '正在镜头画面中识别文物...',
      camDetectedStatus: '已在相机中识别到文物 — 精要语音服务已激活',
      camOpticalFallbackNote:
        '未检测到外接摄像头或未授予权限，已自动启用智能光学取景预览模式。',
      camRetryHardwareBtn: '尝试开启物理摄像头',
      camRescanSpeakBtn: '重新识别并播报语音',
      voicePanelBadgeSpeaking: '正在播报文物精要语音概述...',
      voicePanelBadgeReady: '精要语音服务已就绪',
      voicePlayBtn: '播放精要语音概述',
      voiceReplayBtn: '重新收听',
      voiceStopBtn: '停止语音',
      voiceAutoToggleOn: '识别后自动播报：开启',
      voiceAutoToggleOff: '识别后自动播报：关闭',
      voiceLblArtifact: '文物名称',
      voiceLblCountryAndSite: '所属国家与地点',
      voiceLblUltraBrief: '详细说明精炼简述',
      voiceCertifiedDocNotice:
        '您可以从本平台获取包含全部详情的官方认证打印档案。',
      voicePrintFullDocBtn: '导出包含全部详情的平台认证打印文档 (PDF)',
      voiceIssuingFullDocBtn: '正在生成平台认证打印文档...',
      voiceUnsupportedHint:
        '当前浏览器不支持直接语音合成，以下完整呈现精要简述内容。',
      emptyArchiveTitle: '平台当前暂无已登记建档文物',
      emptyArchiveDesc:
        '本平台仅展示您亲自建档登记的文物。请先在步骤 01 拍摄或上传至少 3 张多角度照片，并在步骤 03 完成文物建档保存，即可在此启用“国家 → 遗址 → 文物”级联核验、相机语音简述及风险预测。',
      emptyArchiveGoStep1Btn: '01. 开始拍摄或上传文物照片',
      emptyArchiveGoStep3Btn: '03. 前往文物建档登记表',
      camEmptyArchiveBadge: '等待登记首件文物档案',
      camEmptyArchiveNotice:
        '相机已就绪 — 当前暂无已登记文物可供语音播报。请先在步骤 01–03 完成文物拍照与登记保存，以启用精要语音介绍与官方认证打印档案。',
      deleteArtifactBtn: '删除此文物',
      baselineCardTitle: '已认证建档基准档案',
      baselineMetaLine: (code, inv, weightG, country, mat) =>
        `档案号：${code} · 馆藏号：${inv} · 质量：${weightG}g · 国家：${country} · 材质：${mat}`,
      baselineSafeClimate: (tMin, tMax, rhMin, rhMax, sc) =>
        `建档安全区间：${tMin}–${tMax}°C · ${rhMin}–${rhMax}% RH · 基准稳定度：${sc}%`,

      inputPanelTitle: '1. 文物真伪核验数据与当前环境实测输入',
      inputPanelSub:
        '输入当前馆藏核验信息与环境实测值，或点击右侧预设场景即时体验风险预测与红标预警：',
      presetMatchSafeBtn: '100% 真品吻合且环境安全',
      presetSimulateHazardBtn: '测试红色高危与劣化预测场景',
      presetSimulateAuthAlertBtn: '测试真伪异常红色警报',
      runComparisonBtn: '执行真伪核验并生成风险预测',

      authInputGroupTitle: '第一部分：文物真伪与流传身份核验',
      authInputGroupSub:
        '比对现场馆藏登记号、实测物理质量（克）以及三维表面浮雕视觉指纹与原始建档记录',
      lblVerifiedInventoryCode: (reg) => `现场核验馆藏号（建档值：${reg}）`,
      lblMeasuredWeightGrams: (regW) => `当前实测质量 g（建档值：${regW}g）`,
      lblVisualFingerprint: '三维表面浮雕视觉指纹比对',
      visualFingerprintOptions: {
        authentic_verified: '与建档三维纹饰浮雕指纹完全吻合',
        minor_surface_variance: '表面存在细微差异 — 建议开展档案复核',
        mismatch_suspected: '疑似纹饰或视觉身份特征不匹配！',
      },

      envInputGroupTitle: '第二部分：当前保存地点、本体状况与核心基础环境实测值',
      lblInspectorName: '核验专家 / 预防性文保员',
      defaultInspectorName: '真伪核验与预防性保护中心 — Smart Guardian',
      lblCurrentCountry: '国家 / 地区（当前保存地）',
      lblCurrentLocation: '当前展厅或库房位置',
      lblObservedCondition: '当前目视本体保存状况',
      lblFieldNotes: '真伪核验与现场勘察记录',
      defaultFieldNoteHazard:
        '文物身份与质量核验吻合；但当前温湿度、结露与振动超标，未来劣化风险指数显著上升。',
      defaultFieldNoteSafe:
        '文物馆藏号、质量及视觉指纹核验完全一致，全部核心基础环境指标均处于安全区间。',
      defaultFieldNoteAuthAlert:
        '紧急真伪预警：现场核验发现馆藏编号、实测质量及表面纹饰指纹与原档案存在显著差异，需立即封存复核。',

      lblCurrTemp: (min, max) => `当前温度 °C（建档：${min}–${max}°C）`,
      lblCurrTempDrift: '日均温变率 (°C/天)',
      lblCurrRh: (min, max) => `当前相对湿度 %（建档：${min}–${max}%）`,
      lblCurrRhHours: '湿度超限持续小时数',
      lblCurrMoisture: '直接水迹与结露状态',
      lblCurrVibration: '当前峰值振速 (mm/s)',
      lblCurrShocks: '记录到的冲击次数',

      rowAuthenticityTitle: '文物真伪核验（馆藏号、质量与视觉指纹）',
      authVerdictVerified: '真品身份已核实且完全吻合',
      authVerdictReview: '需开展馆藏档案复核',
      authVerdictMismatch: '红色警报：疑似文物真伪或身份不符！',
      authDetailVerified: (code, w) =>
        `馆藏号（${code}）、实测质量（${w}g）与三维视觉指纹均精确吻合。`,
      authDetailReview: (dw, cNote) =>
        `实测质量存在轻微偏差（${dw}）${cNote ? ` · ${cNote}` : ''} — 建议核对交接记录。`,
      authDetailMismatch: (reasons) => `真伪核验发现严重异常：${reasons}`,
      authReasonCodeMismatch: (ent, exp) => `馆藏号不符（${ent} 对比 ${exp}）`,
      authReasonMassMismatch: (dp) => `质量偏差超限（${dp}）`,
      authReasonVisualMismatch: '表面纹饰视觉指纹不匹配',
      authReasonCountryChange: (curr, reg) =>
        `保存国家变更（${curr} 对比 ${reg}）`,
      authMismatchDamage:
        '重大安防与档案风险：存在未经授权调换、账物不符或文物本体残损缺失的严重隐患。',
      authMismatchAction:
        '立即将文物封存于高安保专库，会同藏品总账管理员调取三维扫描模型与交接链档案进行司法级复核。',

      forecastSectionTitle: '2. 未来劣化风险前瞻预测矩阵（三大时间维度）',
      forecastSectionSub:
        '基于文物材质敏感度与当前核心基础环境偏差，科学推演短期物理冲击、中期湿热腐蚀与长期热化学老化概率：',
      kpiAuthenticityScore: '真伪核验可信度',
      kpiPredictedRiskIndex: '综合预测风险指数',
      lblRiskProbability: '预测受损风险概率',
      lblProjectedStability: '预测未来稳定度',
      lblPrimaryDriver: '核心致险驱动因素：',
      lblPredictedOutcome: '未来材质演化预测：',

      horizon72hLabel: '近期紧急窗口（24–72 小时）',
      horizon72hBadge: '急性微气候与机械冲击',
      horizon30dLabel: '中期演化窗口（30 天）',
      horizon30dBadge: '受潮变形与活性化学腐蚀',
      horizon12mLabel: '长期累积窗口（12 个月）',
      horizon12mBadge: '年度热化学与结构疲劳老化',

      driverNominal: '微气候平稳处于建档安全基准内',
      driverMoistureShock: '直接水汽结露与机械振动冲击叠加',
      driverThermalRhDrift: '日间温湿度剧烈波动引发物理应力',
      driverBioHumidity: '高湿环境持续超标，加速潮解与锈蚀风险',
      driverSaltMetalCorrosion: '可溶盐结晶循环与活性氯化物腐蚀',
      driverChronicThermalAging: '长期温湿偏高加速分子链热化学降解',

      outcome72hSafe: '近期物理结构与微环境完全稳定，无急性表面应力隐患。',
      outcome72hCaution: '若日均温湿波动持续，表层可能产生轻微吸湿膨胀疲劳。',
      outcome72hHazard:
        '极高近期风险：72 小时内可能发生表面结露水渍或微裂纹急剧扩展。',
      outcome30dSafe: '中期化学与物理结构稳定，无受潮变形或锈蚀活化迹象。',
      outcome30dCaution: '若温湿波动与微振持续，控湿稳定缓冲能力呈缓慢下降趋势。',
      outcome30dHazard: {
        stone_limestone: '预测 30 天内将出现明显盐霜析出及雕刻表层酥粉剥落。',
        metals_bronze: '预测数周内将激活恶性“粉状锈（青铜病）”点蚀扩散。',
        ceramics_glass: '预测古玻璃表面出现碱液析出及脆弱历史釉层边缘起翘。',
        manuscripts_pigments: '预测古籍纸张与羊皮纸发生波浪翘曲变形及纤维松动。',
        organic_wood_textile: '预测木质构件发生吸湿翘曲变形，纺织纤维受潮软化。',
      },
      outcome12mSafe: '达到国际博物馆一级预防性保护标准，全年结构与表面稳固。',
      outcome12mCaution: '若不及时收窄温差与振动，一年内将产生轻微累积热机械疲劳。',
      outcome12mHazard: {
        stone_limestone: '一年内浮雕精细纹饰将发生不可逆风化模糊与硬壳剥离。',
        metals_bronze: '珍贵原始皮壳（Patina）受损，氯化物腐蚀向金属深层穿透。',
        ceramics_glass: '形成永久性釉面开片裂网，脆弱釉层发生持续剥落。',
        manuscripts_pigments: '古籍纸页与羊皮纸发生严重发黄脆化及结构性断裂。',
        organic_wood_textile: '古代木器产生永久性结构劈裂，丝毛织物纤维断裂失强。',
      },

      reportHeaderTitle: '3. 真伪与核心环境指标基准对比表（高危风险红色标示）',
      reportHeaderSub:
        '逐项并列比对文物真伪、物理保存状况与核心基础环境指标，所有危险偏差均以醒目红色标出：',
      kpiBaselineScore: '建档基准稳定度',
      kpiCurrentScore: '当前实测稳定度',
      kpiRedHazardsCount: '红色高危风险项',
      kpiSafeMatchedCount: '安全达标项目数',

      verdictHazardTitle: (h) =>
        `紧急红色预警：检测到 ${h} 项危及文物真伪安全或本体保存的红色高危项！`,
      verdictHazardDesc: (title, h) =>
        `对文物「${title}」的综合核验发现 ${h} 项红色严重异常，请严格按下方响应时限立即执行创新保护方案。`,
      verdictCautionTitle: (c) =>
        `早期预防预警：检测到 ${c} 项轻度偏差需提前干预调控`,
      verdictCautionDesc: (title) =>
        `文物「${title}」总体受控，但风险预测显示局部参数存在漂移，建议提前精准微调。`,
      verdictSafeTitle: '真品核验通过且环境安全稳定 — 与建档基准完全吻合',
      verdictSafeDesc: (title) =>
        `文物「${title}」真伪身份已确认，当前实测值与未来三阶段风险预测均处于安全受控状态。`,

      colParam: '核验维度 / 环境指标',
      colRegistered: '建档认证基准',
      colCurrent: '当前核验与实测值',
      colDelta: '偏差量 (Δ)',
      colRiskStatus: '风险判定',

      badgeHazardRed: '✖ 红色高危风险',
      badgeCautionAmber: '▲ 预防性预警',
      badgeSafeGreen: '● 核验安全达标',

      rowConditionTitle: '本体物理保存状况',
      deltaMatched: '与建档一致 (0)',
      deltaDegraded: '物理保存状况恶化！',
      deltaImproved: '状况改善',

      urgentSectionTitle: '4. 创新预防性保护建议方案与国际标准证书导出',
      urgentSectionSub:
        '按优先级与响应时间窗结构化呈现保护决策卡片，红色标明潜在损伤，支持一键导出高分辨率 PDF 官方报告：',
      lblResponseWindow: '响应处置时限：',
      windowImmediate30m: '立即封存处置 (< 30 分钟)',
      windowUrgent2h: '紧急响应 (< 2 小时)',
      windowPriority6h: '高优先级 (< 6 小时)',
      windowPreventive24h: '预防调控 (< 24 小时)',
      windowRoutine30d: '周期巡检 (每 30 天)',

      exportShowcaseKicker:
        '国际文保官方档案 · INTERNATIONAL CONSERVATION DOSSIER',
      exportShowcaseTitle:
        '导出文物真伪核验证书、未来风险预测与紧急保护建议书 (PDF)',
      exportShowcaseDesc:
        '采用世界级博物馆版式设计（A4 · 200 DPI），完整收录真伪核验结论、72h/30d/12m 风险预测可视化条形图、红标对比矩阵与官方认证印章。',
      exportShowcaseFeatures:
        '真伪与质量核验 · 三阶段风险预测图 · 红标高危警示 · 官方文保签章',
      exportUrgentPdfBtn: '导出真伪核验、风险预测与国际保护建议 PDF',
      exportingUrgentPdfBtn: '正在排版生成国际保护建议 PDF...',

      lblPotentialDamage: '潜在受损风险（红色警示）：',
      lblImmediateAction: '创新预防性保护建议与执行方案：',
      priorityCriticalRed: '立即紧急干预 — 红色高危',
      priorityPreventiveAmber: '前瞻预防性调控',
      priorityRoutineSafe: '常态安全保护维持',

      condDamage:
        '微裂纹扩展、表层酥粉脱落，可能导致原始浮雕纹饰永久受损。',
      condAction:
        '立即停止一切搬动与直接接触，召集专职修复师在恒温恒湿舱内开展表面加固。',

      tempHighDamage: {
        stone_limestone: '热膨胀应力加剧可溶盐结晶，导致石刻表层起甲剥落。',
        metals_bronze: '化学氧化速率倍增，加速青铜与金属表面腐蚀变色。',
        ceramics_glass: '古陶瓷釉层受热应力不均产生细微惊纹开裂。',
        manuscripts_pigments: '古籍纸张与羊皮纸脆化发黄，纤维热化学降解加速。',
        organic_wood_textile: '有机纤维急剧失水收缩，引发木器开裂与织物脆断。',
      },
      tempLowDamage: '低温物理收缩并极易在文物冰冷表面引发水汽结露。',
      tempHighAction: (min, max) =>
        `以 ≤ 1°C/小时的缓降速率平稳回调展柜温度至（${min}–${max}°C），避免热冲击并隔离周边热源。`,
      tempLowAction: (min, max) =>
        `缓慢提升恒温系统温度至建档区间（${min}–${max}°C），同时严密监测露点以防结露。`,

      rhHighDamage: {
        stone_limestone: '孔隙内可溶盐潮解再结晶，撑裂风化雕刻表层。',
        metals_bronze: '诱发恶性“粉状锈（青铜病）”氯化物循环腐蚀，蚀穿金属本体。',
        ceramics_glass: '玻璃器发生碱析出（“哭泣病”）及描金釉彩剥离。',
        manuscripts_pigments: '霉菌孢子迅速萌发，古籍纸页波浪变形、墨迹晕染。',
        organic_wood_textile: '木质构件吸湿膨胀变形，丝毛织物发生微生物霉烂。',
      },
      rhLowDamage: {
        stone_limestone: '盐分急剧失水结晶导致石质表面硬壳起翘脱落。',
        metals_bronze: '金属器镶嵌绿松石或青金石等异质饰片干缩松动。',
        ceramics_glass: '脆弱低温釉层及早期修复粘接部位干裂起翘。',
        manuscripts_pigments: '羊皮纸与古籍纸页僵硬卷曲，纤维层干裂受损。',
        organic_wood_textile: '木器发生不可逆干缩劈裂，古代纺织纤维脆弱易断。',
      },
      rhHighAction: (min, max) =>
        `立即置入预调湿 ProSorb 硅胶盒并启动缓速除湿（≤ 2% RH/小时），恢复至（${min}–${max}% RH）。`,
      rhLowAction: (min, max) =>
        `立即补充预调湿控湿缓冲材料，平缓提升相对湿度至（${min}–${max}% RH）。`,

      moistureDamage:
        '直接受潮将迅速引发金属剧烈锈蚀、可溶盐析出及有机质结构软化坍塌。',
      moistureAction:
        '立即将文物安全转移至干燥过渡保护舱，彻底封堵渗水或冷凝源后再行展陈。',

      vibrationDamage:
        '机械振动与冲击会促使内部暗裂纹贯通扩展，导致脆弱残片移位或脱落。',
      vibrationAction:
        '立即在文物底座下方加装高分子减振隔震垫，并叫停周边一切施工冲击源。',

      allSafeDamageNote:
        '未检测到任何真伪异常或潜在损伤风险 — 全部核心基础环境指标均符合安全基准。',
      allSafeActionNote: (tMin, tMax, rhMin, rhMax) =>
        `继续保持环境稳定在 ${tMin}–${tMax}°C 与 ${rhMin}–${rhMax}% RH，并按季度执行馆藏真伪与质量复核。`,

      pdfDocKicker:
        'SMART GUARDIAN 智慧守护者 — 文物真伪核验、未来风险预测与紧急保护建议书',
      pdfDocTitle: '文物真伪核验证书、未来风险预测与创新保护建议报告',
      pdfDocSubtitle:
        '国际标准文保档案：涵盖真伪身份核验、三阶段劣化风险预测图、红标偏差对比表与分级处置方案',
      pdfSec1Title: '一、 文物真伪认证结论与三阶段未来风险预测矩阵',
      pdfSec2Title: '二、 真伪与核心基础环境指标基准对比总表（高危风险红色高亮）',
      pdfSec3Title: '三、 创新预防性保护紧急建议与分级响应时限',
      pdfSec4Title: '四、 现场核验记录与官方文保签章认证',
      pdfLblArtifact: '文物名称与年代',
      pdfLblCodeAndCountry: '档案号、馆藏号与国家',
      pdfLblAuthenticity: '文物真伪核验结论',
      pdfLblScoresComparison: '稳定度与预测风险',
      pdfForecastStripTitle: '未来劣化风险前瞻预测（72h · 30d · 12m）：',
      pdfRedAlertBanner: (c) =>
        `紧急红色警报：共检测到 ${c} 项真伪或环境红色高危风险，请按响应时限立即执行保护干预！`,
      pdfSafeBanner:
        '真品认证与安全达标：文物身份、质量及未来各阶段保存预测均符合国际博物馆标准。',
      pdfSealUrgentMain: '紧急红标干预',
      pdfSealSafeMain: '真品安全认证',
      pdfSealSub: 'SMART GUARDIAN',
      pdfSigInspectorTitle: '真伪与现场核验专家签字',
      pdfSigInspectorSub: '确认馆藏身份、实测质量及环境读数属实',
      pdfSigConservatorTitle: '预防性保护负责人签准',
      pdfSigConservatorSub: '督办按响应时间窗落实保护建议',
      pdfFooterDisclaimer:
        '本真伪核验、风险预测与保护建议官方档案由 Smart Guardian 签发 — 高危风险均已用红色醒目标出。',
      pdfPageOf: (c, t) => `第 ${c} 页 / 共 ${t} 页`,
    },

    ru: {
      lblCountryField: 'Страна',
      countrySortedHint: 'Страны мира в алфавитном порядке (А–Я)',
      jumpToVerifyBtn: 'Перейти к Шагу 04: Подлинность и прогноз рисков',

      regSubStep1Code: '3А',
      regSubStep1Label: 'Паспорт, страна и эталонная масса',
      regSubStep2Code: '3Б',
      regSubStep2Label: 'Безопасные нормы температуры и влажности',
      regSubStep3Code: '3В',
      regSubStep3Label: 'Базовые показатели среды и регистрация',
      regNextStepHint:
        'После сохранения записи перейдите к финальному Шагу 04 для проверки подлинности, прогноза рисков и экспорта рекомендаций в PDF.',

      sec4Kicker: (n) =>
        `Финальный Шаг 04 · Подлинность и прогноз рисков (объектов в базе: ${n})`,
      sec4Title:
        '04. Проверка подлинности артефакта, прогноз рисков и экспорт мировых рекомендаций',
      sec4Subtitle:
        'Проверьте подлинность памятника (инвентарный шифр, массу и визуальный отпечаток рельефа), спрогнозируйте риски на 3 горизонта времени, выделите угрозы красным и экспортируйте официальный PDF-протокол.',

      selectArtifactLabel:
        'Выберите зарегистрированный артефакт для проверки подлинности и прогноза:',
      cascadeSelectHint:
        'Выберите последовательно из списков: сначала Страну, затем Место, затем Артефакт:',
      cascadeStep1Country: '1. Страна',
      cascadeStep2Site: '2. Место / Музей',
      cascadeStep3Artifact: '3. Зарегистрированный артефакт',
      openVerifyCameraBtn: 'Открыть камеру проверки и голосовой обзор',
      closeVerifyCameraBtn: 'Закрыть камеру проверки',
      camVerifyKicker: 'ОПТИЧЕСКИЙ КОНТРОЛЬ · ГОЛОСОВОЙ СЕРВИС ПЛАТФОРМЫ',
      camVerifyTitle:
        'Камера прямой проверки и краткий голосовой обзор артефакта',
      camScanningStatus: 'Распознавание артефакта в объективе камеры...',
      camDetectedStatus:
        'Артефакт зафиксирован в камере — голосовой обзор активен',
      camOpticalFallbackNote:
        'Автоматически включён оптический видоискатель (физическая камера недоступна или нет разрешения).',
      camRetryHardwareBtn: 'Включить физическую камеру',
      camRescanSpeakBtn: 'Повторить захват и озвучивание',
      voicePanelBadgeSpeaking: 'Воспроизведение краткого голосового обзора...',
      voicePanelBadgeReady: 'Голосовой сервис активен',
      voicePlayBtn: 'Прослушать краткий обзор',
      voiceReplayBtn: 'Повторить озвучивание',
      voiceStopBtn: 'Остановить звук',
      voiceAutoToggleOn: 'Автоозвучивание при захвате: ВКЛ',
      voiceAutoToggleOff: 'Автоозвучивание при захвате: ВЫКЛ',
      voiceLblArtifact: 'Название артефакта',
      voiceLblCountryAndSite: 'Страна и местонахождение',
      voiceLblUltraBrief: 'Предельно краткая выжимка описания',
      voiceCertifiedDocNotice:
        'Вы можете получить все подробные сведения в виде сертифицированного печатного документа платформы.',
      voicePrintFullDocBtn:
        'Получить полный сертифицированный печатный документ (PDF)',
      voiceIssuingFullDocBtn: 'Формирование печатного документа...',
      voiceUnsupportedHint:
        'Прямой синтез речи недоступен в этом браузере; полный текст краткой справки приведён ниже.',
      emptyArchiveTitle: 'На платформе пока нет зарегистрированных артефактов',
      emptyArchiveDesc:
        'Платформа отображает исключительно те артефакты, которые вы регистрируете самостоятельно. Сделайте или загрузите 3+ снимка на Шаге 01 и сохраните паспорт на Шаге 03, чтобы активировать выбор «Страна → Место → Артефакт», голосовой обзор с камеры и прогноз рисков.',
      emptyArchiveGoStep1Btn: '01. Сделать или загрузить снимки',
      emptyArchiveGoStep3Btn: '03. Перейти к форме регистрации',
      camEmptyArchiveBadge: 'Ожидание первой регистрации артефакта',
      camEmptyArchiveNotice:
        'Камера готова — зарегистрированных артефактов для голосового обзора пока нет. Сначала сфотографируйте и зарегистрируйте объект на Шагах 01–03.',
      deleteArtifactBtn: 'Удалить артефакт',
      baselineCardTitle: 'Сертифицированный эталонный паспорт',
      baselineMetaLine: (code, inv, weightG, country, mat) =>
        `Код: ${code} · Инв: ${inv} · Масса: ${weightG}г · Страна: ${country} · Материал: ${mat}`,
      baselineSafeClimate: (tMin, tMax, rhMin, rhMax, sc) =>
        `Норма хранения: ${tMin}–${tMax}°C · ${rhMin}–${rhMax}% RH · Эталонная стабильность: ${sc}%`,

      inputPanelTitle:
        '1. Данные проверки подлинности и текущие показатели среды',
      inputPanelSub:
        'Введите данные сверки подлинности и текущие измерения или выберите готовый тестовый сценарий:',
      presetMatchSafeBtn: '100% Подлинность и безопасная норма',
      presetSimulateHazardBtn: 'Тест красных рисков и прогноза',
      presetSimulateAuthAlertBtn: 'Тест тревоги подлинности',
      runComparisonBtn: 'Проверить подлинность и рассчитать прогноз',

      authInputGroupTitle:
        'Часть А: Проверка подлинности и учётной идентичности артефакта',
      authInputGroupSub:
        'Сверка инвентарного номера, фактической массы (г) и 3D-отпечатка рельефа поверхности с учётной записью',
      lblVerifiedInventoryCode: (reg) =>
        `Сверяемый инвентарный шифр (Эталон: ${reg})`,
      lblMeasuredWeightGrams: (regW) =>
        `Измеренная масса в граммах (Эталон: ${regW}г)`,
      lblVisualFingerprint: 'Совпадение 3D-отпечатка рельефа поверхности',
      visualFingerprintOptions: {
        authentic_verified:
          'Полное совпадение 3D-рельефа поверхности с эталоном',
        minor_surface_variance:
          'Незначительное отличие поверхности — требуется сверка',
        mismatch_suspected:
          'Подозрение на несовпадение рельефа или идентичности!',
      },

      envInputGroupTitle:
        'Часть Б: Текущее место хранения, состояние и базовые показатели среды',
      lblInspectorName: 'Эксперт / Хранитель фонда',
      defaultInspectorName:
        'Служба экспертизы и превентивной консервации — Smart Guardian',
      lblCurrentCountry: 'Страна (текущее местонахождение)',
      lblCurrentLocation: 'Текущий зал или фондохранилище',
      lblObservedCondition: 'Наблюдаемое физическое состояние',
      lblFieldNotes: 'Заключение экспертизы и полевого осмотра',
      defaultFieldNoteHazard:
        'Подлинность артефакта подтверждена; зафиксировано опасное превышение влажности, температуры и вибрации с высоким прогнозом разрушения.',
      defaultFieldNoteSafe:
        'Подлинность, масса и визуальный профиль полностью подтверждены; все базовые показатели микроклимата стабильны.',
      defaultFieldNoteAuthAlert:
        'ТРЕВОГА ПОДЛИННОСТИ: выявлено расхождение инвентарного шифра, массы и поверхностного рельефа — требуется немедленная блокировка в спецхране.',

      lblCurrTemp: (min, max) =>
        `Текущая температура °C (Эталон: ${min}–${max}°C)`,
      lblCurrTempDrift: 'Суточный градиент T° (°C/сут)',
      lblCurrRh: (min, max) =>
        `Текущая влажность % (Эталон: ${min}–${max}%)`,
      lblCurrRhHours: 'Часов вне нормы влажности',
      lblCurrMoisture: 'Прямая влага и конденсат',
      lblCurrVibration: 'Пик вибрации (mm/s)',
      lblCurrShocks: 'Зафиксировано ударов',

      rowAuthenticityTitle:
        'Подлинность артефакта (Инв. шифр, масса и отпечаток)',
      authVerdictVerified: 'Подлинность подтверждена (100%)',
      authVerdictReview: 'Требуется документальная сверка',
      authVerdictMismatch: 'КРАСНАЯ ТРЕВОГА: Несовпадение подлинности!',
      authDetailVerified: (code, w) =>
        `Полное совпадение шифра (${code}), массы (${w}г) и визуального рельефа.`,
      authDetailReview: (dw, cNote) =>
        `Небольшое отклонение массы (${dw})${cNote ? ` · ${cNote}` : ''} — проверьте акт приёма-передачи.`,
      authDetailMismatch: (reasons) =>
        `Критическое нарушение подлинности: ${reasons}`,
      authReasonCodeMismatch: (ent, exp) =>
        `Несовпадение шифра (${ent} vs ${exp})`,
      authReasonMassMismatch: (dp) => `Отклонение массы (${dp})`,
      authReasonVisualMismatch: 'Несовпадение визуального отпечатка рельефа',
      authReasonCountryChange: (curr, reg) =>
        `Смена страны хранения (${curr} vs ${reg})`,
      authMismatchDamage:
        'Критическая угроза безопасности и учёта: риск несанкционированной подмены, ошибки атрибуции или утраты фрагмента массы.',
      authMismatchAction:
        'Немедленно изолировать предмет в опечатанном сейфе-хранилище и провести сверку 3D-скана и книги поступлений с главным хранителем.',

      forecastSectionTitle:
        '2. Матрица прогнозирования будущих рисков (3 временных горизонта)',
      forecastSectionSub:
        'Расчёт вероятности физической, влажностной и термической деградации с учётом класса материала и текущих отклонений:',
      kpiAuthenticityScore: 'Индекс подлинности',
      kpiPredictedRiskIndex: 'Индекс прогноза риска',
      lblRiskProbability: 'Вероятность риска',
      lblProjectedStability: 'Прогноз стабильности',
      lblPrimaryDriver: 'Ведущий фактор риска:',
      lblPredictedOutcome: 'Прогноз для материала:',

      horizon72hLabel: 'Краткосрочный (24–72 часа)',
      horizon72hBadge: 'Острый микроклимат и удары',
      horizon30dLabel: 'Среднесрочный (30 дней)',
      horizon30dBadge: 'Влажностная и химическая коррозия',
      horizon12mLabel: 'Долгосрочный (12 месяцев)',
      horizon12mBadge: 'Термическое и структурное старение',

      driverNominal: 'Стабильный музейный микроклимат в пределах эталона',
      driverMoistureShock: 'Прямой конденсат и механические ударные нагрузки',
      driverThermalRhDrift: 'Резкие суточные перепады температуры и влажности',
      driverBioHumidity: 'Высокая влажность, ускоряющая коррозию и деформацию',
      driverSaltMetalCorrosion: 'Кристаллизация солей и хлоридная коррозия',
      driverChronicThermalAging: 'Хроническое тепловое и влажностное старение',

      outcome72hSafe:
        'Полное физическое и климатическое равновесие без острых напряжений.',
      outcome72hCaution:
        'Лёгкое поверхностное напряжение при сохранении суточных колебаний.',
      outcome72hHazard:
        'Высокая угроза микротрещин или выпадения росы на поверхности в течение 72 часов.',
      outcome30dSafe:
        'Устойчивая химическая и структурная стабильность без коррозии.',
      outcome30dCaution:
        'Постепенное снижение стабильности микроклимата при сохранении колебаний.',
      outcome30dHazard: {
        stone_limestone:
          'Прогноз высолов и зернистого осыпания каменной резьбы в течение 30 дней.',
        metals_bronze:
          'Прогноз активации очагов «бронзовой болезни» (язвенной коррозии) за недели.',
        ceramics_glass:
          'Прогноз выщелачивания стекла и отслоения краёв исторической глазури.',
        manuscripts_pigments:
          'Прогноз коробления пергамена и ослабления структуры волокон.',
        organic_wood_textile:
          'Прогноз коробления древесины и влажностного ослабления волокон ткани.',
      },
      outcome12mSafe:
        'Сохранность мирового музейного уровня с неизменностью структуры на год.',
      outcome12mCaution:
        'Медленная термическая и механическая усталость без коррекции климата.',
      outcome12mHazard: {
        stone_limestone:
          'Необратимая утрата чёткости каменного рельефа и отслоение корки за 12 месяцев.',
        metals_bronze:
          'Разрушение благородной патины и глубокая структурная коррозия металла.',
        ceramics_glass:
          'Сетка необратимого цека глазури и отслоение глазурного слоя.',
        manuscripts_pigments:
          'Сильное пожелтение и структурная ломкость пергамена и бумаги.',
        organic_wood_textile:
          'Глубокие трещины древесины и потеря прочности нитей исторического текстиля.',
      },

      reportHeaderTitle:
        '3. Сводная матрица сравнения с эталоном (красная маркировка угроз)',
      reportHeaderSub:
        'Построчное сопоставление подлинности, физического состояния и базовых показателей среды с выделением угроз красным:',
      kpiBaselineScore: 'Эталон стабильности',
      kpiCurrentScore: 'Текущая стабильность',
      kpiRedHazardsCount: 'Красные угрозы',
      kpiSafeMatchedCount: 'Пунктов в норме',

      verdictHazardTitle: (h) =>
        `СРОЧНАЯ КРАСНАЯ ТРЕВОГА: выявлено критических угроз — ${h}!`,
      verdictHazardDesc: (title, h) =>
        `Проверка «${title}» выявила ${h} критических нарушений (выделены красным). Немедленно выполните протокол защиты ниже.`,
      verdictCautionTitle: (c) =>
        `Превентивное предупреждение: отклонений для коррекции — ${c}`,
      verdictCautionDesc: (title) =>
        `Объект «${title}» защищён, но прогноз указывает на умеренный дрейф параметров, требующий регулировки.`,
      verdictSafeTitle:
        'Подлинность подтверждена, состояние безопасно — 100% соответствие эталону',
      verdictSafeDesc: (title) =>
        `Подлинность «${title}» полностью подтверждена, текущие показатели и прогнозы находятся в безопасной зоне.`,

      colParam: 'Критерий / Показатель',
      colRegistered: 'Зарегистрированный эталон',
      colCurrent: 'Текущая проверка',
      colDelta: 'Отклонение (Δ)',
      colRiskStatus: 'Оценка риска',

      badgeHazardRed: '✖ КРАСНЫЙ РИСК',
      badgeCautionAmber: '▲ Внимание',
      badgeSafeGreen: '● Подтверждено',

      rowConditionTitle: 'Общее физическое состояние',
      deltaMatched: 'Соответствует (0)',
      deltaDegraded: 'Ухудшение состояния!',
      deltaImproved: 'Улучшение',

      urgentSectionTitle:
        '4. Инновационный протокол срочных рекомендаций и мировой PDF-экспорт',
      urgentSectionSub:
        'Карточки превентивных мер с регламентом времени реакции, выделением возможного ущерба красным и экспортом официального PDF:',
      lblResponseWindow: 'Регламент реакции:',
      windowImmediate30m: 'Немедленно (< 30 мин)',
      windowUrgent2h: 'Экстренно (< 2 часов)',
      windowPriority6h: 'Приоритетно (< 6 часов)',
      windowPreventive24h: 'Превентивно (< 24 часов)',
      windowRoutine30d: 'Планово (раз в 30 дней)',

      exportShowcaseKicker:
        'ОФИЦИАЛЬНОЕ МУЗЕЙНОЕ ДОСЬЕ · INTERNATIONAL CONSERVATION DOSSIER',
      exportShowcaseTitle:
        'Экспорт сертификата подлинности, прогноза рисков и рекомендаций (PDF)',
      exportShowcaseDesc:
        'Многостраничный официальный документ A4 (200 DPI): заключение о подлинности, шкала прогноза рисков (72ч / 30д / 12м), красная матрица отклонений и гербовая печать сохранения.',
      exportShowcaseFeatures:
        'Проверка подлинности · Прогноз 72ч / 30д / 12м · Красные риски · Официальная печать',
      exportUrgentPdfBtn:
        'Скачать сертификат подлинности, прогноз и рекомендации PDF',
      exportingUrgentPdfBtn: 'Формирование международного PDF-досье...',

      lblPotentialDamage: 'Возможный ущерб артефакту (Красный риск):',
      lblImmediateAction: 'Инновационная рекомендация и срочная мера:',
      priorityCriticalRed: 'НЕМЕДЛЕННАЯ ЗАЩИТА — КРАСНЫЙ РИСК',
      priorityPreventiveAmber: 'Упреждающая настройка',
      priorityRoutineSafe: 'Плановый режим сохранности',

      condDamage:
        'Развитие микротрещин, осыпание поверхностного слоя и риск утраты фрагментов рельефа.',
      condAction:
        'Немедленно прекратить любое перемещение предмета и вызвать реставратора в стабилизированный бокс.',

      tempHighDamage: {
        stone_limestone:
          'Термическое напряжение и ускоренная кристаллизация солей с отслоением камня.',
        metals_bronze:
          'Ускорение химического окисления и потускнения металлической поверхности.',
        ceramics_glass:
          'Термическое напряжение глазури и появление сетки микротрещин (цека).',
        manuscripts_pigments:
          'Пожелтение, пересыхание пергамена/бумаги и термическое ослабление волокон.',
        organic_wood_textile:
          'Резкое высыхание, усадка волокон и растрескивание древней древесины.',
      },
      tempLowDamage:
        'Холодное сжатие материала и высокий риск выпадения конденсата на охлаждённой поверхности.',
      tempHighAction: (min, max) =>
        `Плавно снизить температуру (≤ 1°C/час без термошока) до (${min}–${max}°C) и изолировать источники тепла.`,
      tempLowAction: (min, max) =>
        `Медленно поднять температуру до эталона (${min}–${max}°C), контролируя точку росы.`,

      rhHighDamage: {
        stone_limestone:
          'Растворение и перекристаллизация солей в порах, разрушающая каменную резьбу.',
        metals_bronze:
          'Активация «бронзовой болезни» — очаговой хлоридной коррозии металла.',
        ceramics_glass:
          'Выщелачивание стекла («плачущее стекло») и отслоение позолоты.',
        manuscripts_pigments:
          'Быстрый рост плесневых грибов, коробление листов и расплывание чернил.',
        organic_wood_textile:
          'Разбухание и деформация дерева, биопоражение исторического текстиля.',
      },
      rhLowDamage: {
        stone_limestone:
          'Резкая кристаллизация солей с отрывом поверхностной корки камня.',
        metals_bronze:
          'Растрескивание инкрустаций, сопряжённых с металлической основой.',
        ceramics_glass:
          'Шелушение хрупкой глазури и старых реставрационных швов.',
        manuscripts_pigments:
          'Охрупчивание пергамена и растрескивание древних листов.',
        organic_wood_textile:
          'Необратимая усадка, трещины в древесине и ломкость нитей ткани.',
      },
      rhHighAction: (min, max) =>
        `Немедленно поместить кондиционированный силикагель ProSorb и плавно снизить влажность до (${min}–${max}% RH).`,
      rhLowAction: (min, max) =>
        `Ввести увлажнённый буферный сорбент для плавного возврата влажности к (${min}–${max}% RH).`,

      moistureDamage:
        'Критическая угроза быстрой коррозии, высолов и размягчения структуры от прямой влаги.',
      moistureAction:
        'Экстренно переместить артефакт в сухую климатическую камеру и устранить источник влаги.',

      vibrationDamage:
        'Механическое раскрытие скрытых трещин и смещение хрупких деталей на креплении.',
      vibrationAction:
        'Немедленно установить эластомерные виброизоляторы под подиум и остановить ударные работы рядом.',

      allSafeDamageNote:
        'Угроз не выявлено — подлинность артефакта и все базовые параметры среды полностью соответствуют норме.',
      allSafeActionNote: (tMin, tMax, rhMin, rhMax) =>
        `Продолжать плановый мониторинг в диапазоне ${tMin}–${tMax}°C и ${rhMin}–${rhMax}% RH с ежеквартальной сверкой подлинности.`,

      pdfDocKicker:
        'ПЛАТФОРМА SMART GUARDIAN — СЕРТИФИКАТ ПОДЛИННОСТИ, ПРОГНОЗ РИСКОВ И РЕКОМЕНДАЦИИ',
      pdfDocTitle:
        'Сертификат подлинности артефакта, прогноз рисков и срочные рекомендации',
      pdfDocSubtitle:
        'Международное досье: экспертиза подлинности, прогноз деградации на 3 горизонта, красная таблица рисков и план защиты',
      pdfSec1Title:
        'I. Заключение о подлинности и матрица прогноза рисков (72ч · 30д · 12м)',
      pdfSec2Title:
        'II. Сводная таблица сравнения с эталоном (угрозы выделены красным)',
      pdfSec3Title:
        'III. Инновационный протокол срочных рекомендаций и сроки реакции',
      pdfSec4Title:
        'IV. Полевое заключение и официальное заверение сохранности',
      pdfLblArtifact: 'Артефакт и период',
      pdfLblCodeAndCountry: 'Код, инв. шифр и страна',
      pdfLblAuthenticity: 'Экспертиза подлинности',
      pdfLblScoresComparison: 'Стабильность и риск',
      pdfForecastStripTitle: 'Прогноз будущих рисков деградации:',
      pdfRedAlertBanner: (c) =>
        `СРОЧНАЯ КРАСНАЯ ТРЕВОГА: выявлено критических угроз — ${c}! Требуется немедленное выполнение мер!`,
      pdfSafeBanner:
        'СЕРТИФИКАТ СООТВЕТСТВИЯ: подлинность, масса и все горизонты сохранности подтверждены.',
      pdfSealUrgentMain: 'СРОЧНАЯ ЗАЩИТА',
      pdfSealSafeMain: 'ПОДЛИННИК В НОРМЕ',
      pdfSealSub: 'SMART GUARDIAN',
      pdfSigInspectorTitle: 'Подпись эксперта по проверке подлинности',
      pdfSigInspectorSub: 'Подтверждение шифра, массы и полевых измерений',
      pdfSigConservatorTitle: 'Виза главного хранителя',
      pdfSigConservatorSub: 'Контроль исполнения регламента реакции',
      pdfFooterDisclaimer:
        'Официальное досье подлинности, прогноза рисков и рекомендаций Smart Guardian — угрозы выделены КРАСНЫМ.',
      pdfPageOf: (c, t) => `Стр. ${c} из ${t}`,
    },
  };
