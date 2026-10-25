import { LocaleCode } from '../types/artifact';

export interface LanguageOption {
  code: LocaleCode;
  nativeLabel: string;
  regionTag: string;
  dir: 'rtl' | 'ltr';
  htmlLang: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'ar',
    nativeLabel: 'العربية',
    regionTag: 'AR',
    dir: 'rtl',
    htmlLang: 'ar',
  },
  {
    code: 'en-US',
    nativeLabel: 'English (US)',
    regionTag: 'US',
    dir: 'ltr',
    htmlLang: 'en-US',
  },
  {
    code: 'fr',
    nativeLabel: 'Français',
    regionTag: 'FR',
    dir: 'ltr',
    htmlLang: 'fr',
  },
  {
    code: 'zh',
    nativeLabel: '中文',
    regionTag: 'ZH',
    dir: 'ltr',
    htmlLang: 'zh-CN',
  },
  {
    code: 'ru',
    nativeLabel: 'Русский',
    regionTag: 'RU',
    dir: 'ltr',
    htmlLang: 'ru',
  },
];

export interface UIStrings {
  pageTitle: string;
  brandName: string;
  navCapture: string;
  navSpatial: string;
  navCultures: string;
  navArchive: string;
  ctaNewArtifact: string;
  editionLanguageLabel: string;

  heroBrandLockup: string;
  heroKicker1: string;
  heroKicker2: string;
  heroKicker3: string;
  heroTitle: string;
  heroLead: string;
  heroPrimaryBtn: string;
  heroSecondaryBtn: string;
  heroFallbackTitle: string;
  heroFallbackSub: string;
  heroScrimCaption: string;
  heroFigCaption: string;

  workflowSectionTitle: string;
  workflowSectionSub: string;
  stepGoAction: string;
  stepLiveAnglesStatus: (count: number) => string;
  stepLiveLightStatus: (pct: number) => string;
  stepLiveCoverageStatus: (pct: number) => string;
  stepLiveArchiveStatus: (count: number) => string;

  step1Label: string;
  step1Title: string;
  step1Desc: string;
  step2Label: string;
  step2Title: string;
  step2Desc: string;
  step3Label: string;
  step3Title: string;
  step3Desc: string;
  step4Label: string;
  step4Title: string;
  step4Desc: string;

  sec1Kicker1: string;
  sec1Kicker2: string;
  sec1Kicker3: string;
  sec1Title: string;
  tabLiveCamera: string;
  tabUploadPhotos: string;
  presetBannerBold: string;
  presetBannerText: string;
  presetIncenseBtn: string;
  presetAstrolabeBtn: string;
  presetSilkEwerBtn: string;

  chooseDirectionLabel: string;
  liveCameraHeading: string;
  liveCameraDesc: string;
  startLiveCameraBtn: string;
  startSimulatorBtn: string;
  cameraUnsupportedErr: string;
  cameraPermissionErr: string;
  telemetryLight: string;
  telemetrySharpness: string;
  switchLensBtn: string;
  mirrorBtn: string;
  switchSimModelBtn: string;
  hideGridBtn: string;
  showGridBtn: string;
  stopStreamBtn: string;
  captureAnglePrefix: string;

  dropzoneTitle: string;
  dropzoneDesc: string;
  dropzoneBtn: string;
  invalidFileNotice: string;
  addedBelowMinNotice: (added: number, remaining: number) => string;
  addedCompleteNotice: (total: number) => string;

  trayTitle: string;
  trayCountSub: (count: number) => string;
  clearAllBtn: string;
  minMetStatus: string;
  minRemainingStatus: (rem: number) => string;
  minUnlockedNote: string;
  open3DStudioBtn: string;
  emptyTrayTitle: string;
  emptyTrayDesc: string;
  sourceCamera: string;
  sourceUpload: string;
  sourcePreset: string;
  deleteAngleAria: string;
  lightboxMeta: (w: number, h: number, sharp: number, bright: number) => string;
  closePreviewAria: string;

  sec2Kicker1: string;
  sec2Kicker2: string;
  sec2Kicker3: (cov: number) => string;
  sec2Title: string;
  mode3DLabBtn: string;
  mode2DScrubberBtn: string;
  gateCurrentAngles: (count: number) => string;
  gateTitle: string;
  gateDesc: string;
  gateBackBtn: string;
  scrubberCounter: (idx: number, total: number) => string;
  scrubberHint: string;
  viewportOrbitHint: string;
  showDockBtn: string;
  hideDockBtn: string;
  volumetricModeBtn: string;
  reliefModeBtn: string;
  finishOriginal: string;
  finishLimestone: string;
  finishBronze: string;
  reliefDepthLabel: string;
  resetViewBtn: string;

  kpi1Label: string;
  kpi1DistinctSuffix: (dirs: number) => string;
  kpi2Label: string;
  kpi3Label: string;
  kpi4Label: string;

  sec3Kicker1: string;
  sec3Kicker2: string;
  sec3Title: string;

  selectCorridorLabel: string;
  mapHeaderTitle: string;
  mapHeaderSub: string;
  civilizationsTerm: string;
  techniquesTerm: string;

  passportTitle: string;
  passportDesc: string;
  fieldArtifactName: string;
  fieldPeriod: string;
  fieldMaterial: string;
  fieldDimensions: string;
  fieldRegion: string;
  fieldCultures: string;
  fieldTeamName: string;
  fieldNotes: string;
  saveToArchiveBtn: (count: number) => string;
  exportPdfBtn: string;
  exportingPdfBtn: string;
  exportPngBtn: string;
  exportingBtn: string;
  exportJsonBtn: string;
  errNeed3BeforeSave: string;
  savedSuccessMsg: (code: string) => string;

  sec4Kicker1: string;
  sec4Kicker2: (n: number) => string;
  sec4Title: string;
  sec4Note: string;
  anglesDocumentedUnit: (n: number) => string;
  inspectIn3DBtn: string;
  cardPdfBtn: string;
  cardBtn: string;

  passportHeaderBanner: (code: string) => string;
  passportMetricsValue: (angles: number, cov: number, illum: number) => string;
  passportIssuedDate: (dateStr: string) => string;

  footerTagline: string;
}

export const UI_STRINGS: Record<LocaleCode, UIStrings> = {
  ar: {
    pageTitle:
      'الحارس الذكي | Smart Guardian — المنصة الدولية للمسح الأثري والتقاء الثقافات',
    brandName: 'الحارس الذكي | Smart Guardian',
    navCapture: '٠١. التصوير والرفع',
    navSpatial: '٠٢. المجسم ٣D',
    navCultures: '٠٣. تسجيل القطعة',
    navArchive: '٠٤. الأصالة والتنبؤ بالمخاطر',
    ctaNewArtifact: 'قطعة جديدة',
    editionLanguageLabel: 'اللغة:',

    heroBrandLockup: 'الحارس الذكي · Smart Guardian',
    heroKicker1: 'مسح بصري متعدد الاتجاهات',
    heroKicker2: 'التوثيق البيئي الوقائي',
    heroKicker3: 'التحقق والتنبؤ بالمخاطر',
    heroTitle: 'الحارس الذكي (Smart Guardian): منظومة متكاملة لتوثيق الآثار والتنبؤ بمخاطرها',
    heroLead:
      'مسار هادئ ومنظّم يبدأ بالتقاط ٣ صور فأكثر ومعاينة المجسم ثلاثي الأبعاد، مروراً بتسجيل هوية القطعة ومؤشراتها البيئية الأساسية، وصولاً إلى التحقق من صحتها والتنبؤ بالمخاطر وتصدير التوصيات المعتمدة.',
    heroPrimaryBtn: 'ابدأ خطوات التوثيق',
    heroSecondaryBtn: 'التحقق والتنبؤ بالمخاطر',
    heroFallbackTitle: 'مختبر الحارس الذكي البصري',
    heroFallbackSub: '٠° · ٩٠° · ١٨٠° · ٢٧٠° · علوي',
    heroScrimCaption: 'توثيق بصري وبيئي متكامل لحماية التراث الإنساني من المخاطر المتوقعة.',
    heroFigCaption: 'قوس المسح البصري متعدد الزوايا في منصة الحارس الذكي.',

    workflowSectionTitle: 'مسار الحارس الذكي في أربع خطوات متسلسلة',
    workflowSectionSub: 'رحلة توثيق هادئة ومترابطة تبدأ بالمسح البصري وتنتهي بالتحقق من صحة القطعة والتنبؤ بالمخاطر:',
    stepGoAction: 'انتقال للخطوة',
    stepLiveAnglesStatus: (count) =>
      count >= 3 ? `مكتمل (${count}/3+)` : `${count}/3 صور`,
    stepLiveLightStatus: (pct) => `إضاءة ${pct}%`,
    stepLiveCoverageStatus: (pct) => `تغطية ${pct}%`,
    stepLiveArchiveStatus: (count) => `${count} قطع مسجلة`,

    step1Label: 'الخطوة ٠١',
    step1Title: 'التصوير أو رفع ٣+ صور',
    step1Desc: 'التقط مباشرة بالكاميرا أو ارفع ٣ صور على الأقل من اتجاهات مختلفة.',
    step2Label: 'الخطوة ٠٢',
    step2Title: 'المعاينة المكانية ٣D والتضاريس',
    step2Desc: 'استعرض المجسم ثلاثي الأبعاد وتضاريس النقش من الزوايا الملتقطة.',
    step3Label: 'الخطوة ٠٣',
    step3Title: 'تسجيل القطعة والمؤشرات البيئية الأساسية',
    step3Desc: 'وثّق هوية القطعة والدولة وحدّد المؤشرات البيئية الأساسية المناسبة لها.',
    step4Label: 'الخطوة ٠٤ · الختام',
    step4Title: 'التحقق من صحة القطعة والتنبؤ بالمخاطر',
    step4Desc: 'طابق أصالة القطعة، وتنبّأ بالمخاطر المستقبلية بالأحمر، وصدّر وثيقة التوصيات PDF.',

    sec1Kicker1: 'الخطوة ٠١',
    sec1Kicker2: 'الحد الأدنى: ٣ صور للقطعة',
    sec1Kicker3: '٦ اتجاهات',
    sec1Title: '٠١. التصوير المباشر أو رفع الصور',
    tabLiveCamera: 'الكاميرا المباشرة',
    tabUploadPhotos: 'رفع الصور (٣+)',
    presetBannerBold: 'نماذج جاهزة للتجربة السريعة:',
    presetBannerText: 'اختر نموذجاً مكتملاً بـ ٤ زوايا أو أضف صورك الخاصة.',
    presetIncenseBtn: 'مبخرة طريق البخور (٤ زوايا)',
    presetAstrolabeBtn: 'إسطرلاب قرطبة – بغداد (٤ زوايا)',
    presetSilkEwerBtn: 'إبريق طريق الحرير (٤ زوايا)',

    chooseDirectionLabel: 'حدد زاوية التصوير حول القطعة الأثرية:',
    liveCameraHeading: 'عدسة الحارس الذكي للتصوير متعدد الاتجاهات',
    liveCameraDesc:
      'شغّل كاميرا جهازك لالتقاط ٣ زوايا أو أكثر للقطعة الأثرية مباشرة، أو فعّل محاكي ذراع المسح البصري لتجربة الالتقاط الحيّ بدون كاميرا خارجية.',
    startLiveCameraBtn: 'تشغيل الكاميرا المباشرة',
    startSimulatorBtn: 'تشغيل محاكي المسح البصري',
    cameraUnsupportedErr:
      'متصفح العرض الحالي لا يدعم الوصول المباشر للكاميرا؛ يمكنك تفعيل محاكي المسح البصري أو رفع الصور مباشرة.',
    cameraPermissionErr:
      'تعذّر فتح الكاميرا الفعلية (قد يكون الإذن غير ممنوح أو لا توجد عدسة متصلة). يمكنك استخدام محاكي المسح المباشر أدناه أو رفع ٣ صور فأكثر.',
    telemetryLight: 'إضاءة',
    telemetrySharpness: 'حدّة',
    switchLensBtn: 'تبديل العدسة',
    mirrorBtn: 'عكس الصورة',
    switchSimModelBtn: 'تبديل المجسم المحاكى',
    hideGridBtn: 'إخفاء الشبكة',
    showGridBtn: 'إظهار الشبكة',
    stopStreamBtn: 'إيقاف البث',
    captureAnglePrefix: 'التقاط',

    dropzoneTitle: 'اسحب وأفلت صور القطعة الأثرية هنا (لا تقل عن ٣ صور)',
    dropzoneDesc:
      'ارفع ٣ صور أو أكثر ملتقطة من اتجاهات مختلفة (الأمام، اليمين، الخلف، اليسار، المسقط العلوي) لتفعيل نظام الحارس الذكي ثلاثي الأبعاد.',
    dropzoneBtn: 'اختيار ٣ صور أو أكثر من الجهاز',
    invalidFileNotice: 'يرجى اختيار ملفات صور صالحة بصيغة JPG أو PNG أو WebP.',
    addedBelowMinNotice: (added, rem) =>
      `تمت إضافة ${added} صورة بنجاح. يشترط الحارس الذكي ٣ صور على الأقل للقطعة الأثرية (متبقٍ ${rem}).`,
    addedCompleteNotice: (total) =>
      `اكتمل نصاب الصور (${total} زوايا موثقة) — انتقل الآن للخطوة التالية لفحص المجسم ثلاثي الأبعاد.`,

    trayTitle: 'سجل الاتجاهات الملتقطة والمرفوعة',
    trayCountSub: (count) => `${count} صور مسجلة · الحد الأدنى الإلزامي: ٣ زوايا فأكثر`,
    clearAllBtn: 'مسح الكل',
    minMetStatus: 'اكتمل شرط الزوايا الثلاث (جاهز للخطوة ٣)',
    minRemainingStatus: (rem) => `متبقٍ ${rem} صور لإتمام الحد الأدنى (٣ صور)`,
    minUnlockedNote: 'تم تفعيل المختبر المكاني ثلاثي الأبعاد وتضاريس السطح.',
    open3DStudioBtn: 'انتقل للخطوة ٣: المعاينة ٣D',
    emptyTrayTitle: 'لم تُلتقط أو تُرفع أي زاوية بعد',
    emptyTrayDesc:
      'ابدأ بالخطوة الأولى عبر التقاط ٣ صور مباشرة من اتجاهات مختلفة، أو رفع ٣ صور على الأقل للقطعة الأثرية.',
    sourceCamera: 'التقاط مباشر',
    sourceUpload: 'ملف مرفوع',
    sourcePreset: 'نموذج معياري',
    deleteAngleAria: 'حذف هذه الزاوية',
    lightboxMeta: (w, h, s, b) =>
      `الأبعاد ${w}×${h} بكسل · مؤشر الحدّة ${s}% · الإضاءة ${b}%`,
    closePreviewAria: 'إغلاق المعاينة',

    sec2Kicker1: 'الخطوة ٠٢ و ٠٣ · البناء المكاني والفحص التضاريسي',
    sec2Kicker2: 'محاكاة قوس المسح الروبوتي في الحارس الذكي',
    sec2Kicker3: (cov) => `تغطية زاوية ${cov}%`,
    sec2Title: '٠٢. مختبر الحارس الذكي للمعاينة المكانية وتضاريس السطح',
    mode3DLabBtn: 'المختبر ثلاثي الأبعاد',
    mode2DScrubberBtn: 'الفحص المداري للزوايا',
    gateCurrentAngles: (count) => `الزوايا الحالية: ${count} من ٣ زوايا إلزامية كحد أدنى`,
    gateTitle: 'يتطلب مختبر الحارس الذكي التقاط أو رفع ٣ صور على الأقل للقطعة الأثرية',
    gateDesc:
      'أكمل الخطوة الأولى في الأعلى بالتقاط صور مباشرة من اتجاهات متعددة أو رفع ٣ صور على الأقل لبناء المجسم وتضاريس النقش.',
    gateBackBtn: 'العودة للخطوة ٠١: الالتقاط والرفع',
    scrubberCounter: (idx, total) => `زاوية ${idx} من ${total}`,
    scrubberHint: 'اسحب للتدوير المداري بين الاتجاهات الملتقطة',
    viewportOrbitHint: 'اسحب للتدوير المداري ٣٦٠° · عجلة الفأرة للتقريب',
    showDockBtn: 'إظهار أدوات المختبر',
    hideDockBtn: 'إخفاء الأدوات',
    volumetricModeBtn: 'المجسم متعدد الأوجه',
    reliefModeBtn: 'التضاريس البارزة للنقش',
    finishOriginal: 'اللون الأصلي للقطعة',
    finishLimestone: 'حجر جيري أثري',
    finishBronze: 'برونز مطروق',
    reliefDepthLabel: 'عمق البروز',
    resetViewBtn: 'إعادة ضبط المنظور',

    kpi1Label: 'إجمالي الاتجاهات الموثقة',
    kpi1DistinctSuffix: (dirs) => `(${dirs} محاور متمايزة)`,
    kpi2Label: 'التغطية المحيطية للقطعة',
    kpi3Label: 'تجانس الإضاءة بين الزوايا',
    kpi4Label: 'كثافة النقوش والحواف البارزة',

    sec3Kicker1: 'الخطوة ٠٣ · التوثيق والحفظ الوقائي',
    sec3Kicker2: 'المؤشرات البيئية الأساسية وإصدار بطاقة الحارس الذكي',
    sec3Title: '٠٣. القطعة الأثرية والمؤشرات البيئية الأساسية',

    selectCorridorLabel: 'اختر المسار التاريخي المرتبط بالقطعة الموثقة:',
    mapHeaderTitle: 'مخطط محطات التلاقي والتبادل الثقافي',
    mapHeaderSub: 'اتصال الحواضر الأثرية',
    civilizationsTerm: 'الحضارات المتلاقية',
    techniquesTerm: 'التقنيات والفنون المشتركة',

    passportTitle: 'إصدار وثيقة «الحارس الذكي — Smart Guardian» الرقمية',
    passportDesc:
      'سجّل بيانات القطعة الأثرية وصلتها بمحور التقاء الثقافات لحفظها في سجل الحارس الذكي وتصدير البطاقة المعتمدة.',
    fieldArtifactName: 'اسم القطعة الأثرية',
    fieldPeriod: 'الحقبة التاريخية',
    fieldMaterial: 'مادة الصنع',
    fieldDimensions: 'الأبعاد التقريبية',
    fieldRegion: 'موقع الاكتشاف أو المحفوظات',
    fieldCultures: 'الثقافات المتلاقية في القطعة',
    fieldTeamName: 'فريق التوثيق والبرمجة',
    fieldNotes: 'مظاهر التقاء الثقافات والملاحظات البحثية',
    saveToArchiveBtn: (n) => `تسجيل واعتماد القطعة للمقارنة (${n} زوايا)`,
    exportPdfBtn: 'تصدير التقرير الرسمي الكامل PDF',
    exportingPdfBtn: 'جارٍ إعداد التقرير PDF...',
    exportPngBtn: 'تنزيل بطاقة الحارس الذكي PNG',
    exportingBtn: 'جارٍ التصدير...',
    exportJsonBtn: 'تصدير JSON',
    errNeed3BeforeSave:
      'يرجى استيفاء ٣ صور على الأقل للقطعة الأثرية من اتجاهات متعددة قبل التوثيق أو التصدير.',
    savedSuccessMsg: (code) =>
      `تم تسجيل القطعة بنجاح برقم مرجعي ${code} — جاهزة الآن للتحقق والمقارنة.`,

    sec4Kicker1: 'الأرشيف المعتمد · القطع المحمية متعدّدة الزوايا',
    sec4Kicker2: (n) => `${n} قطع موثقة`,
    sec4Title: '٠٤. سجل «الحارس الذكي» للقطع الأثرية الموثقة',
    sec4Note:
      'كل قطعة محفوظة أدناه تستوفي شرط التوثيق من ٣ اتجاهات فأكثر، ويمكن معاينتها أو تصدير تقريرها الرسمي الكامل بصيغة PDF بنقرة واحدة.',
    anglesDocumentedUnit: (n) => `${n} زوايا موثقة`,
    inspectIn3DBtn: 'معاينة في المختبر ٣D',
    cardPdfBtn: 'تقرير PDF',
    cardBtn: 'البطاقة PNG',

    passportHeaderBanner: (code) =>
      `وثيقة الحارس الذكي (SMART GUARDIAN) · المعهد الديني (التقاء الثقافات) · ${code}`,
    passportMetricsValue: (a, c, i) =>
      `${a} زوايا موثقة · تغطية محيطية ${c}% · تجانس إضاءة ${i}%`,
    passportIssuedDate: (d) => `تاريخ الإصدار الرقمي (Smart Guardian): ${d}`,

    footerTagline:
      'منصة التوثيق والحماية الأثرية متعددة الاتجاهات — المعهد الديني (التقاء الثقافات 2026 - 2027)',
  },

  'en-US': {
    pageTitle:
      'Smart Guardian — Multi-Angle Artifact Preservation & Cultural Crossroads',
    brandName: 'Smart Guardian',
    navCapture: '01. Capture & Upload',
    navSpatial: '02. 3D View',
    navCultures: '03. Register Artifact',
    navArchive: '04. Authenticity & Risk',
    ctaNewArtifact: 'New Artifact',
    editionLanguageLabel: 'Language:',

    heroBrandLockup: 'Smart Guardian · Global Heritage Preservation',
    heroKicker1: 'Multi-Angle Optical Scan',
    heroKicker2: 'Essential Environmental Indicators',
    heroKicker3: 'Authenticity & Risk Forecast',
    heroTitle: 'Smart Guardian: Serene Multi-Angle Documentation & Predictive Protection',
    heroLead:
      'A calm, structured four-stage workflow: capture 3+ views, inspect 3D surface topography, register provenance and essential environmental indicators, and verify artifact authenticity with red-flagged risk forecasting and PDF recommendations.',
    heroPrimaryBtn: 'Start Documentation',
    heroSecondaryBtn: 'Authenticity & Risk Forecast',
    heroFallbackTitle: 'Smart Guardian Optical Lab',
    heroFallbackSub: '0° · 90° · 180° · 270° · Top',
    heroScrimCaption: 'Non-contact optical fingerprinting and predictive conservation science.',
    heroFigCaption: 'Smart Guardian multi-angle optical scanning gantry.',

    workflowSectionTitle: 'Four Harmonized Conservation Stages',
    workflowSectionSub: 'A cohesive workflow from optical capture to authenticity verification, risk prediction, and executive PDF recommendations:',
    stepGoAction: 'Open Stage',
    stepLiveAnglesStatus: (count) =>
      count >= 3 ? `Ready (${count}/3+)` : `${count}/3 photos`,
    stepLiveLightStatus: (pct) => `Light ${pct}%`,
    stepLiveCoverageStatus: (pct) => `Coverage ${pct}%`,
    stepLiveArchiveStatus: (count) => `${count} Registered`,

    step1Label: 'Stage 01',
    step1Title: 'Capture or Upload 3+ Photos',
    step1Desc: 'Take live multi-angle photos or upload at least 3 distinct views.',
    step2Label: 'Stage 02',
    step2Title: '3D Model & Surface Relief',
    step2Desc: 'Inspect the 3D multi-angle projection and carving topography.',
    step3Label: 'Stage 03',
    step3Title: 'Register Artifact & Essential Indicators',
    step3Desc: 'Record provenance, world country, and essential environmental benchmarks.',
    step4Label: 'Stage 04 · Finale',
    step4Title: 'Authenticity, Risk Forecast & PDF',
    step4Desc: 'Verify artifact authenticity, forecast future hazards in red, and export PDF recommendations.',

    sec1Kicker1: 'Step 01',
    sec1Kicker2: 'Minimum: 3 Photos',
    sec1Kicker3: '6 Directions',
    sec1Title: '01. Live Capture or Photo Upload',
    tabLiveCamera: 'Live Camera',
    tabUploadPhotos: 'Upload Photos (3+)',
    presetBannerBold: 'Quick Ready Samples:',
    presetBannerText: 'Load a 4-angle sample in one click or add your own photos.',
    presetIncenseBtn: 'Incense Route Burner (4 Angles)',
    presetAstrolabeBtn: 'Cordoba–Baghdad Astrolabe (4 Angles)',
    presetSilkEwerBtn: 'Silk Road Cobalt Ewer (4 Angles)',

    chooseDirectionLabel: 'Select camera azimuth around the artifact:',
    liveCameraHeading: 'Smart Guardian Live Multi-Direction Lens',
    liveCameraDesc:
      'Start your device camera to capture 3 or more angles directly, or launch the Robotic Optical Turntable Simulator for live multi-angle capture without an external webcam.',
    startLiveCameraBtn: 'Start Live Camera',
    startSimulatorBtn: 'Launch Optical Simulator',
    cameraUnsupportedErr:
      'Direct camera streaming is unavailable in this browser context; use the Optical Simulator or upload photos.',
    cameraPermissionErr:
      'Unable to open physical camera (permission denied or no lens attached). Use the live Optical Simulator below or upload 3+ photos.',
    telemetryLight: 'Light',
    telemetrySharpness: 'Sharpness',
    switchLensBtn: 'Switch Lens',
    mirrorBtn: 'Mirror Flip',
    switchSimModelBtn: 'Switch Simulated Artifact',
    hideGridBtn: 'Hide Reticle',
    showGridBtn: 'Show Reticle',
    stopStreamBtn: 'Stop Stream',
    captureAnglePrefix: 'Capture',

    dropzoneTitle: 'Drag & Drop Artifact Photos Here (Minimum 3 Photos)',
    dropzoneDesc:
      'Upload 3 or more high-resolution photos taken from distinct angles (Front, Right, Back, Left, Top Zenith) to activate Smart Guardian 3D reconstruction.',
    dropzoneBtn: 'Select 3 or More Photos from Device',
    invalidFileNotice: 'Please select valid image files (JPG, PNG, or WebP).',
    addedBelowMinNotice: (added, rem) =>
      `Added ${added} photo(s). Smart Guardian requires at least 3 photos per artifact (${rem} more needed).`,
    addedCompleteNotice: (total) =>
      `Minimum threshold met (${total} verified angles) — proceed to Step 3 to inspect the 3D spatial model.`,

    trayTitle: 'Captured & Uploaded Angle Registry',
    trayCountSub: (count) => `${count} registered view(s) · Mandatory threshold: 3+ angles`,
    clearAllBtn: 'Clear All',
    minMetStatus: '3-Angle Threshold Complete (Ready for Step 3)',
    minRemainingStatus: (rem) => `${rem} more photo(s) required to reach 3-photo minimum`,
    minUnlockedNote: 'Smart Guardian 3D Lab and surface relief topography are unlocked.',
    open3DStudioBtn: 'Go to Step 3: 3D Preview',
    emptyTrayTitle: 'No artifact angles captured or uploaded yet',
    emptyTrayDesc:
      'Begin Step 1 by capturing at least 3 live photos from different directions, or uploading 3 or more photos from your device.',
    sourceCamera: 'Live Camera',
    sourceUpload: 'Uploaded File',
    sourcePreset: 'Reference Set',
    deleteAngleAria: 'Remove this angle',
    lightboxMeta: (w, h, s, b) =>
      `Dimensions ${w}×${h} px · Sharpness ${s}% · Illumination ${b}%`,
    closePreviewAria: 'Close preview',

    sec2Kicker1: 'Steps 02 & 03 · Spatial Reconstruction & Relief Inspection',
    sec2Kicker2: 'Smart Guardian 3-Axis Robotic Gantry',
    sec2Kicker3: (cov) => `Angular Coverage ${cov}%`,
    sec2Title: '02. Smart Guardian 3D Spatial Lab & Surface Relief',
    mode3DLabBtn: '3D Spatial Lab',
    mode2DScrubberBtn: '2D Orbital Scrubber',
    gateCurrentAngles: (count) => `Current Views: ${count} of 3 Mandatory Minimum Angles`,
    gateTitle: 'Smart Guardian 3D Lab Requires at Least 3 Artifact Photos',
    gateDesc:
      'Complete Step 1 above by capturing live photos from multiple directions or uploading at least 3 views to unlock 3D volume projection and carving relief.',
    gateBackBtn: 'Return to Step 01: Capture & Upload',
    scrubberCounter: (idx, total) => `Angle ${idx} of ${total}`,
    scrubberHint: 'Drag slider to orbit smoothly across captured directions',
    viewportOrbitHint: 'Drag to orbit 360° · Scroll wheel to zoom',
    showDockBtn: 'Show Lab Controls',
    hideDockBtn: 'Hide Controls',
    volumetricModeBtn: 'Multi-Face Volume',
    reliefModeBtn: '2.5D Carving Relief',
    finishOriginal: 'Original Artifact Color',
    finishLimestone: 'Archival Limestone',
    finishBronze: 'Hammered Bronze',
    reliefDepthLabel: 'Relief Depth',
    resetViewBtn: 'Reset Camera',

    kpi1Label: 'Documented Views',
    kpi1DistinctSuffix: (dirs) => `(${dirs} distinct axes)`,
    kpi2Label: 'Perimeter Angular Coverage',
    kpi3Label: 'Cross-Angle Light Uniformity',
    kpi4Label: 'Carving & Edge Relief Density',

    sec3Kicker1: 'Step 03 · Documentation & Preventive Conservation',
    sec3Kicker2: 'Essential Environmental Indicators & Smart Guardian Certificate',
    sec3Title: '03. Artifact & Essential Environmental Indicators',

    selectCorridorLabel: 'Select historical exchange corridor linked to this artifact:',
    mapHeaderTitle: 'Cultural Confluence & Trade Station Topology',
    mapHeaderSub: 'Connected Heritage Hubs',
    civilizationsTerm: 'Intersecting Civilizations',
    techniquesTerm: 'Shared Craft & Techniques',

    passportTitle: 'Issue Smart Guardian Digital Heritage Passport',
    passportDesc:
      'Catalog the artifact’s provenance and cross-cultural links to certify it in the Smart Guardian registry and export an official heritage card.',
    fieldArtifactName: 'Artifact Title',
    fieldPeriod: 'Historical Period',
    fieldMaterial: 'Material & Medium',
    fieldDimensions: 'Dimensions',
    fieldRegion: 'Discovery Site or Collection',
    fieldCultures: 'Intersecting Cultures (comma-separated)',
    fieldTeamName: 'Documentation & Robotics Team',
    fieldNotes: 'Cultural Convergence & Research Notes',
    saveToArchiveBtn: (n) => `Register Artifact Baseline (${n} Angles)`,
    exportPdfBtn: 'Export Full Official PDF Report',
    exportingPdfBtn: 'Generating PDF Report...',
    exportPngBtn: 'Download Smart Guardian PNG',
    exportingBtn: 'Exporting...',
    exportJsonBtn: 'Export JSON',
    errNeed3BeforeSave:
      'Please provide at least 3 multi-angle photos of the artifact before certifying or exporting.',
    savedSuccessMsg: (code) =>
      `Artifact baseline registered under ${code} — ready for condition verification.`,

    sec4Kicker1: 'Certified Archive · Protected Multi-Angle Artifacts',
    sec4Kicker2: (n) => `${n} certified artifacts`,
    sec4Title: '04. Smart Guardian Verified Heritage Registry',
    sec4Note:
      'Every certified entry satisfies the 3+ directional photo requirement and exports a full official PDF conservation report in one click.',
    anglesDocumentedUnit: (n) => `${n} verified angles`,
    inspectIn3DBtn: 'Inspect in 3D Lab',
    cardPdfBtn: 'PDF Report',
    cardBtn: 'Passport PNG',

    passportHeaderBanner: (code) =>
      `SMART GUARDIAN HERITAGE CERTIFICATE · WHERE CULTURES MEET · ${code}`,
    passportMetricsValue: (a, c, i) =>
      `${a} Verified Angles · ${c}% Perimeter Coverage · ${i}% Light Uniformity`,
    passportIssuedDate: (d) => `Smart Guardian Digital Issue Date: ${d}`,

    footerTagline:
      'Multi-Angle Archaeological Preservation Platform — Religious Institute Robotics Team (2026–2027)',
  },

  fr: {
    pageTitle:
      'Smart Guardian — Préservation Multi-Angles & Rencontre des Cultures',
    brandName: 'Smart Guardian',
    navCapture: '01. Capture & Import',
    navSpatial: '02. Vue 3D',
    navCultures: '03. Enregistrement',
    navArchive: '04. Authenticité & Risques',
    ctaNewArtifact: 'Nouvelle Pièce',
    editionLanguageLabel: 'Langue :',

    heroBrandLockup: 'Smart Guardian · Sauvegarde Patrimoniale',
    heroKicker1: 'Numérisation Multi-Angles',
    heroKicker2: 'Indicateurs Environnementaux Essentiels',
    heroKicker3: 'Authenticité & Prévision',
    heroTitle: 'Smart Guardian : Documentation Sereine et Prévision des Risques Patrimoniaux',
    heroLead:
      'Un parcours structuré en quatre étapes : capturez 3+ vues, inspectez le relief 3D, enregistrez l’artéfact et ses indicateurs environnementaux essentiels, puis vérifiez son authenticité, anticipez les risques en rouge et exportez les recommandations en PDF.',
    heroPrimaryBtn: 'Commencer le Parcours',
    heroSecondaryBtn: 'Authenticité & Prévision',
    heroFallbackTitle: 'Labo Optique Smart Guardian',
    heroFallbackSub: '0° · 90° · 180° · 270° · Sommet',
    heroScrimCaption: 'Empreinte optique sans contact et conservation prédictive.',
    heroFigCaption: 'Portique optique multi-angles Smart Guardian.',

    workflowSectionTitle: 'Quatre Étapes Harmonisées de Conservation',
    workflowSectionSub: 'De la capture optique jusqu’au contrôle d’authenticité, la prévision des risques et l’export PDF :',
    stepGoAction: 'Ouvrir l’étape',
    stepLiveAnglesStatus: (count) =>
      count >= 3 ? `Prêt (${count}/3+)` : `${count}/3 vues`,
    stepLiveLightStatus: (pct) => `Lumière ${pct}%`,
    stepLiveCoverageStatus: (pct) => `Couverture ${pct}%`,
    stepLiveArchiveStatus: (count) => `${count} Enregistrées`,

    step1Label: 'Étape 01',
    step1Title: 'Capture ou Import (3+ Photos)',
    step1Desc: 'Prenez des vues en direct ou importez au minimum 3 clichés.',
    step2Label: 'Étape 02',
    step2Title: 'Aperçu 3D & Relief',
    step2Desc: 'Inspectez le volume 3D et le relief des gravures.',
    step3Label: 'Étape 03',
    step3Title: 'Enregistrement & Indicateurs Essentiels',
    step3Desc: 'Notez le pays, l’identité et les indicateurs environnementaux essentiels.',
    step4Label: 'Étape 04 · Finale',
    step4Title: 'Authenticité, Prévision & PDF',
    step4Desc: 'Vérifiez l’authenticité, anticipez les risques en rouge et exportez le PDF.',

    sec1Kicker1: 'Étape 01',
    sec1Kicker2: 'Minimum : 3 Photos',
    sec1Kicker3: '6 Axes',
    sec1Title: '01. Capture en Direct ou Import de Photos',
    tabLiveCamera: 'Caméra Directe',
    tabUploadPhotos: 'Importer (3+)',
    presetBannerBold: 'Exemples Rapides :',
    presetBannerText: 'Chargez un exemple à 4 vues en un clic ou ajoutez vos photos.',
    presetIncenseBtn: 'Brûle-Parfum Route de l’Encens (4 Vues)',
    presetAstrolabeBtn: 'Astrolabe Cordoue–Bagdad (4 Vues)',
    presetSilkEwerBtn: 'Aiguière Route de la Soie (4 Vues)',

    chooseDirectionLabel: 'Sélectionnez l’angle de prise de vue autour de la pièce :',
    liveCameraHeading: 'Optique Multi-Directions Smart Guardian',
    liveCameraDesc:
      'Activez votre caméra pour capturer 3 angles ou plus en direct, ou lancez le Simulateur Optique Robotisé pour tester la prise de vue sans webcam externe.',
    startLiveCameraBtn: 'Activer la Caméra',
    startSimulatorBtn: 'Lancer le Simulateur Optique',
    cameraUnsupportedErr:
      'L’accès direct à la caméra n’est pas pris en charge ici ; utilisez le Simulateur Optique ou importez vos photos.',
    cameraPermissionErr:
      'Caméra physique inaccessible (autorisation refusée ou absente). Utilisez le Simulateur Optique ci-dessous ou importez 3+ photos.',
    telemetryLight: 'Lumière',
    telemetrySharpness: 'Netteté',
    switchLensBtn: 'Changer d’Objectif',
    mirrorBtn: 'Miroir',
    switchSimModelBtn: 'Changer de Modèle Simulé',
    hideGridBtn: 'Masquer la Grille',
    showGridBtn: 'Afficher la Grille',
    stopStreamBtn: 'Arrêter le Flux',
    captureAnglePrefix: 'Capturer',

    dropzoneTitle: 'Glissez-Déposez les Photos de l’Artéfact (Minimum 3 Photos)',
    dropzoneDesc:
      'Importez au moins 3 clichés haute résolution pris sous des angles différents (Face, Droite, Dos, Gauche, Zénith) pour activer Smart Guardian 3D.',
    dropzoneBtn: 'Choisir 3 Photos ou Plus sur l’Appareil',
    invalidFileNotice: 'Veuillez sélectionner des fichiers image valides (JPG, PNG ou WebP).',
    addedBelowMinNotice: (added, rem) =>
      `${added} photo(s) ajoutée(s). Smart Guardian exige au moins 3 photos par artéfact (${rem} restante(s)).`,
    addedCompleteNotice: (total) =>
      `Seuil atteint (${total} angles vérifiés) — passez à l’Étape 3 pour inspecter le modèle 3D.`,

    trayTitle: 'Registre des Angles Capturés et Importés',
    trayCountSub: (count) => `${count} vue(s) enregistrée(s) · Seuil requis : 3+ angles`,
    clearAllBtn: 'Tout Effacer',
    minMetStatus: 'Quorum de 3 Angles Atteint (Prêt pour l’Étape 3)',
    minRemainingStatus: (rem) => `Encore ${rem} photo(s) requise(s) (minimum 3)`,
    minUnlockedNote: 'Le laboratoire spatial 3D et le relief topographique sont actifs.',
    open3DStudioBtn: 'Aller à l’Étape 3 : Labo 3D',
    emptyTrayTitle: 'Aucun angle enregistré pour le moment',
    emptyTrayDesc:
      'Commencez l’Étape 1 en capturant au moins 3 photos en direct ou en important 3 clichés minimum.',
    sourceCamera: 'Caméra Directe',
    sourceUpload: 'Fichier Importé',
    sourcePreset: 'Jeu Référence',
    deleteAngleAria: 'Supprimer cet angle',
    lightboxMeta: (w, h, s, b) =>
      `Dimensions ${w}×${h} px · Netteté ${s}% · Éclairage ${b}%`,
    closePreviewAria: 'Fermer l’aperçu',

    sec2Kicker1: 'Étapes 02 & 03 · Reconstruction Spatiale et Topographie',
    sec2Kicker2: 'Portique Robotisé 3 Axes Smart Guardian',
    sec2Kicker3: (cov) => `Couverture Angulaire ${cov}%`,
    sec2Title: '02. Laboratoire Spatial 3D Smart Guardian et Relief de Surface',
    mode3DLabBtn: 'Labo Spatial 3D',
    mode2DScrubberBtn: 'Explorateur Orbital 2D',
    gateCurrentAngles: (count) => `Vues actuelles : ${count} sur 3 obligatoires au minimum`,
    gateTitle: 'Le Labo 3D Smart Guardian Requiert au Moins 3 Photos de l’Artéfact',
    gateDesc:
      'Complétez l’Étape 1 ci-dessus en capturant des vues sous plusieurs directions ou en important au moins 3 photos.',
    gateBackBtn: 'Retour à l’Étape 01 : Capture & Import',
    scrubberCounter: (idx, total) => `Angle ${idx} sur ${total}`,
    scrubberHint: 'Faites glisser pour pivoter entre les directions capturées',
    viewportOrbitHint: 'Glisser pour pivoter à 360° · Molette pour zoomer',
    showDockBtn: 'Afficher les Outils',
    hideDockBtn: 'Masquer les Outils',
    volumetricModeBtn: 'Volume Multi-Faces',
    reliefModeBtn: 'Relief Sculpté 2,5D',
    finishOriginal: 'Couleur Originale',
    finishLimestone: 'Calcaire Archéologique',
    finishBronze: 'Bronze Martelé',
    reliefDepthLabel: 'Profondeur',
    resetViewBtn: 'Réinitialiser la Vue',

    kpi1Label: 'Directions Documentées',
    kpi1DistinctSuffix: (dirs) => `(${dirs} axes distincts)`,
    kpi2Label: 'Couverture Périphérique',
    kpi3Label: 'Homogénéité d’Éclairage',
    kpi4Label: 'Densité des Gravures et Arêtes',

    sec3Kicker1: 'Étape 03 · Documentation & Conservation',
    sec3Kicker2: 'Indicateurs Essentiels et Certificat Smart Guardian',
    sec3Title: '03. L’Artéfact & les Indicateurs Environnementaux Essentiels',

    selectCorridorLabel: 'Choisissez le corridor historique lié à cet artéfact :',
    mapHeaderTitle: 'Topologie des Carrefours et Relais Culturels',
    mapHeaderSub: 'Cités Patrimoniales Reliées',
    civilizationsTerm: 'Civilisations en Dialogue',
    techniquesTerm: 'Savoir-Faire Partagés',

    passportTitle: 'Émettre le Certificat Patrimonial Smart Guardian',
    passportDesc:
      'Documentez la provenance et les liens interculturels de la pièce pour la certifier au registre Smart Guardian et exporter sa fiche officielle.',
    fieldArtifactName: 'Nom de l’Artéfact',
    fieldPeriod: 'Période Historique',
    fieldMaterial: 'Matériau et Technique',
    fieldDimensions: 'Dimensions',
    fieldRegion: 'Lieu de Découverte ou Musée',
    fieldCultures: 'Cultures Croisées (séparées par des virgules)',
    fieldTeamName: 'Équipe de Documentation',
    fieldNotes: 'Convergences Culturelles et Notes de Recherche',
    saveToArchiveBtn: (n) => `Enregistrer la Référence (${n} Vues)`,
    exportPdfBtn: 'Exporter le Rapport Officiel PDF',
    exportingPdfBtn: 'Génération du PDF...',
    exportPngBtn: 'Télécharger Certificat PNG',
    exportingBtn: 'Export en cours...',
    exportJsonBtn: 'Exporter JSON',
    errNeed3BeforeSave:
      'Veuillez fournir au moins 3 photos sous différents angles avant la certification ou l’export.',
    savedSuccessMsg: (code) =>
      `Artéfact enregistré sous la cote ${code} — prêt pour le contrôle d’état.`,

    sec4Kicker1: 'Archives Certifiées · Artéfacts Protégés Multi-Angles',
    sec4Kicker2: (n) => `${n} pièces certifiées`,
    sec4Title: '04. Registre Patrimonial Vérifié Smart Guardian',
    sec4Note:
      'Chaque pièce certifiée respecte le quorum de 3+ angles et permet d’exporter un rapport officiel PDF complet en un clic.',
    anglesDocumentedUnit: (n) => `${n} vues vérifiées`,
    inspectIn3DBtn: 'Inspecter en 3D',
    cardPdfBtn: 'Rapport PDF',
    cardBtn: 'Fiche PNG',

    passportHeaderBanner: (code) =>
      `CERTIFICAT SMART GUARDIAN · RENCONTRE DES CULTURES · ${code}`,
    passportMetricsValue: (a, c, i) =>
      `${a} Angles Vérifiés · Couverture ${c}% · Uniformité Lumineuse ${i}%`,
    passportIssuedDate: (d) => `Date d’émission Smart Guardian : ${d}`,

    footerTagline:
      'Plateforme Internationale de Sauvegarde Archéologique Multi-Angles — Rencontre des Cultures (2026–2027)',
  },

  zh: {
    pageTitle:
      'Smart Guardian · 智慧守护者 — 多角度文物保护与文明交汇国际平台',
    brandName: 'Smart Guardian · 智慧守护者',
    navCapture: '01. 拍摄与上传',
    navSpatial: '02. 三维预览',
    navCultures: '03. 文物建档',
    navArchive: '04. 真伪核验与风险预测',
    ctaNewArtifact: '新增文物',
    editionLanguageLabel: '语言：',

    heroBrandLockup: 'Smart Guardian · 智慧守护者国际文保平台',
    heroKicker1: '多角度光学指纹',
    heroKicker2: '核心基础环境指标',
    heroKicker3: '真伪核验与风险预测',
    heroTitle: '智慧守护者 (Smart Guardian)：从容有序的文物数字化建档与风险预测体系',
    heroLead:
      '四步连贯式国际文保流程：采集 3 张以上多向照片、检视三维浮雕模型、登记所属国家与核心基础环境指标，最终完成文物真伪核验、红标风险趋势预测并导出权威保护建议 PDF。',
    heroPrimaryBtn: '开始建档流程',
    heroSecondaryBtn: '真伪核验与风险预测',
    heroFallbackTitle: 'Smart Guardian 光学扫描台',
    heroFallbackSub: '0° · 90° · 180° · 270° · 俯视',
    heroScrimCaption: '非接触多角度光学指纹与预防性风险预测科学。',
    heroFigCaption: 'Smart Guardian 多角度文物光学扫描系统。',

    workflowSectionTitle: '四大连贯式国际文保核心步骤',
    workflowSectionSub: '从多向光学采集、规范建档，直至文物真伪核验、风险预测与创新 PDF 报告导出：',
    stepGoAction: '进入步骤',
    stepLiveAnglesStatus: (count) =>
      count >= 3 ? `已就绪 (${count}/3+)` : `${count}/3 张`,
    stepLiveLightStatus: (pct) => `光照 ${pct}%`,
    stepLiveCoverageStatus: (pct) => `覆盖 ${pct}%`,
    stepLiveArchiveStatus: (count) => `${count} 件已登记`,

    step1Label: '步骤 01',
    step1Title: '实时拍摄或上传 3+ 张图',
    step1Desc: '从不同方位拍摄或上传同一文物至少 3 张照片。',
    step2Label: '步骤 02',
    step2Title: '三维模型与纹饰浮雕',
    step2Desc: '直观旋转查看三维空间模型与铭文浮雕。',
    step3Label: '步骤 03',
    step3Title: '文物建档与核心基础环境指标',
    step3Desc: '选择国家、登记文物信息并设定核心基础环境指标基准。',
    step4Label: '步骤 04 · 终章',
    step4Title: '真伪核验、风险预测与建议 PDF',
    step4Desc: '核验文物真实性，红标预测未来受损风险并导出权威建议 PDF。',

    sec1Kicker1: '步骤 01',
    sec1Kicker2: '最低要求：3 张照片',
    sec1Kicker3: '6 个方位',
    sec1Title: '01. 实时拍摄或上传文物照片',
    tabLiveCamera: '实时相机',
    tabUploadPhotos: '上传照片 (3+)',
    presetBannerBold: '快速体验样本：',
    presetBannerText: '一键载入 4 角度文物样本，或上传自有照片。',
    presetIncenseBtn: '乳香之路石雕香炉（4 角度）',
    presetAstrolabeBtn: '科尔多瓦—巴格达星盘（4 角度）',
    presetSilkEwerBtn: '丝绸之路青花描金执壶（4 角度）',

    chooseDirectionLabel: '选择环绕文物的拍摄方位角：',
    liveCameraHeading: 'Smart Guardian 多方位实时光学取景器',
    liveCameraDesc:
      '开启设备摄像头从不同方位直接抓拍至少 3 张文物影像；若无外接摄像头，可启动“机器人光学转台模拟器”完成实时多角度抓拍。',
    startLiveCameraBtn: '开启实时摄像头',
    startSimulatorBtn: '启动机器人光学模拟器',
    cameraUnsupportedErr: '当前浏览器环境不支持直接调用摄像头，请使用光学模拟器或直接上传照片。',
    cameraPermissionErr: '无法打开物理摄像头（权限未授予或未连接镜头）。可使用下方光学模拟器或上传 3 张以上照片。',
    telemetryLight: '照度',
    telemetrySharpness: '锐度',
    switchLensBtn: '切换镜头',
    mirrorBtn: '水平镜像',
    switchSimModelBtn: '切换模拟文物',
    hideGridBtn: '隐藏准星网格',
    showGridBtn: '显示准星网格',
    stopStreamBtn: '停止画面',
    captureAnglePrefix: '抓拍',

    dropzoneTitle: '将文物照片拖放至此（每件文物至少上传 3 张）',
    dropzoneDesc:
      '上传不少于 3 张不同方位（正面、右侧、背面、左侧、顶部俯视）的高清文物图像，以激活 Smart Guardian 三维空间系统。',
    dropzoneBtn: '从设备选择 3 张或更多照片',
    invalidFileNotice: '请选择有效的图像文件（JPG、PNG 或 WebP）。',
    addedBelowMinNotice: (added, rem) =>
      `已添加 ${added} 张照片。智慧守护者要求每件文物不少于 3 张照片（还需补充 ${rem} 张）。`,
    addedCompleteNotice: (total) =>
      `已达最低数量标准（共记录 ${total} 个方位）— 请前往第 3 步检视三维空间模型。`,

    trayTitle: '已抓拍与上传的多角度影像序列',
    trayCountSub: (count) => `已登记 ${count} 张视图 · 最低必选标准：3 个以上角度`,
    clearAllBtn: '清空全部',
    minMetStatus: '已达 3 角度标准（可进入第 3 步三维重建）',
    minRemainingStatus: (rem) => `还需添加 ${rem} 张照片以达到最低标准（至少 3 张）`,
    minUnlockedNote: '智慧守护者三维工作台与表面浮雕重建已激活。',
    open3DStudioBtn: '前往第 3 步：三维预览',
    emptyTrayTitle: '尚未采集或上传任何角度影像',
    emptyTrayDesc: '请先执行第 1 步：从不同方位实时抓拍至少 3 张照片，或上传不少于 3 张文物图像。',
    sourceCamera: '实时抓拍',
    sourceUpload: '本地上传',
    sourcePreset: '标准样本',
    deleteAngleAria: '删除该角度图像',
    lightboxMeta: (w, h, s, b) => `分辨率 ${w}×${h} 像素 · 边缘锐度 ${s}% · 照度 ${b}%`,
    closePreviewAria: '关闭大图预览',

    sec2Kicker1: '第 02 与 03 步 · 空间三维重建与表面浮雕分析',
    sec2Kicker2: 'Smart Guardian 三轴扫描拱架仿真',
    sec2Kicker3: (cov) => `环绕角度覆盖率 ${cov}%`,
    sec2Title: '02. Smart Guardian 三维空间检视台与纹饰表面地形',
    mode3DLabBtn: '三维空间实验室',
    mode2DScrubberBtn: '二维环绕检视器',
    gateCurrentAngles: (count) => `当前已采集：${count} / 3（最低必选角度数）`,
    gateTitle: 'Smart Guardian 三维实验室需要至少 3 张文物照片',
    gateDesc: '请先完成上方第 1 步，从不同方向实时抓拍或上传不少于 3 张照片，以解锁多面体与 2.5D 纹饰浮雕。',
    gateBackBtn: '返回第 01 步：采集与上传',
    scrubberCounter: (idx, total) => `视角 ${idx} / ${total}`,
    scrubberHint: '拖动滑块在已采集的不同方位之间平滑环绕切换',
    viewportOrbitHint: '拖拽可 360° 环绕旋转 · 滚轮缩放检视',
    showDockBtn: '展开实验控制栏',
    hideDockBtn: '收起控制栏',
    volumetricModeBtn: '多角度空间体块',
    reliefModeBtn: '2.5D 纹饰浮雕网格',
    finishOriginal: '文物原始色彩',
    finishLimestone: '馆藏石灰岩质感',
    finishBronze: '锤揲青铜质感',
    reliefDepthLabel: '浮雕起伏深度',
    resetViewBtn: '重置视角',

    kpi1Label: '已记录拍摄方位总数',
    kpi1DistinctSuffix: (dirs) => `（覆盖 ${dirs} 个独立轴向）`,
    kpi2Label: '文物周向角度覆盖率',
    kpi3Label: '多视角光照均匀度',
    kpi4Label: '铭文与浅浮雕边缘密度',

    sec3Kicker1: '第 03 步 · 规范建档与预防性保护',
    sec3Kicker2: '核心环境指标与 Smart Guardian 数字认证',
    sec3Title: '03. 文物与核心基础环境指标',

    selectCorridorLabel: '选择与该文物关联的历史文明交汇走廊：',
    mapHeaderTitle: '跨文化交汇枢纽与贸易驿站拓扑图',
    mapHeaderSub: '古代文明节点互联',
    civilizationsTerm: '交汇文明体系',
    techniquesTerm: '融合工艺与技术',

    passportTitle: '签发 Smart Guardian（智慧守护者）文物数字护照',
    passportDesc: '登记文物断代、材质与跨文化融合特征，存入守护者档案库并导出高清馆藏认证卡。',
    fieldArtifactName: '文物名称',
    fieldPeriod: '历史年代',
    fieldMaterial: '材质与工艺',
    fieldDimensions: '尺寸规格',
    fieldRegion: '出土地点或藏品来源',
    fieldCultures: '交汇融合的文明（以逗号分隔）',
    fieldTeamName: '研发与记录团队',
    fieldNotes: '文明交汇特征与研究说明',
    saveToArchiveBtn: (n) => `登记文物基准数据（${n} 角度）`,
    exportPdfBtn: '导出完整官方 PDF 报告',
    exportingPdfBtn: '正在生成 PDF 报告...',
    exportPngBtn: '下载守护者护照 PNG',
    exportingBtn: '正在生成图像...',
    exportJsonBtn: '导出 JSON 数据',
    errNeed3BeforeSave: '请先采集或上传至少 3 张不同角度的文物照片，再进行归档或导出。',
    savedSuccessMsg: (code) => `文物基准已成功登记（编号：${code}），可立即进行状态核查比对。`,

    sec4Kicker1: '认证典藏库 · 多角度受保护文物',
    sec4Kicker2: (n) => `已认证 ${n} 件文物`,
    sec4Title: '04. Smart Guardian（智慧守护者）认证文物典藏馆',
    sec4Note: '馆内每件档案均满足 3 个以上拍摄方位标准，支持一键检视 3D 模型或导出官方 PDF 完整文献报告。',
    anglesDocumentedUnit: (n) => `${n} 个认证视角`,
    inspectIn3DBtn: '在 3D 实验室检视',
    cardPdfBtn: 'PDF 报告',
    cardBtn: '导出护照 PNG',

    passportHeaderBanner: (code) =>
      `SMART GUARDIAN 智慧守护者数字文物证书 · 文明交汇 · ${code}`,
    passportMetricsValue: (a, c, i) =>
      `${a} 个认证角度 · 周向覆盖 ${c}% · 光照均匀度 ${i}%`,
    passportIssuedDate: (d) => `Smart Guardian 数字签发日期：${d}`,

    footerTagline: '多角度文化遗产保护与文明交汇国际平台 (2026–2027)',
  },

  ru: {
    pageTitle:
      'Smart Guardian · Умный Хранитель — Многоракурсная защита артефактов',
    brandName: 'Smart Guardian · Умный Хранитель',
    navCapture: '01. Съёмка и фото',
    navSpatial: '02. 3D-модель',
    navCultures: '03. Регистрация',
    navArchive: '04. Подлинность и прогноз',
    ctaNewArtifact: 'Новый предмет',
    editionLanguageLabel: 'Язык:',

    heroBrandLockup: 'Smart Guardian · Умный Хранитель',
    heroKicker1: 'Многоракурсная фиксация',
    heroKicker2: 'Базовые показатели среды',
    heroKicker3: 'Подлинность и прогноз рисков',
    heroTitle: 'Smart Guardian: Гармоничная регистрация и прогнозирование рисков наследия',
    heroLead:
      'Выстроенный маршрут из 4 этапов: съёмка от 3 ракурсов, 3D-осмотр рельефа, регистрация паспорта и базовых показателей микроклимата, а в финале — проверка подлинности артефакта, прогноз рисков и экспорт рекомендаций PDF.',
    heroPrimaryBtn: 'Начать регистрацию',
    heroSecondaryBtn: 'Подлинность и прогноз',
    heroFallbackTitle: 'Оптический сканер Smart Guardian',
    heroFallbackSub: '0° · 90° · 180° · 270° · Сверху',
    heroScrimCaption: 'Бесконтактный оптический паспорт и превентивный прогноз сохранности.',
    heroFigCaption: 'Оптическая дуга многоракурсной съёмки Smart Guardian.',

    workflowSectionTitle: '4 последовательных этапа сохранения наследия',
    workflowSectionSub: 'От оптической фиксации и регистрации до проверки подлинности, прогноза рисков и выпуска PDF:',
    stepGoAction: 'Перейти к этапу',
    stepLiveAnglesStatus: (count) =>
      count >= 3 ? `Готово (${count}/3+)` : `${count}/3 фото`,
    stepLiveLightStatus: (pct) => `Свет ${pct}%`,
    stepLiveCoverageStatus: (pct) => `Охват ${pct}%`,
    stepLiveArchiveStatus: (count) => `${count} зарег.`,

    step1Label: 'Этап 01',
    step1Title: 'Съёмка или загрузка от 3 фото',
    step1Desc: 'Снимите камерой или загрузите минимум 3 ракурса артефакта.',
    step2Label: 'Этап 02',
    step2Title: '3D-обзор и рельеф',
    step2Desc: 'Осмотрите 3D-модель и рельеф орнамента.',
    step3Label: 'Этап 03',
    step3Title: 'Регистрация и базовые показатели',
    step3Desc: 'Укажите страну, атрибуцию и базовые экологические показатели.',
    step4Label: 'Этап 04 · Финал',
    step4Title: 'Подлинность, прогноз рисков и PDF',
    step4Desc: 'Проверьте подлинность предмета, спрогнозируйте риски красным и скачайте PDF.',

    sec1Kicker1: 'Шаг 01',
    sec1Kicker2: 'Минимум: 3 фото',
    sec1Kicker3: '6 ракурсов',
    sec1Title: '01. Прямая съёмка или загрузка фото',
    tabLiveCamera: 'Камера',
    tabUploadPhotos: 'Загрузить (3+)',
    presetBannerBold: 'Готовые образцы:',
    presetBannerText: 'Выберите образец из 4 ракурсов в один клик или загрузите свои фото.',
    presetIncenseBtn: 'Курильница Пути благовоний (4 ракурса)',
    presetAstrolabeBtn: 'Астролябия Кордова–Багдад (4 ракурса)',
    presetSilkEwerBtn: 'Кувшин Великого шёлкового пути (4 ракурса)',

    chooseDirectionLabel: 'Выберите направление съёмки вокруг артефакта:',
    liveCameraHeading: 'Оптический видоискатель Smart Guardian',
    liveCameraDesc:
      'Включите камеру устройства для съёмки 3 и более ракурсов напрямую или запустите оптический симулятор роботизированного стола, если внешняя камера не подключена.',
    startLiveCameraBtn: 'Включить камеру',
    startSimulatorBtn: 'Запустить симулятор сканера',
    cameraUnsupportedErr:
      'Прямой доступ к камере недоступен в текущем окружении; используйте оптический симулятор или загрузите фотографии.',
    cameraPermissionErr:
      'Не удалось открыть физическую камеру (нет доступа или объектива). Используйте оптический симулятор ниже или загрузите от 3 фото.',
    telemetryLight: 'Свет',
    telemetrySharpness: 'Резкость',
    switchLensBtn: 'Сменить камеру',
    mirrorBtn: 'Зеркально',
    switchSimModelBtn: 'Сменить модель симуляции',
    hideGridBtn: 'Скрыть сетку',
    showGridBtn: 'Показать сетку',
    stopStreamBtn: 'Остановить поток',
    captureAnglePrefix: 'Снять',

    dropzoneTitle: 'Перетащите фотографии артефакта сюда (минимум 3 снимка)',
    dropzoneDesc:
      'Загрузите 3 или более снимков высокого разрешения с разных сторон (фасад, справа, сзади, слева, сверху) для запуска 3D-системы Smart Guardian.',
    dropzoneBtn: 'Выбрать 3 или более фото с устройства',
    invalidFileNotice: 'Пожалуйста, выберите корректные файлы изображений (JPG, PNG или WebP).',
    addedBelowMinNotice: (added, rem) =>
      `Добавлено фото: ${added}. Протокол Smart Guardian требует минимум 3 снимка артефакта (осталось: ${rem}).`,
    addedCompleteNotice: (total) =>
      `Минимальный порог выполнен (${total} ракурсов) — переходите к Шагу 3 для осмотра 3D-модели.`,

    trayTitle: 'Реестр отснятых и загруженных ракурсов',
    trayCountSub: (count) => `Зарегистрировано снимков: ${count} · Минимум: от 3 ракурсов`,
    clearAllBtn: 'Очистить всё',
    minMetStatus: 'Минимум из 3 ракурсов выполнен (готово к Шагу 3)',
    minRemainingStatus: (rem) => `Добавьте ещё ${rem} фото до обязательного минимума (3 фото)`,
    minUnlockedNote: '3D-лаборатория Smart Guardian и топография рельефа активированы.',
    open3DStudioBtn: 'К Шагу 3: 3D-просмотр',
    emptyTrayTitle: 'Ракурсы ещё не отсняты и не загружены',
    emptyTrayDesc:
      'Начните с Шага 1: сделайте не менее 3 живых снимков с разных направлений или загрузите минимум 3 фотографии артефакта.',
    sourceCamera: 'Прямая съёмка',
    sourceUpload: 'Загруженный файл',
    sourcePreset: 'Эталонный набор',
    deleteAngleAria: 'Удалить этот ракурс',
    lightboxMeta: (w, h, s, b) =>
      `Размер ${w}×${h} пикс. · Резкость ${s}% · Освещённость ${b}%`,
    closePreviewAria: 'Закрыть просмотр',

    sec2Kicker1: 'Шаги 02 и 03 · Пространственная реконструкция и рельеф',
    sec2Kicker2: 'Трёхосевая дуга Smart Guardian',
    sec2Kicker3: (cov) => `Угловой охват ${cov}%`,
    sec2Title: '02. 3D-лаборатория Smart Guardian и топография рельефа',
    mode3DLabBtn: '3D-лаборатория',
    mode2DScrubberBtn: 'Орбитальный обзор 2D',
    gateCurrentAngles: (count) => `Текущие ракурсы: ${count} из 3 обязательных`,
    gateTitle: 'Для 3D-лаборатории Smart Guardian нужно не менее 3 фото артефакта',
    gateDesc:
      'Выполните Шаг 1 выше, отсняв объект с разных направлений или загрузив минимум 3 снимка.',
    gateBackBtn: 'Вернуться к Шагу 01: Съёмка и загрузка',
    scrubberCounter: (idx, total) => `Ракурс ${idx} из ${total}`,
    scrubberHint: 'Перемещайте ползунок для плавного вращения между ракурсами',
    viewportOrbitHint: 'Вращение 360° мышью · Колесо для масштаба',
    showDockBtn: 'Показать панель',
    hideDockBtn: 'Скрыть панель',
    volumetricModeBtn: 'Многогранный объём',
    reliefModeBtn: 'Рельеф резьбы 2.5D',
    finishOriginal: 'Исходный цвет артефакта',
    finishLimestone: 'Музейный известняк',
    finishBronze: 'Чеканная бронза',
    reliefDepthLabel: 'Глубина рельефа',
    resetViewBtn: 'Сбросить вид',

    kpi1Label: 'Зафиксировано ракурсов',
    kpi1DistinctSuffix: (dirs) => `(${dirs} уникальных осей)`,
    kpi2Label: 'Круговой охват объекта',
    kpi3Label: 'Равномерность освещения',
    kpi4Label: 'Плотность резьбы и граней',

    sec3Kicker1: 'Шаг 03 · Документирование и сохранность',
    sec3Kicker2: 'Базовые показатели среды и сертификат Smart Guardian',
    sec3Title: '03. Артефакт и базовые показатели среды',

    selectCorridorLabel: 'Выберите исторический коридор, связанный с артефактом:',
    mapHeaderTitle: 'Карта узлов культурного обмена и караванных станций',
    mapHeaderSub: 'Связь древних центров',
    civilizationsTerm: 'Взаимодействующие цивилизации',
    techniquesTerm: 'Общие технологии и ремёсла',

    passportTitle: 'Выпуск цифрового сертификата Smart Guardian',
    passportDesc:
      'Заполните атрибуцию находки и её межкультурные связи для внесения в реестр Smart Guardian и экспорта официального паспорта.',
    fieldArtifactName: 'Название артефакта',
    fieldPeriod: 'Исторический период',
    fieldMaterial: 'Материал и техника',
    fieldDimensions: 'Размеры',
    fieldRegion: 'Место находки или собрание',
    fieldCultures: 'Пересекающиеся культуры (через запятую)',
    fieldTeamName: 'Команда документирования',
    fieldNotes: 'Признаки диалога культур и заметки исследователей',
    saveToArchiveBtn: (n) => `Зарегистрировать эталон (${n} ракурса)`,
    exportPdfBtn: 'Полный официальный отчёт PDF',
    exportingPdfBtn: 'Формирование PDF...',
    exportPngBtn: 'Скачать паспорт Smart Guardian PNG',
    exportingBtn: 'Экспорт...',
    exportJsonBtn: 'Экспорт JSON',
    errNeed3BeforeSave:
      'Пожалуйста, добавьте не менее 3 разноракурсных снимков перед сохранением или экспортом.',
    savedSuccessMsg: (code) =>
      `Эталон артефакта зарегистрирован под № ${code} — готов к сверке состояния.`,

    sec4Kicker1: 'Сертифицированный архив · Защищённые артефакты',
    sec4Kicker2: (n) => `Сертифицировано: ${n}`,
    sec4Title: '04. Верифицированный реестр наследия Smart Guardian',
    sec4Note:
      'Каждый объект в реестре содержит не менее 3 ракурсов и позволяет скачать полный официальный отчёт PDF в один клик.',
    anglesDocumentedUnit: (n) => `${n} ракурса`,
    inspectIn3DBtn: 'Открыть в 3D',
    cardPdfBtn: 'Отчёт PDF',
    cardBtn: 'Паспорт PNG',

    passportHeaderBanner: (code) =>
      `СЕРТИФИКАТ SMART GUARDIAN · ВСТРЕЧА КУЛЬТУР · ${code}`,
    passportMetricsValue: (a, c, i) =>
      `Ракурсов: ${a} · Охват: ${c}% · Равномерность света: ${i}%`,
    passportIssuedDate: (d) => `Дата выдачи Smart Guardian: ${d}`,

    footerTagline:
      'Международная платформа многоракурсной защиты наследия — Встреча культур (2026–2027)',
  },
};
