import {
  ArtifactConditionGrade,
  DirectMoistureStatus,
  LocaleCode,
  MaterialConservationClass,
} from '../types/artifact';

export interface SimpleIndicatorCopy {
  num: string;
  title: string;
  shortPurpose: string;
}

export interface SimpleConservationStrings {
  sec3Kicker: string;
  sec3Title: string;
  sec3Subtitle: string;

  anglesReadyShort: (count: number) => string;
  anglesNeededShort: (count: number) => string;
  addPhotosBtn: string;
  newBlankBtn: string;

  // Block 1: Essential Artifact Info
  basicInfoTitle: string;
  lblArtifactName: string;
  lblMaterialClass: string;
  materialClasses: Record<MaterialConservationClass, string>;
  lblPeriod: string;
  lblLocation: string;
  lblTeam: string;
  lblShortNote: string;
  lblShortNotePlaceholder: string;

  // Block 2: Suitable Temp & RH Benchmark
  benchmarkTitle: string;
  benchmarkSub: string;
  tempCardTitle: string;
  rhCardTitle: string;
  lblSafeMin: string;
  lblSafeMax: string;
  lblCurrentReading: string;
  safeRangeSummary: (min: number, max: number, unit: string) => string;
  statusWithinRange: string;
  statusAboveRange: (diff: string) => string;
  statusBelowRange: (diff: string) => string;

  // Block 3: Essential Environmental Indicators Summary Table
  envTableTitle: string;
  envTableSub: (nominalCount: number) => string;
  colIndicator: string;
  colKeyValue: string;
  colWhatItDetects: string;
  colStatus: string;

  badgeSafe: string;
  badgeAlert: string;
  badgeRisk: string;

  moistureStatuses: Record<DirectMoistureStatus, string>;
  unitVibration: string;

  indicators: Record<1 | 2 | 3 | 4, SimpleIndicatorCopy>;

  // Archive & PNG Passport concise lines
  archiveSafeClimateLine: (
    tMin: number,
    tMax: number,
    rhMin: number,
    rhMax: number,
    nom: number
  ) => string;
  passportSafeClimateLabel: string;
  passportSafeClimateValue: (
    tMin: number,
    tMax: number,
    rhMin: number,
    rhMax: number,
    nom: number
  ) => string;

  // Researcher Detailed Documentary Parameters (for Official PDF Report)
  conditionGrades: Record<ArtifactConditionGrade, string>;
  researcherToggleTitle: string;
  researcherToggleSub: string;
  lblInventoryNumber: string;
  lblDimensionsCm: string;
  lblWeightGrams: string;
  lblConditionGrade: string;
  lblTempDriftRate: string;
  lblRhDailyFluctuation: string;
  lblRhOutOfRangeHours: string;
  lblMoistureDurationHours: string;
  lblMoistureNotes: string;
  lblShockEventsCount: string;
  lblVibrationPattern: string;
}

export const CONSERVATION_STRINGS: Record<LocaleCode, SimpleConservationStrings> = {
  ar: {
    sec3Kicker: 'الخطوة ٠٣ · توثيق مبسّط وشامل',
    sec3Title: '٠٣. القطعة الأثرية والمؤشرات البيئية الأساسية',
    sec3Subtitle:
      'سجّل أهم بيانات القطعة، وحدّد المؤشرات البيئية الأساسية المناسبة لها لقياس أي تغير بيئي متوقع باختصار ووضوح.',

    anglesReadyShort: (c) => `● مرفق ${c} صور للقطعة (مكتمل وجاهز للحفظ)`,
    anglesNeededShort: (c) => `▲ الصور المرفقة (${c}/3) — يلزم ٣ صور على الأقل لحفظ القطعة`,
    addPhotosBtn: 'إضافة الصور',
    newBlankBtn: 'تفريغ لقطعة جديدة',

    basicInfoTitle: '١. البيانات الأساسية للقطعة الأثرية',
    lblArtifactName: 'اسم القطعة الأثرية',
    lblMaterialClass: 'نوع المادة (يضبط الحرارة والرطوبة تلقائياً)',
    materialClasses: {
      stone_limestone: 'حجر ومنحوتات صخرية',
      metals_bronze: 'برونز ونحاس ومعادن',
      ceramics_glass: 'خزف وفخار وزجاج',
      manuscripts_pigments: 'مخطوطات ورقوق أثرية حساسة',
      organic_wood_textile: 'أخشاب ومنسوجات عضوية',
    },
    lblPeriod: 'الحقبة التاريخية',
    lblLocation: 'موقع الاكتشاف أو القاعة',
    lblTeam: 'فريق التوثيق / الجهة',
    lblShortNote: 'وصف مختصر للقطعة (اختياري)',
    lblShortNotePlaceholder: 'أهم النقوش أو الزخارف أو الملاحظات الوصفية للقطعة...',

    benchmarkTitle: '٢. المؤشر المرجعي للحرارة والرطوبة المناسبة للقطعة',
    benchmarkSub:
      'مقارنة فورية بين النطاق الآمن المناسب للقطعة والقراءة الحالية لاكتشاف أي تغير بيئي متوقع:',
    tempCardTitle: 'درجة الحرارة (°C)',
    rhCardTitle: 'نسبة الرطوبة (% RH)',
    lblSafeMin: 'الحد الأدنى',
    lblSafeMax: 'الحد الأعلى',
    lblCurrentReading: 'القراءة الحالية',
    safeRangeSummary: (min, max, u) => `المناسب: ${min} – ${max}${u}`,
    statusWithinRange: '● ضمن النطاق المناسب',
    statusAboveRange: (d) => `▲ مرتفع (+${d} فوق المناسب)`,
    statusBelowRange: (d) => `▲ منخفض (${d} تحت المناسب)`,

    envTableTitle: '٣. ملخص المؤشرات البيئية الأساسية',
    envTableSub: (nom) => `${nom} من ٤ مؤشرات أساسية ضمن الوضع الآمن`,
    colIndicator: 'المؤشر البيئي',
    colKeyValue: 'القيمة المسجّلة',
    colWhatItDetects: 'ما الذي يساعدنا على اكتشافه؟',
    colStatus: 'الحالة',

    badgeSafe: '● آمن',
    badgeAlert: '▲ تنبيه',
    badgeRisk: '✖ خطر',

    moistureStatuses: {
      dry_none: 'جاف تماماً (لا يوجد تسرب أو تكاثف)',
      condensation_trace: 'تكاثف سطحي طفيف',
      active_seepage: 'تسرب مياه أو بلل مرصود',
    },
    unitVibration: 'mm/s اهتزاز',

    indicators: {
      1: {
        num: '١',
        title: 'درجة الحرارة',
        shortPurpose: 'رصد التدهور الكيميائي والإجهاد الحراري للمادة',
      },
      2: {
        num: '٢',
        title: 'الرطوبة النسبية',
        shortPurpose: 'منع نمو العفن والتآكل والتشقق',
      },
      3: {
        num: '٣',
        title: 'الماء والرطوبة المباشرة',
        shortPurpose: 'اكتشاف التسرب أو التكاثف المسبب للعفن والتآكل',
      },
      4: {
        num: '٤',
        title: 'الاهتزاز والصدمات',
        shortPurpose: 'منع تحرك الأجزاء الدقيقة أو التلف الميكانيكي',
      },
    },

    archiveSafeClimateLine: (tMin, tMax, rhMin, rhMax, nom) =>
      `المناخ المناسب: ${tMin}–${tMax}°C · ${rhMin}–${rhMax}% RH · (${nom}/4 مؤشرات آمنة)`,
    passportSafeClimateLabel: 'النطاق البيئي المناسب وحالة الحفظ',
    passportSafeClimateValue: (tMin, tMax, rhMin, rhMax, nom) =>
      `الحرارة ${tMin}–${tMax}°C · الرطوبة ${rhMin}–${rhMax}% RH · (${nom}/4 مؤشرات أساسية آمنة)`,

    conditionGrades: {
      stable_excellent: 'مستقرة وممتازة (صالحة للعرض المتحفي)',
      good_minor_wear: 'جيدة مع آثار تقادم سطحي طفيف',
      fragile_sensitive: 'حساسة / هشة (تستلزم عناية بيئية مشددة)',
      requires_intervention: 'تتطلب تدخلاً ترميمياً عاجلاً',
    },
    researcherToggleTitle:
      'بيانات التوثيق التفصيلية للتقرير الرسمي PDF (اختياري للباحثين والموثقين)',
    researcherToggleSub:
      'تُضمَّن كافة هذه القراءات والقياسات الدقيقة تلقائياً في المرجع الوثائقي الرسمي المُصدَّر بصيغة PDF.',
    lblInventoryNumber: 'الرقم المخزني / الأرشيفي',
    lblDimensionsCm: 'الأبعاد الدقيقة (سم)',
    lblWeightGrams: 'الوزن التقديري (جم)',
    lblConditionGrade: 'درجة الحالة الفيزيائية للقطعة',
    lblTempDriftRate: 'معدل التغير الحراري اليومي (°C/يوم)',
    lblRhDailyFluctuation: 'التذبذب اليومي للرطوبة (% RH)',
    lblRhOutOfRangeHours: 'مدة البقاء خارج نطاق الرطوبة (ساعات)',
    lblMoistureDurationHours: 'مدة حدث الرطوبة المباشرة أو التكاثف (ساعات)',
    lblMoistureNotes: 'ملاحظات التسرب أو التكاثف السطحي',
    lblShockEventsCount: 'عدد أحداث الصدمات المسجّلة',
    lblVibrationPattern: 'تكرار الاهتزاز ونمطه ومدته',
  },

  'en-US': {
    sec3Kicker: 'Step 03 · Streamlined Essential Dossier',
    sec3Title: '03. Artifact & Essential Environmental Indicators',
    sec3Subtitle:
      'Record essential artifact details and set suitable environmental benchmarks to detect expected microclimate shifts simply and clearly.',

    anglesReadyShort: (c) => `● ${c} Artifact Photos Attached (Ready to save)`,
    anglesNeededShort: (c) => `▲ Photos Attached (${c}/3) — At least 3 photos required to save`,
    addPhotosBtn: 'Add Photos',
    newBlankBtn: 'Clear Fields',

    basicInfoTitle: '1. Essential Artifact Information',
    lblArtifactName: 'Artifact Name',
    lblMaterialClass: 'Material Type (Auto-sets safe Temp & RH)',
    materialClasses: {
      stone_limestone: 'Limestone & Carved Stone',
      metals_bronze: 'Bronze, Brass & Metals',
      ceramics_glass: 'Ceramics, Pottery & Glass',
      manuscripts_pigments: 'Manuscripts & Delicate Parchments',
      organic_wood_textile: 'Wood, Ivory & Organic Textiles',
    },
    lblPeriod: 'Historical Period',
    lblLocation: 'Discovery Site / Gallery',
    lblTeam: 'Documentation Team',
    lblShortNote: 'Brief Summary (Optional)',
    lblShortNotePlaceholder: 'Key motifs, inscriptions, or physical notes...',

    benchmarkTitle: '2. Suitable Temperature & Humidity Benchmark',
    benchmarkSub:
      'Instant check between the artifact’s suitable safe range and current readings to spot expected environmental shifts:',
    tempCardTitle: 'Temperature (°C)',
    rhCardTitle: 'Relative Humidity (% RH)',
    lblSafeMin: 'Safe Min',
    lblSafeMax: 'Safe Max',
    lblCurrentReading: 'Current',
    safeRangeSummary: (min, max, u) => `Suitable: ${min} – ${max}${u}`,
    statusWithinRange: '● Within Suitable Range',
    statusAboveRange: (d) => `▲ High (+${d} above limit)`,
    statusBelowRange: (d) => `▲ Low (${d} below limit)`,

    envTableTitle: '3. Summary of Essential Environmental Indicators',
    envTableSub: (nom) => `${nom} of 4 Essential Indicators Safe`,
    colIndicator: 'Environmental Indicator',
    colKeyValue: 'Recorded Value',
    colWhatItDetects: 'What It Helps Discover',
    colStatus: 'Status',

    badgeSafe: '● Safe',
    badgeAlert: '▲ Alert',
    badgeRisk: '✖ Risk',

    moistureStatuses: {
      dry_none: 'Dry (No seepage or condensation)',
      condensation_trace: 'Minor surface condensation',
      active_seepage: 'Water seepage / wetness detected',
    },
    unitVibration: 'mm/s vibration',

    indicators: {
      1: {
        num: '1',
        title: 'Temperature',
        shortPurpose: 'Detects chemical decay speed & thermal stress',
      },
      2: {
        num: '2',
        title: 'Relative Humidity',
        shortPurpose: 'Prevents mold growth, corrosion & cracking',
      },
      3: {
        num: '3',
        title: 'Direct Water & Moisture',
        shortPurpose: 'Catches leaks or condensation causing rot & rust',
      },
      4: {
        num: '4',
        title: 'Vibration & Shocks',
        shortPurpose: 'Prevents loose parts shifting & mechanical cracks',
      },
    },

    archiveSafeClimateLine: (tMin, tMax, rhMin, rhMax, nom) =>
      `Safe Range: ${tMin}–${tMax}°C · ${rhMin}–${rhMax}% RH · (${nom}/4 Safe)`,
    passportSafeClimateLabel: 'Suitable Climate Range & Conservation',
    passportSafeClimateValue: (tMin, tMax, rhMin, rhMax, nom) =>
      `Temp ${tMin}–${tMax}°C · RH ${rhMin}–${rhMax}% · (${nom}/4 Essential Safe)`,

    conditionGrades: {
      stable_excellent: 'Stable & Excellent (Exhibition Ready)',
      good_minor_wear: 'Good Condition (Minor Historical Wear)',
      fragile_sensitive: 'Fragile / Sensitive (Strict Microclimate)',
      requires_intervention: 'Requires Active Conservation Intervention',
    },
    researcherToggleTitle:
      'Detailed Documentary Parameters for Official PDF Report (Optional for Researchers)',
    researcherToggleSub:
      'All granular physical and essential environmental telemetry fields below are embedded directly in the exported Official PDF Report.',
    lblInventoryNumber: 'Museum Inventory Number',
    lblDimensionsCm: 'Exact Dimensions (cm)',
    lblWeightGrams: 'Estimated Mass (g)',
    lblConditionGrade: 'Physical Condition Grade',
    lblTempDriftRate: 'Daily Thermal Drift Rate (°C/day)',
    lblRhDailyFluctuation: 'Daily RH Fluctuation (% RH)',
    lblRhOutOfRangeHours: 'Duration Outside Safe RH (hours)',
    lblMoistureDurationHours: 'Direct Moisture Event Duration (h)',
    lblMoistureNotes: 'Seepage / Condensation Observation',
    lblShockEventsCount: 'Recorded Shock Events Count',
    lblVibrationPattern: 'Vibration Frequency & Duration',
  },

  fr: {
    sec3Kicker: 'Étape 03 · Documentation Essentielle',
    sec3Title: '03. L’Artéfact & les Indicateurs Environnementaux Essentiels',
    sec3Subtitle:
      'Documentez l’essentiel de la pièce et fixez ses indicateurs environnementaux clés pour repérer toute variation.',

    anglesReadyShort: (c) => `● ${c} photos jointes (Prêt à enregistrer)`,
    anglesNeededShort: (c) => `▲ Photos (${c}/3) — Au moins 3 photos requises`,
    addPhotosBtn: 'Ajouter des photos',
    newBlankBtn: 'Réinitialiser',

    basicInfoTitle: '1. Informations Essentielles de l’Artéfact',
    lblArtifactName: 'Nom de l’artéfact',
    lblMaterialClass: 'Matériau (Calibre T° & HR automatiquement)',
    materialClasses: {
      stone_limestone: 'Pierre & Calcaire sculpté',
      metals_bronze: 'Bronze, Laiton & Métaux',
      ceramics_glass: 'Céramique & Verre',
      manuscripts_pigments: 'Manuscrits & Parchemins anciens',
      organic_wood_textile: 'Bois, Ivoire & Textiles',
    },
    lblPeriod: 'Période historique',
    lblLocation: 'Lieu / Salle d’exposition',
    lblTeam: 'Équipe de Documentation',
    lblShortNote: 'Note résumée (Optionnel)',
    lblShortNotePlaceholder: 'Motifs, inscriptions ou remarques descriptives...',

    benchmarkTitle: '2. Repères de Température et d’Humidité Adaptés',
    benchmarkSub:
      'Comparaison directe entre la plage idéale de la pièce et la mesure actuelle :',
    tempCardTitle: 'Température (°C)',
    rhCardTitle: 'Humidité Relative (% HR)',
    lblSafeMin: 'Min sûr',
    lblSafeMax: 'Max sûr',
    lblCurrentReading: 'Actuel',
    safeRangeSummary: (min, max, u) => `Idéal : ${min} – ${max}${u}`,
    statusWithinRange: '● Dans la plage idéale',
    statusAboveRange: (d) => `▲ Élevé (+${d})`,
    statusBelowRange: (d) => `▲ Bas (${d})`,

    envTableTitle: '3. Résumé des Indicateurs Environnementaux Essentiels',
    envTableSub: (nom) => `${nom} sur 4 indicateurs essentiels conformes`,
    colIndicator: 'Indicateur',
    colKeyValue: 'Mesure clé',
    colWhatItDetects: 'Ce qu’il permet de détecter',
    colStatus: 'État',

    badgeSafe: '● Sûr',
    badgeAlert: '▲ Alerte',
    badgeRisk: '✖ Risque',

    moistureStatuses: {
      dry_none: 'Sec (Aucune trace d’eau)',
      condensation_trace: 'Légère condensation',
      active_seepage: 'Infiltration / mouillage',
    },
    unitVibration: 'mm/s vibration',

    indicators: {
      1: {
        num: '1',
        title: 'Température',
        shortPurpose: 'Détecte la dégradation chimique et le stress thermique',
      },
      2: {
        num: '2',
        title: 'Humidité Relative',
        shortPurpose: 'Prévient moisissures, corrosion et fissures',
      },
      3: {
        num: '3',
        title: 'Eau & Humidité Directe',
        shortPurpose: 'Repère infiltrations, condensation et corrosion rapide',
      },
      4: {
        num: '4',
        title: 'Vibrations & Chocs',
        shortPurpose: 'Prévient le déplacement de fragments et fissures',
      },
    },

    archiveSafeClimateLine: (tMin, tMax, rhMin, rhMax, nom) =>
      `Climat sûr : ${tMin}–${tMax}°C · ${rhMin}–${rhMax}% HR · (${nom}/4 sûrs)`,
    passportSafeClimateLabel: 'Climat de référence & conservation',
    passportSafeClimateValue: (tMin, tMax, rhMin, rhMax, nom) =>
      `T° ${tMin}–${tMax}°C · HR ${rhMin}–${rhMax}% · (${nom}/4 essentiels sûrs)`,

    conditionGrades: {
      stable_excellent: 'Stable & Excellent (Prêt pour exposition)',
      good_minor_wear: 'Bon état (Usure historique légère)',
      fragile_sensitive: 'Fragile / Sensible (Microclimat strict)',
      requires_intervention: 'Intervention de restauration requise',
    },
    researcherToggleTitle:
      'Paramètres Documentaires Détaillés pour le Rapport Officiel PDF (Optionnel — Chercheurs)',
    researcherToggleSub:
      'L’ensemble de ces mesures détaillées est automatiquement inclus dans le rapport documentaire officiel exporté en PDF.',
    lblInventoryNumber: 'Numéro d’inventaire muséal',
    lblDimensionsCm: 'Dimensions exactes (cm)',
    lblWeightGrams: 'Masse estimée (g)',
    lblConditionGrade: 'État de conservation physique',
    lblTempDriftRate: 'Variation thermique quotidienne (°C/j)',
    lblRhDailyFluctuation: 'Fluctuation quotidienne HR (% HR)',
    lblRhOutOfRangeHours: 'Durée hors plage HR (heures)',
    lblMoistureDurationHours: 'Durée d’humidité directe (heures)',
    lblMoistureNotes: 'Observations d’infiltration / condensation',
    lblShockEventsCount: 'Nombre d’événements de choc',
    lblVibrationPattern: 'Fréquence et durée des vibrations',
  },

  zh: {
    sec3Kicker: '步骤 03 · 精简核心记录',
    sec3Title: '03. 文物与核心基础环境指标',
    sec3Subtitle:
      '简洁记录文物关键信息，设定核心基础环境指标基准，直观监测预期微环境变化。',

    anglesReadyShort: (c) => `● 已附 ${c} 张文物照片（可立即保存）`,
    anglesNeededShort: (c) => `▲ 当前照片 (${c}/3) — 至少需 3 张照片方可保存`,
    addPhotosBtn: '添加照片',
    newBlankBtn: '清空重填',

    basicInfoTitle: '1. 文物核心基本信息',
    lblArtifactName: '文物名称',
    lblMaterialClass: '材质类型（自动匹配适宜温湿度）',
    materialClasses: {
      stone_limestone: '石刻与石灰岩',
      metals_bronze: '青铜、黄铜与金属',
      ceramics_glass: '陶瓷与玻璃器',
      manuscripts_pigments: '古籍善本与敏感纸绢',
      organic_wood_textile: '木器与丝织有机质',
    },
    lblPeriod: '历史年代',
    lblLocation: '出土地或展厅位置',
    lblTeam: '记录团队名称',
    lblShortNote: '简要说明（选填）',
    lblShortNotePlaceholder: '文物纹饰、铭文或保存特征要点...',

    benchmarkTitle: '2. 适宜温度与相对湿度基准指标',
    benchmarkSub: '直观对比适宜安全区间与当前实测值，快速发现潜在环境变化：',
    tempCardTitle: '温度 (°C)',
    rhCardTitle: '相对湿度 (% RH)',
    lblSafeMin: '适宜下限',
    lblSafeMax: '适宜上限',
    lblCurrentReading: '当前实测',
    safeRangeSummary: (min, max, u) => `适宜区间：${min} – ${max}${u}`,
    statusWithinRange: '● 处于适宜区间',
    statusAboveRange: (d) => `▲ 偏高 (+${d})`,
    statusBelowRange: (d) => `▲ 偏低 (${d})`,

    envTableTitle: '3. 核心基础环境监测指标简表',
    envTableSub: (nom) => `${nom}/4 项核心指标安全达标`,
    colIndicator: '环境指标',
    colKeyValue: '核心记录值',
    colWhatItDetects: '帮助发现什么风险？',
    colStatus: '状态',

    badgeSafe: '● 安全',
    badgeAlert: '▲ 预警',
    badgeRisk: '✖ 风险',

    moistureStatuses: {
      dry_none: '完全干燥（无渗水结露）',
      condensation_trace: '轻微表面结露',
      active_seepage: '发现渗水或受潮',
    },
    unitVibration: 'mm/s 振动',

    indicators: {
      1: {
        num: '1',
        title: '温度',
        shortPurpose: '发现加速化学劣化与热胀冷缩应力',
      },
      2: {
        num: '2',
        title: '相对湿度',
        shortPurpose: '防范霉菌滋生、金属腐蚀与干裂变形',
      },
      3: {
        num: '3',
        title: '水与直接潮湿',
        shortPurpose: '排查渗水与结露引发的急性霉变锈蚀',
      },
      4: {
        num: '4',
        title: '振动与冲击',
        shortPurpose: '防止脆弱部件移位或机械微裂纹扩展',
      },
    },

    archiveSafeClimateLine: (tMin, tMax, rhMin, rhMax, nom) =>
      `适宜温湿度：${tMin}–${tMax}°C · ${rhMin}–${rhMax}% RH · (${nom}/4 项安全)`,
    passportSafeClimateLabel: '适宜微环境基准与保护状态',
    passportSafeClimateValue: (tMin, tMax, rhMin, rhMax, nom) =>
      `温度 ${tMin}–${tMax}°C · 湿度 ${rhMin}–${rhMax}% RH · (${nom}/4 项核心指标安全)`,

    conditionGrades: {
      stable_excellent: '稳定优良（具备展陈条件）',
      good_minor_wear: '保存良好（轻微历史风化痕迹）',
      fragile_sensitive: '脆弱敏感（需严格恒温恒湿控制）',
      requires_intervention: '亟需保护修复干预',
    },
    researcherToggleTitle: '官方 PDF 文献报告详细监测参数（供研究人员与鉴定专家选填）',
    researcherToggleSub: '以下所有精细物理规格与核心环境监测子项均将完整写入导出的官方 PDF 档案报告。',
    lblInventoryNumber: '馆藏库房登记号',
    lblDimensionsCm: '精确尺寸 (cm)',
    lblWeightGrams: '估算重量 (g)',
    lblConditionGrade: '文物本体保存状况等级',
    lblTempDriftRate: '日均温度变化率 (°C/天)',
    lblRhDailyFluctuation: '相对湿度日波动幅度 (% RH)',
    lblRhOutOfRangeHours: '超出适宜湿度持续时长 (小时)',
    lblMoistureDurationHours: '直接受潮或结露持续时长 (小时)',
    lblMoistureNotes: '渗水/结露现场记录说明',
    lblShockEventsCount: '记录冲击事件次数',
    lblVibrationPattern: '振动频率、持续时间与特征',
  },

  ru: {
    sec3Kicker: 'Шаг 03 · Основные данные и климат',
    sec3Title: '03. Артефакт и базовые показатели среды',
    sec3Subtitle:
      'Запишите основные данные о предмете и задайте базовые экологические показатели для контроля изменений среды.',

    anglesReadyShort: (c) => `● Прикреплено ${c} фото (Готово к сохранению)`,
    anglesNeededShort: (c) => `▲ Фото (${c}/3) — Нужно минимум 3 фото для сохранения`,
    addPhotosBtn: 'Добавить фото',
    newBlankBtn: 'Очистить поля',

    basicInfoTitle: '1. Основные сведения об артефакте',
    lblArtifactName: 'Название артефакта',
    lblMaterialClass: 'Материал (автовыбор норм T° и RH)',
    materialClasses: {
      stone_limestone: 'Камень и резной известняк',
      metals_bronze: 'Бронза, латунь и металлы',
      ceramics_glass: 'Керамика и стекло',
      manuscripts_pigments: 'Рукописи и древние пергамены',
      organic_wood_textile: 'Дерево, кость и текстиль',
    },
    lblPeriod: 'Исторический период',
    lblLocation: 'Место находки / Зал',
    lblTeam: 'Команда документирования',
    lblShortNote: 'Краткое описание (необязательно)',
    lblShortNotePlaceholder: 'Основные орнаменты, надписи или примечания...',

    benchmarkTitle: '2. Оптимальная температура и влажность для артефакта',
    benchmarkSub:
      'Наглядное сравнение безопасного диапазона и текущих показаний:',
    tempCardTitle: 'Температура (°C)',
    rhCardTitle: 'Влажность (% RH)',
    lblSafeMin: 'Мин.',
    lblSafeMax: 'Макс.',
    lblCurrentReading: 'Текущая',
    safeRangeSummary: (min, max, u) => `Норма: ${min} – ${max}${u}`,
    statusWithinRange: '● В пределах нормы',
    statusAboveRange: (d) => `▲ Выше (+${d})`,
    statusBelowRange: (d) => `▲ Ниже (${d})`,

    envTableTitle: '3. Сводка базовых экологических показателей',
    envTableSub: (nom) => `${nom} из 4 базовых показателей в норме`,
    colIndicator: 'Показатель',
    colKeyValue: 'Значение',
    colWhatItDetects: 'Что помогает выявить?',
    colStatus: 'Статус',

    badgeSafe: '● Норма',
    badgeAlert: '▲ Внимание',
    badgeRisk: '✖ Риск',

    moistureStatuses: {
      dry_none: 'Сухо (без протечек и конденсата)',
      condensation_trace: 'Лёгкий конденсат',
      active_seepage: 'Протечка / намокание',
    },
    unitVibration: 'mm/s вибрация',

    indicators: {
      1: {
        num: '1',
        title: 'Температура',
        shortPurpose: 'Риск химического старения и теплового стресса',
      },
      2: {
        num: '2',
        title: 'Относительная влажность',
        shortPurpose: 'Защита от плесени, коррозии и трещин',
      },
      3: {
        num: '3',
        title: 'Прямая влага и вода',
        shortPurpose: 'Контроль протечек и конденсата',
      },
      4: {
        num: '4',
        title: 'Вибрация и удары',
        shortPurpose: 'Защита хрупких деталей от смещения',
      },
    },

    archiveSafeClimateLine: (tMin, tMax, rhMin, rhMax, nom) =>
      `Норма: ${tMin}–${tMax}°C · ${rhMin}–${rhMax}% RH · (${nom}/4 в норме)`,
    passportSafeClimateLabel: 'Эталонный климат и сохранность',
    passportSafeClimateValue: (tMin, tMax, rhMin, rhMax, nom) =>
      `T° ${tMin}–${tMax}°C · RH ${rhMin}–${rhMax}% · (${nom}/4 базовых в норме)`,

    conditionGrades: {
      stable_excellent: 'Стабильное отличное (готово к экспозиции)',
      good_minor_wear: 'Хорошее (незначительные следы бытования)',
      fragile_sensitive: 'Хрупкое / чувствительное (строгий микроклимат)',
      requires_intervention: 'Требуется консервационное вмешательство',
    },
    researcherToggleTitle:
      'Подробные параметры для официального PDF-отчёта (дополнительно для исследователей)',
    researcherToggleSub:
      'Все детальные физические и базовые экологические показатели ниже автоматически включаются в официальный документальный отчёт PDF.',
    lblInventoryNumber: 'Инвентарный номер хранения',
    lblDimensionsCm: 'Точные размеры (см)',
    lblWeightGrams: 'Масса предмета (г)',
    lblConditionGrade: 'Категория физического состояния',
    lblTempDriftRate: 'Суточная скорость изменения T° (°C/сут)',
    lblRhDailyFluctuation: 'Суточное колебание влажности (% RH)',
    lblRhOutOfRangeHours: 'Время вне нормы влажности (часы)',
    lblMoistureDurationHours: 'Длительность воздействия влаги (ч)',
    lblMoistureNotes: 'Примечания по протечкам / конденсату',
    lblShockEventsCount: 'Число ударных воздействий',
    lblVibrationPattern: 'Частота и характер вибрации',
  },
};
