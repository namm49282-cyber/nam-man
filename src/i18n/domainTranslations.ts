import {
  CaptureDirection,
  CulturalCorridor,
  CulturalCorridorId,
  LocaleCode,
  LocalizedDirectionSpec,
  PresetId,
} from '../types/artifact';

const BASE_DIRECTIONS: Array<{
  id: CaptureDirection;
  azimuthDeg: number;
  elevationDeg: number;
}> = [
  { id: CaptureDirection.Front, azimuthDeg: 0, elevationDeg: 12 },
  { id: CaptureDirection.Right, azimuthDeg: 90, elevationDeg: 12 },
  { id: CaptureDirection.Back, azimuthDeg: 180, elevationDeg: 15 },
  { id: CaptureDirection.Left, azimuthDeg: 270, elevationDeg: 12 },
  { id: CaptureDirection.Oblique, azimuthDeg: 45, elevationDeg: 28 },
  { id: CaptureDirection.Top, azimuthDeg: 0, elevationDeg: 88 },
];

const DIRECTION_TEXT: Record<
  LocaleCode,
  Record<CaptureDirection, { label: string; shortLabel: string; instruction: string }>
> = {
  ar: {
    [CaptureDirection.Front]: {
      label: 'الواجهة الأمامية (٠°)',
      shortLabel: 'الأمام ٠°',
      instruction: 'وجّه العدسة عمودياً نحو النقش الرئيسي أو واجهة القطعة.',
    },
    [CaptureDirection.Right]: {
      label: 'الجانب الأيمن (٩٠°)',
      shortLabel: 'اليمين ٩٠°',
      instruction: 'أدر القطعة أو ذراع المسح ربع دورة لإظهار البروز الجانبي الأيمن.',
    },
    [CaptureDirection.Back]: {
      label: 'الواجهة الخلفية (١٨٠°)',
      shortLabel: 'الخلف ١٨٠°',
      instruction: 'وثّق الظهر والأختام الخلفية وآثار الصنعة اليدوية.',
    },
    [CaptureDirection.Left]: {
      label: 'الجانب الأيسر (٢٧٠°)',
      shortLabel: 'اليسار ٢٧٠°',
      instruction: 'التقط المقابض والحواف الجانبية اليسرى لاستكمال المحيط.',
    },
    [CaptureDirection.Oblique]: {
      label: 'زاوية قطرية (٤٥°)',
      shortLabel: 'قطري ٤٥°',
      instruction: 'زاوية ثلاثية الأرباع تربط الواجهة بالجانب لتعزيز التطابق الهندسي.',
    },
    [CaptureDirection.Top]: {
      label: 'المسقط العلوي (سمتي)',
      shortLabel: 'علوي ٩٠°',
      instruction: 'التقط القطعة من الأعلى لتوثيق الفوهة والحواف الدائرية أو المربعة.',
    },
  },
  'en-US': {
    [CaptureDirection.Front]: {
      label: 'Front Elevation (0°)',
      shortLabel: 'Front 0°',
      instruction: 'Align the lens perpendicular to the primary inscription or main facade.',
    },
    [CaptureDirection.Right]: {
      label: 'Right Profile (90°)',
      shortLabel: 'Right 90°',
      instruction: 'Rotate the turntable or scanner arm 90° to capture right-side relief details.',
    },
    [CaptureDirection.Back]: {
      label: 'Rear Elevation (180°)',
      shortLabel: 'Back 180°',
      instruction: 'Document the reverse face, maker stamps, and chisel toolmarks.',
    },
    [CaptureDirection.Left]: {
      label: 'Left Profile (270°)',
      shortLabel: 'Left 270°',
      instruction: 'Capture left handles and lateral contours to complete perimeter geometry.',
    },
    [CaptureDirection.Oblique]: {
      label: 'Oblique Three-Quarter (45°)',
      shortLabel: 'Oblique 45°',
      instruction: 'Diagonal 45° view bridging front and side planes for spatial alignment.',
    },
    [CaptureDirection.Top]: {
      label: 'Top Zenith View (90°)',
      shortLabel: 'Top 90°',
      instruction: 'Overhead zenith capture documenting rim geometry and interior basin.',
    },
  },
  fr: {
    [CaptureDirection.Front]: {
      label: 'Façade Principale (0°)',
      shortLabel: 'Face 0°',
      instruction: 'Alignez l’objectif face à l’inscription principale de l’artéfact.',
    },
    [CaptureDirection.Right]: {
      label: 'Profil Droit (90°)',
      shortLabel: 'Droite 90°',
      instruction: 'Pivotez d’un quart de tour pour révéler les reliefs latéraux droits.',
    },
    [CaptureDirection.Back]: {
      label: 'Face Arrière (180°)',
      shortLabel: 'Dos 180°',
      instruction: 'Documentez le revers, les sceaux et les traces de façonnage.',
    },
    [CaptureDirection.Left]: {
      label: 'Profil Gauche (270°)',
      shortLabel: 'Gauche 270°',
      instruction: 'Capturez les anses et rebords gauches pour fermer le périmètre.',
    },
    [CaptureDirection.Oblique]: {
      label: 'Vue Trois-Quarts (45°)',
      shortLabel: 'Oblique 45°',
      instruction: 'Angle diagonal reliant la face et le profil pour la cohérence 3D.',
    },
    [CaptureDirection.Top]: {
      label: 'Vue Zénithale (Sommet)',
      shortLabel: 'Zénith 90°',
      instruction: 'Prise de vue verticale pour documenter l’ouverture et la bordure.',
    },
  },
  zh: {
    [CaptureDirection.Front]: {
      label: '正视主立面 (0°)',
      shortLabel: '正面 0°',
      instruction: '将镜头垂直对准文物主铭文面或核心正立面。',
    },
    [CaptureDirection.Right]: {
      label: '右侧立面 (90°)',
      shortLabel: '右侧 90°',
      instruction: '将转台或扫描臂旋转 90°，完整记录右侧浮雕与耳环结构。',
    },
    [CaptureDirection.Back]: {
      label: '背视立面 (180°)',
      shortLabel: '背面 180°',
      instruction: '记录文物背面款识、印记及古代手工凿刻痕迹。',
    },
    [CaptureDirection.Left]: {
      label: '左侧立面 (270°)',
      shortLabel: '左侧 270°',
      instruction: '拍摄左侧流口、执柄或边棱，闭合周向几何轮廓。',
    },
    [CaptureDirection.Oblique]: {
      label: '斜向四分之三视角 (45°)',
      shortLabel: '斜角 45°',
      instruction: '衔接正面与侧面的对角视角，增强三维空间拼接精度。',
    },
    [CaptureDirection.Top]: {
      label: '顶部垂直俯视 (90°)',
      shortLabel: '俯视 90°',
      instruction: '从正上方俯拍器物口沿、内膛与顶部几何纹饰。',
    },
  },
  ru: {
    [CaptureDirection.Front]: {
      label: 'Лицевой фасад (0°)',
      shortLabel: 'Фасад 0°',
      instruction: 'Направьте объектив перпендикулярно главной надписи или лицевой грани.',
    },
    [CaptureDirection.Right]: {
      label: 'Правый профиль (90°)',
      shortLabel: 'Справа 90°',
      instruction: 'Поверните стол или дугу на 90° для фиксации правого бокового рельефа.',
    },
    [CaptureDirection.Back]: {
      label: 'Тыльная сторона (180°)',
      shortLabel: 'Сзади 180°',
      instruction: 'Зафиксируйте оборотную сторону, клейма и следы древнего инструмента.',
    },
    [CaptureDirection.Left]: {
      label: 'Левый профиль (270°)',
      shortLabel: 'Слева 270°',
      instruction: 'Снимите левые ручки и боковые грани для замыкания контура.',
    },
    [CaptureDirection.Oblique]: {
      label: 'Диагональный ракурс (45°)',
      shortLabel: 'Диаг. 45°',
      instruction: 'Трёхчетвертной ракурс, связывающий фасад и боковую грань.',
    },
    [CaptureDirection.Top]: {
      label: 'Вид сверху (зенит 90°)',
      shortLabel: 'Сверху 90°',
      instruction: 'Вертикальная съёмка сверху для фиксации венчика и чаши.',
    },
  },
};

export function getLocalizedDirections(locale: LocaleCode): LocalizedDirectionSpec[] {
  const dict = DIRECTION_TEXT[locale];
  return BASE_DIRECTIONS.map((b) => ({
    ...b,
    label: dict[b.id].label,
    shortLabel: dict[b.id].shortLabel,
    instruction: dict[b.id].instruction,
  }));
}

export function getDirectionLabel(locale: LocaleCode, dir: CaptureDirection): string {
  return DIRECTION_TEXT[locale][dir]?.label ?? DIRECTION_TEXT['en-US'][dir].label;
}

export function getLocalizedCorridors(locale: LocaleCode): CulturalCorridor[] {
  const byLocale: Record<LocaleCode, CulturalCorridor[]> = {
    ar: [
      {
        id: CulturalCorridorId.IncenseRoute,
        title: 'طريق البخور واللبان البري',
        eraSpan: 'القرن الثامن ق.م – القرن الثالث الميلادي',
        connectedCivilizations: ['سبأ وحمير', 'الحضارة النبطية (العلا والبتراء)', 'وادي الرافدين', 'شرق المتوسط'],
        sharedTechniques: ['النحت البارز في الحجر الجيري مع سبك البرونز وتلاقي خط المسند بالنقوش النبطية'],
        summary:
          'شكّلت قوافل اللبان شرياناً ثقافياً حمل معه الفنون المعمارية والمباخر المنحوتة التي جمعت الرموز السبئية بدقة النحت النبطي والهلنستي.',
        mapCoordinates: [
          { name: 'مأرب وظفار', x: 76, y: 78, role: 'منابع اللبان' },
          { name: 'قرية الفاو', x: 62, y: 60, role: 'حاضرة التبادل' },
          { name: 'الحِجر (العلا)', x: 46, y: 43, role: 'بوابة الأنباط' },
          { name: 'البتراء والمتوسط', x: 28, y: 24, role: 'منفذ المتوسط' },
        ],
      },
      {
        id: CulturalCorridorId.SilkRoad,
        title: 'طريق الحرير البري والبحري',
        eraSpan: 'القرن الثاني ق.م – القرن الخامس عشر الميلادي',
        connectedCivilizations: ['بغداد العباسية', 'فارس وسمرقند', 'سلالتا تانغ ومينغ الصينيتان', 'موانئ الخليج'],
        sharedTechniques: ['تزجيج الخزف بصبغة الكوبالت الأزرق المشرقي مع زخارف اللوتس والخط العربي'],
        summary:
          'انتقلت خامات الكوبالت من المشرق لتلوّن بورسلان الصين، ثم عادت الأواني عبر موانئ الخليج حاملةً حواراً بصرياً فريداً بين الشرق والغرب.',
        mapCoordinates: [
          { name: 'شيآن وجينغدتشن', x: 84, y: 36, role: 'أفران البورسلان' },
          { name: 'سمرقند', x: 60, y: 28, role: 'ملتقى القوافل' },
          { name: 'بغداد والبصرة', x: 36, y: 44, role: 'مختبر الكوبالت' },
          { name: 'صحار ومسقط', x: 50, y: 68, role: 'الملاحة البحرية' },
        ],
      },
      {
        id: CulturalCorridorId.MediterraneanAndalus,
        title: 'جسر الأندلس وحوض المتوسط',
        eraSpan: 'القرن الثامن – القرن السادس عشر الميلادي',
        connectedCivilizations: ['قرطبة وغرناطة', 'حواضر المغرب والقيروان', 'صقلية', 'عصر النهضة الأوروبي'],
        sharedTechniques: ['هندسة الإسطرلابات النحاسية الدقيقة ثنائية النقش والخزف ذو البريق المعدني'],
        summary:
          'في مراصد قرطبة وطليطلة التقت علوم الفلك والهندسة الدقيقة، فصيغت آلات رصد نحاسية حملت أسماء النجوم العربية مع الجداول الأوروبية.',
        mapCoordinates: [
          { name: 'قرطبة وطليطلة', x: 20, y: 34, role: 'دار الرصد والترجمة' },
          { name: 'فاس والقيروان', x: 34, y: 56, role: 'الآلات الفلكية' },
          { name: 'صقلية والبندقية', x: 52, y: 26, role: 'عبور الفنون' },
          { name: 'القاهرة والإسكندرية', x: 74, y: 58, role: 'مكتبات الحكمة' },
        ],
      },
      {
        id: CulturalCorridorId.MesopotamiaGulf,
        title: 'شبكة الرافدين ودلمون وماجان ووادي السند',
        eraSpan: 'الألف الثالث – الألف الأول قبل الميلاد',
        connectedCivilizations: ['سومر وبابل', 'حضارة دلمون', 'حضارة ماجان', 'وادي السند'],
        sharedTechniques: ['نحت الأختام الدائرية وتعدين النحاس العُماني وتوحيد المكاييل الحجرية'],
        summary:
          'أقدم شبكة تبادل بحري موثقة في التاريخ جمعت نحاس ماجان وأختام دلمون وعقيق السند وألواح الرافدين في منظومة ثقافية متكاملة.',
        mapCoordinates: [
          { name: 'أور وبابل', x: 24, y: 28, role: 'التدوين المسماري' },
          { name: 'دلمون وتاروت', x: 44, y: 48, role: 'وسيط الأختام' },
          { name: 'ماجان (عُمان)', x: 58, y: 68, role: 'مناجم النحاس' },
          { name: 'وادي السند', x: 82, y: 52, role: 'العقيق والمكاييل' },
        ],
      },
    ],

    'en-US': [
      {
        id: CulturalCorridorId.IncenseRoute,
        title: 'Incense & Frankincense Overland Route',
        eraSpan: '8th Century BCE – 3rd Century CE',
        connectedCivilizations: ['Saba & Himyar', 'Nabataean Hegra & Petra', 'Mesopotamia', 'Eastern Mediterranean'],
        sharedTechniques: ['High-relief limestone carving paired with cast bronze basins and Musnad–Nabataean epigraphy'],
        summary:
          'Caravans carrying frankincense and myrrh forged an artistic highway uniting South Arabian geometric symbolism with Nabataean and Hellenistic stonecraft.',
        mapCoordinates: [
          { name: 'Marib & Dhofar', x: 76, y: 78, role: 'Resin Sources' },
          { name: 'Qaryat al-Faw', x: 62, y: 60, role: 'Artistic Oasis' },
          { name: 'Hegra (AlUla)', x: 46, y: 43, role: 'Nabataean Gate' },
          { name: 'Petra & Levant', x: 28, y: 24, role: 'Mediterranean Port' },
        ],
      },
      {
        id: CulturalCorridorId.SilkRoad,
        title: 'Overland & Maritime Silk Road',
        eraSpan: '2nd Century BCE – 15th Century CE',
        connectedCivilizations: ['Abbasid Baghdad', 'Persia & Samarkand', 'Tang & Ming China', 'Arabian Gulf Ports'],
        sharedTechniques: ['Imported cobalt-blue underglaze painting fusing lotus motifs with calligraphic bands'],
        summary:
          'Cobalt ores mined in West Asia traveled east to color imperial Chinese porcelain, returning by dhow ships as shared treasures of East-West dialogue.',
        mapCoordinates: [
          { name: 'Xi’an & Jingdezhen', x: 84, y: 36, role: 'Porcelain Kilns' },
          { name: 'Samarkand', x: 60, y: 28, role: 'Caravan Hub' },
          { name: 'Baghdad & Basra', x: 36, y: 44, role: 'Cobalt Glaze Lab' },
          { name: 'Sohar & Muscat', x: 50, y: 68, role: 'Maritime Gateway' },
        ],
      },
      {
        id: CulturalCorridorId.MediterraneanAndalus,
        title: 'Al-Andalus & Mediterranean Scientific Bridge',
        eraSpan: '8th – 16th Century CE',
        connectedCivilizations: ['Cordoba & Granada', 'Maghreb & Kairouan', 'Norman–Arab Sicily', 'Renaissance Europe'],
        sharedTechniques: ['Bilingual engraved brass astrolabes, celestial retes, and metallic lusterware'],
        summary:
          'In the observatories of Cordoba and Toledo, scholars synthesized Greek, Arabic, and Latin astronomy into precision brass instruments.',
        mapCoordinates: [
          { name: 'Cordoba & Toledo', x: 20, y: 34, role: 'Observatories' },
          { name: 'Fez & Kairouan', x: 34, y: 56, role: 'Brass Astrolabes' },
          { name: 'Palermo & Venice', x: 52, y: 26, role: 'European Craft' },
          { name: 'Cairo & Alexandria', x: 74, y: 58, role: 'Scholarly Archives' },
        ],
      },
      {
        id: CulturalCorridorId.MesopotamiaGulf,
        title: 'Mesopotamia, Dilmun, Magan & Indus Network',
        eraSpan: '3rd – 1st Millennium BCE',
        connectedCivilizations: ['Sumer & Babylon', 'Dilmun (Bahrain)', 'Magan (Oman & UAE)', 'Harappan Indus'],
        sharedTechniques: ['Carved steatite stamp seals, Magan copper metallurgy, and standardized stone weights'],
        summary:
          'Humanity’s earliest maritime exchange network linked Magan copper ingots, Dilmun circular seals, Indus carnelian, and Mesopotamian cuneiform tablets.',
        mapCoordinates: [
          { name: 'Ur & Babylon', x: 24, y: 28, role: 'Cuneiform Records' },
          { name: 'Dilmun & Tarout', x: 44, y: 48, role: 'Seal Entrepôt' },
          { name: 'Magan (Oman)', x: 58, y: 68, role: 'Copper Smelting' },
          { name: 'Indus Valley', x: 82, y: 52, role: 'Carnelian & Weights' },
        ],
      },
    ],

    fr: [
      {
        id: CulturalCorridorId.IncenseRoute,
        title: 'Route Terrestre de l’Encens et de la Myrrhe',
        eraSpan: 'VIIIe s. av. J.-C. – IIIe s. apr. J.-C.',
        connectedCivilizations: ['Saba & Himyar', 'Nabatéens (Hégra & Pétra)', 'Mésopotamie', 'Méditerranée Orientale'],
        sharedTechniques: ['Sculpture sur calcaire en haut-relief, bronze coulé et épigraphie sud-arabique et nabatéenne'],
        summary:
          'Les caravanes d’encens ont façonné un axe culturel unissant la symbolique sabéenne à la taille de pierre nabatéenne et hellénistique.',
        mapCoordinates: [
          { name: 'Marib & Dhofar', x: 76, y: 78, role: 'Sources d’Encens' },
          { name: 'Qaryat al-Faw', x: 62, y: 60, role: 'Oasis Artistique' },
          { name: 'Hégra (AlUla)', x: 46, y: 43, role: 'Porte Nabatéenne' },
          { name: 'Pétra & Levant', x: 28, y: 24, role: 'Accès Méditerranée' },
        ],
      },
      {
        id: CulturalCorridorId.SilkRoad,
        title: 'Route de la Soie Terrestre et Maritime',
        eraSpan: 'IIe s. av. J.-C. – XVe s. apr. J.-C.',
        connectedCivilizations: ['Bagdad Abbasside', 'Perse & Samarcande', 'Dynasties Tang & Ming', 'Ports du Golfe'],
        sharedTechniques: ['Glaçure au bleu de cobalt oriental associant motifs de lotus et frises calligraphiques'],
        summary:
          'Le minerai de cobalt du Moyen-Orient a voyagé vers les fours chinois avant de revenir par mer sous forme de porcelaines bleu et blanc.',
        mapCoordinates: [
          { name: 'Xi’an & Jingdezhen', x: 84, y: 36, role: 'Fours à Porcelaine' },
          { name: 'Samarcande', x: 60, y: 28, role: 'Carrefour Caravanier' },
          { name: 'Bagdad & Bassorah', x: 36, y: 44, role: 'Atelier du Cobalt' },
          { name: 'Sohar & Mascate', x: 50, y: 68, role: 'Navigation Maritime' },
        ],
      },
      {
        id: CulturalCorridorId.MediterraneanAndalus,
        title: 'Pont Scientifique d’Al-Andalus et Méditerranée',
        eraSpan: 'VIIIe – XVIe siècle',
        connectedCivilizations: ['Cordoue & Grenade', 'Maghreb & Kairouan', 'Sicile Normano-Arabe', 'Europe de la Renaissance'],
        sharedTechniques: ['Astrolabes en laiton bilingues finement gravés et céramiques à reflets métalliques'],
        summary:
          'Dans les observatoires de Cordoue et Tolède, astronomes et artisans ont uni les savoirs arabes et latins sur des disques de laiton.',
        mapCoordinates: [
          { name: 'Cordoue & Tolède', x: 20, y: 34, role: 'Observatoires' },
          { name: 'Fès & Kairouan', x: 34, y: 56, role: 'Instruments' },
          { name: 'Palerme & Venise', x: 52, y: 26, role: 'Transmission' },
          { name: 'Le Caire & Alexandrie', x: 74, y: 58, role: 'Bibliothèques' },
        ],
      },
      {
        id: CulturalCorridorId.MesopotamiaGulf,
        title: 'Réseau Mésopotamie, Dilmun, Magan & Indus',
        eraSpan: 'IIIe – Ier millénaire av. J.-C.',
        connectedCivilizations: ['Sumer & Babylone', 'Dilmun (Bahreïn)', 'Magan (Oman)', 'Vallée de l’Indus'],
        sharedTechniques: ['Sceaux circulaires en stéatite, métallurgie du cuivre et poids normalisés'],
        summary:
          'Le plus ancien réseau maritime documenté reliait le cuivre de Magan, les sceaux de Dilmun, la cornaline de l’Indus et les tablettes d’Ur.',
        mapCoordinates: [
          { name: 'Ur & Babylone', x: 24, y: 28, role: 'Écriture Cunéiforme' },
          { name: 'Dilmun & Tarout', x: 44, y: 48, role: 'Comptoir des Sceaux' },
          { name: 'Magan (Oman)', x: 58, y: 68, role: 'Mines de Cuivre' },
          { name: 'Vallée de l’Indus', x: 82, y: 52, role: 'Cornaline & Poids' },
        ],
      },
    ],

    zh: [
      {
        id: CulturalCorridorId.IncenseRoute,
        title: '陆上乳香与香料贸易之路',
        eraSpan: '公元前 8 世纪 – 公元 3 世纪',
        connectedCivilizations: ['萨巴与希木叶尔王国', '纳巴泰文明（欧拉与佩特拉）', '美索不达米亚', '东地中海城邦'],
        sharedTechniques: ['石灰岩高浮雕与青铜铸盆结合，融合古南阿拉伯碑铭与纳巴泰几何纹样'],
        summary:
          '满载乳香与没药的驼队贯通阿拉伯半岛南北，使萨巴礼仪符号、纳巴泰石雕技艺与地中海审美在驿站器物上交相辉映。',
        mapCoordinates: [
          { name: '马里卜与佐法尔', x: 76, y: 78, role: '乳香产地与铜作' },
          { name: '法乌遗址', x: 62, y: 60, role: '商贸艺术绿洲' },
          { name: '黑格拉（欧拉）', x: 46, y: 43, role: '纳巴泰枢纽' },
          { name: '佩特拉与地中海', x: 28, y: 24, role: '地中海门户' },
        ],
      },
      {
        id: CulturalCorridorId.SilkRoad,
        title: '陆上与海上丝绸之路',
        eraSpan: '公元前 2 世纪 – 公元 15 世纪',
        connectedCivilizations: ['阿拔斯巴格达', '波斯与撒马尔罕', '中国唐宋元明王朝', '阿拉伯湾港口'],
        sharedTechniques: ['西亚钴蓝釉料与东方高火瓷胎结合，融汇莲瓣纹、云气纹与书法装饰带'],
        summary:
          '来自西亚的苏麻离青钴矿跨越山海进入景德镇窑火，烧制成璀璨瓷器后再经海路远销亚非欧，见证东西方工艺的深度互鉴。',
        mapCoordinates: [
          { name: '西安与景德镇', x: 84, y: 36, role: '制瓷中心窑场' },
          { name: '撒马尔罕', x: 60, y: 28, role: '陆路商队中枢' },
          { name: '巴格达与巴士拉', x: 36, y: 44, role: '钴料与玻璃工坊' },
          { name: '苏哈尔与马斯喀特', x: 50, y: 68, role: '远洋航海门户' },
        ],
      },
      {
        id: CulturalCorridorId.MediterraneanAndalus,
        title: '安达卢斯与地中海科学桥梁',
        eraSpan: '公元 8 世纪 – 16 世纪',
        connectedCivilizations: ['科尔多瓦与格拉纳达', '马格里布与凯鲁万', '西西里岛', '欧洲文艺复兴城邦'],
        sharedTechniques: ['双语精密蚀刻黄铜星盘、天球仪星网以及金属光泽彩陶工艺'],
        summary:
          '在科尔多瓦与托莱多的天文台中，东西方天文学家共同校准星表，打造出镌刻阿拉伯星名与拉丁纬度的精密黄铜仪器。',
        mapCoordinates: [
          { name: '科尔多瓦与托莱多', x: 20, y: 34, role: '天文台与译馆' },
          { name: '非斯与凯鲁万', x: 34, y: 56, role: '精密星盘工坊' },
          { name: '巴勒莫与威尼斯', x: 52, y: 26, role: '技艺传入欧洲' },
          { name: '开罗与亚历山大', x: 74, y: 58, role: '古典学术文库' },
        ],
      },
      {
        id: CulturalCorridorId.MesopotamiaGulf,
        title: '两河流域—迪尔蒙—马干—印度河网络',
        eraSpan: '公元前第 3 千纪 – 前第 1 千纪',
        connectedCivilizations: ['苏美尔与巴比伦', '迪尔蒙文明（巴林）', '马干文明（阿曼）', '哈拉帕印度河文明'],
        sharedTechniques: ['滑石圆形印章雕刻、阿曼古铜冶炼与跨海域标准化石质砝码'],
        summary:
          '人类最早的远洋贸易网络之一，将马干红铜、迪尔蒙圆印、印度河红玉髓与乌尔楔形文字泥板紧密联结。',
        mapCoordinates: [
          { name: '乌尔与巴比伦', x: 24, y: 28, role: '楔形文字文献' },
          { name: '迪尔蒙与塔鲁特', x: 44, y: 48, role: '印章贸易港' },
          { name: '马干（阿曼）', x: 58, y: 68, role: '古代铜矿冶炼' },
          { name: '印度河流域', x: 82, y: 52, role: '红玉髓与度量衡' },
        ],
      },
    ],

    ru: [
      {
        id: CulturalCorridorId.IncenseRoute,
        title: 'Караванный Путь благовоний и ладана',
        eraSpan: 'VIII в. до н. э. – III в. н. э.',
        connectedCivilizations: ['Саба и Химьяр', 'Набатея (Хегра и Петра)', 'Месопотамия', 'Восточное Средиземноморье'],
        sharedTechniques: ['Высокий рельеф по известняку, литая бронза и соединение письма муснад с набатейской резьбой'],
        summary:
          'Караваны с ладаном и миррой связали Южную Аравию со Средиземноморьем, объединив сабейскую символику с набатейским и эллинистическим камнерезным искусством.',
        mapCoordinates: [
          { name: 'Мариб и Дофар', x: 76, y: 78, role: 'Истоки ладана' },
          { name: 'Карьят-аль-Фау', x: 62, y: 60, role: 'Оазис ремёсел' },
          { name: 'Хегра (Аль-Ула)', x: 46, y: 43, role: 'Врата Набатеи' },
          { name: 'Петра и Левант', x: 28, y: 24, role: 'Выход к морю' },
        ],
      },
      {
        id: CulturalCorridorId.SilkRoad,
        title: 'Сухопутный и Морской Шёлковый путь',
        eraSpan: 'II в. до н. э. – XV в. н. э.',
        connectedCivilizations: ['Аббасидский Багдад', 'Персия и Самарканд', 'Династии Тан и Мин', 'Порты Залива'],
        sharedTechniques: ['Подглазурная роспись восточным кобальтом, сочетающая лотосы и каллиграфические фризы'],
        summary:
          'Кобальтовые руды Ближнего Востока отправлялись в печи Цзиндэчжэня, возвращаясь морскими караванами в виде фарфора как символ диалога Востока и Запада.',
        mapCoordinates: [
          { name: 'Сиань и Цзиндэчжэнь', x: 84, y: 36, role: 'Печи фарфора' },
          { name: 'Самарканд', x: 60, y: 28, role: 'Узел караванов' },
          { name: 'Багдад и Басра', x: 36, y: 44, role: 'Мастерские глазури' },
          { name: 'Сухар и Маскат', x: 50, y: 68, role: 'Морские врата' },
        ],
      },
      {
        id: CulturalCorridorId.MediterraneanAndalus,
        title: 'Научный мост Аль-Андалуса и Средиземноморья',
        eraSpan: 'VIII – XVI вв. н. э.',
        connectedCivilizations: ['Кордова и Гранада', 'Магриб и Кайруан', 'Сицилия', 'Ренессансная Европа'],
        sharedTechniques: ['Двуязычные гравированные латунные астролябии и керамика с металлическим люстром'],
        summary:
          'В обсерваториях Кордовы и Толедо астрономы объединили арабскую и европейскую научную традицию в высокоточных навигационных приборах.',
        mapCoordinates: [
          { name: 'Кордова и Толедо', x: 20, y: 34, role: 'Обсерватории' },
          { name: 'Фес и Кайруан', x: 34, y: 56, role: 'Астролябии' },
          { name: 'Палермо и Венеция', x: 52, y: 26, role: 'Мост в Европу' },
          { name: 'Каир и Александрия', x: 74, y: 58, role: 'Библиотеки' },
        ],
      },
      {
        id: CulturalCorridorId.MesopotamiaGulf,
        title: 'Сеть Месопотамии, Дильмуна, Магана и Инда',
        eraSpan: 'III – I тыс. до н. э.',
        connectedCivilizations: ['Шумер и Вавилон', 'Дильмун (Бахрейн)', 'Маган (Оман)', 'Долина Инда'],
        sharedTechniques: ['Резные круглые печати из стеатита, выплавка меди Магана и единые каменные гири'],
        summary:
          'Древнейшая морская торговая сеть объединила медь Магана, печати Дильмуна, сердолик Хараппы и клинописные архивы Ура.',
        mapCoordinates: [
          { name: 'Ур и Вавилон', x: 24, y: 28, role: 'Клинопись' },
          { name: 'Дильмун и Тарут', x: 44, y: 48, role: 'Порт печатей' },
          { name: 'Маган (Оман)', x: 58, y: 68, role: 'Медные рудники' },
          { name: 'Долина Инда', x: 82, y: 52, role: 'Сердолик и меры' },
        ],
      },
    ],
  };

  return byLocale[locale];
}

export interface PresetMetadataTranslation {
  title: string;
  period: string;
  material: string;
  dimensions: string;
  region: string;
  cultures: string[];
  notes: string;
  defaultTeam: string;
  corridorId: CulturalCorridorId;
}

export const PRESET_METADATA: Record<
  PresetId,
  Record<LocaleCode, PresetMetadataTranslation>
> = {
  incense_burner: {
    ar: {
      title: 'مبخرة القوافل المنحوتة (ملتقى البتراء ومأرب)',
      period: 'القرن الأول ق.م – الثاني الميلادي',
      material: 'حجر جيري دافئ مع حوض وحلقات من البرونز المؤكسد',
      dimensions: '٢٤ × ٢٠ × ٢٠ سم',
      region: 'محطات طريق البخور (العلا – مأرب)',
      cultures: ['الحضارة النبطية', 'سبأ وحمير', 'شرق المتوسط'],
      notes:
        'تجمع القطعة بين حروف خط المسند الجنوبي والزخارف الهندسية النبطية مع مشهد قافلة الإبل المنحوت على الجانب الأيمن وحوض التبخير البرونزي في المسقط العلوي.',
      defaultTeam: 'فريق الروبوت الطلاب بالمعهد الديني (2026-2027)',
      corridorId: CulturalCorridorId.IncenseRoute,
    },
    'en-US': {
      title: 'Carved Caravan Incense Burner (Petra–Marib Crossroads)',
      period: '1st Century BCE – 2nd Century CE',
      material: 'Warm carved limestone with patinated bronze basin & ring handle',
      dimensions: '24 × 20 × 20 cm',
      region: 'Incense Route Stations (AlUla – Marib)',
      cultures: ['Nabataean', 'Saba & Himyar', 'Eastern Mediterranean'],
      notes:
        'Combines South Arabian Musnad script and Nabataean geometric friezes on the front with a camel caravan relief on the right profile and a cast bronze incense basin on top.',
      defaultTeam: 'Religious Institute Student Robotics Team (2026–2027)',
      corridorId: CulturalCorridorId.IncenseRoute,
    },
    fr: {
      title: 'Brûle-Parfum Caravanier Sculpté (Carrefour Pétra–Marib)',
      period: 'Ier s. av. J.-C. – IIe s. apr. J.-C.',
      material: 'Calcaire sculpté chaud avec vasque et anneau en bronze patiné',
      dimensions: '24 × 20 × 20 cm',
      region: 'Relais de la Route de l’Encens (AlUla – Marib)',
      cultures: ['Nabatéenne', 'Saba & Himyar', 'Méditerranée Orientale'],
      notes:
        'Associe l’écriture sud-arabique Musnad et des frises géométriques nabatéennes en façade à un bas-relief de caravane sur le profil droit et une vasque en bronze au sommet.',
      defaultTeam: 'Équipe Robotique Étudiante — Institut Religieux (2026–2027)',
      corridorId: CulturalCorridorId.IncenseRoute,
    },
    zh: {
      title: '商队浮雕石刻青铜香炉（佩特拉—马里卜交汇遗珍）',
      period: '公元前 1 世纪 – 公元 2 世纪',
      material: '暖色雕花石灰岩配氧化青铜香盆与侧环',
      dimensions: '24 × 20 × 20 厘米',
      region: '乳香之路驿站遗址（欧拉—马里卜）',
      cultures: ['纳巴泰文明', '萨巴与希木叶尔', '东地中海'],
      notes:
        '正面融合古南阿拉伯碑铭字母与纳巴泰几何饰带，右侧精雕骆驼商队行进浮雕，顶部嵌有铸造青铜焚香内盆。',
      defaultTeam: '宗教研究院学生机器人团队 (2026–2027)',
      corridorId: CulturalCorridorId.IncenseRoute,
    },
    ru: {
      title: 'Резная караванная курильница (перекрёсток Петры и Мариба)',
      period: 'I в. до н. э. – II в. н. э.',
      material: 'Тёплый резной известняк, чаша и кольцо из патинированной бронзы',
      dimensions: '24 × 20 × 20 см',
      region: 'Станции Пути благовоний (Аль-Ула – Мариб)',
      cultures: ['Набатейская', 'Саба и Химьяр', 'Восточное Средиземноморье'],
      notes:
        'Сочетает южноаравийское письмо муснад и набатейский геометрический фриз на фасаде с рельефом верблюжьего каравана справа и бронзовой чашей сверху.',
      defaultTeam: 'Студенческая команда робототехники Религиозного института (2026–2027)',
      corridorId: CulturalCorridorId.IncenseRoute,
    },
  },

  astrolabe: {
    ar: {
      title: 'إسطرلاب الرصد الفلكي المشترك (قرطبة – بغداد)',
      period: 'القرن العاشر الميلادي',
      material: 'نحاس أصفر مطروق ومطعّم باللازورد',
      dimensions: 'قطر ١٩.٥ سم × سماكة ١.٨ سم',
      region: 'مراصد قرطبة وحواضر المتوسط',
      cultures: ['الأندلس', 'بغداد العباسية', 'حوض المتوسط'],
      notes:
        'يوثق المسح الرباعي شبكة النجوم الأمامية ومسطرة الرصد (العضادة) على الظهر، شاهداً على انتقال العلوم الفلكية بين الشرق والغرب.',
      defaultTeam: 'فريق الروبوت الطلاب بالمعهد الديني (2026-2027)',
      corridorId: CulturalCorridorId.MediterraneanAndalus,
    },
    'en-US': {
      title: 'Shared Celestial Brass Astrolabe (Cordoba–Baghdad)',
      period: '10th Century CE',
      material: 'Hammered engraved brass with lapis-blue celestial inlay',
      dimensions: '19.5 cm diameter × 1.8 cm thickness',
      region: 'Observatories of Cordoba & Mediterranean Ports',
      cultures: ['Al-Andalus', 'Abbasid Baghdad', 'Mediterranean Europe'],
      notes:
        'Four-angle scan documents the front star-pointer rete and rear sighting alidade, illustrating astronomical knowledge shared across East and West.',
      defaultTeam: 'Religious Institute Student Robotics Team (2026–2027)',
      corridorId: CulturalCorridorId.MediterraneanAndalus,
    },
    fr: {
      title: 'Astrolabe Céleste en Laiton (Cordoue–Bagdad)',
      period: 'Xe siècle apr. J.-C.',
      material: 'Laiton martelé gravé avec incrustation bleu lapis',
      dimensions: 'Diamètre 19,5 cm × épaisseur 1,8 cm',
      region: 'Observatoires de Cordoue & Méditerranée',
      cultures: ['Al-Andalus', 'Bagdad Abbasside', 'Europe Méditerranéenne'],
      notes:
        'La numérisation sous 4 angles révèle l’araignée stellaire frontale et l’alidade de visée au revers, témoins du dialogue astronomique.',
      defaultTeam: 'Équipe Robotique Étudiante — Institut Religieux (2026–2027)',
      corridorId: CulturalCorridorId.MediterraneanAndalus,
    },
    zh: {
      title: '跨文化精密黄铜天文星盘（科尔多瓦—巴格达）',
      period: '公元 10 世纪',
      material: '锤揲镌刻黄铜嵌青金蓝刻度圈',
      dimensions: '直径 19.5 厘米 × 厚 1.8 厘米',
      region: '科尔多瓦天文台与地中海学术城邦',
      cultures: ['安达卢斯', '阿拔斯巴格达', '地中海欧洲'],
      notes:
        '四角度扫描完整记录正面星网指针与背面照准窥衡，展现东西方天文学与精密机械制造的交汇。',
      defaultTeam: '宗教研究院学生机器人团队 (2026–2027)',
      corridorId: CulturalCorridorId.MediterraneanAndalus,
    },
    ru: {
      title: 'Латунная небесная астролябия (Кордова – Багдад)',
      period: 'X век н. э.',
      material: 'Чеканная гравированная латунь с лазуритовой инкрустацией',
      dimensions: 'Диаметр 19,5 см × толщина 1,8 см',
      region: 'Обсерватории Кордовы и Средиземноморья',
      cultures: ['Аль-Андалус', 'Аббасидский Багдад', 'Южная Европа'],
      notes:
        'Съёмка с 4 направлений фиксирует лицевую звёздную сетку-рете и визирную линейку-алидаду на обороте — памятник единства астрономической науки.',
      defaultTeam: 'Студенческая команда робототехники Религиозного института (2026–2027)',
      corridorId: CulturalCorridorId.MediterraneanAndalus,
    },
  },

  silk_ewer: {
    ar: {
      title: 'إبريق الخزف اللازوردي المذهّب (طريق الحرير)',
      period: 'القرن الثالث عشر الميلادي',
      material: 'خزف مزجج بالكوبالت الأزرق وبريق الذهب',
      dimensions: 'ارتفاع ٣٢ سم × قطر ١٧ سم',
      region: 'موانئ الخليج العربي وسمرقند',
      cultures: ['العراق وفارس', 'الصين', 'موانئ الخليج العربي'],
      notes:
        'يُظهر المسح متعدد الاتجاهات التقاء خام الكوبالت المشرقي مع تقنيات الأفران الآسيوية والزخارف النباتية المتداولة عبر طريق الحرير.',
      defaultTeam: 'فريق الروبوت الطلاب بالمعهد الديني (2026-2027)',
      corridorId: CulturalCorridorId.SilkRoad,
    },
    'en-US': {
      title: 'Cobalt & Gold Glazed Ceramic Ewer (Silk Road)',
      period: '13th Century CE',
      material: 'Stoneware glazed with West Asian cobalt blue & gold luster',
      dimensions: '32 cm height × 17 cm diameter',
      region: 'Arabian Gulf Ports & Samarkand',
      cultures: ['Iraq & Persia', 'China', 'Arabian Gulf Maritime Hubs'],
      notes:
        'Multi-angle capture highlights the meeting of West Asian cobalt mineral glazes with East Asian high-fired kiln craft and shared floral bands.',
      defaultTeam: 'Religious Institute Student Robotics Team (2026–2027)',
      corridorId: CulturalCorridorId.SilkRoad,
    },
    fr: {
      title: 'Aiguière en Céramique Bleu de Cobalt et Or (Route de la Soie)',
      period: 'XIIIe siècle apr. J.-C.',
      material: 'Céramique glaçurée au cobalt oriental et rehauts d’or',
      dimensions: 'Hauteur 32 cm × diamètre 17 cm',
      region: 'Ports du Golfe & Samarcande',
      cultures: ['Irak & Perse', 'Chine', 'Ports Maritimes du Golfe'],
      notes:
        'La capture multi-angles illustre la rencontre du minerai de cobalt moyen-oriental et de la maîtrise des fours asiatiques.',
      defaultTeam: 'Équipe Robotique Étudiante — Institut Religieux (2026–2027)',
      corridorId: CulturalCorridorId.SilkRoad,
    },
    zh: {
      title: '丝绸之路钴蓝描金釉陶执壶',
      period: '公元 13 世纪',
      material: '西亚钴蓝釉彩配描金高温陶瓷',
      dimensions: '高 32 厘米 × 腹径 17 厘米',
      region: '阿拉伯湾贸易港与撒马尔罕',
      cultures: ['两河与波斯', '中国', '海湾航海枢纽'],
      notes:
        '多角度影像清晰呈现西亚钴蓝矿物发色剂与东方瓷器造型、卷草花卉纹饰的跨大陆融合。',
      defaultTeam: '宗教研究院学生机器人团队 (2026–2027)',
      corridorId: CulturalCorridorId.SilkRoad,
    },
    ru: {
      title: 'Керамический кувшин с кобальтовой глазурью и золотом (Шёлковый путь)',
      period: 'XIII век н. э.',
      material: 'Керамика с ближневосточным кобальтом и золотым люстром',
      dimensions: 'Высота 32 см × диаметр 17 см',
      region: 'Порты Залива и Самарканд',
      cultures: ['Ирак и Персия', 'Китай', 'Морские порты Залива'],
      notes:
        'Многоракурсная фиксация раскрывает синтез ближневосточной кобальтовой глазури и восточноазиатских технологий обжига.',
      defaultTeam: 'Студенческая команда робототехники Религиозного института (2026–2027)',
      corridorId: CulturalCorridorId.SilkRoad,
    },
  },
};
