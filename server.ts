import express from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const JWT_SECRET = process.env.JWT_SECRET || 'dragon9_temporal_sync_fallback_key_2026';

  app.use(express.json());

  // API Routes
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

  // Vite middleware for development
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
