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
    } catch (e) {
      console.error('Generation error (falling back to offline simulation due to quota/network):', e);
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

  app.post('/api/video-status', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(400).json({ error: 'No API key' });
      const ai = new GoogleGenAI({ apiKey });
      const op = new GenerateVideosOperation();
      op.name = req.body.operationName;
      const updated = await ai.operations.getVideosOperation({ operation: op });
      res.json({ done: updated.done });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Failed to get video status' });
    }
  });

  app.get('/api/video-download', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(400).json({ error: 'No API key' });
      const ai = new GoogleGenAI({ apiKey });
      const op = new GenerateVideosOperation();
      op.name = req.query.op as string;
      const updated = await ai.operations.getVideosOperation({ operation: op });
      
      const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
      if (!uri) {
        return res.status(404).json({ error: 'Video URI not found' });
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
      console.error('Download error:', e);
      res.status(500).json({ error: 'Failed to download video' });
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
