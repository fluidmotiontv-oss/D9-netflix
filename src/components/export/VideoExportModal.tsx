import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  Download, 
  Play, 
  Pause, 
  Video, 
  Volume2, 
  VolumeX, 
  Clock, 
  FileText, 
  Sparkles, 
  Check, 
  RefreshCw, 
  Smartphone, 
  Monitor, 
  Radio, 
  Layers, 
  FastForward,
  AlertCircle
} from 'lucide-react';
import { 
  generate1MinuteCues, 
  generate3MinuteCues, 
  buildSrtContent, 
  buildVttContent, 
  buildProductionScriptMarkdown, 
  ScriptCue 
} from '../../utils/scriptTimedCues';
import { drawPerformerCanvasFrame } from '../../utils/canvasPerformerRenderer';

interface VideoExportModalProps {
  act: any;
  isOpen: boolean;
  onClose: () => void;
  primaryColor?: string;
  accentColor?: string;
}

export default function VideoExportModal({
  act,
  isOpen,
  onClose,
  primaryColor = '#22c55e',
  accentColor = '#4ade80'
}: VideoExportModalProps) {
  // Duration & Aspect Ratio Options
  const [durationMode, setDurationMode] = useState<60 | 180 | 15>(60);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [includeVoice, setIncludeVoice] = useState(true);
  const [includeSoundscape, setIncludeSoundscape] = useState(true);
  const [includeSubtitles, setIncludeSubtitles] = useState(true);

  // Recording & Preview States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [activeCueIndex, setActiveCueIndex] = useState(0);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  // Canvas & Audio Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioDestinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const timerIntervalRef = useRef<any>(null);

  // Prepare cues for the selected duration
  const cues: ScriptCue[] = React.useMemo(() => {
    if (durationMode === 180) {
      return generate3MinuteCues(act);
    } else if (durationMode === 15) {
      // 15-second teaser slice
      const base = generate1MinuteCues(act);
      return [
        {
          ...base[0],
          endTime: 6,
        },
        {
          ...base[base.length - 1],
          startTime: 6,
          endTime: 15,
        }
      ];
    } else {
      return generate1MinuteCues(act);
    }
  }, [act, durationMode]);

  const targetDuration = durationMode;

  // Active cue calculation based on current recording time
  useEffect(() => {
    const foundIndex = cues.findIndex(c => recordingTime >= c.startTime && recordingTime < c.endTime);
    if (foundIndex !== -1) {
      setActiveCueIndex(foundIndex);
    } else if (recordingTime >= targetDuration && cues.length > 0) {
      setActiveCueIndex(cues.length - 1);
    }
  }, [recordingTime, cues, targetDuration]);

  // Clean up on modal close or unmount
  useEffect(() => {
    return () => {
      stopRecording();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Web Audio Procedural Soundscape Generator
  const initAudioStream = () => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = ctx;
    const dest = ctx.createMediaStreamDestination();
    audioDestinationRef.current = dest;

    if (includeSoundscape) {
      const now = ctx.currentTime;

      // 1. 432Hz / 40Hz Ambient Comedy Sub-bass drone
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(43.2, now); // 43.2Hz sub harmonic
      subGain.gain.setValueAtTime(0.18, now);
      subOsc.connect(subGain);
      subGain.connect(dest);
      subOsc.start(now);

      // 2. Warm Vinyl Room Tone & Flutter
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.015;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(1400, now);
      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(dest);
      whiteNoise.start(now);

      // 3. Periodic Harmonic Bells & Punchline Chimes
      const chimeInterval = setInterval(() => {
        if (ctx.state === 'closed') {
          clearInterval(chimeInterval);
          return;
        }
        const chimeNow = ctx.currentTime;
        const osc = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(864, chimeNow);
        osc.frequency.exponentialRampToValueAtTime(216, chimeNow + 1.2);
        chimeGain.gain.setValueAtTime(0.08, chimeNow);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, chimeNow + 1.2);
        osc.connect(chimeGain);
        chimeGain.connect(dest);
        osc.start(chimeNow);
        osc.stop(chimeNow + 1.3);
      }, 9000);
    }

    return dest.stream;
  };

  // Speech Synthesis helper that reads script lines as time progresses
  const speakCurrentScriptCue = (text: string) => {
    if (!includeVoice || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.02;
      utterance.pitch = 0.92; // Slightly lower, conversational pitch
      // Try to select an English voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes('en-NZ') || v.lang.includes('en-GB') || v.lang.includes('en-US'));
      if (preferredVoice) utterance.voice = preferredVoice;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis notice:", e);
    }
  };

  // Canvas Frame Drawing Loop with Complete 2.5D Cell-Shaded Dragon Face & Top Layers
  const drawFrame = (timestamp: number, currentTimeSec: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentCue = cues[activeCueIndex] || cues[0] || null;
    const clipTitle = durationMode === 60 ? "1-Minute Viral Highlight" : "3-Minute Theatrical Master Cut";

    drawPerformerCanvasFrame({
      ctx,
      width: canvas.width,
      height: canvas.height,
      timestamp,
      currentTimeSec,
      targetDurationSec: targetDuration,
      currentCue,
      aspectRatio,
      targetLanguage: 'EN',
      clipTitle,
      presetTitle: act.title || 'Act I',
      strainPairing: act.strainPairing || 'Cosmic OG (31.4% THC)',
      includeSubtitles,
      includeTimingVisualizer: true,
      primaryColor: primaryColor || '#22c55e',
      accentColor: accentColor || '#a855f7',
      isSpeaking: isRecording,
    });
  };

  // Start Real-Time Video Recording
  const startRecording = async () => {
    if (isRecording) return;
    setRecordedVideoUrl(null);
    recordedChunksRef.current = [];
    setIsRecording(true);
    setRecordingTime(0);

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set resolution according to aspect ratio
    if (aspectRatio === '9:16') {
      canvas.width = 720;
      canvas.height = 1280;
    } else {
      canvas.width = 1280;
      canvas.height = 720;
    }

    // 1. Initialize canvas video stream
    const canvasStream = canvas.captureStream(30);

    // 2. Initialize procedural audio destination
    const audioStream = initAudioStream();

    // 3. Combine video and audio into a unified recording stream
    const combinedTracks = [
      ...canvasStream.getVideoTracks(),
      ...audioStream.getAudioTracks(),
    ];
    const combinedStream = new MediaStream(combinedTracks);

    // 4. Setup MediaRecorder with best supported mimeType
    let mimeType = 'video/webm;codecs=vp9,opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/mp4';
      }
    }

    try {
      const recorder = new MediaRecorder(combinedStream, {
        mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : undefined,
        videoBitsPerSecond: 3500000,
      });

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        setIsRecording(false);
      };

      mediaRecorderRef.current = recorder;
      recorder.start(1000); // 1-second chunks
    } catch (err) {
      console.error("MediaRecorder start failed:", err);
      setIsRecording(false);
      return;
    }

    // Speak first script cue
    if (cues.length > 0) {
      speakCurrentScriptCue(cues[0].spokenText);
    }

    // Timer Interval
    let elapsed = 0;
    let lastCueSpoken = 0;

    timerIntervalRef.current = setInterval(() => {
      elapsed += 0.5;
      setRecordingTime(elapsed);

      // Check if cue transitioned and speak it
      const nextCueIdx = cues.findIndex(c => elapsed >= c.startTime && elapsed < c.endTime);
      if (nextCueIdx !== -1 && nextCueIdx !== lastCueSpoken) {
        lastCueSpoken = nextCueIdx;
        speakCurrentScriptCue(cues[nextCueIdx].spokenText);
      }

      // Check if target duration reached
      if (elapsed >= targetDuration) {
        stopRecording();
      }
    }, 500);

    // Animation Loop
    const renderLoop = (time: number) => {
      drawFrame(time, elapsed);
      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };
    animationFrameRef.current = requestAnimationFrame(renderLoop);
  };

  // Stop Recording
  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsRecording(false);
  };

  // Download Handlers
  const handleDownloadVideo = () => {
    if (!recordedVideoUrl) return;
    const a = document.createElement('a');
    a.href = recordedVideoUrl;
    const ext = recordedVideoUrl.includes('mp4') ? 'mp4' : 'webm';
    a.download = `Dragon9_SuperPuff_${act.id || 'Act'}_${durationMode}Sec_${aspectRatio === '9:16' ? 'Vertical' : 'Landscape'}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadSrt = () => {
    const srtText = buildSrtContent(cues);
    const blob = new Blob([srtText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dragon9_SuperPuff_${act.id || 'Act'}_${durationMode}Sec_Subtitles.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadProductionScript = () => {
    const scriptMd = buildProductionScriptMarkdown(act, durationMode === 180 ? 180 : 60, cues);
    const blob = new Blob([scriptMd], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dragon9_SuperPuff_${act.id || 'Act'}_${durationMode}Sec_ProductionScript.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyScript = () => {
    const scriptMd = buildProductionScriptMarkdown(act, durationMode === 180 ? 180 : 60, cues);
    navigator.clipboard.writeText(scriptMd);
    setCopyStatus('Script copied to clipboard!');
    setTimeout(() => setCopyStatus(null), 2500);
  };

  if (!isOpen) return null;

  const currentCue = cues[activeCueIndex] || cues[0];
  const progressPercent = Math.min(100, (recordingTime / targetDuration) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white font-mono uppercase tracking-wide">
                  Video Export Studio
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black uppercase bg-green-500/20 text-green-300 border border-green-500/40">
                  Script-Synced Audio & Video
                </span>
              </div>
              <p className="text-xs text-white/50 font-mono mt-0.5">
                Export 1-Minute (Shorts/Reels) or 3-Minute (Showcase) videos with studio audio following the script.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopRecording();
              onClose();
            }}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Controls & Configuration Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-black/50 p-3.5 rounded-xl border border-white/10 text-xs font-mono">
            
            {/* Duration Selector */}
            <div>
              <label className="text-white/50 text-[10px] uppercase font-bold tracking-wider block mb-1.5 flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>Target Video Length</span>
              </label>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { sec: 60, label: '1-Min', desc: 'Reels / Shorts' },
                  { sec: 180, label: '3-Min', desc: 'Master Set' },
                  { sec: 15, label: '15s', desc: 'Teaser' },
                ].map((opt) => (
                  <button
                    key={opt.sec}
                    disabled={isRecording}
                    onClick={() => {
                      setDurationMode(opt.sec as any);
                      setRecordedVideoUrl(null);
                    }}
                    className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                      durationMode === opt.sec
                        ? 'bg-green-500/20 border-green-500/60 text-green-300 font-bold shadow-sm'
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    <div className="font-bold">{opt.label}</div>
                    <div className="text-[8px] opacity-70">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio Selector */}
            <div>
              <label className="text-white/50 text-[10px] uppercase font-bold tracking-wider block mb-1.5 flex items-center gap-1">
                <Layers className="w-3 h-3 text-purple-400" />
                <span>Video Format / Aspect</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  disabled={isRecording}
                  onClick={() => setAspectRatio('9:16')}
                  className={`py-2 px-2 rounded-lg border flex items-center justify-center gap-1.5 transition-all ${
                    aspectRatio === '9:16'
                      ? 'bg-purple-500/20 border-purple-500/60 text-purple-300 font-bold'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>9:16 (Vertical)</span>
                </button>
                <button
                  disabled={isRecording}
                  onClick={() => setAspectRatio('16:9')}
                  className={`py-2 px-2 rounded-lg border flex items-center justify-center gap-1.5 transition-all ${
                    aspectRatio === '16:9'
                      ? 'bg-purple-500/20 border-purple-500/60 text-purple-300 font-bold'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>16:9 (Landscape)</span>
                </button>
              </div>
            </div>

            {/* Audio Toggle Options */}
            <div>
              <label className="text-white/50 text-[10px] uppercase font-bold tracking-wider block mb-1.5 flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-amber-400" />
                <span>Audio Synthesis</span>
              </label>
              <div className="flex flex-col space-y-1">
                <label className="flex items-center gap-2 cursor-pointer text-[11px] text-white/80">
                  <input
                    type="checkbox"
                    disabled={isRecording}
                    checked={includeVoice}
                    onChange={(e) => setIncludeVoice(e.target.checked)}
                    className="accent-green-500 rounded"
                  />
                  <span>Script Voiceover (TTS)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[11px] text-white/80">
                  <input
                    type="checkbox"
                    disabled={isRecording}
                    checked={includeSoundscape}
                    onChange={(e) => setIncludeSoundscape(e.target.checked)}
                    className="accent-green-500 rounded"
                  />
                  <span>432Hz Soundscape & Foley</span>
                </label>
              </div>
            </div>

            {/* Subtitles Overlay */}
            <div>
              <label className="text-white/50 text-[10px] uppercase font-bold tracking-wider block mb-1.5 flex items-center gap-1">
                <FileText className="w-3 h-3 text-blue-400" />
                <span>Subtitles & Teleprompter</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[11px] text-white/80 mt-1">
                <input
                  type="checkbox"
                  disabled={isRecording}
                  checked={includeSubtitles}
                  onChange={(e) => setIncludeSubtitles(e.target.checked)}
                  className="accent-green-500 rounded"
                />
                <span>Kinetic Captions On Video</span>
              </label>
              <div className="text-[9px] text-white/40 mt-1">
                Synchronized with spoken script cues.
              </div>
            </div>

          </div>

          {/* Video Preview & Canvas Arena */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Visualizer Canvas / Rendered Video Player */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center bg-black/80 rounded-2xl border border-white/10 p-3 relative overflow-hidden min-h-[320px]">
              
              {/* If Video has been recorded, show playable HTML5 video */}
              {recordedVideoUrl ? (
                <div className="w-full flex flex-col items-center space-y-3">
                  <video
                    src={recordedVideoUrl}
                    controls
                    autoPlay
                    className={`rounded-xl border border-green-500/40 shadow-2xl max-h-[320px] ${
                      aspectRatio === '9:16' ? 'aspect-[9/16] w-auto' : 'aspect-[16/9] w-full'
                    }`}
                  />
                  <div className="flex items-center gap-2 text-xs font-mono text-green-400">
                    <Check className="w-4 h-4" />
                    <span>Video Render Complete ({durationMode}s with Audio & Subtitles)</span>
                  </div>
                </div>
              ) : (
                /* Live Canvas Render View */
                <div className="w-full flex flex-col items-center justify-center relative">
                  <canvas
                    ref={canvasRef}
                    className={`rounded-xl border border-white/15 bg-black shadow-lg max-h-[300px] ${
                      aspectRatio === '9:16' ? 'aspect-[9/16] w-auto' : 'aspect-[16/9] w-full'
                    }`}
                  />
                  
                  {!isRecording && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-xl p-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 flex items-center justify-center mb-2 shadow-lg">
                        <Play className="w-6 h-6 ml-0.5" />
                      </div>
                      <p className="text-sm font-bold text-white font-mono">
                        Ready to Render {durationMode === 60 ? '1-Minute' : durationMode === 180 ? '3-Minute' : '15s'} Video
                      </p>
                      <p className="text-xs text-white/50 max-w-sm mt-1">
                        Synthesizes speech voiceover, 432Hz ambient audio, dynamic stage visualizer, and kinetic subtitles into an MP4/WebM video file.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Progress & Recording HUD */}
              {isRecording && (
                <div className="w-full mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-red-400 font-bold flex items-center gap-1.5 animate-pulse">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                      <span>RECORDING STAGE STREAM...</span>
                    </span>
                    <span className="text-white/70">
                      {recordingTime.toFixed(1)}s / {targetDuration}s ({progressPercent.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-cyan-400 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Script Teleprompter & Timed Cues */}
            <div className="lg:col-span-5 flex flex-col bg-black/50 rounded-2xl border border-white/10 p-4 overflow-hidden">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-green-400" />
                  <span>Script & Directives ({cues.length} Cues)</span>
                </span>
                <span className="text-[10px] font-mono text-white/40">
                  Total: {targetDuration}s
                </span>
              </div>

              {/* Scrollable list of timed script segments */}
              <div className="flex-1 overflow-y-auto space-y-2 max-h-[260px] pr-1 font-mono text-xs">
                {cues.map((cue, idx) => {
                  const isActive = idx === activeCueIndex;
                  return (
                    <div
                      key={cue.id}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isActive
                          ? 'bg-green-500/15 border-green-400 text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-white/60'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-white/40 mb-1">
                        <span className="font-bold text-cyan-400">
                          [{cue.startTime}s – {cue.endTime}s] {cue.isPunchline ? '🔥 PUNCHLINE' : ''}
                        </span>
                        <span>Scene {idx + 1}</span>
                      </div>
                      <p className={`font-medium ${isActive ? 'text-green-300 font-bold' : 'text-white/80'}`}>
                        "{cue.spokenText}"
                      </p>
                      <div className="mt-1.5 pt-1.5 border-t border-white/5 text-[9px] text-amber-300/80 space-y-0.5">
                        <div>🎬 {cue.visualCue}</div>
                        <div>🔊 {cue.audioCue}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons Row */}
              <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap gap-2">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-green-500 hover:bg-green-600 text-black font-mono font-black uppercase text-xs transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>Render {durationMode === 60 ? '1-Min' : durationMode === 180 ? '3-Min' : '15s'} Video</span>
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono font-black uppercase text-xs transition-all flex items-center justify-center gap-2 animate-pulse"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Stop Recording Early</span>
                  </button>
                )}

                {recordedVideoUrl && (
                  <button
                    onClick={handleDownloadVideo}
                    className="py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-black font-mono font-black uppercase text-xs transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Video</span>
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Export Companion Assets Row (SRT Subtitles, Production Script, Text) */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-green-400" />
                <span>Production Assets & Subtitle Package</span>
              </div>
              <p className="text-[11px] text-white/50 mt-0.5">
                Download synchronized SRT subtitles, VTT caption tracks, and formatted markdown scripts with audio/visual cues.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleDownloadSrt}
                className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all flex items-center gap-1.5"
                title="Download standard .SRT subtitle file timed to the video"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Subtitles (.SRT)</span>
              </button>

              <button
                onClick={handleDownloadProductionScript}
                className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all flex items-center gap-1.5"
                title="Download production markdown script with [Visual Cue] and [Audio Cue] brackets"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Timed Script (.MD)</span>
              </button>

              <button
                onClick={handleCopyScript}
                className="px-3 py-1.5 rounded-lg border border-green-500/40 bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{copyStatus || 'Copy Directives'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
