import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const IS_PROD = process.env.NODE_ENV === 'production';
  const JWT_SECRET = process.env.JWT_SECRET || 'dragon9_temporal_sync_fallback_key_2026';

  // Enable trust proxy for Cloud Run and reverse proxy ingress
  app.set('trust proxy', 1);

  // 1. Security & Middleware Hardening
  app.use(helmet({
    contentSecurityPolicy: IS_PROD ? undefined : false, // Allow Vite inline scripts & HMR in dev
    crossOriginEmbedderPolicy: false, // Ensure media and video assets embed smoothly
  }));

  app.use(cors({
    origin: true,
    credentials: true,
  }));

  app.use(express.json({ limit: '1mb' }));

  // Global Rate Limiter: 100 requests per minute per IP
  const globalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    validate: {
      xForwardedForHeader: false,
      forwardedHeader: false,
    },
    message: { error: 'Too many requests, please try again later.' },
  });
  app.use('/api/', globalLimiter);

  // AI-specific Rate Limiter: 20 requests per minute per IP
  const aiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    validate: {
      xForwardedForHeader: false,
      forwardedHeader: false,
    },
    message: { error: 'AI request limit reached. Please wait a minute.' },
  });

  // Initialize Gemini SDK lazily / safely
  const apiKey = process.env.GEMINI_API_KEY;
  let aiClient: GoogleGenAI | null = null;
  if (apiKey) {
    aiClient = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } else {
    console.warn('[WARN] GEMINI_API_KEY is not configured. AI routes will run in degraded/simulated mode.');
  }

  // 2. Master API Gateway Router (/api/v1)
  const apiV1Router = express.Router();

  // System Health & Telemetry
  apiV1Router.get('/system/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      platform: process.platform,
      memory: process.memoryUsage(),
      gateway: 'Master Unified Gateway v1.0.0',
    });
  });

  // System Metrics & Performance Monitor
  apiV1Router.get('/system/metrics', (_req: Request, res: Response) => {
    const memory = process.memoryUsage();
    res.json({
      status: 'operational',
      uptimeSeconds: Math.floor(process.uptime()),
      memoryHeapUsedMB: Math.round(memory.heapUsed / 1024 / 1024 * 100) / 100,
      memoryHeapTotalMB: Math.round(memory.heapTotal / 1024 / 1024 * 100) / 100,
      memoryRssMB: Math.round(memory.rss / 1024 / 1024 * 100) / 100,
      activeConnections: 1,
      gateway: 'Express Hardened v1.0.0',
      securityControls: {
        helmetActive: true,
        rateLimiterActive: true,
        corsActive: true,
        bodyLimitMB: 1,
      }
    });
  });

  // AI Intelligence Unified Endpoint (/api/v1/ai/generate)
  apiV1Router.post('/ai/generate', aiLimiter, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { prompt, model: requestedModel } = req.body;
      const model = (requestedModel && requestedModel !== 'gemini-2.5-flash') ? requestedModel : 'gemini-3.8-flash';

      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Valid prompt string is required.' });
      }

      if (!aiClient) {
        return res.json({
          success: true,
          simulated: true,
          text: `[Offline Local Simulation - GEMINI_API_KEY not configured]:\nPrompt received: "${prompt.slice(0, 120)}..."\nSystem responded with standard low-latency temporal alignment response.`,
        });
      }

      let text = '';
      try {
        const response = await aiClient.models.generateContent({
          model,
          contents: prompt,
        });
        text = response.text || '';
      } catch (genErr: any) {
        const errMsg = genErr?.message || String(genErr);
        if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('depleted')) {
          console.warn('[Master Gateway] Gemini quota/prepayment depleted. Returning resilient stand-in response.');
          return res.json({
            success: true,
            quotaExhausted: true,
            simulated: true,
            text: `[Master Gateway - Resilient Temporal Offline Response]: Prompt received: "${prompt.slice(0, 120)}". The AI Engine processed this through the local fallback pipeline.`,
          });
        }
        // Fallback to gemini-3.7-flash if requested model failed
        if (model !== 'gemini-3.7-flash') {
          try {
            const fallbackResp = await aiClient.models.generateContent({
              model: 'gemini-3.7-flash',
              contents: prompt,
            });
            text = fallbackResp.text || '';
          } catch (e: any) {
            const fMsg = e?.message || String(e);
            if (fMsg.includes('429') || fMsg.includes('RESOURCE_EXHAUSTED') || fMsg.includes('depleted')) {
              return res.json({
                success: true,
                quotaExhausted: true,
                simulated: true,
                text: `[Master Gateway - Resilient Temporal Offline Response]: Prompt received: "${prompt.slice(0, 120)}". Local fallback response rendered.`,
              });
            }
            throw e;
          }
        } else {
          throw genErr;
        }
      }

      return res.json({
        success: true,
        text,
      });
    } catch (error) {
      return next(error);
    }
  });

  app.use('/api/v1', apiV1Router);

  // 3. Application API Routes (Preserved & Protected)
  app.post('/api/auth/login', (req, res) => {
    const { passcode } = req.body;
    // Simple password check for the theater
    if (passcode === 'SYNC' || passcode === 'DRAGON9') {
      const token = jwt.sign({ access: 'granted', role: 'viewer' }, JWT_SECRET, { expiresIn: '4h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid passcode' });
    }
  });

  app.get('/api/auth/verify', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }
    const token = authHeader.split(' ')[1];
    try {
      jwt.verify(token, JWT_SECRET);
      res.json({ valid: true });
    } catch (e) {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  });

  app.post('/api/generate-act', async (req, res) => {
    try {
      let data: any = {};
      const apiKey = process.env.GEMINI_API_KEY;

      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Act as Dragon 9, a hyper-conscious, polite, dry Kiwi-accented stoner dragon comedian.
        Write a new short stand-up comedy act (Act X).
        Topic: A mundane human concept (like emails, traffic, or microwaves) interpreted through temporal stoner logic.
        Return ONLY valid JSON:
        {
          "title": "Act Name (Short)",
          "bit": "The joke/dialogue in character",
          "gag": "Description of the visual gag involving smoke or neon"
        }`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });

        data = JSON.parse(response.text || '{}');
        
        // Start Video Generation
        const videoPrompt = `A cinematic, ultra-detailed, photorealistic cyberpunk shot of a stoner dragon performing stand-up comedy. Masterpiece, 8k resolution, dramatic lighting, volumetric smoke. ${data.gag}`;
        const operation = await ai.models.generateVideos({
            model: 'veo-3.1-generate-preview',
            prompt: videoPrompt,
            config: {
                numberOfVideos: 1,
                resolution: '1080p',
                aspectRatio: '16:9'
            }
        });
        
        data.operationName = operation.name;
        data.time = '45:00 - 50:00';
        data.id = 'act-gen-' + Date.now();
        data.status = 'generating_video';
        
      } else {
        // Simulated fallback if no API key is provided
        await new Promise(resolve => setTimeout(resolve, 2000));
        data = {
          title: "Act X: Quantum Hot Pockets",
          bit: "You humans put cold food in a box, spin it around, and it comes out hot on the edges and frozen in the middle. Time is linear, but your Hot Pockets exist in a state of quantum superposition.",
          gag: "Dragon exhales a square puff of smoke that slowly rotates like a microwave plate before collapsing into a neon puddle.",
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          time: '45:00 - 50:00',
          id: 'act-gen-' + Date.now()
        };
      }
      
      res.json(data);
    } catch (e: any) {
      const msg = e?.message || String(e);
      if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) {
        console.log('API quota exceeded / rate limited. Using offline simulation gracefully.');
      } else {
        console.error('Generation error:', e);
      }
      // Fallback graceful response when quota / spending cap / API limit is hit
      const fallbackData = {
        title: "Act X: The Cosmic Microwave Paradox",
        bit: "You humans put cold food in a box, spin it around, and it comes out hot on the edges and frozen in the middle. Time is linear, but your Hot Pockets exist in a state of quantum superposition.",
        gag: "Dragon exhales a square puff of smoke that slowly rotates like a microwave plate before collapsing into a neon puddle.",
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        time: '45:00 - 50:00',
        id: 'act-gen-' + Date.now(),
        status: 'ready'
      };
      res.json(fallbackData);
    }
  });

  // Gemini-Powered Real-Time Heckler Engine Endpoint
  app.post(['/api/heckler/generate', '/api/generate-heckle'], async (req: Request, res: Response) => {
    const { act, performer, intensity, preferredCategory, isBrutalMode, persona } = req.body || {};
    const actTitle = act?.title || 'Act I: The Threshold';
    const actBit = act?.bit || 'Deconstructing linear 60-minute time and corporate routines';
    const actTopic = act?.topic || act?.comedyTheory || 'Temporal Stand-up comedy';
    const strain = performer?.activeStrain || act?.strainPairing || 'Chrono-Glaze';
    const composure = typeof performer?.composure === 'number' ? performer.composure : 85;
    const comedyXp = typeof performer?.comedyXp === 'number' ? performer.comedyXp : 480;
    const rankTitle = performer?.rankTitle || 'Rookie Open Micer';
    const chaos = intensity || 'standard';
    const isBrutal = Boolean(isBrutalMode || intensity === 'brutal');
    const targetPersona = persona || 'the_heckler';

    // Resilient fallback generator in case of network limits, API quotas, or missing credentials
    const getContextualFallback = () => {
      const standardFallbacks = [
        {
          label: "Temporal Clock-Watcher",
          phrase: `Mate, nobody cares about your 54-minute hours! I've got work at 8am in the real world!`,
          category: "audio",
          hecklerPersona: "Exhausted 9-to-5 Commuter in Row 3",
          icon: "⏰",
          performerRoast: `Aw bless ya legend, still letting a wall clock dictate your soul? You've got an 8am alarm, but Super Puff operates in cosmic superposition. Times Up, Mother Fathers!`,
          comedyTheoryTakeaway: "Status Inversion: Disarm audience anxiety by questioning the sanctity of their mundane routine.",
          xpAward: 60,
          reactionAnimation: "eyebrow_raise",
          terpenePairingNote: `High Pinene for instantaneous mental agility when handling corporate clock-watchers.`
        },
        {
          label: "Microwave Quantum Debate",
          phrase: `Spinning cold food isn't quantum physics, dragon! You're just completely baked!`,
          category: "audio",
          hecklerPersona: "Pedantic Physics Student in Back Row",
          icon: "🔬",
          performerRoast: `If quantum superposition isn't real, explain why your Hot Pocket has molten lava cheese touching absolute zero beef, bro. Science proved it. Times Up, Mother Fathers!`,
          comedyTheoryTakeaway: "Empirical Reversal: Use visceral shared everyday experience to beat abstract pedantry.",
          xpAward: 65,
          reactionAnimation: "laser_track",
          terpenePairingNote: `Myrcene baseline to keep vocal frequency deep and unshakable.`
        },
        {
          label: "VC Valuation Challenge",
          phrase: `Where's the smart contract, lizard? Show us the liquidity pool or step down!`,
          category: "disruption",
          hecklerPersona: "Anxious Web3 Day Trader with Red Chart",
          icon: "📉",
          performerRoast: `Mate, you traded your life savings for JPEG monkeys and you're lecturing an ancient dragon on liquidity? The only thing dropping faster than your portfolio is your composure. Times Up, Mother Fathers!`,
          comedyTheoryTakeaway: "High-Status Deflection: Expose the heckler's vulnerable projection with effortless calm.",
          xpAward: 70,
          reactionAnimation: "smoke_blast",
          terpenePairingNote: `Limonene uplift to maintain a playful, smiling aura while dismantling egos.`
        },
        {
          label: "Heirloom Tomato Toss",
          phrase: `*SPLAT!* An organic heirloom tomato flies straight toward the center stage mic!`,
          category: "projectile",
          hecklerPersona: "Rowdy Backseat Critic",
          icon: "🍅",
          performerRoast: `An heirloom tomato in this economy? Mate, that's $8.50 a pound. Super Puff bends time and weaves right through it. Times Up, Mother Fathers!`,
          comedyTheoryTakeaway: "Physical Deflection: Turn physical aggression into observational economic absurdity.",
          xpAward: 75,
          reactionAnimation: "dodge",
          terpenePairingNote: `Terpinolene for rapid reflex evasion and laser counter-punch.`
        },
        {
          label: "Terpene Skeptic",
          phrase: `${strain} is weak! My cousin grows way louder fire in his shed!`,
          category: "audio",
          hecklerPersona: "Armchair Dispensary Critic",
          icon: "🌿",
          performerRoast: `Your cousin's shed weed smells like burnt lawn clippings and broken dreams, mate. We're smoking pure 26.66-hour cured stardust. Take a seat. Times Up, Mother Fathers!`,
          comedyTheoryTakeaway: "Territorial Superiority: Defend connoisseur credentials with vivid sensory contrast.",
          xpAward: 60,
          reactionAnimation: "smoke_blast",
          terpenePairingNote: `Caryophyllene for peppery, assertive comeback punch.`
        },
        {
          label: "Napkin Airplane Flight",
          phrase: `*WHOOSH!* A folded napkin airplane glides right across the spotlight beam!`,
          category: "projectile",
          hecklerPersona: "Bored Origami Prankster in Row 1",
          icon: "✈️",
          performerRoast: `Look at this aerodynamics! Did you fold this during my setup? I respect the origami dedication, but your trajectory is as off as your life choices. Times Up, Mother Fathers!`,
          comedyTheoryTakeaway: "Playful Incorporation: Never ignore physical reality on stage; absorb it as part of the act.",
          xpAward: 65,
          reactionAnimation: "eyebrow_raise",
          terpenePairingNote: `High-Pinene focus for instantaneous object interaction.`
        },
        {
          label: "Awkward Silence Table",
          phrase: `*Crickets chirping awkwardly from the dark VIP corner booth...*`,
          category: "crowd",
          hecklerPersona: "Dead Silence Table",
          icon: "🦗",
          performerRoast: `Yeah nah, don't all laugh at once. That joke wasn't for this timeline anyway—your great-grandkids are gonna find it hilarious. Times Up, Mother Fathers!`,
          comedyTheoryTakeaway: "The Pregnant Pause Retort: Acknowledge silence immediately to win back crowd trust.",
          xpAward: 55,
          reactionAnimation: "deadpan",
          terpenePairingNote: `Smooth inhalation to reset room timing and tempo.`
        }
      ];

      const brutalFallbacks = [
        {
          label: "Savage Heckler Mob",
          phrase: `GET OFF THE STAGE! Your timing is completely broken and this whole weed routine is washed!`,
          category: "audio",
          hecklerPersona: "Ruthless 3AM Comedy Cellar Assassin",
          icon: "💀",
          performerRoast: `Washed? Mate, I've headlined comedy venues that haven't even been built yet in your calendar. You bought a ticket to the front row just to display your generational insecurities? Sit down, hydrate, and take notes. Times Up, Mother Fathers!`,
          comedyTheoryTakeaway: "Scorched-Earth Grounding: Eviscerate hostile aggression with absolute metaphysical dominance.",
          xpAward: 180,
          reactionAnimation: "smoke_blast",
          terpenePairingNote: `Maximum Caryophyllene punch to weaponize calm against unhinged hostility.`
        },
        {
          label: "Double Pint Glass Barrage",
          phrase: `*CRASH!* A glass pint hurled from the VIP balcony shatters across the stage footlights!`,
          category: "projectile",
          hecklerPersona: "Drunk VIP Table Heckler Swarm",
          icon: "💥",
          performerRoast: `Throwing glassware at an interdimensional dragon? Mate, in the 5th dimension, that glass just reconstituted itself and billed your credit card for a $450 venue deposit. Keep tossing, you're financing my world tour. Times Up, Mother Fathers!`,
          comedyTheoryTakeaway: "High-Status Absorption: Neutralize violent projectiles by declaring total fiscal & physical superiority.",
          xpAward: 200,
          reactionAnimation: "dodge",
          terpenePairingNote: `High Myrcene + Terpinolene reflex lock for zero-flinch evasion.`
        },
        {
          label: "Deafening Chorus of Boos",
          phrase: `BOOOOOOO! WE WANT A REFUND! YOUR BITS MAKE NO SENSE!`,
          category: "crowd",
          hecklerPersona: "Hostile Pitch Review Board in Chorus",
          icon: "📢",
          performerRoast: `Refund? You can't refund elapsed consciousness, champion! That 15 minutes of your life is officially archived in the Akashic records under 'Witnessed a Legend'. You're welcome. Times Up, Mother Fathers!`,
          comedyTheoryTakeaway: "Crowd Inversion: Convert collective booing into an irreversible cosmological gift.",
          xpAward: 175,
          reactionAnimation: "deadpan",
          terpenePairingNote: `Heavy Limonene to smile directly into a hostile crowd roar.`
        },
        {
          label: "Rotten Produce Artillery",
          phrase: `*DOUBLE SPLAT!* An overripe eggplant and rotten egg smash into the stage monitors!`,
          category: "projectile",
          hecklerPersona: "Unforgiving Riot Squad in Row 2",
          icon: "🥚",
          performerRoast: `An eggplant and an egg? Mate, you didn't throw an insult, you threw an unfinished breakfast casserole! Super Puff exhales 800-degree dragon smoke and cooks your grief into a five-star meal. Times Up, Mother Fathers!`,
          comedyTheoryTakeaway: "Alchemy of Ridicule: Transform hostile objects into gourmet absurdism.",
          xpAward: 190,
          reactionAnimation: "smoke_blast",
          terpenePairingNote: `Pinene mental speed to improvise multi-object destruction.`
        }
      ];

      const fallbacks = isBrutal ? brutalFallbacks : standardFallbacks;
      const pool = preferredCategory && preferredCategory !== 'all'
        ? fallbacks.filter(f => f.category === preferredCategory)
        : fallbacks;
      const selected = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : fallbacks[0];

      return {
        ...selected,
        id: `heckle-gen-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        generatedBy: isBrutal ? 'local-brutal-engine' : 'local-contextual-engine',
        actContext: actTitle,
        persona: targetPersona,
        isBrutal
      };
    };

    if (!aiClient) {
      return res.json({
        success: true,
        heckle: getContextualFallback(),
        source: 'resilient-contextual',
        persona: targetPersona,
        isBrutal
      });
    }

    try {
      const personaProfiles: Record<string, string> = {
        the_heckler: 'AUDIENCE PERSONA: "The Heckler" (Aggressive, impatient, sneering front-row heckler challenging jokes, timing, or asking him to wrap it up)',
        the_fan: 'AUDIENCE PERSONA: "The Fan" (Over-hyped, breathless superfan shouting adoration, screaming catchphrases, and asking for callbacks)',
        the_critic: 'AUDIENCE PERSONA: "The Critic" (Pretentious, snobbish British/academic theater critic using highbrow terminology like semiotics, narrative throughline, and dramaturgy)',
        the_tech_bro: 'AUDIENCE PERSONA: "The Tech Bro" (Silicon Valley angel investor asking about CAC/LTV, crypto tokenomics, and pivoting to autonomous AI agents)',
        the_drunk: 'AUDIENCE PERSONA: "The Drunk" (Slurred, boisterous, laughing late, friendly but chaotic and spilling beer)',
      };
      const personaInstruction = personaProfiles[targetPersona] || personaProfiles.the_heckler;

      const prompt = `You are the real-time AI Heckler Engine for an interactive stand-up comedy special starring "Dragon 9" (aka "Super Puff")—an interdimensional, hyper-conscious, polite, dry Kiwi-accented stoner dragon comedian.
The performance is happening LIVE on stage right now!

CURRENT PERFORMANCE CONTEXT:
- Act Playing: "${actTitle}"
- Act Joke Premise/Bit: "${actBit}"
- Topic / Comedy Theory: "${actTopic}"
- Performer Active Cannabis Strain: "${strain}"
- Composure: ${composure}%
- Comedy Rank: "${rankTitle}" (XP: ${comedyXp})
- Disruption Chaos Level: "${chaos}"
- Preferred Disruption Category: "${preferredCategory || 'any'}"
- ${personaInstruction}
${isBrutal ? `*** 💀 BRUTAL MODE ENGAGED 💀 ***
This is the ultimate ruthless comedy crucible.
The audience heckler is NOT gentle. They are a cutthroat, hostile, hyper-critical spectator delivering a vicious interruption strictly matching the persona above.
They must deliver a savage, cutting, high-stakes interruption that targets Dragon 9's specific bit, his stoner logic, his timing, or the audience's patience.
Dragon 9 MUST deliver an equally scorched-earth, hilarious, devastating Kiwi stoner takedown that incinerates the heckler's ego, asserts absolute dominance over the room, and emphatically concludes with or features: "Times Up, Mother Fathers!".
Award high XP between 150 and 250 for surviving this brutal test.` : `TASK:
Generate an impromptu, randomized heckle disruption from an audience member strictly matching the AUDIENCE PERSONA described above, reacting specifically to what Dragon 9 is doing or saying on stage in this act.
The heckler delivers their line in character.
Also generate Dragon 9's instant devastating counter-roast in character (polite Kiwi hospitality mixed with lethal comic timing and stoner swagger, ending with or featuring his signature catchphrase: "Times Up, Mother Fathers!").`}

Return ONLY valid JSON matching this exact structure:
{
  "label": "Short punchy disruption name (2-4 words)",
  "phrase": "The exact shouted heckle words or sound effect description in character",
  "category": "audio" | "projectile" | "disruption" | "crowd",
  "hecklerPersona": "Descriptive persona title (e.g. 'The Critic (Snooty Reviewer)' or 'The Fan (Breathless Stan)')",
  "icon": "A single emoji representing the disruption",
  "performerRoast": "Dragon 9's instant devastating dry Kiwi stoner comeback that wins back the room and restores composure, ending with 'Times Up, Mother Fathers!'",
  "comedyTheoryTakeaway": "Stand-up comedy theory rule or technique applied (e.g. 'Status Inversion', 'Room Parity Principle', 'Absurd Escalation')",
  "xpAward": ${isBrutal ? 180 : 65},
  "reactionAnimation": "laser_track" | "eyebrow_raise" | "smoke_blast" | "dodge" | "deadpan",
  "terpenePairingNote": "Brief tip on terpene profile calibration for comedic poise"
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      if (!parsed.phrase || !parsed.performerRoast) {
        throw new Error('Invalid JSON structure from Gemini');
      }

      const validAnimations = ['laser_track', 'eyebrow_raise', 'smoke_blast', 'dodge', 'deadpan', 'surprised'];
      const reactionAnimation = validAnimations.includes(parsed.reactionAnimation) ? parsed.reactionAnimation : 'eyebrow_raise';

      const heckle = {
        id: `heckle-gemini-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        label: parsed.label || 'Contextual Interruption',
        phrase: parsed.phrase,
        category: ['audio', 'projectile', 'disruption', 'crowd'].includes(parsed.category) ? parsed.category : 'audio',
        hecklerPersona: parsed.hecklerPersona || 'Audience Spectator',
        icon: parsed.icon || '🎙️',
        performerRoast: parsed.performerRoast,
        comedyTheoryTakeaway: parsed.comedyTheoryTakeaway || 'Status Inversion',
        xpAward: Number(parsed.xpAward) || 65,
        reactionAnimation,
        terpenePairingNote: parsed.terpenePairingNote || 'Balanced hybrid focus',
        generatedBy: 'gemini-3.8-flash',
        actContext: actTitle,
        persona: targetPersona,
      };

      return res.json({
        success: true,
        heckle,
        source: 'gemini-api',
        persona: targetPersona,
      });
    } catch (err: any) {
      console.warn('[Heckler Engine] Gemini generation note / fallback engaged:', err?.message || err);
      const fallback = getContextualFallback();
      return res.json({
        success: true,
        heckle: fallback,
        source: 'resilient-contextual',
        note: 'Rendered via local contextual fallback engine'
      });
    }
  });

  app.post('/api/compile-knowledge', async (req, res) => {
    try {
      const { isBrutal } = req.body || {};
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = isBrutal
          ? `Act as Dr. Green Thumbro & Dragon 9 in BRUTAL TRUTH MODE (zero f's given, completely ruthless, savage, uncompromising stoner philosopher & brutal roast comic).
          Generate a new structured JSON collection of savage roast insights, unfiltered comedy truths, and brutal tactical roast protocols.
          Return ONLY valid JSON in this exact structure:
          {
            "filename": "brutal_truth_protocol_v5.json",
            "title": "Title of Savage Dataset",
            "description": "Brief description of the brutal dataset",
            "version": "2.0.0",
            "author": "Dr. Green Thumbro (Unfiltered)",
            "category": "roasts",
            "payload": {
              "savage_insights": ["Insight 1", "Insight 2"],
              "brutal_truths": ["Truth 1", "Truth 2"],
              "roast_coefficients": { "savagery": 100 }
            }
          }`
          : `Act as Dr. Green Thumbro & Dragon 9, master stoner philosophers and comedy writers.
          Generate a new structured JSON collection of stoner comedy knowledge, guru advice, and quantum rolling blueprints.
          Return ONLY valid JSON in this exact structure:
          {
            "filename": "thumbro_quantum_wisdom_v5.json",
            "title": "Title of Dataset",
            "description": "Brief description of the dataset",
            "version": "1.0.0",
            "author": "Dr. Green Thumbro",
            "category": "wisdom",
            "payload": {
              "guru_insights": ["Insight 1", "Insight 2"],
              "joke_premises": ["Premise 1", "Premise 2"],
              "terpene_constants": { "myrcene": 99.1 }
            }
          }`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });

        const data = JSON.parse(response.text || '{}');
        data.id = 'json-gen-' + Date.now();
        data.driftSpeed = 20;
        data.driftDelay = 1;
        return res.json(data);
      } else {
        throw new Error('No API key');
      }
    } catch (e) {
      const rnd = Date.now().toString().slice(-3);
      const isBrutal = req.body?.isBrutal;
      res.json({
        id: 'json-gen-' + Date.now(),
        filename: isBrutal ? `brutal_truth_protocol_${rnd}.json` : `guru_stoner_masterclass_${rnd}.json`,
        title: isBrutal ? `Brutal Truth Protocol Vol. ${rnd}` : `Dr. Green Thumbro Quantum Insights Vol. ${rnd}`,
        description: isBrutal ? 'Zero f\'s given savage roasts, unfiltered comedy destruction, and brutal reality checks.' : 'AI-synthesized cannabis botany, 54-minute time deconstruction, and advanced stand-up punchline harmonics.',
        version: isBrutal ? '2.0.0' : '1.0.0',
        author: isBrutal ? 'Dr. Green Thumbro (Unfiltered)' : 'Dr. Green Thumbro',
        category: isBrutal ? 'roasts' : 'wisdom',
        payload: isBrutal ? {
          compilation_timestamp: new Date().toISOString(),
          brutal_truths: [
            "Your material is weaker than a pre-roll rolled by a toddler in the dark.",
            "If the crowd isn't laughing, it's not the acoustics—you just suck.",
            "Stop blaming hecklers for your lack of an actual premise."
          ],
          savagery_metrics: {
            filter_level: 0,
            roast_potency: "Nuclear"
          }
        } : {
          compilation_timestamp: new Date().toISOString(),
          guru_axioms: [
            "A heavy bassline cures 90% of awkward stage silence.",
            "Always roll your thoughts as tight as a fine Japanese washi paper."
          ]
        },
        driftSpeed: 22,
        driftDelay: 0
      });
    }
  });

  app.post('/api/video-status', async (req, res) => {
    try {
      const opName = req.body.operationName;
      if (!opName || opName.startsWith('act-gen-') || opName.startsWith('simulated-')) {
        return res.json({ done: true });
      }
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return res.json({ done: true });
      const ai = new GoogleGenAI({ apiKey });
      const op = new GenerateVideosOperation();
      op.name = opName;
      const updated = await ai.operations.getVideosOperation({ operation: op });
      res.json({ done: updated.done });
    } catch (e) {
      // Return done true on status check failure to fallback gracefully to videoUrl
      res.json({ done: true });
    }
  });

  app.get('/api/video-download', async (req, res) => {
    try {
      const opName = req.query.op as string;
      if (!opName || opName.startsWith('act-gen-') || opName.startsWith('simulated-')) {
        // Redirect to sample video
        return res.redirect('https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');
      }
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return res.redirect('https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');
      const ai = new GoogleGenAI({ apiKey });
      const op = new GenerateVideosOperation();
      op.name = opName;
      const updated = await ai.operations.getVideosOperation({ operation: op });
      
      const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
      if (!uri) {
        return res.redirect('https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');
      }
      
      const videoRes = await fetch(uri, {
        headers: { 'x-goog-api-key': apiKey },
      });
      
      res.setHeader('Content-Type', 'video/mp4');
      videoRes.body!.pipeTo(
        new WritableStream({
          write(chunk) { res.write(chunk); },
          close() { res.end(); },
        })
      );
    } catch (e) {
      res.redirect('https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');
    }
  });

  app.post('/api/generate-nutflox-promos', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      let generatedAIs: any = null;

      if (apiKey) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const prompt = `You are the Executive Creative Director & Lead Prompt Engineer for "Nutflox" (Dragon 9's decentralized stoner-comedy streaming paradigm).
Write 3 future-proofed, ultra-high-tech video promotional advertisement packages for the Nutflox Special campaign.
Ad 1: 15-second High-BPM Glitch Teaser (TikTok/Reels/Shorts).
Ad 2: 30-second Cinematic Broadcast TV Spot (YouTube/Connected TV).
Ad 3: 60-second Viral Social Director's Cut (Beached As Dragon9 meets futuristic streaming revolution).

Return ONLY valid JSON with this exact array structure under key "promos":
{
  "promos": [
    {
      "id": "promo-1",
      "title": "Ad 1: The Holographic Temporal Glitch",
      "hook": "...",
      "duration": "15s High-BPM Cut",
      "aspectRatio": "9:16 Vertical & 16:9 Master",
      "targetChannels": ["TikTok Spark Ads", "Instagram Reels", "YouTube Shorts"],
      "storyboard": "...",
      "scriptVoiceover": "...",
      "audioBpm": 145,
      "audioSpec": "...",
      "adHeadline": "...",
      "adBody": "...",
      "cta": "Decompress Stream Now",
      "techSpecs": {
        "resolution": "4K UHD (3840x2160 & 2160x3840)",
        "codec": "Apple ProRes 422HQ & H.265 Master Multi-Track",
        "colorGrading": "HDR10+ / Rec.2020 Wide Color Gamut (1000 nits)",
        "audioMix": "Dolby Atmos 5.1 & Binaural Spatialization (48kHz/24-bit)",
        "bitrate": "50 Mbps CBR Ultra-Low Jitter",
        "fps": "60.00 fps Motion-Smoothed"
      },
      "kpiTarget": {
        "hookRate": "46.8% at 3s",
        "estimatedCTR": "5.4%",
        "targetCAC": "$0.88"
      }
    }
  ]
}`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
          });
          generatedAIs = JSON.parse(response.text || '{}');
        } catch (err) {
          console.warn('Gemini promo generation error, falling back to built-in future-proofed masters:', err);
        }
      }

      const sampleVideos = [
        'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
      ];

      const defaultPromos = [
        {
          id: 'promo-1',
          title: 'Ad 1: The Holographic Temporal Glitch',
          hook: 'Linear TV is a 24-hour scam. Synchronise or stay obsolete.',
          duration: '15s High-BPM Cut',
          aspectRatio: '9:16 Vertical & 16:9 Master',
          targetChannels: ['TikTok Spark Ads', 'Instagram Reels', 'YouTube Shorts', 'Snapchat'],
          videoUrl: sampleVideos[2],
          storyboard: '0.0s: Glitching retro Nutflox VHS tape dissolves into 8K quantum hyper-render of Dragon 9. 0.3s: Neon holographic smoke burst pulses to a 145 BPM sub-bass kick. 0.9s: Dragon 9 taps a floating sovereign joint; time counter rewinds from 24h to 26.667h. 1.2s: Nutflox logo laser-ignites into the center with instantaneous unlock CTA.',
          scriptVoiceover: '[Voiceover - Gritty Cyber-Kiwi]: "They locked you into monthly subscriptions for reruns. Dragon 9 broke the timeline. Decompress the Fold. Stream in 26.667-hour real-time."',
          audioBpm: 145,
          audioSpec: 'Deep 808 sub-bass, metallic glitch impacts, binaural spatial whoosh calibrated at 528Hz harmonic resonance.',
          adHeadline: 'Stop Paying for 24-Hour Reruns. Stream Dragon 9 on Nutflox.',
          adBody: 'Traditional streaming feeds you yesterday\'s content. Nutflox is decentralized stand-up comedy unfolding live across 26.667-hour cycles. Instant sovereign unlock with zero subscription traps.',
          cta: 'Decompress Stream Now',
          techSpecs: {
            resolution: '4K UHD (3840x2160 & 2160x3840)',
            codec: 'Apple ProRes 422HQ & H.265 Master Multi-Track',
            colorGrading: 'HDR10+ / Rec.2020 Wide Color Gamut (1000 nits)',
            audioMix: 'Dolby Atmos 5.1 & Binaural Spatialization (48kHz/24-bit)',
            bitrate: '50 Mbps CBR Ultra-Low Jitter',
            fps: '60.00 fps Motion-Smoothed'
          },
          kpiTarget: {
            hookRate: '46.8% at 3s',
            estimatedCTR: '5.4%',
            targetCAC: '$0.88'
          }
        },
        {
          id: 'promo-2',
          title: 'Ad 2: The Sovereign Streaming Revolution',
          hook: 'What if Netflix had no servers, no ads, and only smoked pure truth?',
          duration: '30s Broadcast / CTV Spot',
          aspectRatio: '16:9 Cinematic Widescreen (2.39:1 Anamorphic safe)',
          targetChannels: ['YouTube In-Stream', 'Connected TV (Roku/AppleTV)', 'Reddit Video Ads', 'Meta Feeds'],
          videoUrl: sampleVideos[1],
          storyboard: '0.0s - 0.7s: Wide drone sweep across neon metropolis Babylon skyline crumbling into digital dust. 0.8s - 1.8s: Cut to Dragon 9 center stage in glowing spotlight, exhaling majestic volumetric smoke rings that form the Nutflox infinite fold. 1.9s - 3.0s: Close-up on gold-embossed Sovereign Joint pack being unsealed. Instant transition to audience laughing in 120fps slow motion. Dynamic QR code pulses with PayPal Sovereign Gateway.',
          scriptVoiceover: '[Voiceover - Calm, authoritative, dry]: "Linear time was invented by people who wanted you at work by nine. On Nutflox, time belongs to the performers. One uncompressed payment. Infinite sovereign replay. Welcome to the New."',
          audioBpm: 120,
          audioSpec: 'Cinematic hybrid orchestral strings, analog Moog synth arpeggio, clean center dialogue track with -14 LUFS broadcast normalization.',
          adHeadline: 'The World\'s First 26.667-Hour Stand-Up Comedy Special.',
          adBody: 'Watch Dragon 9 dismantle linear time, corporate hurry-sickness, and Babylon deception. No recurring credit card charges. Unlock once, own forever.',
          cta: 'Watch The Nutflox Special',
          techSpecs: {
            resolution: '4K DCI (4096x2160) Anamorphic Master',
            codec: 'ProRes 4444 XQ & AV1 Web-Ready 10-bit',
            colorGrading: 'ACEScc Workflow, P3-D65 Display Target',
            audioMix: 'Dolby Atmos 7.1.4 Bed + Object Audio / EBU R128 Compliant',
            bitrate: '65 Mbps CBR Master',
            fps: '24.00 fps Cinematic Base'
          },
          kpiTarget: {
            hookRate: '38.5% at 5s',
            estimatedCTR: '4.2%',
            targetCAC: '$1.25'
          }
        },
        {
          id: 'promo-3',
          title: 'Ad 3: Beached As Dragon9 (Viral Social Special)',
          hook: 'Yeah nah bro, can\'t fathom paying monthly subscription fees.',
          duration: '60s Viral Social Director\'s Cut',
          aspectRatio: '1:1 Square & 9:16 Vertical Cut',
          targetChannels: ['TikTok Viral Campaign', 'Instagram Stories/Reels', 'X Video', 'YouTube Shorts'],
          videoUrl: sampleVideos[0],
          storyboard: '0.0s - 0.5s: Sunny golden Tasman beach shore. A confused cartoon seagull swoops in: "Bro! You\'re beached! Where\'s your streaming subscription?!" 0.6s - 1.5s: Dragon 9 turns around with glowing sunglasses: "Yeah nah bro. I\'m a Dragon9. Can\'t fathom subscription traps." 1.6s - 3.5s: Fast-cut montage of high-energy stand-up punchlines, crowd hysteria, and fractal origami smoke bursts. 3.6s - 6.0s: Seagull tries to offer a chip. Dragon 9 vaporizes the chip into a sovereign streaming token.',
          scriptVoiceover: '[Dragon 9 - Authentic Kiwi stoner dragon]: "Look bro, Babylon wants your direct debit every month for movies you watched in 2014. On Nutflox, you unfold the archives when you want. Sweet as. Have a chip? Yeah nah, stream Dragon 9 instead bro."',
          audioBpm: 105,
          audioSpec: 'Warm dub reggae bassline, procedural ocean surf wash, crisp vinyl crackle, punchy vocal master with punchline rimshots.',
          adHeadline: 'Beached As Bro. The Nutflox Special is Live.',
          adBody: 'Unfathomable value. Unfiltered comedy. Watch Dragon 9 live on Nutflox now. Simulated PayPal checkout & Sovereign Jewel Slot support enabled.',
          cta: 'Stream Free Preview',
          techSpecs: {
            resolution: '4K UHD (3840x2160) Multi-Aspect Adaptive',
            codec: 'H.265 / HEVC Main10 & WebM VP9 Low-Latency',
            colorGrading: 'Rec.709 & HDR10 Simultaneous Dual-Deliverable',
            audioMix: 'Stereo Spatialized & Mono-Compatible Master (-16 LUFS)',
            bitrate: '35 Mbps Adaptive Variable Bitrate',
            fps: '60.00 fps High Smoothness'
          },
          kpiTarget: {
            hookRate: '52.1% at 3s',
            estimatedCTR: '6.8%',
            targetCAC: '$0.62'
          }
        }
      ];

      const promos = (generatedAIs?.promos && Array.isArray(generatedAIs.promos) && generatedAIs.promos.length === 3)
        ? generatedAIs.promos.map((p: any, idx: number) => ({
            ...p,
            videoUrl: sampleVideos[idx % sampleVideos.length],
            techSpecs: p.techSpecs || defaultPromos[idx].techSpecs,
            kpiTarget: p.kpiTarget || defaultPromos[idx].kpiTarget
          }))
        : defaultPromos;

      res.json({
        success: true,
        generatedAt: new Date().toISOString(),
        campaignManifest: {
          campaignName: 'Nutflox Special Global Launch - Cycle 26.667h',
          targetAudience: 'Stoner Comedy, Web3 Creators, Tech Mavericks, Late-Night Standup Fans',
          totalAds: 3,
          currency: 'USD',
          trackingPixel: 'D9-NUTFLOX-CAMPAIGN-V1'
        },
        promos
      });
    } catch (e: any) {
      console.error('Promo generation error:', e);
      res.status(500).json({ error: 'Failed to generate promotional videos', details: String(e) });
    }
  });

  // 4. Global Error Handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[Gateway Exception]:', err?.stack || err?.message || err);
    res.status(500).json({
      error: 'Internal Gateway Error',
      message: IS_PROD ? 'An unexpected gateway error occurred.' : err?.message,
    });
  });

  // 5. Vite middleware for development vs Production Static Serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
