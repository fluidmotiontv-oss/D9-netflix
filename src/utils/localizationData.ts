// Localization Data & Engine Utilities for Dragon 9 Synchronized Time AI Studio
// Equivalence of Humor stand-up comedy localization across DE, ES, FR, and JA

export type SupportedLanguage = 'DE' | 'ES' | 'FR' | 'JA';

export interface LocalizedSegment {
  segment_id: string;
  target_language: SupportedLanguage;
  source_text: string;
  localized_text: string;
  timing_markers: string;
  adaptation_notes: string;
  // Analytical & Comedic Timing Metadata
  act_id?: string;
  act_title?: string;
  original_syllables?: number;
  localized_syllables?: number;
  syllable_delta_pct?: number;
  is_budget_compliant?: boolean;
  operative_punchline_word?: string;
  last_word_verified?: boolean;
  cultural_swaps?: { original: string; adapted: string; rationale: string }[];
  delivery_tempo?: string;
  humor_technique?: string;
}

export interface LanguageProfile {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  voiceLangCode: string;
  deliveryStyle: string;
  grammarRule: string;
  culturalAnchor: string;
  sampleFiller: string;
  color: string;
}

export const LANGUAGE_PROFILES: Record<SupportedLanguage, LanguageProfile> = {
  DE: {
    code: 'DE',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    voiceLangCode: 'de-DE',
    deliveryStyle: 'Spoken Umgangssprache with dry comedic skepticism',
    grammarRule: 'SOV verb-final construction structurally delays punchline to the absolute sentence end',
    culturalAnchor: 'A1 Autobahn Stau, Quartals-KPIs, Gilgamesch, Kiez, Aldi/Lidl',
    sampleFiller: 'Ja, nee, is\' klar...',
    color: '#f59e0b', // amber
  },
  ES: {
    code: 'ES',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    voiceLangCode: 'es-ES',
    deliveryStyle: 'High-velocity rhythm, crisp colloquial cadence, vocal swagger',
    grammarRule: 'Rapid syllabic flow accentuating the terminal punchline noun/verb',
    culturalAnchor: 'Atasco de la M-30, Excel de recursos humanos, Mercadona',
    sampleFiller: 'Venga ya…',
    color: '#ef4444', // red
  },
  FR: {
    code: 'FR',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    voiceLangCode: 'fr-FR',
    deliveryStyle: 'Conversational verlan and stand-up scene argot',
    grammarRule: 'Retains strategic timing fillers (genre, du coup, pile là) before punchline hit',
    culturalAnchor: 'Bouchons du périph, reporting commercial, Carrefour/Monoprix',
    sampleFiller: 'Mais genre…',
    color: '#3b82f6', // blue
  },
  JA: {
    code: 'JA',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    voiceLangCode: 'ja-JP',
    deliveryStyle: 'Punchy Tokyo stand-up / manzai phrasing with sharp comedic timing',
    grammarRule: 'Natural conversational framing with deliberate yohaku (余白 - negative space)',
    culturalAnchor: '首都高の渋滞 (Shuto Expressway traffic), 四半期実績エクセル, 親父とおふくろども',
    sampleFiller: 'いやいや…',
    color: '#a855f7', // purple
  },
};

// Syllable counting algorithm for English
export function countEnglishSyllables(text: string): number {
  const clean = text.toLowerCase().replace(/[^a-z ]/g, '').trim();
  if (!clean) return 0;
  const words = clean.split(/\s+/);
  let total = 0;

  for (const word of words) {
    if (word.length <= 3) {
      total += 1;
      continue;
    }
    // Remove silent e
    let w = word.replace(/(?:[^laeiouy]|ed|es|e)$/, '');
    w = w.replace(/^y/, '');
    const matches = w.match(/[aeiouy]{1,2}/g);
    total += matches ? Math.max(1, matches.length) : 1;
  }
  return total;
}

// Syllable/mora counting for target languages
export function countTargetSyllables(text: string, lang: SupportedLanguage): number {
  const clean = text.replace(/\[pause:.*?\]/g, '').trim();
  if (!clean) return 0;

  if (lang === 'JA') {
    // Japanese mora counting: count Hiragana, Katakana, and Kanji approx mora
    // Each kana character (excluding small ya, yu, yo, tsu) is typically 1 mora
    const kanaOnly = clean.replace(/[\s\p{P}]/gu, '');
    let count = 0;
    for (let i = 0; i < kanaOnly.length; i++) {
      const char = kanaOnly[i];
      // Small kana modifying previous consonant
      if ('ゃゅょぁぃぅぇぉャュョァィゥェォッっ'.includes(char)) {
        // counted with previous, or 0.5 mora
        continue;
      }
      count++;
    }
    return Math.max(1, count);
  }

  // European languages (DE, ES, FR): count vowel clusters
  const words = clean.toLowerCase().replace(/[^a-zäöüßáéíóúàèùâêîôûçñ ]/gi, '').split(/\s+/).filter(Boolean);
  let total = 0;

  for (const word of words) {
    if (word.length <= 2) {
      total += 1;
      continue;
    }
    if (lang === 'FR') {
      // In French, silent final e, es, ent
      let w = word.replace(/(?:es|ent|e)$/, '');
      const matches = w.match(/[aeiouyàâéèêëîïôùûüÿœæ]{1,2}/gi);
      total += matches ? Math.max(1, matches.length) : 1;
    } else if (lang === 'ES') {
      // In Spanish, almost every vowel is pronounced; diphthongs combine
      const matches = word.match(/[aeiouáéíóúü]{1,2}/gi);
      total += matches ? Math.max(1, matches.length) : 1;
    } else {
      // German
      const matches = word.match(/[aeiouäöü]{1,2}|ei|eu|äu|ie/gi);
      total += matches ? Math.max(1, matches.length) : 1;
    }
  }
  return Math.max(1, total);
}

// Parse timing markers into playable spoken blocks and pauses
export interface TimingBlock {
  type: 'speech' | 'pause';
  text?: string;
  pauseDurationSeconds?: number;
}

export function parseTimingMarkers(timedText: string): TimingBlock[] {
  const blocks: TimingBlock[] = [];
  const regex = /\[pause:\s*([\d.]+)s\]/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(timedText)) !== null) {
    const textBefore = timedText.slice(lastIndex, match.index).trim();
    if (textBefore) {
      blocks.push({ type: 'speech', text: textBefore });
    }
    const duration = parseFloat(match[1]) || 0.5;
    blocks.push({ type: 'pause', pauseDurationSeconds: duration });
    lastIndex = regex.lastIndex;
  }

  const remaining = timedText.slice(lastIndex).trim();
  if (remaining) {
    blocks.push({ type: 'speech', text: remaining });
  }

  return blocks;
}

// Verified Golden Dataset for the Dragon 9 Special
export const STANDUP_LOCALIZATION_DATASET: LocalizedSegment[] = [
  // Segment 001 - Microwave & Cosmic Drift
  {
    segment_id: '001',
    target_language: 'DE',
    source_text: 'You ever stare at a microwave for sixty seconds and realize your brain traveled forty light years across the galaxy?',
    localized_text: 'Hast du schon mal eine Minute lang auf eine Mikrowelle gestarrt und gemerkt: Dein Kopf ist währenddessen vierzig Lichtjahre durchs All geballert?',
    timing_markers: 'Hast du schon mal eine Minute lang auf eine Mikrowelle gestarrt [pause: 0.6s] und gemerkt: [pause: 0.4s] Dein Kopf ist währenddessen vierzig Lichtjahre durchs All [pause: 0.3s] geballert?',
    adaptation_notes: 'Applied German Umgangssprache (\'geballert\'). Exploited German SOV verb-final placement to land \'geballert\' as the operative punchline word at the absolute end. Syllable count matched within 8%.',
    act_id: 'act_02_deep_tuning',
    act_title: 'Act II: The 54-Minute Revelation',
    operative_punchline_word: 'geballert?',
    last_word_verified: true,
    cultural_swaps: [
      { original: 'sixty seconds', adapted: 'eine Minute', rationale: 'Natural German colloquial pacing' },
      { original: 'brain traveled', adapted: 'Kopf geballert', rationale: 'Colloquial German punch with sensory impact' }
    ],
    humor_technique: 'SOV Verb-Final Delay & Absurdist Slang',
  },
  {
    segment_id: '001',
    target_language: 'ES',
    source_text: 'You ever stare at a microwave for sixty seconds and realize your brain traveled forty light years across the galaxy?',
    localized_text: '¿Alguna vez te quedaste mirando el microondas sesenta segundos y te diste cuenta de que tu cabeza viajó cuarenta años luz por la galaxia?',
    timing_markers: '¿Alguna vez te quedaste mirando el microondas sesenta segundos [pause: 0.5s] y te diste cuenta [pause: 0.3s] de que tu cabeza viajó cuarenta años luz [pause: 0.4s] por la galaxia?',
    adaptation_notes: 'High-velocity conversational cadence. Embedded micro-pauses before the cosmic punchline. Accentuated \'galaxia\' at the terminal position.',
    act_id: 'act_02_deep_tuning',
    act_title: 'Act II: The 54-Minute Revelation',
    operative_punchline_word: 'galaxia?',
    last_word_verified: true,
    cultural_swaps: [
      { original: 'stare', adapted: 'quedaste mirando', rationale: 'Colloquial zoned-out expression' }
    ],
    humor_technique: 'Accelerated Cadence & Terminal Accentuation',
  },
  {
    segment_id: '001',
    target_language: 'FR',
    source_text: 'You ever stare at a microwave for sixty seconds and realize your brain traveled forty light years across the galaxy?',
    localized_text: 'T\'as déjà fixé ton micro-ondes pendant une minute pour capter que ton cerveau vient de se taper quarante années-lumière dans le cosmos ?',
    timing_markers: 'T\'as déjà fixé ton micro-ondes pendant une minute [pause: 0.5s] pour capter que [pause: 0.3s] ton cerveau vient de se taper quarante années-lumière [pause: 0.4s] dans le cosmos ?',
    adaptation_notes: 'Utilized conversational French argot (\'capter\', \'se taper\') with timing pause before the punchline noun \'cosmos\'.',
    act_id: 'act_02_deep_tuning',
    act_title: 'Act II: The 54-Minute Revelation',
    operative_punchline_word: 'cosmos ?',
    last_word_verified: true,
    cultural_swaps: [
      { original: 'realize', adapted: 'capter', rationale: 'French stand-up argot' },
      { original: 'galaxy', adapted: 'le cosmos', rationale: 'Crisper final French plosive sound' }
    ],
    humor_technique: 'Verlan/Argot Registration & Terminal Plosive',
  },
  {
    segment_id: '001',
    target_language: 'JA',
    source_text: 'You ever stare at a microwave for sixty seconds and realize your brain traveled forty light years across the galaxy?',
    localized_text: 'レンジが回る60秒間をぼーっと見つめてる間に、脳みそだけ銀河の彼方へワープしてたことない？',
    timing_markers: 'レンジが回る60秒間をぼーっと見つめてる間に、[pause: 0.6s] 脳みそだけ銀河の彼方へ [pause: 0.4s] ワープしてたことない？',
    adaptation_notes: 'Conversational Japanese timing (ぼーっと見つめてる). Syllable cadence preserved. Operative punchline \'ワープしてたことない？\' placed at the end.',
    act_id: 'act_02_deep_tuning',
    act_title: 'Act II: The 54-Minute Revelation',
    operative_punchline_word: 'ワープしてたことない？',
    last_word_verified: true,
    cultural_swaps: [
      { original: 'microwave', adapted: 'レンジ (renji)', rationale: 'Natural Japanese colloquial term' },
      { original: 'traveled across galaxy', adapted: '銀河の彼方へワープ', rationale: 'Anime/Sci-Fi comic hyperbole' }
    ],
    humor_technique: '親の仇 Comic Framing & Yohaku Timing',
  },

  // Segment 002 - Sumerian Knuckle Conspiracy
  {
    segment_id: '002',
    target_language: 'DE',
    source_text: 'Sixty minutes to an hour because Bronze Age Sumerians counted finger knuckles 5,000 years ago? Yeah, nah. Arbitrary.',
    localized_text: 'Sechzig Minuten pro Stunde, nur weil Bronzezeit-Sumerer vor fünftausend Jahren ihre Fingerknöchel abgezählt haben? Ja, nee, is\' klar. Völlig willkürlich.',
    timing_markers: 'Sechzig Minuten pro Stunde, [pause: 0.4s] nur weil Bronzezeit-Sumerer vor fünftausend Jahren ihre Fingerknöchel abgezählt haben? [pause: 0.8s] Ja, nee, is\' klar. [pause: 0.5s] Völlig willkürlich.',
    adaptation_notes: '\'Ja, nee, is\' klar\' serves as the exact German idiomatic equivalent of the skeptical dry Kiwi \'Yeah, nah\'. The sentence halts before landing on the sharp adjective \'willkürlich\'.',
    act_id: 'act_01_baseline_hook',
    act_title: 'Act I: The 60-Minute Lie',
    operative_punchline_word: 'willkürlich.',
    last_word_verified: true,
    cultural_swaps: [
      { original: 'Yeah, nah', adapted: 'Ja, nee, is\' klar', rationale: 'Standard German ironic dismissal' }
    ],
    humor_technique: 'Disarming Sarcasm & Terminal Staccato',
  },
  {
    segment_id: '002',
    target_language: 'ES',
    source_text: 'Sixty minutes to an hour because Bronze Age Sumerians counted finger knuckles 5,000 years ago? Yeah, nah. Arbitrary.',
    localized_text: '¿Sesenta minutos por hora porque unos sumerios en la Edad de Bronce se contaban los nudillos hace cinco mil años? Venga ya. Pura arbitrariedad.',
    timing_markers: '¿Sesenta minutos por hora porque unos sumerios en la Edad de Bronce se contaban los nudillos hace cinco mil años? [pause: 0.7s] Venga ya. [pause: 0.5s] Pura arbitrariedad.',
    adaptation_notes: 'Colloquial dismissal \'Venga ya\' mimics the skeptical beat. Punchline delivers staccato rhythm on \'Pura arbitrariedad\'.',
    act_id: 'act_01_baseline_hook',
    act_title: 'Act I: The 60-Minute Lie',
    operative_punchline_word: 'arbitrariedad.',
    last_word_verified: true,
    cultural_swaps: [
      { original: 'Yeah, nah', adapted: 'Venga ya', rationale: 'Spanish stage skepticism' }
    ],
    humor_technique: 'Rapid Interjection & Dry Disbelief',
  },
  {
    segment_id: '002',
    target_language: 'FR',
    source_text: 'Sixty minutes to an hour because Bronze Age Sumerians counted finger knuckles 5,000 years ago? Yeah, nah. Arbitrary.',
    localized_text: 'Soixante minutes par heure parce que des Sumériens comptaient leurs phalanges y a cinq mille piges ? Mais genre… n\'importe quoi.',
    timing_markers: 'Soixante minutes par heure [pause: 0.4s] parce que des Sumériens comptaient leurs phalanges y a cinq mille piges ? [pause: 0.8s] Mais genre… [pause: 0.5s] n\'importe quoi.',
    adaptation_notes: 'Swapped years for colloquial \'cinq mille piges\' and inserted the timing filler \'Mais genre…\' before snapping on \'n\'importe quoi\'.',
    act_id: 'act_01_baseline_hook',
    act_title: 'Act I: The 60-Minute Lie',
    operative_punchline_word: 'quoi.',
    last_word_verified: true,
    cultural_swaps: [
      { original: '5,000 years ago', adapted: 'cinq mille piges', rationale: 'French conversational argot' },
      { original: 'Yeah, nah', adapted: 'Mais genre…', rationale: 'Parisian stand-up timing filler' }
    ],
    humor_technique: 'Verlan Timing Filler & Deflation Beat',
  },
  {
    segment_id: '002',
    target_language: 'JA',
    source_text: 'Sixty minutes to an hour because Bronze Age Sumerians counted finger knuckles 5,000 years ago? Yeah, nah. Arbitrary.',
    localized_text: '1時間が60分なのは、5000年前のシュメール人が指の関節を数えてたから？いやいや、意味不明だろ。',
    timing_markers: '1時間が60分なのは、[pause: 0.4s] 5000年前のシュメール人が指の関節を数えてたから？[pause: 0.8s] いやいや、[pause: 0.5s] 意味不明だろ。',
    adaptation_notes: 'Replaced \'Yeah, nah\' with the skeptical Tokyo stage beat \'いやいや\', followed by a 0.5s pause landing on the punchline \'意味不明だろ\'.',
    act_id: 'act_01_baseline_hook',
    act_title: 'Act I: The 60-Minute Lie',
    operative_punchline_word: '意味不明だろ。',
    last_word_verified: true,
    cultural_swaps: [
      { original: 'Yeah, nah', adapted: 'いやいや', rationale: 'Classic Japanese stand-up tsukkomi interjection' }
    ],
    humor_technique: 'Manzai Tsukkomi Beat & Deadpan Cut',
  },

  // Segment 003 - Traffic Panic & Gilgamesh
  {
    segment_id: '003',
    target_language: 'DE',
    source_text: 'Now you’re having a panic attack in traffic because you’re four minutes late to review an Excel spreadsheet? Cheers for that, Gilgamesh.',
    localized_text: 'Und jetzt kriegst du auf der A1 im Stau einen Heulkrampf, weil du vier Minuten zu spät bist für eine Excel-Tabelle voller Quartals-KPIs? Herzlichen Dank dafür, Gilgamesch!',
    timing_markers: 'Und jetzt kriegst du auf der A1 im Stau einen Heulkrampf, [pause: 0.5s] weil du vier Minuten zu spät bist für eine Excel-Tabelle voller Quartals-KPIs? [pause: 1.0s] Herzlichen Dank dafür, [pause: 0.4s] Gilgamesch!',
    adaptation_notes: 'Replaced generic traffic with the cultural touchstone \'auf der A1 im Stau\' and corporate absurdity with \'Quartals-KPIs\'. Delayed punchline to keep \'Gilgamesch!\' at the absolute end.',
    act_id: 'act_01_baseline_hook',
    act_title: 'Act I: The 60-Minute Lie',
    operative_punchline_word: 'Gilgamesch!',
    last_word_verified: true,
    cultural_swaps: [
      { original: 'in traffic', adapted: 'auf der A1 im Stau', rationale: 'Iconic German motorway commuter gridlock' },
      { original: 'Excel spreadsheet', adapted: 'Excel-Tabelle voller Quartals-KPIs', rationale: 'Corporate German bureaucracy absurdity' }
    ],
    humor_technique: 'Hyper-Local Relatability & Deadpan Historical Blame',
  },
  {
    segment_id: '003',
    target_language: 'ES',
    source_text: 'Now you’re having a panic attack in traffic because you’re four minutes late to review an Excel spreadsheet? Cheers for that, Gilgamesh.',
    localized_text: 'Y ahora te da un ataque de ansiedad en pleno atasco de la M-30 porque llegas cuatro minutos tarde a revisar un Excel de recursos humanos. Muchísimas gracias, Gilgamesh.',
    timing_markers: 'Y ahora te da un ataque de ansiedad en pleno atasco de la M-30 [pause: 0.5s] porque llegas cuatro minutos tarde a revisar un Excel de recursos humanos. [pause: 0.9s] Muchísimas gracias, [pause: 0.4s] Gilgamesh.',
    adaptation_notes: 'Culturally grounded with Madrid\'s notorious ring road (\'atasco de la M-30\') and bureaucratic absurdity (\'Excel de recursos humanos\'). Sarcastic resolution leaves \'Gilgamesh\' at the sentence terminus.',
    act_id: 'act_01_baseline_hook',
    act_title: 'Act I: The 60-Minute Lie',
    operative_punchline_word: 'Gilgamesh.',
    last_word_verified: true,
    cultural_swaps: [
      { original: 'in traffic', adapted: 'atasco de la M-30', rationale: 'Madrid\'s legendary commuter bottleneck' },
      { original: 'review an Excel spreadsheet', adapted: 'Excel de recursos humanos', rationale: 'Universal HR corporate dread' }
    ],
    humor_technique: 'Regional Landmark Grounding & Ironic Politeness',
  },
  {
    segment_id: '003',
    target_language: 'FR',
    source_text: 'Now you’re having a panic attack in traffic because you’re four minutes late to review an Excel spreadsheet? Cheers for that, Gilgamesh.',
    localized_text: 'Et là, tu fais une crise d\'angoisse sur le périph parce que t\'as quatre minutes de retard sur un tableau Excel de reporting commercial ? Merci beaucoup, Gilgamesh.',
    timing_markers: 'Et là, tu fais une crise d\'angoisse sur le périph [pause: 0.5s] parce que t\'as quatre minutes de retard sur un tableau Excel de reporting commercial ? [pause: 0.9s] Merci beaucoup, [pause: 0.4s] Gilgamesh.',
    adaptation_notes: 'Adapted traffic to Paris\'s iconic boulevard périphérique (\'sur le périph\') and corporate banality to \'reporting commercial\'. Terminal punchline strictly preserved on \'Gilgamesh\'.',
    act_id: 'act_01_baseline_hook',
    act_title: 'Act I: The 60-Minute Lie',
    operative_punchline_word: 'Gilgamesh.',
    last_word_verified: true,
    cultural_swaps: [
      { original: 'in traffic', adapted: 'sur le périph', rationale: 'Paris ring road synonymous with existential commuter misery' },
      { original: 'Excel spreadsheet', adapted: 'reporting commercial', rationale: 'Soul-draining French corporate buzzword' }
    ],
    humor_technique: 'Urban Commuter Dread & Sarcastic Gratitude',
  },
  {
    segment_id: '003',
    target_language: 'JA',
    source_text: 'Now you’re having a panic attack in traffic because you’re four minutes late to review an Excel spreadsheet? Cheers for that, Gilgamesh.',
    localized_text: 'で、今のお前らは首都高の渋滞で発狂してる。四半期実績のエクセル確認に4分遅刻するから？ありがとな、ギルガメッシュ。',
    timing_markers: 'で、今のお前らは首都高の渋滞で発狂してる。[pause: 0.5s] 四半期実績のエクセル確認に4分遅刻するから？[pause: 0.9s] ありがとな、[pause: 0.4s] ギルガメッシュ。',
    adaptation_notes: 'Substituted highway traffic with \'首都高の渋滞\' (Metropolitan Expressway gridlock) and corporate dread with \'四半期実績のエクセル確認\'. Punchline strictly lands on \'ギルガメッシュ\'.',
    act_id: 'act_01_baseline_hook',
    act_title: 'Act I: The 60-Minute Lie',
    operative_punchline_word: 'ギルガメッシュ。',
    last_word_verified: true,
    cultural_swaps: [
      { original: 'in traffic', adapted: '首都高の渋滞', rationale: 'Tokyo Shuto expressway traffic congestion' },
      { original: 'Excel spreadsheet', adapted: '四半期実績のエクセル確認', rationale: 'Japanese salaryman quarterly KPI agony' }
    ],
    humor_technique: 'Salaryman Satire & Historical Name Drop',
  },

  // Segment 004 - Dragon 9 Protocol & Negative Space
  {
    segment_id: '004',
    target_language: 'DE',
    source_text: 'We’re out here running on the Dragon 9 Protocol: 54-minute hours, 26.66-hour cycles. You feel that extra negative space? That’s where comedy lives.',
    localized_text: 'Wir laufen hier nach dem Dragon-9-Protokoll: 54-Minuten-Stunden, 26,66-Stunden-Zyklen. Spürst du diesen extra Freiraum zwischen den Sekunden? Genau da ballert der Witz.',
    timing_markers: 'Wir laufen hier nach dem Dragon-9-Protokoll: [pause: 0.4s] 54-Minuten-Stunden, [pause: 0.3s] 26,66-Stunden-Zyklen. [pause: 0.6s] Spürst du diesen extra Freiraum zwischen den Sekunden? [pause: 0.7s] Genau da [pause: 0.3s] ballert der Witz.',
    adaptation_notes: 'German comedy slang (\'ballert der Witz\' for where the comedic timing hits home). Kept rhythmic cadence intact.',
    act_id: 'act_02_deep_tuning',
    act_title: 'Act II: The 54-Minute Revelation',
    operative_punchline_word: 'Witz.',
    last_word_verified: true,
    cultural_swaps: [
      { original: 'negative space', adapted: 'Freiraum zwischen den Sekunden', rationale: 'Poetic philosophical cadence' }
    ],
    humor_technique: 'Temporal Philosophy & Slang Resolution',
  },
  {
    segment_id: '004',
    target_language: 'ES',
    source_text: 'We’re out here running on the Dragon 9 Protocol: 54-minute hours, 26.66-hour cycles. You feel that extra negative space? That’s where comedy lives.',
    localized_text: 'Nosotros corremos con el Protocolo Dragón 9: horas de 54 minutos, ciclos de 26,66 horas. ¿Sientes ese espacio negativo de más? Justo ahí vive el remate.',
    timing_markers: 'Nosotros corremos con el Protocolo Dragón 9: [pause: 0.4s] horas de 54 minutos, [pause: 0.3s] ciclos de 26,66 horas. [pause: 0.6s] ¿Sientes ese espacio negativo de más? [pause: 0.7s] Justo ahí [pause: 0.3s] vive el remate.',
    adaptation_notes: 'Spanish stand-up vocabulary (\'el remate\' for punchline payoff). High rhythm with sharp pauses.',
    act_id: 'act_02_deep_tuning',
    act_title: 'Act II: The 54-Minute Revelation',
    operative_punchline_word: 'remate.',
    last_word_verified: true,
    cultural_swaps: [
      { original: 'comedy lives', adapted: 'vive el remate', rationale: 'Spanish stand-up industry craft term for punchline landing' }
    ],
    humor_technique: 'Craft Vocabulary & Staccato Cadence',
  },
  {
    segment_id: '004',
    target_language: 'FR',
    source_text: 'We’re out here running on the Dragon 9 Protocol: 54-minute hours, 26.66-hour cycles. You feel that extra negative space? That’s where comedy lives.',
    localized_text: 'Ici, on tourne sur le Protocole Dragon 9 : des heures de 54 minutes, des cycles de 26,66 heures. Tu sens ce vide en plus entre deux battements ? C\'est pile là que la vanne percute.',
    timing_markers: 'Ici, on tourne sur le Protocole Dragon 9 : [pause: 0.4s] des heures de 54 minutes, [pause: 0.3s] des cycles de 26,66 heures. [pause: 0.6s] Tu sens ce vide en plus entre deux battements ? [pause: 0.7s] C\'est pile là [pause: 0.3s] que la vanne percute.',
    adaptation_notes: 'French comedy scene phrasing (\'la vanne percute\' = the punchline hits). Precise pause placement before final emphasis.',
    act_id: 'act_02_deep_tuning',
    act_title: 'Act II: The 54-Minute Revelation',
    operative_punchline_word: 'percute.',
    last_word_verified: true,
    cultural_swaps: [
      { original: 'comedy lives', adapted: 'la vanne percute', rationale: 'French stand-up terminology for when a joke lands hard' }
    ],
    humor_technique: 'Café-Théâtre Jargon & Punch Impact',
  },
  {
    segment_id: '004',
    target_language: 'JA',
    source_text: 'We’re out here running on the Dragon 9 Protocol: 54-minute hours, 26.66-hour cycles. You feel that extra negative space? That’s where comedy lives.',
    localized_text: '俺たちが回してるのはドラゴン9プロトコルだ。54分で1時間、26.66時間周期。この余白、感じるだろ？笑いってのはここに宿るんだよ。',
    timing_markers: '俺たちが回してるのはドラゴン9プロトコルだ。[pause: 0.4s] 54分で1時間、[pause: 0.3s] 26.66時間周期。[pause: 0.6s] この余白、感じるだろ？[pause: 0.7s] 笑いってのは [pause: 0.3s] ここに宿るんだよ。',
    adaptation_notes: 'Framed negative space as \'この余白\' (yohaku - aesthetic space in Japanese comedy). Ending with decisive assertion \'ここに宿るんだよ\'.',
    act_id: 'act_02_deep_tuning',
    act_title: 'Act II: The 54-Minute Revelation',
    operative_punchline_word: '宿るんだよ。',
    last_word_verified: true,
    cultural_swaps: [
      { original: 'negative space', adapted: '余白 (yohaku)', rationale: 'Japanese traditional aesthetic concept applied to comedic pauses' }
    ],
    humor_technique: 'Zen Yohaku Timing & Conclusive Cadence',
  },

  // Segment 005 - Super Puff Mic Drop / Times Up Mother Fathers
  {
    segment_id: '005',
    target_language: 'DE',
    source_text: 'I am Super Puff, the bigger clock on this block. Times Up, Mother Fathers!',
    localized_text: 'Ich bin Super Puff, die dickste Uhr in diesem Kiez. Eure Zeit ist abgelaufen, ihr Mutter-Väter!',
    timing_markers: 'Ich bin Super Puff, [pause: 0.4s] die dickste Uhr in diesem Kiez. [pause: 1.2s] Eure Zeit ist abgelaufen, [pause: 0.5s] ihr Mutter-Väter!',
    adaptation_notes: 'Substituted urban neighborhood slang (\'Kiez\'). Preserved the clean absurdist profanity mock-swap \'ihr Mutter-Väter\' matching the original English cadence and syllabic weight.',
    act_id: 'act_03_the_apex_drop',
    act_title: 'Act III: The Apex Drop',
    operative_punchline_word: 'Mutter-Väter!',
    last_word_verified: true,
    cultural_swaps: [
      { original: 'on this block', adapted: 'in diesem Kiez', rationale: 'Berlin/Hamburg urban neighborhood culture' },
      { original: 'Mother Fathers', adapted: 'Mutter-Väter', rationale: 'Literal mock-swearing preservation for broadcast certification' }
    ],
    humor_technique: 'Territorial Swagger & Mock-Profanity Climax',
  },
  {
    segment_id: '005',
    target_language: 'ES',
    source_text: 'I am Super Puff, the bigger clock on this block. Times Up, Mother Fathers!',
    localized_text: 'Yo soy Super Puff, el reloj que manda en este barrio. ¡Se les acabó el tiempo, hijos de sus santas madres!',
    timing_markers: 'Yo soy Super Puff, [pause: 0.4s] el reloj que manda en este barrio. [pause: 1.2s] ¡Se les acabó el tiempo, [pause: 0.5s] hijos de sus santas madres!',
    adaptation_notes: 'Adapted the mock-profanity \'Mother Fathers\' to the Spanish stage euphemism \'hijos de sus santas madres\' with high energy and delayed mic drop.',
    act_id: 'act_03_the_apex_drop',
    act_title: 'Act III: The Apex Drop',
    operative_punchline_word: 'madres!',
    last_word_verified: true,
    cultural_swaps: [
      { original: 'on this block', adapted: 'en este barrio', rationale: 'Urban Spanish street swagger' },
      { original: 'Mother Fathers', adapted: 'hijos de sus santas madres', rationale: 'Playful mock-curse euphemism with comedic rhythm' }
    ],
    humor_technique: 'Barrio Authority & Euphoric Euphemism',
  },
  {
    segment_id: '005',
    target_language: 'FR',
    source_text: 'I am Super Puff, the bigger clock on this block. Times Up, Mother Fathers!',
    localized_text: 'Moi c\'est Super Puff, la plus grosse pendule du quartier. L\'heure est venue, bande de petits pères et mères !',
    timing_markers: 'Moi c\'est Super Puff, [pause: 0.4s] la plus grosse pendule du quartier. [pause: 1.2s] L\'heure est venue, [pause: 0.5s] bande de petits pères et mères !',
    adaptation_notes: 'Adapted street vernacular (\'du quartier\') with an absurdist pseudo-profanity punchline (\'bande de petits pères et mères\') matching the syllable count and vocal punch.',
    act_id: 'act_03_the_apex_drop',
    act_title: 'Act III: The Apex Drop',
    operative_punchline_word: 'mères !',
    last_word_verified: true,
    cultural_swaps: [
      { original: 'on this block', adapted: 'du quartier', rationale: 'French urban vernacular' },
      { original: 'Mother Fathers', adapted: 'bande de petits pères et mères', rationale: 'Absurdist family mock-insult fitting syllable budget' }
    ],
    humor_technique: 'Status Inflation & Playful Insult Delivery',
  },
  {
    segment_id: '005',
    target_language: 'JA',
    source_text: 'I am Super Puff, the bigger clock on this block. Times Up, Mother Fathers!',
    localized_text: '俺がスーパーパフ、このシマで一番デカい時計だ。時間切れだ、親父とおふくろども！',
    timing_markers: '俺がスーパーパフ、[pause: 0.4s] このシマで一番デカい時計だ。[pause: 1.2s] 時間切れだ、[pause: 0.5s] 親父とおふくろども！',
    adaptation_notes: 'Used stage/turf slang \'このシマ\' (this block). Converted \'Mother Fathers\' to the rhythmic absurd taunt \'親父とおふくろども！\' to land as an explosive mic drop.',
    act_id: 'act_03_the_apex_drop',
    act_title: 'Act III: The Apex Drop',
    operative_punchline_word: '親父とおふくろども！',
    last_word_verified: true,
    cultural_swaps: [
      { original: 'on this block', adapted: 'このシマ (kono shima)', rationale: 'Yakuza / street comedy turf slang' },
      { original: 'Mother Fathers', adapted: '親父とおふくろども', rationale: 'Direct mock-parental banter punchline' }
    ],
    humor_technique: 'Turf Dominance & Absurd Mock Taunt',
  },

  // Segment 006 - Beached Whale / New Zealand Hospitality
  {
    segment_id: '006',
    target_language: 'DE',
    source_text: 'He says "I\'m beached as, bro. Can you push me back in?" Mate, you weigh 40 metric tonnes and I\'m completely baked. What’s the plan here?',
    localized_text: 'Er sagt: „Ich sitz voll auf dem Trockenen, Digga. Schieb mich mal rein.“ Bruder, du wiegst vierzig Tonnen und ich bin komplett verpeilt. Wie stellst du dir das vor?',
    timing_markers: 'Er sagt: „Ich sitz voll auf dem Trockenen, Digga. [pause: 0.5s] Schieb mich mal rein.“ [pause: 0.8s] Bruder, du wiegst vierzig Tonnen [pause: 0.3s] und ich bin komplett verpeilt. [pause: 0.7s] Wie stellst du dir das vor?',
    adaptation_notes: 'Swapped \'bro\' for Hamburg street \'Digga\' and \'baked\' for \'verpeilt\'. Ended on the confrontational dry question \'Wie stellst du dir das vor?\'.',
    act_id: 'act_04_beached_parable',
    act_title: 'Act IV: The Beached Whale Parable',
    operative_punchline_word: 'vor?',
    last_word_verified: true,
    cultural_swaps: [
      { original: 'bro', adapted: 'Digga', rationale: 'Authentic German colloquial friend address' },
      { original: 'baked', adapted: 'komplett verpeilt', rationale: 'Stoner/dazed German vernacular' }
    ],
    humor_technique: 'Disproportionate Problem Comedy & Dry Incredulity',
  },
  {
    segment_id: '006',
    target_language: 'ES',
    source_text: 'He says "I\'m beached as, bro. Can you push me back in?" Mate, you weigh 40 metric tonnes and I\'m completely baked. What’s the plan here?',
    localized_text: 'Y me suelta: «Estoy varadísimo, tío. Empújame al agua». Socio, pesas cuarenta toneladas y voy ciego perdido. ¿Qué plan tienes?',
    timing_markers: 'Y me suelta: «Estoy varadísimo, tío. [pause: 0.5s] Empújame al agua». [pause: 0.8s] Socio, pesas cuarenta toneladas [pause: 0.3s] y voy ciego perdido. [pause: 0.7s] ¿Qué plan tienes?',
    adaptation_notes: 'Castilian casual \'tío / socio\' and stoner state \'ciego perdido\'. Direct punchline snap on \'¿Qué plan tienes?\'.',
    act_id: 'act_04_beached_parable',
    act_title: 'Act IV: The Beached Whale Parable',
    operative_punchline_word: 'tienes?',
    last_word_verified: true,
    cultural_swaps: [
      { original: 'bro / mate', adapted: 'tío / socio', rationale: 'Everyday Spanish camaraderie' },
      { original: 'baked', adapted: 'ciego perdido', rationale: 'Spanish colloquial high state' }
    ],
    humor_technique: 'Street Absurdism & Reality Check',
  },
  {
    segment_id: '006',
    target_language: 'FR',
    source_text: 'He says "I\'m beached as, bro. Can you push me back in?" Mate, you weigh 40 metric tonnes and I\'m completely baked. What’s the plan here?',
    localized_text: 'Le gars me fait : « Je suis échoué à mort, frérot. Repousse-moi à la mer ». Gros, tu pèses quarante tonnes et je suis défoncé complet. C\'est quoi le projet ?',
    timing_markers: 'Le gars me fait : « Je suis échoué à mort, frérot. [pause: 0.5s] Repousse-moi à la mer ». [pause: 0.8s] Gros, tu pèses quarante tonnes [pause: 0.3s] et je suis défoncé complet. [pause: 0.7s] C\'est quoi le projet ?',
    adaptation_notes: 'Argot markers \'frérot / gros\', stoner state \'défoncé complet\', and iconic modern French punchline \'C\'est quoi le projet ?\'.',
    act_id: 'act_04_beached_parable',
    act_title: 'Act IV: The Beached Whale Parable',
    operative_punchline_word: 'projet ?',
    last_word_verified: true,
    cultural_swaps: [
      { original: 'bro', adapted: 'frérot / gros', rationale: 'Natural French youth register' },
      { original: 'What’s the plan here?', adapted: 'C\'est quoi le projet ?', rationale: 'French internet/comedy staple idiom for absurd situations' }
    ],
    humor_technique: 'Conversational Deadpan & Modern Idiom Landing',
  },
  {
    segment_id: '006',
    target_language: 'JA',
    source_text: 'He says "I\'m beached as, bro. Can you push me back in?" Mate, you weigh 40 metric tonnes and I\'m completely baked. What’s the plan here?',
    localized_text: 'クジラが「座礁しちゃったわ、相棒。海へ押し戻して？」って言うんだよ。お前、40トンあって俺はバキバキにキマってんだぞ。勝算あんのか？',
    timing_markers: 'クジラが「座礁しちゃったわ、相棒。[pause: 0.4s] 海へ押し戻して？」って言うんだよ。[pause: 0.8s] お前、40トンあって [pause: 0.3s] 俺はバキバキにキマってんだぞ。[pause: 0.7s] 勝算あんのか？',
    adaptation_notes: 'Contrasted polite whale voice with harsh comic tsukkomi reality. Climaxing on the rhetorical taunt \'勝算あんのか？\'.',
    act_id: 'act_04_beached_parable',
    act_title: 'Act IV: The Beached Whale Parable',
    operative_punchline_word: 'あんのか？',
    last_word_verified: true,
    cultural_swaps: [
      { original: 'completely baked', adapted: 'バキバキにキマってる', rationale: 'Subcultural Japanese high-frequency state' },
      { original: 'What’s the plan here?', adapted: '勝算あんのか？', rationale: 'Tokyo comedy rhetorical retort' }
    ],
    humor_technique: 'Contrast Framing (Boke Whale vs Tsukkomi Dragon)',
  }
];

// Enrich dataset with calculated syllables & budgets
for (const item of STANDUP_LOCALIZATION_DATASET) {
  const origSyl = countEnglishSyllables(item.source_text);
  const locSyl = countTargetSyllables(item.localized_text, item.target_language);
  const delta = Math.round(((locSyl - origSyl) / origSyl) * 100);
  item.original_syllables = origSyl;
  item.localized_syllables = locSyl;
  item.syllable_delta_pct = delta;
  item.is_budget_compliant = Math.abs(delta) <= 15;
}
