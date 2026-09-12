// Old Clock Crowd Work Bonus Data: Super Puff vs. The Linear Time Believers
import { HecklerPersonaId } from '../audio/hecklerPersonas';

export interface OldClockStage {
  step: 1 | 2 | 3 | 4;
  title: string;
  speaker: 'heckler' | 'puff';
  text: string;
  japaneseText?: string;
  actionNote: string;
  sfx: 'clock_tick' | 'smoke_blast' | 'clock_shatter' | 'sub_drop' | 'crowd_gasp' | 'crowd_laugh';
  confidenceDrain: number; // Percentage remaining after this step
  statusSummary: string;
}

export interface OldClockHeckler {
  id: string;
  name: string;
  avatar: string;
  seatLocation: string;
  personaId: HecklerPersonaId;
  clockObsession: string;
  heckleTrigger: string;
  startingConfidence: number;
  stages: OldClockStage[];
  oldClockDiagnosis: string;
  liberatedTakeaway: string;
  terpenePairing: string;
  xpAward: number;
}

export const OLD_CLOCK_HECKLERS: OldClockHeckler[] = [
  {
    id: 'dave-management',
    name: 'Dave from Middle Management',
    avatar: '👔',
    seatLocation: 'Row B, Seat 12 (Direct Front Center)',
    personaId: 'the_tech_bro',
    clockObsession: 'Apple Watch Ultra, Outlook Calendar & 15-Minute Agile Standups',
    heckleTrigger: 'Hey dragon, wrap it up! You are 4 minutes past your 15-minute slot, my Outlook sync is pinging, and linear time pays my mortgage!',
    startingConfidence: 100,
    oldClockDiagnosis: 'Terminal Stockholm Syndrome with Microsoft 365 and 9 AM Zoom Standups',
    liberatedTakeaway: 'Dave took off his Apple Watch, placed it under his pint glass, and stared into the ceiling lights for 20 minutes in peaceful silence.',
    terpenePairing: 'Cosmic OG (31.4% THC | 2.8% Myrcene) for instant corporate deprogramming',
    xpAward: 220,
    stages: [
      {
        step: 1,
        title: 'The Heckle: Calendar Alert Panic',
        speaker: 'heckler',
        text: 'Hey dragon, wrap it up! You are 4 minutes past your 15-minute slot! My Outlook sync is pinging, my Agile sprint retro starts at 11, and linear time pays my mortgage!',
        actionNote: 'Taps glowing smartwatch aggressively while waving a corporate badge',
        sfx: 'clock_tick',
        confidenceDrain: 100,
        statusSummary: 'Arrogant adherence to corporate calendar dogma'
      },
      {
        step: 2,
        title: 'The Disarming Probe: Kiwi Hospitality',
        speaker: 'puff',
        text: 'Aw Dave, mate. Bless ya, legend. Look at your Apple Watch vibrating like a frightened cicada. You have a titanium wrist computer telling your biological heart when it is legally permitted to stand up?',
        japaneseText: '相棒、そのスマートウォッチに魂まで支配されてんのか？ (Mate, is that smartwatch running your soul?)',
        actionNote: 'Super Puff pauses mid-stride, raises one emerald eyebrow, takes a slow velvet pull from his joint',
        sfx: 'smoke_blast',
        confidenceDrain: 75,
        statusSummary: 'Disarmed by gentle pity; glancing nervously at wrist'
      },
      {
        step: 3,
        title: 'The Brutal Deconstruction: Sumerian Knuckles',
        speaker: 'puff',
        text: 'Dave, who told you an hour was sixty minutes? Three Babylonian shepherds five thousand years ago who counted the twelve finger joints on one hand with their thumb, multiplied by five fingers on the other hand, and went "Right, sixty it is!" You built your entire 401(k), your quarterly performance reviews, and your existential anxiety on ancient Mesopotamian knuckle math, mate!',
        japaneseText: '5000年前の羊飼いの指関節の数え間違いで、お前の人生が縛られてんだよ！ (Your entire life is bound by a 5,000-year-old shepherd finger-counting error!)',
        actionNote: 'Blows a dense violet smoke ring that forms a ticking clock dial, then slices it in half with a liquid chrome mic',
        sfx: 'clock_shatter',
        confidenceDrain: 30,
        statusSummary: 'Existential panic set in; realizing knuckles dictate his bedtime'
      },
      {
        step: 4,
        title: 'The Annihilation: The 54-Minute Liberation',
        speaker: 'puff',
        text: 'There are fifty-four fluid minutes in an authentic hour, Dave. That is six whole minutes stolen from you every hour by Big Chrono to keep you answering Slack notifications before breakfast. Your calendar is not time management, champion—it is Stockholm syndrome with a spreadsheet. I am Super Puff, the bigger clock on this block. Times Up, Mother Fathers!',
        japaneseText: '時間切れだぜ、マザーファザーズ！ お前の時計はもう死んでいる。(Times Up, Mother Fathers! Your clock is already dead.)',
        actionNote: 'Drops the mic, sub-bass 808 rattles the venue footlights, crowd breaks into roaring applause',
        sfx: 'sub_drop',
        confidenceDrain: 0,
        statusSummary: 'CONFIDENCE DESTROYED (0%): Apple Watch unstrapped; mind shattered into 54-min geometry'
      }
    ]
  },
  {
    id: 'swiss-horologist',
    name: 'Julian the Swiss Horology Snob',
    avatar: '⌚',
    seatLocation: 'Row A, Seat 4 (VIP High-Top Table)',
    personaId: 'the_critic',
    clockObsession: 'Patek Philippe Grandmaster Chime with Tourbillon Escapement',
    heckleTrigger: 'Preposterous! My timepiece has 38 ruby jewels and a double-axis tourbillon! It is calibrated to the cosmic frequency of the Swiss Alps!',
    startingConfidence: 100,
    oldClockDiagnosis: 'Severe Mechanical Fetishism & Delusions of Swiss Cosmic Authority',
    liberatedTakeaway: 'Julian realized gears are just metal rocks rubbing together in an anxious circle.',
    terpenePairing: 'Quantum Diesel (High Terpinolene) for high-speed gear dismantling',
    xpAward: 240,
    stages: [
      {
        step: 1,
        title: 'The Heckle: The 38-Jewel Defense',
        speaker: 'heckler',
        text: 'Preposterous! My timepiece has thirty-eight synthetic ruby jewels and a double-axis tourbillon! It is calibrated to the cosmic frequency of the Swiss Alps!',
        actionNote: 'Pulls back cuff of bespoke Italian blazer to flaunt a $90,000 rose gold mechanical dial',
        sfx: 'clock_tick',
        confidenceDrain: 100,
        statusSummary: 'Unshakable snobbery in European micro-mechanics'
      },
      {
        step: 2,
        title: 'The Disarming Probe: The Gear Salad',
        speaker: 'puff',
        text: 'Julian, mate. Look at you. You paid thirty thousand quid for an artisanal gear salad strapped to your pulse just so tiny brass cogs can remind you you are still twenty minutes late to an empty pilates studio.',
        japaneseText: '高そうな時計だな。でもお前の焦りは1円も安くなってねえよ。(Pricey watch, mate. Hasnt made your panic a single yen cheaper.)',
        actionNote: 'Blows a tiny cloud of sparkling stardust directly over the rose-gold bezel',
        sfx: 'smoke_blast',
        confidenceDrain: 68,
        statusSummary: 'Blushing; attempting to cover the dial with sleeve'
      },
      {
        step: 3,
        title: 'The Brutal Deconstruction: The Ham Slicer',
        speaker: 'puff',
        text: 'You put microscopic ruby rocks inside a gold casing so springs can tick-tick-tick your mortal existence into little wafer-thin slices like a supermarket delicatessen ham! The multiverse does not have teeth on its gears, Julian. The cosmos is a fluid twenty-seven-degree holographic terpene wave. Your tourbillon is just an over-engineered panic metronome!',
        japaneseText: '宇宙には歯車なんてねえんだよ。お前のトゥールビヨンはただの高級パニック装置だ！ (The universe has no gears. Your tourbillon is just a luxury panic device!)',
        actionNote: 'Points blunt tip at watch face; simulated glass cracks with a sharp high-frequency resonance',
        sfx: 'clock_shatter',
        confidenceDrain: 25,
        statusSummary: 'Horrified realization that his watch is an expensive prison warden'
      },
      {
        step: 4,
        title: 'The Annihilation: Chrono Liquidation',
        speaker: 'puff',
        text: 'You bought a prison guard from Geneva and named it an heirloom. Drop that brass hamster wheel in your gin and tonic, breathe in the 54-minute void, and remember who runs this dimension. Times Up, Mother Fathers!',
        japaneseText: 'ジュネーブの牢屋から今すぐ出な。時間切れだぜ、マザーファザーズ！ (Step out of your Geneva jail cell. Times Up, Mother Fathers!)',
        actionNote: 'Sub-bass gong boom shakes the stage floor; audience table erupts in laughter',
        sfx: 'sub_drop',
        confidenceDrain: 0,
        statusSummary: 'CONFIDENCE DESTROYED (0%): Patek Philippe dunked in ice water'
      }
    ]
  },
  {
    id: 'daylight-bureaucrat',
    name: 'Brenda the Daylight Savings Advocate',
    avatar: '☀️',
    seatLocation: 'Row C, Seat 7 (Aisle Seat)',
    personaId: 'the_heckler',
    clockObsession: 'Daylight Savings Time, Municipal Ordinances & School Bus Schedules',
    heckleTrigger: 'Daylight Savings is essential for farmers and civic efficiency! We spring forward and fall back for civilization!',
    startingConfidence: 100,
    oldClockDiagnosis: 'Chronic Sun-Theft Rationalization Syndrome',
    liberatedTakeaway: 'Brenda finally acknowledged that cutting a blanket and sewing it to the top does not make a longer blanket.',
    terpenePairing: '27° Nebula Haze (Linalool + Humulene) for cosmic perspective shifts',
    xpAward: 210,
    stages: [
      {
        step: 1,
        title: 'The Heckle: Spring Forward Dogma',
        speaker: 'heckler',
        text: 'Daylight Savings is essential for agriculture and civic efficiency! We spring forward and fall back for civilization! It gives the workers more sunshine!',
        actionNote: 'Stands up with folded arms and indignant municipal school-board posture',
        sfx: 'clock_tick',
        confidenceDrain: 100,
        statusSummary: 'Moral certainty that the state controls the sun'
      },
      {
        step: 2,
        title: 'The Disarming Probe: The Blanket Parable',
        speaker: 'puff',
        text: 'Brenda, bless your heart, darling. You are standing there smiling like someone who cuts ten inches off the top of a blanket, stitches it onto the bottom, and genuinely believes they invented a longer blanket.',
        japaneseText: '毛布の下を切って上に縫い付けて「長くなった」って喜んでるタイプか？ (You the type to cut the bottom of a blanket and sew it to the top?)',
        actionNote: 'Puff rests his elbow on the mic stand, smiling with gentle, disarming Kiwi warmth',
        sfx: 'smoke_blast',
        confidenceDrain: 70,
        statusSummary: 'Audience bursts into chuckles; Brenda blinks in confusion'
      },
      {
        step: 3,
        title: 'The Brutal Deconstruction: The Bovine Reality Check',
        speaker: 'puff',
        text: 'Do you honestly think dairy cows in the paddock wake up on the second Sunday of March, look at a sundial, and go: "Bloody oath, Parliament passed a statutory declaration, better postpone milk production by sixty minutes"? You give an entire nation cardiac arrhythmia twice a year because some bloke in 1895 wanted to catch more butterflies after dinner!',
        japaneseText: '牛が国会の決議気にして乳出すと思ってんのか？ 蝶々捕まえたいオッサンが作った茶番だ！ (You think cows milk according to parliament bills?)',
        actionNote: 'Snaps fingers; digital stage backdrop flashes an analog clock hand spinning violently in reverse',
        sfx: 'clock_shatter',
        confidenceDrain: 20,
        statusSummary: 'Utter deflation; realizing butterfly hunters invented her sleep schedule'
      },
      {
        step: 4,
        title: 'The Annihilation: Solar Sovereignity',
        speaker: 'puff',
        text: 'The sun does not punch a municipal timecard, Brenda. And neither does Super Puff. You lost an hour in March and you have been yelling at parking wardens ever since. Let the old clock burn. Times Up, Mother Fathers!',
        japaneseText: '太陽はお前らのタイムカードなんか見てねえよ。時間切れだぜ、マザーファザーズ！ (The sun does not read your timecards. Times Up, Mother Fathers!)',
        actionNote: 'Stage lighting pulses ultraviolet; heavy sub-bass drone sweeps the room',
        sfx: 'sub_drop',
        confidenceDrain: 0,
        statusSummary: 'CONFIDENCE DESTROYED (0%): Brenda sits down, giggling at the absurdity'
      }
    ]
  },
  {
    id: 'quantum-pedant',
    name: 'Dr. Arthur (Atomic Clock Physicist)',
    avatar: '🔬',
    seatLocation: 'Row D, Seat 2 (Science Podcast T-Shirt)',
    personaId: 'the_critic',
    clockObsession: 'Cesium-133 Atomic Fountain Clocks & BIPM International Atomic Time',
    heckleTrigger: 'Nonsense! The second is rigorously defined by 9,192,631,770 hyper-fine transitions of unperturbed Cesium-133! You cannot invent 54-minute hours!',
    startingConfidence: 100,
    oldClockDiagnosis: 'Rubber-Ruler Positivism & Terpene-Deficient Materialism',
    liberatedTakeaway: 'Arthur realized measuring vibrational oscillations of atoms is just observing popcorn in a microwave.',
    terpenePairing: 'Resonance Haze (α-Pinene 2.4%) for laser-fast scientific dismantling',
    xpAward: 250,
    stages: [
      {
        step: 1,
        title: 'The Heckle: Hyperfine Cesium Precision',
        speaker: 'heckler',
        text: 'Nonsense! The second is rigorously defined by 9,192,631,770 ground-state hyper-fine transitions of unperturbed Cesium-133! You cannot just invent 54-minute hours on a comedy stage!',
        actionNote: 'Pushes glasses up nose with pedantic academic swagger',
        sfx: 'clock_tick',
        confidenceDrain: 100,
        statusSummary: 'Armored in NIST and SI physics textbook authority'
      },
      {
        step: 2,
        title: 'The Disarming Probe: The Microwave Popcorn',
        speaker: 'puff',
        text: 'Aw, here comes the Wikipedia commando. Nine billion oscillations, eh professor? Let me take a slow drag of this Cosmic OG while your frontal lobe attempts to catch up with multidimensional reality.',
        japaneseText: '出たよ、ウィキペディアの理論武装マン。ちょっと一服待っとけ。(Here comes Wikipedia man. Hold on while I take a puff.)',
        actionNote: 'Deep bubbling bong rip sound echoes through stage subwoofers',
        sfx: 'smoke_blast',
        confidenceDrain: 80,
        statusSummary: 'Crowd chuckles at the bong rip delay; Arthur shifts weight'
      },
      {
        step: 3,
        title: 'The Brutal Deconstruction: The Rubber Ruler',
        speaker: 'puff',
        text: 'Arthur, you counted nine billion atomic twitches. But who defined the container they twitch inside? You did! You took an arbitrary fraction of the wobbly spin of a damp rock orbiting a third-rate yellow sun, divided it by sixty twice, and called it fundamental cosmology! You are measuring the ocean with a sponge and claiming you invented wetness, champion!',
        japaneseText: 'グラグラ揺れる惑星の自転を勝手に割っただけのモノサシで、宇宙の真理語ってんじゃねえ！ (Do not talk about cosmic truth using a ruler based on a wobbly planetary spin!)',
        actionNote: 'Exhales an illuminated violet geometric lattice that shatters the cesium atomic model',
        sfx: 'clock_shatter',
        confidenceDrain: 30,
        statusSummary: 'Stunned into intellectual silence; physics framework wobbling'
      },
      {
        step: 4,
        title: 'The Annihilation: 27° Dimensional Tilt',
        speaker: 'puff',
        text: 'When you tilt perception twenty-seven degrees, your cesium atoms look like frozen dust in a sunbeam. I do not invent 54-minute hours, Arthur—I conduct them. Tell the International Bureau of Weights and Measures that Super Puff revoked their license. Times Up, Mother Fathers!',
        japaneseText: '国際度量衡局に伝えておけ、スーパーパフが許可を取り消したとな。時間切れだぜ、マザーファザーズ！ (Tell the Bureau of Measures: Super Puff revoked their license. Times Up!)',
        actionNote: 'Mic drop reverberates in 808 sub-bass, room erupts in cheering',
        sfx: 'sub_drop',
        confidenceDrain: 0,
        statusSummary: 'CONFIDENCE DESTROYED (0%): Arthur buys a bag of dispensary gummies'
      }
    ]
  },
  {
    id: 'miracle-morning',
    name: 'Chad the 4:30 AM Miracle Morning Hustler',
    avatar: '🥶',
    seatLocation: 'Row A, Seat 1 (Front Row VIP Right)',
    personaId: 'the_tech_bro',
    clockObsession: 'Cold Plunges, Whoop Strap, 4:30 AM Wakeups & LinkedIn Gratitude Posts',
    heckleTrigger: 'I wake up at 4:30 AM sharp! Ice bath, red light therapy, journaling from 5:00 to 5:45! The clock is my accountability partner and dopamine stack!',
    startingConfidence: 100,
    oldClockDiagnosis: 'Severe Cortisol Addiction Masquerading as Optimization',
    liberatedTakeaway: 'Chad realized an alarm clock is just a digital taser you voluntarily subject yourself to.',
    terpenePairing: 'Zen Bonsai & Origami Washi Reserve (32.8% THC)',
    xpAward: 230,
    stages: [
      {
        step: 1,
        title: 'The Heckle: The 4:30 AM Routine',
        speaker: 'heckler',
        text: 'I wake up at 4:30 AM sharp! Ice bath, red light therapy, journaling from 5:00 to 5:45! The clock is my accountability partner and my dopamine stack! If you snooze, you lose!',
        actionNote: 'Tenses trapezius muscles while showing off black silicone fitness tracker',
        sfx: 'clock_tick',
        confidenceDrain: 100,
        statusSummary: 'Aggressive gym-bro self-righteousness'
      },
      {
        step: 2,
        title: 'The Disarming Probe: The Cold Wet Reality',
        speaker: 'puff',
        text: 'Chad. Mate. You plunge yourself into freezing ice water in total pitch-black darkness just to convince your inner child that you are not hollow inside?',
        japaneseText: '暗闇で氷水に浸かってまで「自分は生きてる」って思い込みたいのか？ (Plunging into ice in the dark just to convince yourself you are alive?)',
        actionNote: 'Puff tilts his head with profound, quiet Kiwi sympathy',
        sfx: 'smoke_blast',
        confidenceDrain: 72,
        statusSummary: 'Chad freezes mid-flex; emotional armor pierced'
      },
      {
        step: 3,
        title: 'The Brutal Deconstruction: The Cortisol Taser',
        speaker: 'puff',
        text: 'You set an electronic screeching noise to electrocute your nervous system with pure cortisol at four-thirty in the morning so you can take a picture of a lukewarm oat matcha and post it to LinkedIn before the garbage trucks arrive. The clock is not your accountability partner, Chad—it is your parole officer!',
        japaneseText: '目覚まし時計はお前の相棒じゃねえ、お前の看守だ！ (Your alarm clock is not your partner; it is your prison warden!)',
        actionNote: 'Simulated ice cracking sound followed by a shattering glass clock face',
        sfx: 'clock_shatter',
        confidenceDrain: 22,
        statusSummary: 'Visibly trembling; realization that LinkedIn likes did not heal his trauma'
      },
      {
        step: 4,
        title: 'The Annihilation: Sovereign Dragon Awakening',
        speaker: 'puff',
        text: 'Dragons do not set alarms, champion. We wake up when the terpenes sing and we sleep when the punchline hits. Throw that Whoop strap into the compost bin, sleep until noon, and meet me in the 54th minute. Times Up, Mother Fathers!',
        japaneseText: 'ウープのバンドなんか捨てて昼まで寝てろ！ 時間切れだぜ、マザーファザーズ！ (Ditch that Whoop strap and sleep till noon. Times Up, Mother Fathers!)',
        actionNote: 'Sub-bass drop shakes Chad\'s chair; front row starts high-fiving',
        sfx: 'sub_drop',
        confidenceDrain: 0,
        statusSummary: 'CONFIDENCE DESTROYED (0%): Chad takes off his fitness tracker and orders a brownie'
      }
    ]
  },
  {
    id: 'venue-timekeeper',
    name: 'Gary the Nervous Venue Manager',
    avatar: '🚨',
    seatLocation: 'Sound Booth / Back Wall by Red Light',
    personaId: 'the_heckler',
    clockObsession: 'Flashing Red Stage Light, Union Curfew & 11:00 PM Noise Ordinance',
    heckleTrigger: 'WRAP IT UP! Look at the red light flashing on the back wall! It is 10:58 PM! The union crew goes into double-time in two minutes!',
    startingConfidence: 100,
    oldClockDiagnosis: 'Panic-Induced Municipal Curfew Paranoia',
    liberatedTakeaway: 'Gary realized that the universe does not file union overtime grievances.',
    terpenePairing: 'Temporal Void Grand Reserve (34.5% THC) for infinite curfew expansion',
    xpAward: 260,
    stages: [
      {
        step: 1,
        title: 'The Heckle: The Red Light Panic',
        speaker: 'heckler',
        text: 'WRAP IT UP! Look at the red light flashing on the back wall! It is 10:58 PM! The union stagehands go into double-time in two minutes! Wrap it up now!',
        actionNote: 'Aggressively flashes a bright red flashlight from the sound booth',
        sfx: 'clock_tick',
        confidenceDrain: 100,
        statusSummary: 'Hysterical club manager defending union curfew'
      },
      {
        step: 2,
        title: 'The Disarming Probe: The Plastic Disc',
        speaker: 'puff',
        text: 'Gary, look at you pointing at a three-dollar red LED bulb like it has supreme spiritual authority over an eight-ton interdimensional dragon with an active microphone.',
        japaneseText: '3ドルの赤いLEDライトで、ドラゴンを止められると思ってんのか？ (Think a three-dollar red LED bulb can stop a dragon?)',
        actionNote: 'Puff turns slowly toward the sound booth, smiling effortlessly through purple smoke',
        sfx: 'smoke_blast',
        confidenceDrain: 65,
        statusSummary: 'Sound booth crew chuckling; Gary swallowing hard'
      },
      {
        step: 3,
        title: 'The Brutal Deconstruction: The Petrol Station Batteries',
        speaker: 'puff',
        text: 'Gary, that plastic wall clock above the fire exit runs on two leaky double-A batteries bought from a discount petrol station in 2018! If I exhale a single plume of violet smoke, the quartz crystal in that clock starts counting backwards to your childhood regrets! The council does not own time, the union does not own time, and your plastic clock does not own Super Puff!',
        japaneseText: 'スタンドで買った安物乾電池の時計に、このステージが止められるかよ！ (A cheap petrol station battery clock cannot stop this stage!)',
        actionNote: 'A wave of stage smoke sweeps to the back wall; the red light flickers and turns cosmic cyan',
        sfx: 'clock_shatter',
        confidenceDrain: 15,
        statusSummary: 'Red light turns cyan; Gary drops clipboard'
      },
      {
        step: 4,
        title: 'The Annihilation: The Bigger Clock on the Block',
        speaker: 'puff',
        text: 'Tell the union we are in the 54-minute overtime realm where all stagehands get paid in golden dragon bullion. I am the bigger clock on this block! 時間切れだぜ、マザーファザーズ！ Times Up, Mother Fathers!',
        japaneseText: '俺がこの街で一番デカい時計だ！ 時間切れだぜ、マザーファザーズ！ (I am the bigger clock on this block! Times Up, Mother Fathers!)',
        actionNote: 'Epic sub-bass drop reverberates, confetti of golden smoke sweeps the theater',
        sfx: 'sub_drop',
        confidenceDrain: 0,
        statusSummary: 'CONFIDENCE DESTROYED (0%): Gary buys a round of pints for the sound crew'
      }
    ]
  }
];

// Helper to generate dynamic fallback roast if user types a custom clock defense
export function generateCustomClockDeconstruction(customLine: string): OldClockHeckler {
  const trimmed = customLine.trim() || 'My calendar says time is up!';
  
  return {
    id: `custom-${Date.now()}`,
    name: 'Audience Heckler in Row 3',
    avatar: '⏱️',
    seatLocation: 'Row C, Seat 5 (Center Floor)',
    personaId: 'the_heckler',
    clockObsession: trimmed,
    heckleTrigger: trimmed,
    startingConfidence: 100,
    oldClockDiagnosis: 'Spontaneous Acute Linear Time Clinging',
    liberatedTakeaway: 'The heckler realized linear time was an optical illusion created by calendars and coffee.',
    terpenePairing: 'Chrono-Glaze (28.2% THC)',
    xpAward: 200,
    stages: [
      {
        step: 1,
        title: 'The Spoken Defense',
        speaker: 'heckler',
        text: `"${trimmed}"`,
        actionNote: 'Shouted with desperate conviction from the audience floor',
        sfx: 'clock_tick',
        confidenceDrain: 100,
        statusSummary: 'Defending their custom schedule against cosmic reality'
      },
      {
        step: 2,
        title: 'The Disarming Probe',
        speaker: 'puff',
        text: `Aw mate, look at you shouting "${trimmed}" like you genuinely believe the universe keeps an appointments diary. Bless ya, legend. Did you rehearse that in the mirror while checking your pulse?`,
        japaneseText: 'そんなカレンダーの言い訳、宇宙には1ミリも通用しねえよ。(That calendar excuse does not work one millimeter in this cosmos.)',
        actionNote: 'Puff raises an eyebrow, chuckles softly, and taps the microphone head',
        sfx: 'smoke_blast',
        confidenceDrain: 70,
        statusSummary: 'Disarmed by calm Kiwi hospitality'
      },
      {
        step: 3,
        title: 'The Brutal Deconstruction',
        speaker: 'puff',
        text: `You really tied your entire human dignity to "${trimmed}"? Mate, five thousand years ago some Babylonian sheep herders looked at their thumbs and guessed sixty! You are sweating over an imaginary grid invented before plumbing! In the 54-minute universe, your schedule is just vapor!`,
        japaneseText: '古代の羊飼いの思いつきに人生捧げてんじゃねえ！ (Do not dedicate your life to an ancient shepherd guess!)',
        actionNote: 'Visual clock dial shatters into neon fragments across the stage monitors',
        sfx: 'clock_shatter',
        confidenceDrain: 25,
        statusSummary: 'Belief system disintegrating under Sumerian knuckle math'
      },
      {
        step: 4,
        title: 'The Annihilation',
        speaker: 'puff',
        text: `Throw that schedule into the wind, mate. I am Super Puff, the bigger clock on the block. 時間切れだぜ、マザーファザーズ！ Times Up, Mother Fathers!`,
        japaneseText: '俺が一番デカい時計だ。時間切れだぜ、マザーファザーズ！ (I am the bigger clock. Times Up, Mother Fathers!)',
        actionNote: 'Massive 808 sub-bass drop and crowd cheers roar through the theater',
        sfx: 'sub_drop',
        confidenceDrain: 0,
        statusSummary: 'CONFIDENCE DESTROYED (0%): Completely converted to 54-minute freedom'
      }
    ]
  };
}
