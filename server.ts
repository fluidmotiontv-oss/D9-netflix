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
