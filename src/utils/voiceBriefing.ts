import { PRESET_METADATA } from '../i18n/domainTranslations';
import { DocumentedArtifact, LocaleCode, PresetId } from '../types/artifact';
import { getCountryDisplayName } from './worldCountries';

export interface ArtifactVoiceBriefingData {
  artifactName: string;
  countryName: string;
  siteName: string;
  ultraBriefSummary: string;
  printedDocNotice: string;
  fullSpokenScript: string;
}

const DEFAULT_SITE_FALLBACK: Record<LocaleCode, string> = {
  ar: 'الموقع الأثري المعتمد',
  'en-US': 'Certified Heritage Site',
  fr: 'Site Patrimonial Certifié',
  zh: '认证文物保存遗址',
  ru: 'Сертифицированный объект наследия',
};

/**
 * Ultra-concise curator summaries for the 3 reference presets across all 5 locales,
 * fulfilling "النبذة التفصيلية عنها باختصار شديد".
 */
const PRESET_ULTRA_BRIEF_SUMMARIES: Record<
  PresetId,
  Record<LocaleCode, string>
> = {
  incense_burner: {
    ar: 'مبخرة أثرية من الحجر الجيري المنحوت والبرونز من القرن الأول قبل الميلاد، تجمع نقوش المسند الجنوبي والزخارف النبطية ومشهد قوافل البخور.',
    'en-US':
      'A 1st-century BCE carved limestone and bronze incense burner uniting South Arabian Musnad epigraphy, Nabataean geometric friezes, and a camel caravan relief.',
    fr: 'Brûle-parfum en calcaire sculpté et bronze du Ier siècle av. J.-C., alliant écriture sud-arabique Musnad, frises nabatéennes et bas-relief caravanier.',
    zh: '公元前一世纪雕花石灰岩配青铜香炉，融汇古南阿拉伯碑铭、纳巴泰几何纹饰与骆驼商队浮雕。',
    ru: 'Резная известняковая и бронзовая курильница I века до н. э., объединяющая южноаравийское письмо муснад, набатейский фриз и рельеф каравана.',
  },
  astrolabe: {
    ar: 'إسطرلاب فلكي دقيق من النحاس الأصفر المطروق يعود للقرن العاشر الميلادي، يوثّق شبكة النجوم وتلاقي علوم الرصد الفلكي بين قرطبة وبغداد.',
    'en-US':
      'A 10th-century hammered brass celestial astrolabe documenting precision star-pointer retes and shared astronomical science between Cordoba and Baghdad.',
    fr: 'Astrolabe céleste en laiton martelé du Xe siècle documentant l’araignée stellaire et le dialogue astronomique entre Cordoue et Bagdad.',
    zh: '公元十世纪锤揲黄铜精密星盘，完整保存正面星网指针与照准窥衡，见证科尔多瓦与巴格达的天文学交汇。',
    ru: 'Чеканная латунная небесная астролябия X века с лицевой звёздной сеткой и алидадой — памятник астрономической науки Кордовы и Багдада.',
  },
  silk_ewer: {
    ar: 'إبريق خزفي مزجّج بالكوبالت الأزرق وبريق الذهب من القرن الثالث عشر الميلادي، يجسّد التبادل الفني العابر للقارات عبر طريق الحرير.',
    'en-US':
      'A 13th-century stoneware ewer glazed in cobalt blue and gold luster, embodying cross-continental kiln artistry along the Silk Road.',
    fr: 'Aiguière en céramique du XIIIe siècle glaçurée au bleu de cobalt et à l’or, illustrant les échanges artistiques de la Route de la Soie.',
    zh: '公元十三世纪钴蓝釉描金执壶，展现西亚钴料与东方高温窑艺在丝绸之路上的跨大陆交融。',
    ru: 'Керамический кувшин XIII века с кобальтовой глазурью и золотым люстром, воплощающий художественный обмен на Великом шёлковом пути.',
  },
};

const CERTIFIED_PRINTED_DOC_NOTICE: Record<LocaleCode, string> = {
  ar: 'يمكنك الحصول على كافة التفاصيل في صورة مستند مطبوع معتمد من المنصة.',
  'en-US':
    'You can obtain all full details in a certified printed document from the platform.',
  fr: 'Vous pouvez obtenir tous les détails complets sous forme de document imprimé certifié par la plateforme.',
  zh: '您可以从本平台获取包含全部详情的官方认证打印档案。',
  ru: 'Вы можете получить все подробные сведения в виде сертифицированного печатного документа платформы.',
};

const LOCALE_SPEECH_LANG: Record<LocaleCode, string> = {
  ar: 'ar-SA',
  'en-US': 'en-US',
  fr: 'fr-FR',
  zh: 'zh-CN',
  ru: 'ru-RU',
};

const LOCALE_LANG_PREFIX: Record<LocaleCode, string> = {
  ar: 'ar',
  'en-US': 'en',
  fr: 'fr',
  zh: 'zh',
  ru: 'ru',
};

/**
 * Resolves the localized artifact title cleanly across presets and custom entries.
 */
export function getArtifactDisplayTitle(
  artifact: DocumentedArtifact,
  locale: LocaleCode
): string {
  if (artifact.presetKey) {
    const presetAll = PRESET_METADATA[artifact.presetKey];
    if (presetAll) {
      const matchesKnownPresetTitle = Object.values(presetAll).some(
        (m) => m.title.trim() === (artifact.titleAr || '').trim()
      );
      if (matchesKnownPresetTitle || !artifact.titleAr?.trim()) {
        return presetAll[locale].title;
      }
    }
  }
  return (artifact.titleAr || '').trim();
}

/**
 * Resolves the localized site / discovery region name for cascading dropdowns
 * (Country -> Site -> Artifact) across all 5 supported languages.
 */
export function getArtifactSiteDisplayName(
  artifact: DocumentedArtifact,
  locale: LocaleCode
): string {
  if (artifact.presetKey) {
    const presetAll = PRESET_METADATA[artifact.presetKey];
    if (presetAll) {
      const rawRegion = (artifact.discoveryRegionAr || '').trim();
      const matchesKnownPresetRegion = Object.values(presetAll).some(
        (m) => m.region.trim() === rawRegion
      );
      if (matchesKnownPresetRegion || !rawRegion) {
        return presetAll[locale].region;
      }
    }
  }

  const customSite = (
    artifact.discoveryRegionAr ||
    artifact.environmentalProfile?.galleryStorageLocation ||
    ''
  ).trim();

  return customSite || DEFAULT_SITE_FALLBACK[locale];
}

function distillCustomArtifactSummary(
  artifact: DocumentedArtifact,
  locale: LocaleCode
): string {
  if (artifact.presetKey) {
    const presetAll = PRESET_METADATA[artifact.presetKey];
    const rawNotes = (artifact.curatorialNotesAr || '').trim();
    const isDefaultPresetNote =
      !rawNotes ||
      Object.values(presetAll).some((m) => m.notes.trim() === rawNotes);
    if (isDefaultPresetNote) {
      return PRESET_ULTRA_BRIEF_SUMMARIES[artifact.presetKey][locale];
    }
  }

  const rawNotes = (artifact.curatorialNotesAr || '').trim();
  if (rawNotes.length > 0) {
    const firstSentence = rawNotes
      .split(/(?<=[.!?।。؛;])\s+/)[0]
      ?.trim() ?? rawNotes;
    const maxChars = locale === 'zh' ? 75 : 155;
    if (firstSentence.length <= maxChars) {
      return firstSentence;
    }
    const sliced = firstSentence.slice(0, maxChars);
    const lastSpace = sliced.lastIndexOf(' ');
    const cleanCut =
      locale !== 'zh' && lastSpace > 60 ? sliced.slice(0, lastSpace) : sliced;
    return `${cleanCut.trim()}…`;
  }

  const period = (artifact.periodAr || '').trim();
  const material = (artifact.materialAr || '').trim();

  switch (locale) {
    case 'ar':
      return `قطعة أثرية موثّقة من ${material || 'مقتنيات التراث'} تعود إلى ${
        period || 'حقبة تاريخية معتمدة'
      }.`;
    case 'fr':
      return `Artéfact patrimonial documenté en ${
        material || 'matériau historique'
      }, datant de ${period || 'période certifiée'}.`;
    case 'zh':
      return `已建档珍贵文物，材质为${material || '历史遗珍'}，年代属${
        period || '认证历史时期'
      }。`;
    case 'ru':
      return `Задокументированный памятник (${
        material || 'исторический материал'
      }), период: ${period || 'сертифицированная эпоха'}.`;
    default:
      return `Documented heritage artifact crafted of ${
        material || 'archival material'
      }, dating to ${period || 'a certified historical period'}.`;
  }
}

/**
 * Builds the concise voice briefing payload containing:
 * 1. Artifact Name
 * 2. Country
 * 3. Ultra-brief summary of detailed description
 * 4. Explicit notice that full details are available in a certified printed document from the platform
 */
export function buildArtifactVoiceBriefing(
  artifact: DocumentedArtifact,
  locale: LocaleCode
): ArtifactVoiceBriefingData {
  const artifactName = getArtifactDisplayTitle(artifact, locale);
  const countryName = getCountryDisplayName(
    artifact.countryCode || 'BH',
    locale
  );
  const siteName = getArtifactSiteDisplayName(artifact, locale);
  const ultraBriefSummary = distillCustomArtifactSummary(artifact, locale);
  const printedDocNotice = CERTIFIED_PRINTED_DOC_NOTICE[locale];

  let fullSpokenScript = '';
  switch (locale) {
    case 'ar':
      fullSpokenScript = `اسم القطعة: ${artifactName}. الدولة: ${countryName}. نبذة مختصرة: ${ultraBriefSummary} تنويه: ${printedDocNotice}`;
      break;
    case 'fr':
      fullSpokenScript = `Artéfact : ${artifactName}. Pays : ${countryName}. Résumé succinct : ${ultraBriefSummary} Note : ${printedDocNotice}`;
      break;
    case 'zh':
      fullSpokenScript = `文物名称：${artifactName}。所属国家：${countryName}。简要概述：${ultraBriefSummary} 提示：${printedDocNotice}`;
      break;
    case 'ru':
      fullSpokenScript = `Артефакт: ${artifactName}. Страна: ${countryName}. Краткая справка: ${ultraBriefSummary} Примечание: ${printedDocNotice}`;
      break;
    default:
      fullSpokenScript = `Artifact: ${artifactName}. Country: ${countryName}. Brief summary: ${ultraBriefSummary} Note: ${printedDocNotice}`;
      break;
  }

  return {
    artifactName,
    countryName,
    siteName,
    ultraBriefSummary,
    printedDocNotice,
    fullSpokenScript,
  };
}

// Keep strong reference to prevent browser GC from prematurely dropping utterance mid-playback
let activeUtteranceRef: SpeechSynthesisUtterance | null = null;
let speakTimerId: number | null = null;

export function isSpeechSynthesisSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof SpeechSynthesisUtterance !== 'undefined'
  );
}

// Preload voices asynchronously when available
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  try {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', () => {
      window.speechSynthesis.getVoices();
    });
  } catch {
    // Ignore restricted context errors
  }
}

function selectBestVoiceForLocale(
  locale: LocaleCode
): SpeechSynthesisVoice | null {
  if (!isSpeechSynthesisSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const targetExact = LOCALE_SPEECH_LANG[locale].toLowerCase();
  const targetPrefix = LOCALE_LANG_PREFIX[locale].toLowerCase();

  const matchingPrefix = voices.filter((v) =>
    v.lang.toLowerCase().startsWith(targetPrefix)
  );
  if (matchingPrefix.length === 0) return null;

  // Prefer natural/neural/enhanced voices when available
  const highQuality = matchingPrefix.find((v) =>
    /natural|neural|online|google|premium|enhanced/i.test(v.name)
  );
  if (highQuality) return highQuality;

  const exactMatch = matchingPrefix.find(
    (v) => v.lang.toLowerCase() === targetExact
  );
  return exactMatch ?? matchingPrefix[0];
}

/**
 * Unlocks Web Speech API inside a direct user click gesture (such as clicking
 * "التحقق والتنبؤ بالمخاطر") so subsequent camera-detection narration plays smoothly.
 */
export function primeSpeechSynthesisOnUserGesture(): void {
  if (!isSpeechSynthesisSupported()) return;
  try {
    window.speechSynthesis.resume();
    if (!window.speechSynthesis.speaking) {
      const primer = new SpeechSynthesisUtterance(' ');
      primer.volume = 0.01;
      primer.rate = 2;
      window.speechSynthesis.speak(primer);
    }
  } catch {
    // Ignore browser speech unlock errors safely
  }
}

/**
 * Plays a soft, museum-grade two-tone confirmation chime when the artifact
 * locks inside the verification camera frame.
 */
export function playDetectionChime(): void {
  if (typeof window === 'undefined') return;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return;

  try {
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(528, now);
    osc1.frequency.setValueAtTime(660, now + 0.09);

    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.exponentialRampToValueAtTime(0.045, now + 0.025);
    gain1.gain.exponentialRampToValueAtTime(0.0008, now + 0.24);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.25);
    window.setTimeout(() => {
      ctx.close().catch(() => {});
    }, 350);
  } catch {
    // Ignore audio context restrictions
  }
}

export function stopArtifactBriefing(): void {
  if (speakTimerId !== null && typeof window !== 'undefined') {
    window.clearTimeout(speakTimerId);
    speakTimerId = null;
  }
  activeUtteranceRef = null;
  if (!isSpeechSynthesisSupported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // Ignore cancel errors
  }
}

export function speakArtifactBriefing(
  script: string,
  locale: LocaleCode,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: () => void;
  }
): () => void {
  if (!isSpeechSynthesisSupported()) {
    callbacks?.onError?.();
    return () => {};
  }

  stopArtifactBriefing();

  let cancelled = false;

  speakTimerId = window.setTimeout(() => {
    if (cancelled) return;
    try {
      window.speechSynthesis.resume();
      const utterance = new SpeechSynthesisUtterance(script);
      utterance.lang = LOCALE_SPEECH_LANG[locale];
      const chosenVoice = selectBestVoiceForLocale(locale);
      if (chosenVoice) {
        utterance.voice = chosenVoice;
        utterance.lang = chosenVoice.lang;
      }
      utterance.rate = locale === 'ar' ? 0.96 : 0.98;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        if (!cancelled) {
          callbacks?.onStart?.();
        }
      };

      utterance.onend = () => {
        if (activeUtteranceRef === utterance) {
          activeUtteranceRef = null;
        }
        if (!cancelled) {
          callbacks?.onEnd?.();
        }
      };

      utterance.onerror = () => {
        if (activeUtteranceRef === utterance) {
          activeUtteranceRef = null;
        }
        if (!cancelled) {
          callbacks?.onEnd?.();
          callbacks?.onError?.();
        }
      };

      activeUtteranceRef = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      callbacks?.onError?.();
    }
  }, 55);

  return () => {
    cancelled = true;
    stopArtifactBriefing();
  };
}
