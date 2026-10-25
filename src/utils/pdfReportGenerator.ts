import { jsPDF } from 'jspdf';
import { TEAM_CREDITS_I18N } from '../components/TeamCreditsModal';
import { CONSERVATION_STRINGS } from '../i18n/conservationStrings';
import {
  getDirectionLabel,
  PRESET_METADATA,
} from '../i18n/domainTranslations';
import { UI_STRINGS } from '../i18n/uiStrings';
import {
  ArtifactConditionGrade,
  ArtifactEnvironmentalProfile,
  DocumentedArtifact,
  LocaleCode,
} from '../types/artifact';
import {
  ConservationStatusLevel,
  createDefaultEnvironmentalProfile,
  evaluateEnvironmentalProfile,
} from './conservationEngine';
import { loadImageElement } from './imageAnalysis';
import { getCountryDisplayName } from './worldCountries';

interface PdfLocalizedCopy {
  docTitle: string;
  docKicker: string;
  docSubtitle: string;
  refNoLabel: string;
  invNoLabel: string;
  issuedAtLabel: string;
  stabilityScoreLabel: string;
  pageCounter: (curr: number, total: number) => string;

  sec1Heading: string;
  lblArtifactTitle: string;
  lblPeriod: string;
  lblMaterialAndClass: string;
  lblDimensionsAndWeight: string;
  lblCondition: string;
  lblLocation: string;
  lblResearchTeam: string;
  lblCuratorialNotes: string;
  defaultNotesFallback: string;

  sec2Heading: string;
  kpiViews: string;
  kpiCoverage: string;
  kpiLightUniformity: string;
  kpiReliefDensity: string;
  kpiMeanSharpness: string;
  angleStatsLine: (az: number, sharp: number, bright: number) => string;

  sec3Heading: string;
  tempGaugeLabel: string;
  rhGaugeLabel: string;
  safeRangeTag: (min: number, max: number, unit: string) => string;
  currentValTag: (val: number, unit: string) => string;
  driftRateTag: (rate: number, unit: string) => string;
  outOfRangeHrsTag: (hrs: number) => string;

  sec4Heading: string;
  colNumTitle: string;
  colFullTelemetry: string;
  colDiagnosticPurpose: string;
  colEvalScore: string;

  row1Detail: (p: ArtifactEnvironmentalProfile) => string;
  row2Detail: (p: ArtifactEnvironmentalProfile) => string;
  row3Detail: (p: ArtifactEnvironmentalProfile, statusText: string) => string;
  row4Detail: (p: ArtifactEnvironmentalProfile) => string;

  sec5Heading: string;
  synthesisNominal: (score: number, tMin: number, tMax: number, rhMin: number, rhMax: number) => string;
  synthesisAlert: (score: number, warnCount: number, critCount: number, flaggedNames: string) => string;
  recommendationLine: string;

  sec6Heading: string;
  sigResearcherTitle: string;
  sigResearcherSub: string;
  sigConservationTitle: string;
  sigConservationSub: string;
  sigSealTitle: string;
  sealOuterTop: string;
  sealCenterMain: string;
  sealCenterSub: string;
  footerDisclaimer: string;
}

const PDF_COPY: Record<LocaleCode, PdfLocalizedCopy> = {
  ar: {
    docTitle: 'التقرير الوثائقي والبيئي الرسمي للقطعة الأثرية',
    docKicker: 'منصة الحارس الذكي · SMART GUARDIAN — مرجع وثائقي رسمي للباحثين والموثقين',
    docSubtitle:
      'سجل مرجعي معتمد يتضمن البطاقة التعريفية، التوثيق البصري متعدد الاتجاهات، والمؤشرات البيئية الأساسية للحفظ الوقائي',
    refNoLabel: 'رقم القيد الرسمي',
    invNoLabel: 'الرقم المخزني',
    issuedAtLabel: 'تاريخ التوثيق والإصدار',
    stabilityScoreLabel: 'مؤشر الاستقرار البيئي العام',
    pageCounter: (c, tot) => `صفحة ${c} من ${tot}`,

    sec1Heading: 'أولاً: البيانات التعريفية والتوثيقية والمواصفات الفيزيائية للقطعة الأثرية',
    lblArtifactTitle: 'اسم القطعة الأثرية',
    lblPeriod: 'الحقبة التاريخية',
    lblMaterialAndClass: 'مادة الصنع وفئة الحساسية',
    lblDimensionsAndWeight: 'الأبعاد والوزن التقديري',
    lblCondition: 'درجة الحالة الفيزيائية',
    lblLocation: 'موقع الاكتشاف / القاعة المتحفية',
    lblResearchTeam: 'فريق التوثيق والجهة المعتمدة',
    lblCuratorialNotes: 'الوصف الأثري والملاحظات البحثية والتوثيقية:',
    defaultNotesFallback:
      'قطعة أثرية موثقة بصرياً من عدة اتجاهات ومفحوصة وفق معايير المؤشرات البيئية الأساسية للحفظ الوقائي.',

    sec2Heading: 'ثانياً: التوثيق البصري متعدد الاتجاهات وتحليل التضاريس السطحية',
    kpiViews: 'الاتجاهات الموثقة',
    kpiCoverage: 'التغطية الزاوية',
    kpiLightUniformity: 'تجانس الإضاءة',
    kpiReliefDensity: 'كثافة النقش البارز',
    kpiMeanSharpness: 'متوسط الحدّة البصرية',
    angleStatsLine: (az, s, b) => `زاوية ${az}° · حدّة ${s}% · سطوع ${b}%`,

    sec3Heading: 'ثالثاً: المؤشر المرجعي لدرجة الحرارة ونسبة الرطوبة المناسبة للقطعة',
    tempGaugeLabel: '١. نطاق درجة الحرارة المناسبة (°C)',
    rhGaugeLabel: '٢. نطاق الرطوبة النسبية المناسبة (% RH)',
    safeRangeTag: (min, max, u) => `النطاق المناسب الآمن: ${min} – ${max}${u}`,
    currentValTag: (v, u) => `القراءة المسجلة: ${v}${u}`,
    driftRateTag: (r, u) => `معدل التغير اليومي: ±${r}${u}`,
    outOfRangeHrsTag: (h) => `ساعات خارج النطاق: ${h} ساعة`,

    sec4Heading: 'رابعاً: السجل التفصيلي للمؤشرات البيئية الأساسية المسجّلة للحفظ الوقائي',
    colNumTitle: 'المؤشر البيئي الأساسي',
    colFullTelemetry: 'كافة البيانات والقراءات البيئية الأساسية المسجّلة',
    colDiagnosticPurpose: 'الأهمية التشخيصية والوقائية',
    colEvalScore: 'التقييم',

    row1Detail: (p) =>
      `الحالية: ${p.tempCurrentC}°C | النطاق المناسب: ${p.tempSafeMinC}–${p.tempSafeMaxC}°C | معدل التغير اليومي: ±${p.tempChangeRateCPerDay}°C/يوم`,
    row2Detail: (p) =>
      `الحالية: ${p.rhCurrentPct}% RH | النطاق المناسب: ${p.rhSafeMinPct}–${p.rhSafeMaxPct}% | التذبذب اليومي: ±${p.rhDailyFluctuationPct}% | خارج النطاق: ${p.rhOutOfRangeHours} ساعة`,
    row3Detail: (p, st) =>
      `الحالة: ${st} | مدة الحدث: ${p.directMoistureDurationHours} ساعة | الملاحظات: ${p.directMoistureNotes}`,
    row4Detail: (p) =>
      `ذروة الاهتزاز: ${p.vibrationPeakMmPerSec} mm/s | أحداث الصدمات: ${p.shockEventsCount} | النمط والتكرار: ${p.vibrationFrequencyDuration}`,

    sec5Heading: 'خامساً: الخلاصة التشخيصية والتوصيات المرجعية للباحثين والموثقين',
    synthesisNominal: (score, tMin, tMax, rhMin, rhMax) =>
      `تشير قراءات الرصد البيئي إلى استقرار وقائي ممتاز بنسبة (${score}%)؛ حيث تقع جميع المؤشرات البيئية الأساسية ضمن الحدود المرجعية الآمنة للمادة، مع التزام دقيق بنطاق الحرارة (${tMin}–${tMax}°C) والرطوبة النسبية (${rhMin}–${rhMax}% RH).`,
    synthesisAlert: (score, warn, crit, names) =>
      `سجّل التقييم البيئي العام مؤشر استقرار (${score}%) مع رصد (${warn}) مؤشرات في نطاق التنبيه و(${crit}) في نطاق الخطر في كل من: [${names}]. يُوصى بضبط بيئة الحفظ فوراً لإعادة القراءات إلى النطاق المرجعي للقطعة.`,
    recommendationLine:
      'التوصية المرجعية: يُعتمد هذا التقرير كسجل وثائقي أساسي للمقارنة الدورية ورصد أي تغيرات مناخية أو فيزيائية مستقبلية على القطعة الأثرية.',

    sec6Heading: 'سادساً: الاعتماد الرسمي وتوقيع الباحثين والموثقين',
    sigResearcherTitle: 'اعتماد الباحث / فريق التوثيق الأثري',
    sigResearcherSub: 'التوقيع والمصادقة على صحة البيانات الوصفية والبصرية',
    sigConservationTitle: 'مصادقة مختبر الحفظ الوقائي والبيئي',
    sigConservationSub: 'تم تدقيق المؤشرات البيئية الأساسية ومعايير المادة',
    sigSealTitle: 'الختم الوثائقي الرسمي للمنصة',
    sealOuterTop: 'SMART GUARDIAN · ARCHIVAL SEAL',
    sealCenterMain: 'مُعتَمَد رسمياً',
    sealCenterSub: 'CERTIFIED PDF',
    footerDisclaimer:
      'وثيقة رسمية صادرة إلكترونياً عبر منصة الحارس الذكي (Smart Guardian) للتوثيق والحفظ الوقائي للآثار.',
  },

  'en-US': {
    docTitle: 'Official Archaeological & Environmental Documentary Report',
    docKicker: 'SMART GUARDIAN PLATFORM — OFFICIAL REFERENCE DOSSIER FOR RESEARCHERS & AUTHENTICATORS',
    docSubtitle:
      'Certified archival record containing provenance attribution, multi-angle optical documentation, and essential environmental indicators',
    refNoLabel: 'Official Accession No.',
    invNoLabel: 'Inventory Code',
    issuedAtLabel: 'Certification Date',
    stabilityScoreLabel: 'Environmental Stability Index',
    pageCounter: (c, tot) => `Page ${c} of ${tot}`,

    sec1Heading: 'I. Artifact Attribution, Provenance & Physical Record',
    lblArtifactTitle: 'Artifact Title',
    lblPeriod: 'Historical Period',
    lblMaterialAndClass: 'Material & Sensitivity Class',
    lblDimensionsAndWeight: 'Dimensions & Estimated Mass',
    lblCondition: 'Physical Condition Grade',
    lblLocation: 'Discovery Site / Gallery Wing',
    lblResearchTeam: 'Documentation & Research Team',
    lblCuratorialNotes: 'Curatorial Attribution, Epigraphy & Research Notes:',
    defaultNotesFallback:
      'Multi-angle optically documented heritage artifact verified against essential preventive conservation standards.',

    sec2Heading: 'II. Multi-Angle Optical Documentation & Surface Relief Analysis',
    kpiViews: 'Verified Views',
    kpiCoverage: 'Angular Coverage',
    kpiLightUniformity: 'Surface Uniformity',
    kpiReliefDensity: 'Relief Edge Density',
    kpiMeanSharpness: 'Mean Optical Sharpness',
    angleStatsLine: (az, s, b) => `Azimuth ${az}° · Sharp ${s}% · Tone ${b}%`,

    sec3Heading: 'III. Primary Microclimate Benchmark — Suitable Temperature & Relative Humidity',
    tempGaugeLabel: '1. Suitable Temperature Benchmark (°C)',
    rhGaugeLabel: '2. Suitable Relative Humidity Benchmark (% RH)',
    safeRangeTag: (min, max, u) => `Suitable Safe Range: ${min} – ${max}${u}`,
    currentValTag: (v, u) => `Recorded Reading: ${v}${u}`,
    driftRateTag: (r, u) => `Daily Drift Rate: ±${r}${u}`,
    outOfRangeHrsTag: (h) => `Out-of-Range Duration: ${h} h`,

    sec4Heading: 'IV. Essential Preventive Conservation Environmental Indicators',
    colNumTitle: 'Essential Indicator',
    colFullTelemetry: 'Recorded Essential Environmental Measurements & Sub-Parameters',
    colDiagnosticPurpose: 'Preventive Diagnostic Purpose',
    colEvalScore: 'Evaluation',

    row1Detail: (p) =>
      `Current: ${p.tempCurrentC}°C | Suitable: ${p.tempSafeMinC}–${p.tempSafeMaxC}°C | Thermal Drift Rate: ±${p.tempChangeRateCPerDay}°C/day`,
    row2Detail: (p) =>
      `Current: ${p.rhCurrentPct}% RH | Suitable: ${p.rhSafeMinPct}–${p.rhSafeMaxPct}% | Daily Fluctuation: ±${p.rhDailyFluctuationPct}% | Out-of-Range: ${p.rhOutOfRangeHours} h`,
    row3Detail: (p, st) =>
      `Status: ${st} | Event Duration: ${p.directMoistureDurationHours} h | Notes: ${p.directMoistureNotes}`,
    row4Detail: (p) =>
      `Peak Velocity: ${p.vibrationPeakMmPerSec} mm/s | Shock Events: ${p.shockEventsCount} | Pattern: ${p.vibrationFrequencyDuration}`,

    sec5Heading: 'V. Conservation Synthesis & Official Archival Recommendations',
    synthesisNominal: (score, tMin, tMax, rhMin, rhMax) =>
      `Preventive conservation telemetry confirms an overall environmental stability index of ${score}%. All essential environmental indicators are within safe museum thresholds, maintaining the prescribed microclimate band of ${tMin}–${tMax}°C and ${rhMin}–${rhMax}% RH.`,
    synthesisAlert: (score, warn, crit, names) =>
      `Environmental audit recorded an overall stability index of ${score}%, with ${warn} warning(s) and ${crit} critical risk(s) affecting: [${names}]. Immediate microclimate stabilization is recommended to restore readings to the artifact’s safe baseline.`,
    recommendationLine:
      'Documentary Attestation: Retained as an official baseline reference for researchers, conservators, and museum registrars during periodic audits.',

    sec6Heading: 'VI. Official Authentication, Conservation Audit & Archival Seal',
    sigResearcherTitle: 'Lead Researcher / Authenticator',
    sigResearcherSub: 'Verified attribution & multi-angle optical record',
    sigConservationTitle: 'Preventive Conservation Audit',
    sigConservationSub: 'Essential environmental indicators verified against material class',
    sigSealTitle: 'Official Smart Guardian Seal',
    sealOuterTop: 'SMART GUARDIAN · OFFICIAL DOSSIER',
    sealCenterMain: 'CERTIFIED',
    sealCenterSub: 'ARCHIVAL PDF',
    footerDisclaimer:
      'Official documentary reference generated by the Smart Guardian Archaeological Documentation & Preventive Conservation Platform.',
  },

  fr: {
    docTitle: 'Rapport Documentaire et Environnemental Officiel de l’Artéfact',
    docKicker: 'PLATEFORME SMART GUARDIAN — RÉFÉRENCE OFFICIELLE POUR CHERCHEURS & CONSERVATEURS',
    docSubtitle:
      'Dossier d’archive certifié regroupant l’attribution muséale, la prise de vue multi-angles et les indicateurs environnementaux essentiels',
    refNoLabel: 'Cote Officielle',
    invNoLabel: 'N° d’Inventaire',
    issuedAtLabel: 'Date d’Émission',
    stabilityScoreLabel: 'Indice de Stabilité Climatique',
    pageCounter: (c, tot) => `Page ${c} sur ${tot}`,

    sec1Heading: 'I. Identification Muséale, Provenance & État Physique',
    lblArtifactTitle: 'Désignation de l’Artéfact',
    lblPeriod: 'Période Historique',
    lblMaterialAndClass: 'Matériau & Classe de Sensibilité',
    lblDimensionsAndWeight: 'Dimensions & Masse Estimée',
    lblCondition: 'État de Conservation Physique',
    lblLocation: 'Lieu de Découverte / Salle',
    lblResearchTeam: 'Équipe de Recherche & Documentation',
    lblCuratorialNotes: 'Notes Scientifiques, Épigraphie & Observations :',
    defaultNotesFallback:
      'Pièce patrimoniale documentée sous angles multiples et contrôlée selon les indicateurs environnementaux essentiels de conservation préventive.',

    sec2Heading: 'II. Relevé Optique Multi-Angles & Analyse du Relief de Surface',
    kpiViews: 'Vues Certifiées',
    kpiCoverage: 'Couverture Angulaire',
    kpiLightUniformity: 'Homogénéité Tonale',
    kpiReliefDensity: 'Densité du Relief',
    kpiMeanSharpness: 'Netteté Moyenne',
    angleStatsLine: (az, s, b) => `Azimut ${az}° · Netteté ${s}% · Ton ${b}%`,

    sec3Heading: 'III. Référentiel Microclimatique — Température et Humidité Adaptées',
    tempGaugeLabel: '1. Plage de Température Recommandée (°C)',
    rhGaugeLabel: '2. Plage d’Humidité Relative Recommandée (% HR)',
    safeRangeTag: (min, max, u) => `Plage idéale sûre : ${min} – ${max}${u}`,
    currentValTag: (v, u) => `Mesure enregistrée : ${v}${u}`,
    driftRateTag: (r, u) => `Variation quotidienne : ±${r}${u}`,
    outOfRangeHrsTag: (h) => `Durée hors plage : ${h} h`,

    sec4Heading: 'IV. Relevé des Indicateurs Environnementaux Essentiels de Conservation Préventive',
    colNumTitle: 'Indicateur Essentiel',
    colFullTelemetry: 'Mesures Essentielles et Sous-Paramètres Enregistrés',
    colDiagnosticPurpose: 'Objectif Diagnostique Préventif',
    colEvalScore: 'Évaluation',

    row1Detail: (p) =>
      `Actuelle : ${p.tempCurrentC}°C | Plage sûre : ${p.tempSafeMinC}–${p.tempSafeMaxC}°C | Dérive thermique : ±${p.tempChangeRateCPerDay}°C/j`,
    row2Detail: (p) =>
      `Actuelle : ${p.rhCurrentPct}% HR | Plage sûre : ${p.rhSafeMinPct}–${p.rhSafeMaxPct}% | Fluctuation/j : ±${p.rhDailyFluctuationPct}% | Hors plage : ${p.rhOutOfRangeHours} h`,
    row3Detail: (p, st) =>
      `État : ${st} | Durée d’événement : ${p.directMoistureDurationHours} h | Notes : ${p.directMoistureNotes}`,
    row4Detail: (p) =>
      `Pic vibratoire : ${p.vibrationPeakMmPerSec} mm/s | Chocs : ${p.shockEventsCount} | Régime : ${p.vibrationFrequencyDuration}`,

    sec5Heading: 'V. Synthèse Diagnostique & Recommandations de Conservation',
    synthesisNominal: (score, tMin, tMax, rhMin, rhMax) =>
      `L’audit environnemental atteste un indice global de stabilité de ${score}%. Tous les indicateurs environnementaux essentiels respectent les seuils muséaux, maintenant le microclimat prescrit (${tMin}–${tMax}°C et ${rhMin}–${rhMax}% HR).`,
    synthesisAlert: (score, warn, crit, names) =>
      `L’audit indique un indice de stabilité de ${score}% avec ${warn} alerte(s) et ${crit} risque(s) critique(s) sur : [${names}]. Une régulation microclimatique immédiate est recommandée.`,
    recommendationLine:
      'Valeur probante : Ce rapport constitue une pièce documentaire officielle de référence pour le suivi scientifique périodique.',

    sec6Heading: 'VI. Authentification Scientifique, Visa de Conservation & Sceau Officiel',
    sigResearcherTitle: 'Chercheur / Responsable Documentaire',
    sigResearcherSub: 'Attribution et dossier optique multi-angles vérifiés',
    sigConservationTitle: 'Audit de Conservation Préventive',
    sigConservationSub: 'Validation complète des indicateurs environnementaux essentiels',
    sigSealTitle: 'Sceau Numérique Smart Guardian',
    sealOuterTop: 'SMART GUARDIAN · DOSSIER OFFICIEL',
    sealCenterMain: 'CERTIFIÉ',
    sealCenterSub: 'ARCHIVE PDF',
    footerDisclaimer:
      'Document officiel généré par la plateforme internationale Smart Guardian de préservation archéologique.',
  },

  zh: {
    docTitle: '文物数字化保护与微环境监测官方完整文献报告',
    docKicker: 'SMART GUARDIAN 智慧守护者 — 供研究人员与文物鉴定专家使用的官方档案参考',
    docSubtitle:
      '权威认证档案：完整收录文物考证信息、多角度光学影像及核心基础环境指标监测数据',
    refNoLabel: '官方档案编号',
    invNoLabel: '库房登记号',
    issuedAtLabel: '报告签发日期',
    stabilityScoreLabel: '环境稳定综合指数',
    pageCounter: (c, tot) => `第 ${c} 页 / 共 ${tot} 页`,

    sec1Heading: '一、 文物考证属性、来源与本体保存状况',
    lblArtifactTitle: '文物标准名称',
    lblPeriod: '历史年代',
    lblMaterialAndClass: '材质与敏感度分级',
    lblDimensionsAndWeight: '几何尺寸与估算重量',
    lblCondition: '本体保存状况等级',
    lblLocation: '出土地点 / 馆藏展厅',
    lblResearchTeam: '记录与科研认证团队',
    lblCuratorialNotes: '文物纹饰特征、铭文考证与研究备注：',
    defaultNotesFallback:
      '本件文物已完成多方位非接触式光学影像采集，并依据博物馆预防性保护标准完成核心基础环境指标核验。',

    sec2Heading: '二、 多角度光学采集序列与表面浮雕机理分析',
    kpiViews: '已认证方位数',
    kpiCoverage: '周向角度覆盖',
    kpiLightUniformity: '色调均匀度',
    kpiReliefDensity: '纹饰浮雕密度',
    kpiMeanSharpness: '平均边缘锐度',
    angleStatsLine: (az, s, b) => `方位 ${az}° · 锐度 ${s}% · 亮度 ${b}%`,

    sec3Heading: '三、 核心微环境基准 — 文物适宜温度与相对湿度安全区间',
    tempGaugeLabel: '1. 适宜温度安全基准 (°C)',
    rhGaugeLabel: '2. 适宜相对湿度安全基准 (% RH)',
    safeRangeTag: (min, max, u) => `适宜安全区间：${min} – ${max}${u}`,
    currentValTag: (v, u) => `当前实测记录：${v}${u}`,
    driftRateTag: (r, u) => `日均变化率：±${r}${u}`,
    outOfRangeHrsTag: (h) => `超限持续时长：${h} 小时`,

    sec4Heading: '四、 预防性保护核心基础环境指标完整监测总表',
    colNumTitle: '核心环境指标',
    colFullTelemetry: '已登记完整环境实测数值与细分监测参数',
    colDiagnosticPurpose: '预防性保护诊断意义',
    colEvalScore: '评估状态',

    row1Detail: (p) =>
      `当前：${p.tempCurrentC}°C | 适宜区间：${p.tempSafeMinC}–${p.tempSafeMaxC}°C | 日均温变率：±${p.tempChangeRateCPerDay}°C/天`,
    row2Detail: (p) =>
      `当前：${p.rhCurrentPct}% RH | 适宜区间：${p.rhSafeMinPct}–${p.rhSafeMaxPct}% | 日波动：±${p.rhDailyFluctuationPct}% | 超限时长：${p.rhOutOfRangeHours} 小时`,
    row3Detail: (p, st) =>
      `当前状态：${st} | 持续时长：${p.directMoistureDurationHours} 小时 | 现场说明：${p.directMoistureNotes}`,
    row4Detail: (p) =>
      `峰值振速：${p.vibrationPeakMmPerSec} mm/s | 冲击次数：${p.shockEventsCount} | 振动特征：${p.vibrationFrequencyDuration}`,

    sec5Heading: '五、 预防性保护综合诊断结论与研究人员参考建议',
    synthesisNominal: (score, tMin, tMax, rhMin, rhMax) =>
      `微环境综合评估稳定指数达 ${score}%。全部核心基础环境指标均处于馆藏安全阈值内，严格维持在适宜温度（${tMin}–${tMax}°C）与相对湿度（${rhMin}–${rhMax}% RH）基准区间。`,
    synthesisAlert: (score, warn, crit, names) =>
      `微环境综合稳定指数为 ${score}%，其中 ${warn} 项预警、${crit} 项高风险，涉及指标：[${names}]。建议立即开展微环境恒温恒湿调控与减振保护。`,
    recommendationLine:
      '文献参考效力：本 PDF 报告作为官方基准文献档案，供研究人员、文保工程师及藏品管理员开展周期性比对核查。',

    sec6Heading: '六、 研究员与鉴定专家签章及官方数字认证印鉴',
    sigResearcherTitle: '首席研究员 / 文物建档鉴定人',
    sigResearcherSub: '文物考证信息与多角度光学影像核验签字',
    sigConservationTitle: '预防性保护环境审核专员',
    sigConservationSub: '核心基础环境实测参数与材质阈值合规核准',
    sigSealTitle: '智慧守护者官方数字印鉴',
    sealOuterTop: 'SMART GUARDIAN · OFFICIAL ARCHIVE',
    sealCenterMain: '官方认证档案',
    sealCenterSub: 'CERTIFIED PDF',
    footerDisclaimer:
      '本官方文献报告由 Smart Guardian（智慧守护者）多角度文物数字化与预防性保护平台自动签发。',
  },

  ru: {
    docTitle: 'Официальный документальный и экологический отчёт об артефакте',
    docKicker: 'ПЛАТФОРМА SMART GUARDIAN — ОФИЦИАЛЬНЫЙ СПРАВОЧНЫЙ ДОКУМЕНТ ДЛЯ ИССЛЕДОВАТЕЛЕЙ',
    docSubtitle:
      'Заверенное архивное досье: музейная атрибуция, многоракурсная фотофиксация и основные экологические показатели превентивной консервации',
    refNoLabel: 'Регистрационный №',
    invNoLabel: 'Инвентарный №',
    issuedAtLabel: 'Дата выпуска',
    stabilityScoreLabel: 'Индекс стабильности среды',
    pageCounter: (c, tot) => `Стр. ${c} из ${tot}`,

    sec1Heading: 'I. Музейная атрибуция, происхождение и физическое состояние',
    lblArtifactTitle: 'Название артефакта',
    lblPeriod: 'Исторический период',
    lblMaterialAndClass: 'Материал и класс чувствительности',
    lblDimensionsAndWeight: 'Размеры и расчётная масса',
    lblCondition: 'Физическая сохранность',
    lblLocation: 'Место находки / Зал музея',
    lblResearchTeam: 'Группа документирования',
    lblCuratorialNotes: 'Научное описание, эпиграфика и исследовательские примечания:',
    defaultNotesFallback:
      'Памятник зафиксирован с нескольких ракурсов бесконтактным оптическим методом и проверен по основным экологическим показателям консервации.',

    sec2Heading: 'II. Многоракурсная оптическая фиксация и анализ поверхностного рельефа',
    kpiViews: 'Ракурсов снято',
    kpiCoverage: 'Угловой охват',
    kpiLightUniformity: 'Тональный баланс',
    kpiReliefDensity: 'Плотность рельефа',
    kpiMeanSharpness: 'Средняя резкость',
    angleStatsLine: (az, s, b) => `Азимут ${az}° · Резк. ${s}% · Тон ${b}%`,

    sec3Heading: 'III. Эталон микроклимата — оптимальная температура и влажность',
    tempGaugeLabel: '1. Безопасный диапазон температуры (°C)',
    rhGaugeLabel: '2. Безопасный диапазон относительной влажности (% RH)',
    safeRangeTag: (min, max, u) => `Безопасная норма: ${min} – ${max}${u}`,
    currentValTag: (v, u) => `Текущее значение: ${v}${u}`,
    driftRateTag: (r, u) => `Суточный градиент: ±${r}${u}`,
    outOfRangeHrsTag: (h) => `Вне нормы: ${h} ч`,

    sec4Heading: 'IV. Сводка основных экологических показателей превентивной консервации',
    colNumTitle: 'Основной показатель',
    colFullTelemetry: 'Зарегистрированные измерения и детальные параметры',
    colDiagnosticPurpose: 'Диагностическое назначение',
    colEvalScore: 'Статус',

    row1Detail: (p) =>
      `Текущая: ${p.tempCurrentC}°C | Норма: ${p.tempSafeMinC}–${p.tempSafeMaxC}°C | Скорость изм.: ±${p.tempChangeRateCPerDay}°C/сут`,
    row2Detail: (p) =>
      `Текущая: ${p.rhCurrentPct}% RH | Норма: ${p.rhSafeMinPct}–${p.rhSafeMaxPct}% | Колебание: ±${p.rhDailyFluctuationPct}% | Вне нормы: ${p.rhOutOfRangeHours} ч`,
    row3Detail: (p, st) =>
      `Статус: ${st} | Длительность: ${p.directMoistureDurationHours} ч | Примечание: ${p.directMoistureNotes}`,
    row4Detail: (p) =>
      `Пик вибрации: ${p.vibrationPeakMmPerSec} mm/s | Ударов: ${p.shockEventsCount} | Характер: ${p.vibrationFrequencyDuration}`,

    sec5Heading: 'V. Диагностическое заключение и рекомендации для исследователей',
    synthesisNominal: (score, tMin, tMax, rhMin, rhMax) =>
      `Комплексный индекс стабильности среды составляет ${score}%. Все основные экологические показатели соответствуют музейным нормам хранения с соблюдением диапазона ${tMin}–${tMax}°C и ${rhMin}–${rhMax}% RH.`,
    synthesisAlert: (score, warn, crit, names) =>
      `Индекс стабильности составляет ${score}% (предупреждений: ${warn}, критических отклонений: ${crit}) по показателям: [${names}]. Рекомендуется немедленная стабилизация микроклимата.`,
    recommendationLine:
      'Статус документа: Настоящий PDF-отчёт является официальным эталонным документом для научных сотрудников и хранителей фондов.',

    sec6Heading: 'VI. Официальное заверение исследователей и архивная печать',
    sigResearcherTitle: 'Ведущий исследователь / Документатор',
    sigResearcherSub: 'Подтверждение атрибуции и оптической фиксации',
    sigConservationTitle: 'Аудит превентивной консервации',
    sigConservationSub: 'Проверка основных экологических показателей хранения',
    sigSealTitle: 'Официальная печать Smart Guardian',
    sealOuterTop: 'SMART GUARDIAN · ARCHIVAL RECORD',
    sealCenterMain: 'ЗАВЕРЕНО',
    sealCenterSub: 'OFFICIAL PDF',
    footerDisclaimer:
      'Официальный справочный документ, сформированный международной платформой Smart Guardian.',
  },
};

const PAGE_W = 1654; // A4 width at ~200 DPI
const PAGE_H = 2339; // A4 height at ~200 DPI
const MARGIN_X = 76;
const CONTENT_W = PAGE_W - MARGIN_X * 2;

function tokenizeForWrap(text: string): string[] {
  // Supports space-delimited scripts (Arabic, English, French, Russian) and CJK characters
  const rawParts = text.trim().split(/(\s+)/);
  const tokens: string[] = [];
  const cjkRegex = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/;

  for (const part of rawParts) {
    if (!part) continue;
    if (/^\s+$/.test(part)) {
      tokens.push(' ');
    } else if (cjkRegex.test(part) && part.length > 1) {
      for (const ch of Array.from(part)) {
        tokens.push(ch);
      }
    } else {
      tokens.push(part);
    }
  }
  return tokens;
}

function wrapCanvasParagraph(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const clean = (text || '—').replace(/\s+/g, ' ').trim();
  if (!clean) return ['—'];

  const tokens = tokenizeForWrap(clean);
  const lines: string[] = [];
  let current = '';

  for (const tk of tokens) {
    if (tk === ' ' && !current) continue;
    const candidate = current + tk;
    if (ctx.measureText(candidate).width > maxWidth && current.trim().length > 0) {
      lines.push(current.trim());
      if (lines.length >= maxLines) {
        lines[maxLines - 1] = `${lines[maxLines - 1].replace(/[.,،؛\s]+$/, '')}…`;
        return lines;
      }
      current = tk === ' ' ? '' : tk;
    } else {
      current = candidate;
    }
  }

  if (current.trim().length > 0 && lines.length < maxLines) {
    lines.push(current.trim());
  }
  return lines.length > 0 ? lines : ['—'];
}

function drawLines(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  anchorX: number,
  startY: number,
  lineHeight: number
): number {
  let y = startY;
  for (const ln of lines) {
    ctx.fillText(ln, anchorX, y);
    y += lineHeight;
  }
  return y;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawArchivalPageFrame(
  ctx: CanvasRenderingContext2D,
  isRtl: boolean,
  footerLeftText: string,
  footerRightText: string
) {
  ctx.fillStyle = '#FBF9F5';
  ctx.fillRect(0, 0, PAGE_W, PAGE_H);

  // Outer burnished brass frame + inner museum verdigris hairline
  ctx.strokeStyle = '#C89E54';
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, PAGE_W - 72, PAGE_H - 72);

  ctx.strokeStyle = '#0F4C45';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(48, 48, PAGE_W - 96, PAGE_H - 96);

  // Corner registration ornaments
  const corners = [
    [36, 36],
    [PAGE_W - 48, 36],
    [36, PAGE_H - 48],
    [PAGE_W - 48, PAGE_H - 48],
  ];
  ctx.fillStyle = '#C89E54';
  for (const [cx, cy] of corners) {
    ctx.fillRect(cx, cy, 12, 12);
  }

  // Bottom footer divider
  ctx.strokeStyle = '#DED4C3';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(MARGIN_X, PAGE_H - 104);
  ctx.lineTo(PAGE_W - MARGIN_X, PAGE_H - 104);
  ctx.stroke();

  ctx.save();
  ctx.font = '500 17px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
  ctx.fillStyle = '#5C5247';
  ctx.direction = isRtl ? 'rtl' : 'ltr';
  ctx.textAlign = isRtl ? 'right' : 'left';
  ctx.fillText(
    footerLeftText,
    isRtl ? PAGE_W - MARGIN_X : MARGIN_X,
    PAGE_H - 70
  );

  ctx.font = '700 17px "IBM Plex Mono", "Manrope", "Readex Pro", sans-serif';
  ctx.fillStyle = '#0F4C45';
  ctx.textAlign = isRtl ? 'left' : 'right';
  ctx.fillText(
    footerRightText,
    isRtl ? MARGIN_X : PAGE_W - MARGIN_X,
    PAGE_H - 70
  );
  ctx.restore();
}

function drawSectionBanner(
  ctx: CanvasRenderingContext2D,
  y: number,
  title: string,
  isRtl: boolean
): number {
  drawRoundedRect(ctx, MARGIN_X, y, CONTENT_W, 48, 10);
  ctx.fillStyle = '#EFE8DA';
  ctx.fill();
  ctx.strokeStyle = '#D5C7AE';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // Accent bar on leading edge inside section header
  ctx.fillStyle = '#0F4C45';
  if (isRtl) {
    ctx.fillRect(PAGE_W - MARGIN_X - 10, y + 8, 5, 32);
  } else {
    ctx.fillRect(MARGIN_X + 6, y + 8, 5, 32);
  }

  ctx.save();
  ctx.direction = isRtl ? 'rtl' : 'ltr';
  ctx.textAlign = isRtl ? 'right' : 'left';
  ctx.fillStyle = '#0F4C45';
  ctx.font = '700 22px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
  ctx.fillText(
    title,
    isRtl ? PAGE_W - MARGIN_X - 24 : MARGIN_X + 22,
    y + 32
  );
  ctx.restore();

  return y + 64;
}

function statusPalette(level: ConservationStatusLevel) {
  if (level === 'nominal') {
    return { bg: '#E6F4EF', border: '#0F4C45', text: '#0A3E38' };
  }
  if (level === 'warning') {
    return { bg: '#FEF3C7', border: '#B45309', text: '#92400E' };
  }
  return { bg: '#FFE4E6', border: '#BE123C', text: '#9F1239' };
}

export async function exportArtifactOfficialPdfReport(
  artifact: DocumentedArtifact,
  locale: LocaleCode
): Promise<void> {
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Proceed safely if font promise rejects
    }
  }

  const isRtl = locale === 'ar';
  const t = UI_STRINGS[locale];
  const c = CONSERVATION_STRINGS[locale];
  const pCopy = PDF_COPY[locale];
  const teamCredits = TEAM_CREDITS_I18N[locale];

  const envProfile: ArtifactEnvironmentalProfile =
    artifact.environmentalProfile ??
    createDefaultEnvironmentalProfile(locale, 'stone_limestone');

  const evalResult = evaluateEnvironmentalProfile(envProfile);

  const presetMeta = artifact.presetKey
    ? PRESET_METADATA[artifact.presetKey]?.[locale]
    : undefined;

  const displayTitle = presetMeta ? presetMeta.title : artifact.titleAr;
  const displayPeriod = presetMeta ? presetMeta.period : artifact.periodAr;
  const displayMaterial = presetMeta ? presetMeta.material : artifact.materialAr;
  const displayDims = presetMeta ? presetMeta.dimensions : artifact.dimensionsCm;
  const rawRegion = presetMeta ? presetMeta.region : artifact.discoveryRegionAr;
  const countryLabel = artifact.countryCode
    ? getCountryDisplayName(artifact.countryCode, locale)
    : '';
  const displayRegion = countryLabel
    ? `${countryLabel} — ${rawRegion}`
    : rawRegion;
  const displayNotes =
    (presetMeta ? presetMeta.notes : artifact.curatorialNotesAr) ||
    pCopy.defaultNotesFallback;
  const displayTeam = artifact.teamNameAr || teamCredits.prominentStatement;
  const invCode = artifact.inventoryNumber || `INV-${artifact.accessionCode}`;
  const weightStr = artifact.weightGrams ? `${artifact.weightGrams} g` : '—';
  const conditionKey: ArtifactConditionGrade =
    artifact.conditionGrade ?? 'stable_excellent';
  const conditionLabel = c.conditionGrades[conditionKey];
  const materialClassLabel = c.materialClasses[envProfile.materialClass];

  const localeDateMap: Record<LocaleCode, string> = {
    ar: 'ar-SA',
    'en-US': 'en-US',
    fr: 'fr-FR',
    zh: 'zh-CN',
    ru: 'ru-RU',
  };
  const formattedDate = new Date(artifact.createdAtIso).toLocaleDateString(
    localeDateMap[locale],
    { year: 'numeric', month: 'short', day: '2-digit' }
  );

  // =========================================================================
  // PAGE 1: INSTITUTIONAL HEADER, ATTRIBUTION, MULTI-ANGLE OPTICS & BENCHMARK
  // =========================================================================
  const page1 = document.createElement('canvas');
  page1.width = PAGE_W;
  page1.height = PAGE_H;
  const ctx1 = page1.getContext('2d');
  if (!ctx1) return;

  drawArchivalPageFrame(
    ctx1,
    isRtl,
    pCopy.footerDisclaimer,
    pCopy.pageCounter(1, 2)
  );

  // Top Museum Verdigris Institutional Banner
  const bannerY = 72;
  const bannerH = 228;
  drawRoundedRect(ctx1, MARGIN_X, bannerY, CONTENT_W, bannerH, 16);
  const headerGrad = ctx1.createLinearGradient(
    MARGIN_X,
    bannerY,
    MARGIN_X,
    bannerY + bannerH
  );
  headerGrad.addColorStop(0, '#155B53');
  headerGrad.addColorStop(1, '#0B3934');
  ctx1.fillStyle = headerGrad;
  ctx1.fill();
  ctx1.strokeStyle = '#C89E54';
  ctx1.lineWidth = 2.5;
  ctx1.stroke();

  ctx1.save();
  ctx1.direction = isRtl ? 'rtl' : 'ltr';
  ctx1.textAlign = isRtl ? 'right' : 'left';
  const bannerTextX = isRtl ? PAGE_W - MARGIN_X - 34 : MARGIN_X + 34;

  ctx1.fillStyle = '#F3D28C';
  ctx1.font = '700 18px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
  ctx1.fillText(pCopy.docKicker, bannerTextX, bannerY + 42);

  ctx1.fillStyle = '#FBF9F5';
  ctx1.font =
    '700 38px "Cormorant Garamond", "Amiri", "Noto Serif SC", Georgia, serif';
  const titleLines = wrapCanvasParagraph(
    ctx1,
    pCopy.docTitle,
    CONTENT_W - 68,
    1
  );
  drawLines(ctx1, titleLines, bannerTextX, bannerY + 92, 44);

  ctx1.fillStyle = '#DCEAE7';
  ctx1.font = '500 18px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
  const subLines = wrapCanvasParagraph(
    ctx1,
    pCopy.docSubtitle,
    CONTENT_W - 68,
    2
  );
  drawLines(ctx1, subLines, bannerTextX, bannerY + 128, 25);

  // Metadata Strip inside bottom of Header Banner
  const stripY = bannerY + 168;
  ctx1.strokeStyle = 'rgba(243, 210, 140, 0.35)';
  ctx1.lineWidth = 1;
  ctx1.beginPath();
  ctx1.moveTo(MARGIN_X + 28, stripY);
  ctx1.lineTo(PAGE_W - MARGIN_X - 28, stripY);
  ctx1.stroke();

  const metaStripItems = [
    `${pCopy.refNoLabel}: ${artifact.accessionCode}`,
    `${pCopy.invNoLabel}: ${invCode}`,
    `${pCopy.issuedAtLabel}: ${formattedDate}`,
    `${pCopy.stabilityScoreLabel}: ${evalResult.overallStabilityPct}% (${evalResult.nominalCount}/4)`,
  ];
  ctx1.fillStyle = '#F3D28C';
  ctx1.font = '600 17px "IBM Plex Mono", "Manrope", "Readex Pro", sans-serif';
  ctx1.fillText(metaStripItems.join('   ·   '), bannerTextX, stripY + 38);
  ctx1.restore();

  // SECTION I: ARTIFACT ATTRIBUTION & PROVENANCE
  let curY = bannerY + bannerH + 26;
  curY = drawSectionBanner(ctx1, curY, pCopy.sec1Heading, isRtl);

  const attrBoxH = 448;
  drawRoundedRect(ctx1, MARGIN_X, curY, CONTENT_W, attrBoxH, 12);
  ctx1.fillStyle = '#FFFFFF';
  ctx1.fill();
  ctx1.strokeStyle = '#DED4C3';
  ctx1.lineWidth = 1.5;
  ctx1.stroke();

  const fieldsGrid: Array<[string, string]> = [
    [pCopy.lblArtifactTitle, displayTitle],
    [pCopy.lblPeriod, displayPeriod],
    [
      pCopy.lblMaterialAndClass,
      `${displayMaterial} (${materialClassLabel})`,
    ],
    [pCopy.lblDimensionsAndWeight, `${displayDims} · ${weightStr}`],
    [pCopy.lblCondition, conditionLabel],
    [pCopy.lblLocation, displayRegion],
    [pCopy.refNoLabel, artifact.accessionCode],
    [pCopy.invNoLabel, invCode],
  ];

  const colW = (CONTENT_W - 72) / 2;
  const rowH = 74;
  ctx1.save();
  ctx1.direction = isRtl ? 'rtl' : 'ltr';
  ctx1.textAlign = isRtl ? 'right' : 'left';

  for (let i = 0; i < fieldsGrid.length; i++) {
    const r = Math.floor(i / 2);
    const colIdx = i % 2;
    const cellLeft = isRtl
      ? colIdx === 0
        ? MARGIN_X + 48 + colW
        : MARGIN_X + 24
      : colIdx === 0
      ? MARGIN_X + 24
      : MARGIN_X + 48 + colW;

    const anchorX = isRtl ? cellLeft + colW : cellLeft;
    const cellTop = curY + 20 + r * rowH;

    if (r > 0) {
      ctx1.strokeStyle = '#EFE9DC';
      ctx1.lineWidth = 1;
      ctx1.beginPath();
      ctx1.moveTo(cellLeft, cellTop - 10);
      ctx1.lineTo(cellLeft + colW, cellTop - 10);
      ctx1.stroke();
    }

    ctx1.fillStyle = '#6E6357';
    ctx1.font = '600 16px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
    ctx1.fillText(fieldsGrid[i][0], anchorX, cellTop + 16);

    ctx1.fillStyle = '#1C1814';
    ctx1.font = '700 20px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
    const valLines = wrapCanvasParagraph(ctx1, fieldsGrid[i][1], colW - 12, 1);
    drawLines(ctx1, valLines, anchorX, cellTop + 46, 24);
  }

  // Team & Curatorial Notes full-width bottom rows inside Section I box
  const notesDivY = curY + 20 + 4 * rowH - 4;
  ctx1.strokeStyle = '#DED4C3';
  ctx1.lineWidth = 1.2;
  ctx1.beginPath();
  ctx1.moveTo(MARGIN_X + 24, notesDivY);
  ctx1.lineTo(PAGE_W - MARGIN_X - 24, notesDivY);
  ctx1.stroke();

  const fullAnchorX = isRtl ? PAGE_W - MARGIN_X - 24 : MARGIN_X + 24;
  ctx1.fillStyle = '#0F4C45';
  ctx1.font = '700 16px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
  ctx1.fillText(
    `${pCopy.lblResearchTeam}: ${displayTeam}`,
    fullAnchorX,
    notesDivY + 28
  );

  ctx1.fillStyle = '#6E6357';
  ctx1.font = '700 16px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
  ctx1.fillText(pCopy.lblCuratorialNotes, fullAnchorX, notesDivY + 58);

  ctx1.fillStyle = '#2C2620';
  ctx1.font = '500 18px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
  const noteLines = wrapCanvasParagraph(
    ctx1,
    displayNotes,
    CONTENT_W - 48,
    2
  );
  drawLines(ctx1, noteLines, fullAnchorX, notesDivY + 86, 26);
  ctx1.restore();

  // SECTION II: MULTI-ANGLE OPTICAL DOCUMENTATION & SURFACE RELIEF
  curY += attrBoxH + 26;
  curY = drawSectionBanner(ctx1, curY, pCopy.sec2Heading, isRtl);

  const opticsBoxH = 442;
  drawRoundedRect(ctx1, MARGIN_X, curY, CONTENT_W, opticsBoxH, 12);
  ctx1.fillStyle = '#FFFFFF';
  ctx1.fill();
  ctx1.strokeStyle = '#DED4C3';
  ctx1.lineWidth = 1.5;
  ctx1.stroke();

  // KPI Ribbon (5 optical metrics)
  const kpiItems = [
    [
      pCopy.kpiViews,
      `${artifact.metrics.totalAngles} (${artifact.metrics.uniqueDirections})`,
    ],
    [pCopy.kpiCoverage, `${artifact.metrics.angularCoveragePct}%`],
    [pCopy.kpiLightUniformity, `${artifact.metrics.illuminationConsistencyPct}%`],
    [pCopy.kpiReliefDensity, `${artifact.metrics.edgeReliefDensityPct}%`],
    [pCopy.kpiMeanSharpness, `${artifact.metrics.meanSharpness}%`],
  ];
  const kpiW = (CONTENT_W - 48 - 16 * 4) / 5;
  for (let i = 0; i < kpiItems.length; i++) {
    const idx = isRtl ? kpiItems.length - 1 - i : i;
    const kx = MARGIN_X + 24 + i * (kpiW + 16);
    const ky = curY + 20;
    drawRoundedRect(ctx1, kx, ky, kpiW, 74, 8);
    ctx1.fillStyle = '#FAF7F1';
    ctx1.fill();
    ctx1.strokeStyle = '#E5DDD0';
    ctx1.lineWidth = 1;
    ctx1.stroke();

    ctx1.save();
    ctx1.textAlign = 'center';
    ctx1.fillStyle = '#6E6357';
    ctx1.font = '600 14px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
    ctx1.fillText(kpiItems[idx][0], kx + kpiW / 2, ky + 27);

    ctx1.fillStyle = '#0F4C45';
    ctx1.font = '700 22px "IBM Plex Mono", monospace';
    ctx1.fillText(kpiItems[idx][1], kx + kpiW / 2, ky + 58);
    ctx1.restore();
  }

  // Up to 6 directional photo thumbnails in a single clean archival strip (or 4-6 adaptive)
  const shownAngles = artifact.angles.slice(0, 6);
  const countCols = Math.max(3, Math.min(6, shownAngles.length || 3));
  const thumbGap = 18;
  const thumbW = (CONTENT_W - 48 - thumbGap * (countCols - 1)) / countCols;
  const thumbH = Math.min(248, thumbW);
  const thumbStartY = curY + 114;

  for (let i = 0; i < shownAngles.length; i++) {
    const visualCol = isRtl ? countCols - 1 - i : i;
    const tx = MARGIN_X + 24 + visualCol * (thumbW + thumbGap);
    const ang = shownAngles[i];

    ctx1.fillStyle = '#EFE9DC';
    ctx1.fillRect(tx, thumbStartY, thumbW, thumbH);

    try {
      const img = await loadImageElement(ang.dataUrl);
      const iw = img.naturalWidth || thumbW;
      const ih = img.naturalHeight || thumbH;
      const scale = Math.max(thumbW / iw, thumbH / ih);
      const sw = thumbW / scale;
      const sh = thumbH / scale;
      const sx = (iw - sw) / 2;
      const sy = (ih - sh) / 2;
      ctx1.drawImage(img, sx, sy, sw, sh, tx, thumbStartY, thumbW, thumbH);
    } catch {
      // Fallback parchment square
    }

    ctx1.strokeStyle = '#C89E54';
    ctx1.lineWidth = 1.6;
    ctx1.strokeRect(tx, thumbStartY, thumbW, thumbH);

    ctx1.save();
    ctx1.direction = isRtl ? 'rtl' : 'ltr';
    ctx1.textAlign = 'center';
    ctx1.fillStyle = '#1C1814';
    ctx1.font = '700 16px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
    ctx1.fillText(
      getDirectionLabel(locale, ang.direction),
      tx + thumbW / 2,
      thumbStartY + thumbH + 24
    );

    ctx1.fillStyle = '#6E6357';
    ctx1.font = '500 13px "IBM Plex Mono", "Manrope", "Readex Pro", sans-serif';
    ctx1.fillText(
      pCopy.angleStatsLine(ang.azimuthDeg, ang.sharpnessScore, ang.brightnessPct),
      tx + thumbW / 2,
      thumbStartY + thumbH + 45
    );
    ctx1.restore();
  }

  // SECTION III: PRIMARY SUITABLE TEMPERATURE & HUMIDITY BENCHMARK GAUGES
  curY += opticsBoxH + 26;
  curY = drawSectionBanner(ctx1, curY, pCopy.sec3Heading, isRtl);

  const benchBoxH = 290;
  const gaugeW = (CONTENT_W - 28) / 2;

  const drawBenchmarkGaugeCard = (
    cardX: number,
    cardTitle: string,
    safeMin: number,
    safeMax: number,
    currentVal: number,
    scaleMin: number,
    scaleMax: number,
    unit: string,
    deltaVal: number,
    extraSubLine: string
  ) => {
    drawRoundedRect(ctx1, cardX, curY, gaugeW, benchBoxH, 12);
    ctx1.fillStyle = '#FFFFFF';
    ctx1.fill();
    ctx1.strokeStyle = deltaVal === 0 ? '#0F4C45' : '#BE123C';
    ctx1.lineWidth = 1.8;
    ctx1.stroke();

    const anchorX = isRtl ? cardX + gaugeW - 24 : cardX + 24;
    ctx1.save();
    ctx1.direction = isRtl ? 'rtl' : 'ltr';
    ctx1.textAlign = isRtl ? 'right' : 'left';

    ctx1.fillStyle = '#1C1814';
    ctx1.font = '700 21px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
    ctx1.fillText(cardTitle, anchorX, curY + 40);

    // Status pill text
    const statusStr =
      deltaVal === 0
        ? c.statusWithinRange
        : deltaVal > 0
        ? c.statusAboveRange(`${deltaVal}${unit}`)
        : c.statusBelowRange(`${deltaVal}${unit}`);
    ctx1.fillStyle = deltaVal === 0 ? '#0F4C45' : '#BE123C';
    ctx1.font = '700 17px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
    ctx1.fillText(statusStr, anchorX, curY + 74);

    // Visual Safe Range Gauge Bar (LTR coordinate math for universal numeric scale)
    const barX = cardX + 24;
    const barY = curY + 98;
    const barW = gaugeW - 48;
    const barH = 26;

    drawRoundedRect(ctx1, barX, barY, barW, barH, 13);
    ctx1.fillStyle = '#EFE9DC';
    ctx1.fill();
    ctx1.strokeStyle = '#D4C7B0';
    ctx1.lineWidth = 1.2;
    ctx1.stroke();

    const clampRatio = (v: number) =>
      Math.max(0, Math.min(1, (v - scaleMin) / (scaleMax - scaleMin)));
    const safeStartPx = barX + clampRatio(safeMin) * barW;
    const safeEndPx = barX + clampRatio(safeMax) * barW;
    const pinPx = barX + clampRatio(currentVal) * barW;

    ctx1.fillStyle = 'rgba(15, 76, 69, 0.24)';
    ctx1.fillRect(
      safeStartPx,
      barY + 2,
      Math.max(8, safeEndPx - safeStartPx),
      barH - 4
    );
    ctx1.strokeStyle = '#0F4C45';
    ctx1.lineWidth = 2;
    ctx1.strokeRect(
      safeStartPx,
      barY + 2,
      Math.max(8, safeEndPx - safeStartPx),
      barH - 4
    );

    // Current reading pin marker
    ctx1.fillStyle = deltaVal === 0 ? '#0F4C45' : '#BE123C';
    ctx1.fillRect(pinPx - 4, barY - 6, 8, barH + 12);

    // Numeric metrics under bar
    ctx1.fillStyle = '#0F4C45';
    ctx1.font = '700 20px "IBM Plex Mono", "Manrope", "Readex Pro", sans-serif';
    ctx1.fillText(
      pCopy.safeRangeTag(safeMin, safeMax, unit),
      anchorX,
      curY + 168
    );

    ctx1.fillStyle = '#1C1814';
    ctx1.font = '700 20px "IBM Plex Mono", "Manrope", "Readex Pro", sans-serif';
    ctx1.fillText(pCopy.currentValTag(currentVal, unit), anchorX, curY + 204);

    ctx1.fillStyle = '#5C5247';
    ctx1.font = '500 16px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
    ctx1.fillText(extraSubLine, anchorX, curY + 244);

    ctx1.restore();
  };

  const tempCardX = isRtl ? MARGIN_X + gaugeW + 28 : MARGIN_X;
  const rhCardX = isRtl ? MARGIN_X : MARGIN_X + gaugeW + 28;

  drawBenchmarkGaugeCard(
    tempCardX,
    pCopy.tempGaugeLabel,
    envProfile.tempSafeMinC,
    envProfile.tempSafeMaxC,
    envProfile.tempCurrentC,
    0,
    45,
    '°C',
    evalResult.tempDeltaFromSafeC,
    pCopy.driftRateTag(envProfile.tempChangeRateCPerDay, '°C')
  );

  drawBenchmarkGaugeCard(
    rhCardX,
    pCopy.rhGaugeLabel,
    envProfile.rhSafeMinPct,
    envProfile.rhSafeMaxPct,
    envProfile.rhCurrentPct,
    0,
    100,
    '%',
    evalResult.rhDeltaFromSafePct,
    `${pCopy.driftRateTag(envProfile.rhDailyFluctuationPct, '%')} · ${pCopy.outOfRangeHrsTag(envProfile.rhOutOfRangeHours)}`
  );

  // =========================================================================
  // PAGE 2: ALL 9 ENVIRONMENTAL INDICATORS TABLE, SYNTHESIS & OFFICIAL SEAL
  // =========================================================================
  const page2 = document.createElement('canvas');
  page2.width = PAGE_W;
  page2.height = PAGE_H;
  const ctx2 = page2.getContext('2d');
  if (!ctx2) return;

  drawArchivalPageFrame(
    ctx2,
    isRtl,
    `${teamCredits.prominentStatement} — ${t.brandName}`,
    pCopy.pageCounter(2, 2)
  );

  // Running Official Header on Page 2
  const runY = 72;
  drawRoundedRect(ctx2, MARGIN_X, runY, CONTENT_W, 86, 12);
  ctx2.fillStyle = '#0F4C45';
  ctx2.fill();
  ctx2.strokeStyle = '#C89E54';
  ctx2.lineWidth = 2;
  ctx2.stroke();

  ctx2.save();
  ctx2.direction = isRtl ? 'rtl' : 'ltr';
  ctx2.textAlign = isRtl ? 'right' : 'left';
  ctx2.fillStyle = '#F3D28C';
  ctx2.font = '700 16px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
  ctx2.fillText(
    `${pCopy.docTitle} · ${artifact.accessionCode}`,
    isRtl ? PAGE_W - MARGIN_X - 28 : MARGIN_X + 28,
    runY + 34
  );

  ctx2.fillStyle = '#FBF9F5';
  ctx2.font =
    '700 24px "Cormorant Garamond", "Amiri", "Noto Serif SC", Georgia, serif';
  const runTitleLine = wrapCanvasParagraph(
    ctx2,
    `${displayTitle} — ${displayPeriod} · ${displayRegion}`,
    CONTENT_W - 56,
    1
  )[0];
  ctx2.fillText(
    runTitleLine,
    isRtl ? PAGE_W - MARGIN_X - 28 : MARGIN_X + 28,
    runY + 68
  );
  ctx2.restore();

  // SECTION IV: ESSENTIAL ENVIRONMENTAL INDICATORS TABLE
  let p2Y = runY + 110;
  p2Y = drawSectionBanner(ctx2, p2Y, pCopy.sec4Heading, isRtl);

  const detailedRows: Array<{
    id: 1 | 2 | 3 | 4;
    telemetry: string;
  }> = [
    { id: 1, telemetry: pCopy.row1Detail(envProfile) },
    { id: 2, telemetry: pCopy.row2Detail(envProfile) },
    {
      id: 3,
      telemetry: pCopy.row3Detail(
        envProfile,
        c.moistureStatuses[envProfile.directMoistureStatus]
      ),
    },
    { id: 4, telemetry: pCopy.row4Detail(envProfile) },
  ];

  // Column widths (total = CONTENT_W = 1502)
  const wColInd = 290;
  const wColTel = 662;
  const wColPurp = 360;
  const wColStat = 190;

  const getColBounds = () => {
    if (isRtl) {
      const rightEdge = PAGE_W - MARGIN_X;
      const c1 = { x: rightEdge - wColInd, w: wColInd };
      const c2 = { x: c1.x - wColTel, w: wColTel };
      const c3 = { x: c2.x - wColPurp, w: wColPurp };
      const c4 = { x: c3.x - wColStat, w: wColStat };
      return { c1, c2, c3, c4 };
    }
    const c1 = { x: MARGIN_X, w: wColInd };
    const c2 = { x: c1.x + wColInd, w: wColTel };
    const c3 = { x: c2.x + wColTel, w: wColPurp };
    const c4 = { x: c3.x + wColPurp, w: wColStat };
    return { c1, c2, c3, c4 };
  };

  const cols = getColBounds();
  const tableHeaderH = 58;
  const tableRowH = 168;
  const totalTableH = tableHeaderH + detailedRows.length * tableRowH;

  drawRoundedRect(ctx2, MARGIN_X, p2Y, CONTENT_W, totalTableH, 12);
  ctx2.fillStyle = '#FFFFFF';
  ctx2.fill();

  // Table Header Fill
  ctx2.fillStyle = '#EDE4D3';
  ctx2.fillRect(MARGIN_X + 2, p2Y + 2, CONTENT_W - 4, tableHeaderH);

  ctx2.save();
  ctx2.direction = isRtl ? 'rtl' : 'ltr';
  ctx2.textAlign = isRtl ? 'right' : 'left';
  ctx2.fillStyle = '#2C2620';
  ctx2.font = '700 17.5px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';

  const cellAnchor = (col: { x: number; w: number }) =>
    isRtl ? col.x + col.w - 16 : col.x + 16;

  ctx2.fillText(pCopy.colNumTitle, cellAnchor(cols.c1), p2Y + 36);
  ctx2.fillText(pCopy.colFullTelemetry, cellAnchor(cols.c2), p2Y + 36);
  ctx2.fillText(pCopy.colDiagnosticPurpose, cellAnchor(cols.c3), p2Y + 36);
  ctx2.fillText(pCopy.colEvalScore, cellAnchor(cols.c4), p2Y + 36);

  // Render the 4 Essential Environmental Rows
  for (let idx = 0; idx < detailedRows.length; idx++) {
    const rowSpec = detailedRows[idx];
    const indCopy = c.indicators[rowSpec.id];
    const diag = evalResult.indicators[rowSpec.id];
    const ry = p2Y + tableHeaderH + idx * tableRowH;

    if (idx % 2 === 1) {
      ctx2.fillStyle = '#FAF7F1';
      ctx2.fillRect(MARGIN_X + 2, ry, CONTENT_W - 4, tableRowH);
    }

    ctx2.strokeStyle = '#E5DDD0';
    ctx2.lineWidth = 1.2;
    ctx2.beginPath();
    ctx2.moveTo(MARGIN_X, ry);
    ctx2.lineTo(PAGE_W - MARGIN_X, ry);
    ctx2.stroke();

    // Col 1: Indicator # & Name
    ctx2.fillStyle = '#9E6E24';
    ctx2.font = '700 18.5px "IBM Plex Mono", "Manrope", "Readex Pro", sans-serif';
    ctx2.fillText(
      `${indCopy.num}.`,
      cellAnchor(cols.c1),
      ry + 50
    );

    ctx2.fillStyle = '#1C1814';
    ctx2.font = '700 19.5px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
    const indTitleLines = wrapCanvasParagraph(
      ctx2,
      indCopy.title,
      cols.c1.w - 32,
      2
    );
    drawLines(ctx2, indTitleLines, cellAnchor(cols.c1), ry + 84, 27);

    // Col 2: Complete Telemetry & Sub-Parameters
    ctx2.fillStyle = '#1C1814';
    ctx2.font = '600 17px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
    const telLines = wrapCanvasParagraph(
      ctx2,
      rowSpec.telemetry,
      cols.c2.w - 32,
      3
    );
    drawLines(ctx2, telLines, cellAnchor(cols.c2), ry + 50, 30);

    // Col 3: Preventive Diagnostic Purpose
    ctx2.fillStyle = '#5C5247';
    ctx2.font = '500 16.5px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
    const purpLines = wrapCanvasParagraph(
      ctx2,
      indCopy.shortPurpose,
      cols.c3.w - 32,
      3
    );
    drawLines(ctx2, purpLines, cellAnchor(cols.c3), ry + 50, 28);

    // Col 4: Status Badge + Stability Score %
    const pal = statusPalette(diag.level);
    const badgeLabel =
      diag.level === 'nominal'
        ? c.badgeSafe
        : diag.level === 'warning'
        ? c.badgeAlert
        : c.badgeRisk;

    const badgeW = cols.c4.w - 32;
    const badgeX = cols.c4.x + 16;
    const badgeY = ry + 42;
    drawRoundedRect(ctx2, badgeX, badgeY, badgeW, 44, 8);
    ctx2.fillStyle = pal.bg;
    ctx2.fill();
    ctx2.strokeStyle = pal.border;
    ctx2.lineWidth = 1.4;
    ctx2.stroke();

    ctx2.save();
    ctx2.textAlign = 'center';
    ctx2.fillStyle = pal.text;
    ctx2.font = '700 16px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
    ctx2.fillText(badgeLabel, badgeX + badgeW / 2, badgeY + 28);

    ctx2.fillStyle = '#4A423A';
    ctx2.font = '700 16.5px "IBM Plex Mono", monospace';
    ctx2.fillText(
      `${diag.stabilityScorePct}%`,
      badgeX + badgeW / 2,
      badgeY + 76
    );
    ctx2.restore();
  }

  // Vertical column dividers & outer border on table
  ctx2.strokeStyle = '#DED4C3';
  ctx2.lineWidth = 1.2;
  const vLines = isRtl
    ? [cols.c1.x, cols.c2.x, cols.c3.x]
    : [cols.c2.x, cols.c3.x, cols.c4.x];
  for (const vx of vLines) {
    ctx2.beginPath();
    ctx2.moveTo(vx, p2Y);
    ctx2.lineTo(vx, p2Y + totalTableH);
    ctx2.stroke();
  }
  drawRoundedRect(ctx2, MARGIN_X, p2Y, CONTENT_W, totalTableH, 12);
  ctx2.strokeStyle = '#C89E54';
  ctx2.lineWidth = 1.8;
  ctx2.stroke();
  ctx2.restore();

  // SECTION V: DIAGNOSTIC SYNTHESIS & PREVENTIVE RECOMMENDATIONS
  p2Y += totalTableH + 34;
  p2Y = drawSectionBanner(ctx2, p2Y, pCopy.sec5Heading, isRtl);

  const synthH = 204;
  drawRoundedRect(ctx2, MARGIN_X, p2Y, CONTENT_W, synthH, 12);
  ctx2.fillStyle = '#FAF7F1';
  ctx2.fill();
  ctx2.strokeStyle = '#D5C7AE';
  ctx2.lineWidth = 1.5;
  ctx2.stroke();

  const flaggedNames = ([1, 2, 3, 4] as const)
    .filter((id) => evalResult.indicators[id].level !== 'nominal')
    .map((id) => c.indicators[id].title)
    .join('، ');

  const synthesisBody =
    evalResult.nominalCount === 4
      ? pCopy.synthesisNominal(
          evalResult.overallStabilityPct,
          envProfile.tempSafeMinC,
          envProfile.tempSafeMaxC,
          envProfile.rhSafeMinPct,
          envProfile.rhSafeMaxPct
        )
      : pCopy.synthesisAlert(
          evalResult.overallStabilityPct,
          evalResult.warningCount,
          evalResult.criticalCount,
          flaggedNames
        );

  ctx2.save();
  ctx2.direction = isRtl ? 'rtl' : 'ltr';
  ctx2.textAlign = isRtl ? 'right' : 'left';
  const synthAnchorX = isRtl ? PAGE_W - MARGIN_X - 26 : MARGIN_X + 26;

  ctx2.fillStyle = '#1C1814';
  ctx2.font = '600 18.5px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
  const synthLines = wrapCanvasParagraph(
    ctx2,
    synthesisBody,
    CONTENT_W - 52,
    3
  );
  const nextSynthY = drawLines(ctx2, synthLines, synthAnchorX, p2Y + 42, 30);

  ctx2.fillStyle = '#0F4C45';
  ctx2.font = '700 17px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
  const recLines = wrapCanvasParagraph(
    ctx2,
    pCopy.recommendationLine,
    CONTENT_W - 52,
    2
  );
  drawLines(ctx2, recLines, synthAnchorX, Math.max(p2Y + 142, nextSynthY + 12), 26);
  ctx2.restore();

  // SECTION VI: OFFICIAL AUTHENTICATION & ARCHIVAL SEAL
  p2Y += synthH + 34;
  p2Y = drawSectionBanner(ctx2, p2Y, pCopy.sec6Heading, isRtl);

  const sigBoxH = 264;
  const sigGap = 22;
  const sigW = (CONTENT_W - sigGap * 2) / 3;

  const boxPositions = [
    MARGIN_X,
    MARGIN_X + sigW + sigGap,
    MARGIN_X + (sigW + sigGap) * 2,
  ];
  const researcherBoxX = isRtl ? boxPositions[2] : boxPositions[0];
  const auditBoxX = boxPositions[1];
  const sealBoxX = isRtl ? boxPositions[0] : boxPositions[2];

  const drawSignatureCard = (
    bx: number,
    heading: string,
    sub: string,
    entityLine: string,
    footCode: string
  ) => {
    drawRoundedRect(ctx2, bx, p2Y, sigW, sigBoxH, 12);
    ctx2.fillStyle = '#FFFFFF';
    ctx2.fill();
    ctx2.strokeStyle = '#DED4C3';
    ctx2.lineWidth = 1.5;
    ctx2.stroke();

    const ax = isRtl ? bx + sigW - 22 : bx + 22;
    ctx2.save();
    ctx2.direction = isRtl ? 'rtl' : 'ltr';
    ctx2.textAlign = isRtl ? 'right' : 'left';

    ctx2.fillStyle = '#0F4C45';
    ctx2.font = '700 18px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
    const hLines = wrapCanvasParagraph(ctx2, heading, sigW - 44, 1);
    drawLines(ctx2, hLines, ax, p2Y + 36, 24);

    ctx2.fillStyle = '#6E6357';
    ctx2.font = '500 15px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
    const sLines = wrapCanvasParagraph(ctx2, sub, sigW - 44, 2);
    drawLines(ctx2, sLines, ax, p2Y + 66, 22);

    ctx2.fillStyle = '#1C1814';
    ctx2.font =
      '700 19px "Cormorant Garamond", "Amiri", "Noto Serif SC", Georgia, serif';
    const entLines = wrapCanvasParagraph(ctx2, entityLine, sigW - 44, 2);
    drawLines(ctx2, entLines, ax, p2Y + 132, 25);

    // Signature dotted rule
    ctx2.strokeStyle = '#C89E54';
    ctx2.setLineDash([6, 4]);
    ctx2.beginPath();
    ctx2.moveTo(bx + 22, p2Y + 206);
    ctx2.lineTo(bx + sigW - 22, p2Y + 206);
    ctx2.stroke();
    ctx2.setLineDash([]);

    ctx2.fillStyle = '#6E6357';
    ctx2.font = '600 14px "IBM Plex Mono", monospace';
    ctx2.fillText(footCode, ax, p2Y + 238);
    ctx2.restore();
  };

  drawSignatureCard(
    researcherBoxX,
    pCopy.sigResearcherTitle,
    pCopy.sigResearcherSub,
    displayTeam,
    `${artifact.accessionCode} · ${formattedDate}`
  );

  drawSignatureCard(
    auditBoxX,
    pCopy.sigConservationTitle,
    pCopy.sigConservationSub,
    `${teamCredits.generalSupervisor.tag}: ${teamCredits.generalSupervisor.name}`,
    `STABILITY: ${evalResult.overallStabilityPct}% (${evalResult.nominalCount}/4)`
  );

  // Official Circular Smart Guardian Seal Box
  drawRoundedRect(ctx2, sealBoxX, p2Y, sigW, sigBoxH, 12);
  ctx2.fillStyle = '#FFFFFF';
  ctx2.fill();
  ctx2.strokeStyle = '#C89E54';
  ctx2.lineWidth = 1.8;
  ctx2.stroke();

  const sealCx = sealBoxX + sigW / 2;
  const sealCy = p2Y + 138;
  const sealR = 82;

  ctx2.save();
  ctx2.textAlign = 'center';
  ctx2.fillStyle = '#0F4C45';
  ctx2.font = '700 17px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
  ctx2.fillText(pCopy.sigSealTitle, sealCx, p2Y + 34);

  // Outer brass & inner verdigris concentric seal rings
  ctx2.beginPath();
  ctx2.arc(sealCx, sealCy, sealR, 0, Math.PI * 2);
  ctx2.fillStyle = 'rgba(15, 76, 69, 0.06)';
  ctx2.fill();
  ctx2.strokeStyle = '#0F4C45';
  ctx2.lineWidth = 3;
  ctx2.stroke();

  ctx2.beginPath();
  ctx2.arc(sealCx, sealCy, sealR - 10, 0, Math.PI * 2);
  ctx2.setLineDash([5, 4]);
  ctx2.strokeStyle = '#C89E54';
  ctx2.lineWidth = 2;
  ctx2.stroke();
  ctx2.setLineDash([]);

  ctx2.beginPath();
  ctx2.arc(sealCx, sealCy, sealR - 22, 0, Math.PI * 2);
  ctx2.strokeStyle = '#0F4C45';
  ctx2.lineWidth = 1.2;
  ctx2.stroke();

  ctx2.fillStyle = '#9E6E24';
  ctx2.font = '700 11px "IBM Plex Mono", monospace';
  ctx2.fillText('SMART GUARDIAN', sealCx, sealCy - 24);

  ctx2.fillStyle = '#0F4C45';
  ctx2.font = '700 20px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
  ctx2.fillText(pCopy.sealCenterMain, sealCx, sealCy + 4);

  ctx2.fillStyle = '#5C5247';
  ctx2.font = '700 12px "IBM Plex Mono", monospace';
  ctx2.fillText(pCopy.sealCenterSub, sealCx, sealCy + 26);
  ctx2.fillText(artifact.accessionCode, sealCx, sealCy + 44);
  ctx2.restore();

  // =========================================================================
  // COMPILE 2-PAGE A4 PDF DOCUMENT VIA jsPDF & TRIGGER DIRECT DOWNLOAD
  // =========================================================================
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  pdf.setProperties({
    title: `${pCopy.docTitle} — ${displayTitle} (${artifact.accessionCode})`,
    subject: pCopy.docSubtitle,
    author: teamCredits.prominentStatement,
    keywords:
      'Smart Guardian, Archaeological Documentation, Preventive Conservation, Official PDF Report',
    creator: 'Smart Guardian | الحارس الذكي',
  });

  const imgDataPage1 = page1.toDataURL('image/jpeg', 0.94);
  const imgDataPage2 = page2.toDataURL('image/jpeg', 0.94);

  pdf.addImage(imgDataPage1, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
  pdf.addPage('a4', 'portrait');
  pdf.addImage(imgDataPage2, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');

  const safeCode = artifact.accessionCode.replace(/[^a-zA-Z0-9-_]/g, '');
  pdf.save(`smart-guardian-official-report-${safeCode}-${locale}.pdf`);
}
