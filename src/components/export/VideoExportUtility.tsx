import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
  AlertCircle,
  Film,
  Scissors,
  Share2,
  Globe,
  Sliders,
  Flame,
  Award,
  Zap
} from 'lucide-react';
import { 
  ScriptCue,
  buildSrtContent, 
  buildVttContent, 
  buildProductionScriptMarkdown 
} from '../../utils/scriptTimedCues';
import { drawPerformerCanvasFrame } from '../../utils/canvasPerformerRenderer';
import { 
  HIGHLIGHT_PRESETS,
  HighlightSegmentPreset,
  build1MinuteHighlightCues,
  build3MinuteHighlightCues,
  getClipMetadata
} from '../../utils/videoHighlightEngine';
import { 
  SupportedLanguage, 
  LANGUAGE_PROFILES,
  parseTimingMarkers,
  TimingBlock
} from '../../utils/localizationData';
import { SUPER_PUFF_INITIATION_SPECIAL } from '../../data';

interface VideoExportUtilityProps {
  initialActId?: string;
  isOpen?: boolean;
  onClose?: () => void;
  isStandaloneView?: boolean;
  themePrimary?: string;
  themeAccent?: string;
}

export default function VideoExportUtility({
  initialActId = 'act_01_threshold',
  isOpen = true,
  onClose,
  isStandaloneView = false,
  themePrimary = '#22c55e',
  themeAccent = '#00f3ff',
}: VideoExportUtilityProps) {
  // Preset & Highlight Configuration State
  const [selectedPresetId, setSelectedPresetId] = useState<string>('highlight-act1-1m');
  const [durationMode, setDurationMode] = useState<60 | 180>(60);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [targetLanguage, setTargetLanguage] = useState<SupportedLanguage | 'EN'>('EN');
  
  // Audio & Overlay Options
  const [includeVoice, setIncludeVoice] = useState(true);
  const [includeSoundscape, setIncludeSoundscape] = useState(true);
  const [includeSubtitles, setIncludeSubtitles] = useState(true);
  const [includeTimingVisualizer, setIncludeTimingVisualizer] = useState(true);
  const [speechRate, setSpeechRate] = useState<number>(1.0);

  // Recording & Playback States
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [activeCueIndex, setActiveCueIndex] = useState(0);
  const [activeTimingBlock, setActiveTimingBlock] = useState<TimingBlock | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [batchExportProgress, setBatchExportProgress] = useState<number | null>(null);

  // Canvas & Audio References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioDestinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const timerIntervalRef = useRef<any>(null);

  // Selected Preset Object
  const currentPreset = useMemo(() => {
    return HIGHLIGHT_PRESETS.find(p => p.id === selectedPresetId) || HIGHLIGHT_PRESETS[0];
  }, [selectedPresetId]);

  // Generate Script Cues with strict pacing markers
  const cues: ScriptCue[] = useMemo(() => {
    if (durationMode === 180) {
      return build3MinuteHighlightCues(currentPreset.actSource, targetLanguage);
    } else {
      return build1MinuteHighlightCues(currentPreset.actSource, targetLanguage);
    }
  }, [currentPreset.actSource, durationMode, targetLanguage]);

  const targetDuration = durationMode;
  const progressPercent = Math.min(100, (playbackTime / targetDuration) * 100);

  // Sync active cue index as playback time progresses
  useEffect(() => {
    const foundIndex = cues.findIndex(c => playbackTime >= c.startTime && playbackTime < c.endTime);
    if (foundIndex !== -1) {
      setActiveCueIndex(foundIndex);
    } else if (playbackTime >= targetDuration && cues.length > 0) {
      setActiveCueIndex(cues.length - 1);
    }
  }, [playbackTime, cues, targetDuration]);

  // Clean up resources on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Web Audio Procedural Soundscape Generator
  const initAudioStream = useCallback(() => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = ctx;
    const dest = ctx.createMediaStreamDestination();
    audioDestinationRef.current = dest;

    if (includeSoundscape) {
      const now = ctx.currentTime;

      // 1. 432Hz Sub-bass Ambient Resonance
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(43.2, now); // Sub-harmonic 43.2Hz
      subGain.gain.setValueAtTime(0.20, now);
      subOsc.connect(subGain);
      subGain.connect(dest);
      subOsc.start(now);

      // 2. Lo-Fi Vinyl Room Tone & Air
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.018;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(1200, now);
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
      }, 10000);
    }

    return dest.stream;
  }, [includeSoundscape]);

  // Speech Synthesis with Timing Marker [pause: X.Xs] Respect
  const speakCurrentScriptCue = useCallback((cue: ScriptCue) => {
    if (!includeVoice || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      
      // Parse timing markers inside the text
      const blocks = parseTimingMarkers(cue.spokenText);
      
      if (blocks.length === 0) return;

      const langCode = targetLanguage === 'EN' 
        ? 'en-US' 
        : LANGUAGE_PROFILES[targetLanguage]?.voiceLangCode || 'en-US';

      // Sequence through speech blocks and pauses
      let blockIdx = 0;

      const playNextBlock = () => {
        if (blockIdx >= blocks.length) return;
        const block = blocks[blockIdx];
        setActiveTimingBlock(block);

        if (block.type === 'speech' && block.text) {
          const utterance = new SpeechSynthesisUtterance(block.text);
          utterance.rate = speechRate;
          utterance.pitch = 0.95;
          utterance.lang = langCode;

          const voices = window.speechSynthesis.getVoices();
          const matchedVoice = voices.find(v => v.lang.startsWith(langCode.slice(0, 2)));
          if (matchedVoice) utterance.voice = matchedVoice;

          utterance.onend = () => {
            blockIdx++;
            playNextBlock();
          };

          utterance.onerror = () => {
            blockIdx++;
            playNextBlock();
          };

          window.speechSynthesis.speak(utterance);
        } else if (block.type === 'pause' && block.pauseDurationSeconds) {
          // Dedicated pause delay for comedic timing
          const pauseMs = block.pauseDurationSeconds * 1000;
          setTimeout(() => {
            blockIdx++;
            playNextBlock();
          }, pauseMs);
        }
      };

      playNextBlock();
    } catch (e) {
      console.warn("Speech synthesis notice:", e);
    }
  }, [includeVoice, targetLanguage, speechRate]);

  // Canvas Frame Drawing Loop (Renders high-fidelity stage visuals with complete dragon face & layers)
  const drawFrame = useCallback((timestamp: number, currentTimeSec: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentCue = cues[activeCueIndex] || cues[0] || null;
    const clipTitle = durationMode === 60 ? "1-Minute Highlight Reel" : "3-Minute Master Cut";

    drawPerformerCanvasFrame({
      ctx,
      width: canvas.width,
      height: canvas.height,
      timestamp,
      currentTimeSec,
      targetDurationSec: durationMode,
      currentCue,
      aspectRatio,
      targetLanguage,
      clipTitle,
      presetTitle: currentPreset.title,
      strainPairing: currentPreset.theme,
      includeSubtitles,
      includeTimingVisualizer,
      primaryColor: '#22c55e',
      accentColor: '#a855f7',
      isSpeaking: isPlayingPreview || isRecording,
    });
  }, [cues, activeCueIndex, durationMode, targetLanguage, currentPreset.title, currentPreset.theme, aspectRatio, includeSubtitles, includeTimingVisualizer, isPlayingPreview, isRecording]);

  // Start Real-Time Highlight Video Recording
  const startRecording = async () => {
    if (isRecording) return;
    setRecordedVideoUrl(null);
    recordedChunksRef.current = [];
    setIsRecording(true);
    setPlaybackTime(0);

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

    // 1. Capture stream from canvas
    const canvasStream = canvas.captureStream(30);

    // 2. Initialize procedural audio destination
    const audioStream = initAudioStream();

    // 3. Combine tracks into single recorder stream
    const combinedTracks = [
      ...canvasStream.getVideoTracks(),
      ...audioStream.getAudioTracks(),
    ];
    const combinedStream = new MediaStream(combinedTracks);

    // 4. Determine supported mimeType
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

    // Speak initial cue
    if (cues.length > 0) {
      speakCurrentScriptCue(cues[0]);
    }

    // Timer Interval
    let elapsed = 0;
    let lastCueSpoken = 0;

    timerIntervalRef.current = setInterval(() => {
      elapsed += 0.5;
      setPlaybackTime(elapsed);

      // Transition check for next cue
      const nextCueIdx = cues.findIndex(c => elapsed >= c.startTime && elapsed < c.endTime);
      if (nextCueIdx !== -1 && nextCueIdx !== lastCueSpoken) {
        lastCueSpoken = nextCueIdx;
        speakCurrentScriptCue(cues[nextCueIdx]);
      }

      // Complete when duration reached
      if (elapsed >= targetDuration) {
        stopRecording();
      }
    }, 500);

    // Animation Render Loop
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

  // Download Video File
  const handleDownloadVideo = () => {
    if (!recordedVideoUrl) return;
    const a = document.createElement('a');
    a.href = recordedVideoUrl;
    const ext = recordedVideoUrl.includes('mp4') ? 'mp4' : 'webm';
    const langSlug = targetLanguage;
    a.download = `Dragon9_Highlight_${durationMode}Sec_${currentPreset.id}_${langSlug}_${aspectRatio === '9:16' ? 'Vertical' : 'Landscape'}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Download SRT Subtitle Track
  const handleDownloadSrt = () => {
    const srtText = buildSrtContent(cues);
    const blob = new Blob([srtText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dragon9_Highlight_${durationMode}Sec_${currentPreset.id}_${targetLanguage}.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download Formatted Production Script (.md)
  const handleDownloadProductionScript = () => {
    const act = SUPER_PUFF_INITIATION_SPECIAL.acts.find(a => a.id === currentPreset.actSource) || SUPER_PUFF_INITIATION_SPECIAL.acts[0];
    const md = buildProductionScriptMarkdown(act, durationMode, cues);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dragon9_Highlight_${durationMode}Sec_${currentPreset.id}_ProductionScript.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy Directives to Clipboard
  const handleCopyScript = () => {
    const text = cues.map(c => `[${c.startTime}s - ${c.endTime}s] "${c.spokenText}" (Directive: ${c.pacingNote})`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopyStatus('Copied Cues!');
    setTimeout(() => setCopyStatus(null), 2500);
  };

  // Preset Selector Helper
  const handleSelectPreset = (preset: HighlightSegmentPreset) => {
    if (isRecording) stopRecording();
    setSelectedPresetId(preset.id);
    setDurationMode(preset.duration);
    setPlaybackTime(0);
    setRecordedVideoUrl(null);
  };

  if (!isOpen && !isStandaloneView) return null;

  return (
    <div className={`w-full h-full flex flex-col bg-[#050505] text-white select-none ${isStandaloneView ? '' : 'fixed inset-0 z-50 bg-black/90 backdrop-blur-xl'}`}>
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-black/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500/20 to-cyan-500/20 border border-green-500/40 flex items-center justify-center text-green-400 shadow-md">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold font-mono tracking-wide text-white uppercase">
                Video Export Utility
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 font-bold">
                18-Min Special Highlights
              </span>
            </div>
            <p className="text-[11px] text-white/50 font-mono mt-0.5">
              Segments performance into 1-minute and 3-minute clips with synchronized 432Hz audio & comedic timing markers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher Badge */}
          <div className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 text-xs font-mono">
            <Globe className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-white/60">Language:</span>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value as any)}
              disabled={isRecording}
              aria-label="Target language for video export"
              className="bg-transparent text-purple-300 font-bold outline-none cursor-pointer"
            >
              <option value="EN" className="bg-neutral-900 text-white">EN (English Original)</option>
              <option value="DE" className="bg-neutral-900 text-white">DE 🇩🇪 (German)</option>
              <option value="ES" className="bg-neutral-900 text-white">ES 🇪🇸 (Spanish)</option>
              <option value="FR" className="bg-neutral-900 text-white">FR 🇫🇷 (French)</option>
              <option value="JA" className="bg-neutral-900 text-white">JA 🇯🇵 (Japanese)</option>
            </select>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-white/60 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Preset Segmentation & Controls (5 Cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          
          {/* Segment Selector Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
                  18-Minute Highlight Presets
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                {HIGHLIGHT_PRESETS.length} Cuts
              </span>
            </div>

            {/* Presets List */}
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {HIGHLIGHT_PRESETS.map((preset) => {
                const isSelected = preset.id === selectedPresetId;
                return (
                  <button
                    key={preset.id}
                    disabled={isRecording}
                    onClick={() => handleSelectPreset(preset)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-green-500/20 via-cyan-500/15 to-purple-500/20 border-green-500/60 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className={`font-bold font-mono ${isSelected ? 'text-green-300' : 'text-white/90'}`}>
                        {preset.title}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                        preset.duration === 60 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}>
                        {preset.duration === 60 ? '1-Min Short' : '3-Min Master'}
                      </span>
                    </div>

                    <p className="text-[10px] text-white/50 line-clamp-2 leading-relaxed font-mono">
                      {preset.description}
                    </p>

                    <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/5">
                      {preset.tags.map((tag, i) => (
                        <span key={i} className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-white/40">
                          #{tag}
                        </span>
                      ))}
                      <span className="ml-auto text-[9px] font-mono text-cyan-400">
                        Drop @ {preset.punchlineTimestamp}s
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Export Settings & Audio Pipeline Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <Sliders className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
                Render & Audio Pipeline
              </h3>
            </div>

            {/* Duration Mode Toggles */}
            <div>
              <label className="text-[10px] font-mono uppercase text-white/50 block mb-1.5">
                Target Highlight Length
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  disabled={isRecording}
                  onClick={() => setDurationMode(60)}
                  className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                    durationMode === 60
                      ? 'bg-green-500/20 border-green-500/60 text-green-300 font-bold shadow-sm'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>1-Minute (60s)</span>
                </button>
                <button
                  disabled={isRecording}
                  onClick={() => setDurationMode(180)}
                  className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                    durationMode === 180
                      ? 'bg-purple-500/20 border-purple-500/60 text-purple-300 font-bold shadow-sm'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>3-Minute (180s)</span>
                </button>
              </div>
            </div>

            {/* Aspect Ratio Toggles */}
            <div>
              <label className="text-[10px] font-mono uppercase text-white/50 block mb-1.5">
                Aspect Ratio / Social Target
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  disabled={isRecording}
                  onClick={() => setAspectRatio('9:16')}
                  className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                    aspectRatio === '9:16'
                      ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 font-bold'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>9:16 (Shorts / Reels)</span>
                </button>
                <button
                  disabled={isRecording}
                  onClick={() => setAspectRatio('16:9')}
                  className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                    aspectRatio === '16:9'
                      ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 font-bold'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>16:9 (YouTube / Stage)</span>
                </button>
              </div>
            </div>

            {/* Audio Synthesis & Overlay Checkboxes */}
            <div className="space-y-2 pt-1 border-t border-white/5 font-mono text-[11px]">
              <label className="flex items-center justify-between text-white/80 cursor-pointer">
                <span className="flex items-center gap-2">
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Synthesized TTS Speech</span>
                </span>
                <input
                  type="checkbox"
                  disabled={isRecording}
                  checked={includeVoice}
                  onChange={(e) => setIncludeVoice(e.target.checked)}
                  className="accent-green-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between text-white/80 cursor-pointer">
                <span className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                  <span>432Hz Soundscape & Sub Drops</span>
                </span>
                <input
                  type="checkbox"
                  disabled={isRecording}
                  checked={includeSoundscape}
                  onChange={(e) => setIncludeSoundscape(e.target.checked)}
                  className="accent-green-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between text-white/80 cursor-pointer">
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Burn-in Dynamic Subtitles</span>
                </span>
                <input
                  type="checkbox"
                  disabled={isRecording}
                  checked={includeSubtitles}
                  onChange={(e) => setIncludeSubtitles(e.target.checked)}
                  className="accent-green-500 rounded"
                />
              </label>
            </div>

          </div>

        </div>

        {/* Center / Right Column: Live Visualizer Stage & Timed Cues (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          
          {/* Live Stage Visualizer / Video Player Container */}
          <div className="flex-1 bg-black/90 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden min-h-[340px] shadow-2xl">
            
            {/* When Video has rendered, display playable video */}
            {recordedVideoUrl ? (
              <div className="w-full flex flex-col items-center space-y-3">
                <video
                  src={recordedVideoUrl}
                  controls
                  autoPlay
                  className={`rounded-xl border border-green-500/50 shadow-2xl max-h-[320px] ${
                    aspectRatio === '9:16' ? 'aspect-[9/16] w-auto' : 'aspect-[16/9] w-full'
                  }`}
                />
                <div className="flex items-center gap-2 text-xs font-mono text-green-400">
                  <Check className="w-4 h-4" />
                  <span>Render Finished: {durationMode}s Highlight Ready for Broadcast</span>
                </div>
              </div>
            ) : (
              /* Live Canvas Stage Preview */
              <div className="w-full flex flex-col items-center justify-center relative">
                <canvas
                  ref={canvasRef}
                  className={`rounded-xl border border-white/15 bg-black shadow-lg max-h-[310px] ${
                    aspectRatio === '9:16' ? 'aspect-[9/16] w-auto' : 'aspect-[16/9] w-full'
                  }`}
                />

                {!isRecording && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/65 rounded-xl p-4 text-center">
                    <div className="w-14 h-14 rounded-full bg-green-500/20 text-green-400 border border-green-500/40 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                      <Play className="w-6 h-6 ml-0.5 fill-green-400" />
                    </div>
                    <p className="text-sm font-bold text-white font-mono">
                      Ready to Render {durationMode === 60 ? '1-Minute' : '3-Minute'} Highlight
                    </p>
                    <p className="text-xs text-white/50 max-w-md mt-1 font-mono">
                      Synchronizes comedy timing markers, procedural sub-bass drops, and voiceover to preserve cadence.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Recording HUD Progress Bar */}
            {isRecording && (
              <div className="w-full mt-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-red-400 font-bold flex items-center gap-2 animate-pulse">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span>ENCODING STAGE STREAM ({aspectRatio === '9:16' ? '720x1280' : '1280x720'})...</span>
                  </span>
                  <span className="text-white/80">
                    {playbackTime.toFixed(1)}s / {targetDuration}s ({progressPercent.toFixed(0)}%)
                  </span>
                </div>
                <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 via-cyan-400 to-purple-500 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-3">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-black font-mono font-black uppercase text-xs transition-all shadow-[0_0_25px_rgba(34,197,94,0.4)] flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Render {durationMode === 60 ? '1-Min Short' : '3-Min Master'} Video</span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex-1 py-3 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono font-black uppercase text-xs transition-all flex items-center justify-center gap-2 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]"
              >
                <Pause className="w-4 h-4" />
                <span>Stop Recording Early</span>
              </button>
            )}

            {recordedVideoUrl && (
              <button
                onClick={handleDownloadVideo}
                className="py-3 px-5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-black font-mono font-black uppercase text-xs transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Video</span>
              </button>
            )}
          </div>

          {/* Timed Script Cues & Subtitle Directives (Teleprompter Rack) */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-green-400" />
                <span className="text-xs font-mono font-bold text-white uppercase">
                  Script Timing Cues ({cues.length} Segments)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadSrt}
                  className="px-2.5 py-1 rounded-lg border border-white/10 hover:bg-white/10 text-[10px] font-mono text-cyan-300 flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>.SRT</span>
                </button>
                <button
                  onClick={handleDownloadProductionScript}
                  className="px-2.5 py-1 rounded-lg border border-white/10 hover:bg-white/10 text-[10px] font-mono text-amber-300 flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>.MD Script</span>
                </button>
                <button
                  onClick={handleCopyScript}
                  className="px-2.5 py-1 rounded-lg border border-green-500/30 bg-green-500/10 text-[10px] font-mono text-green-300 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{copyStatus || 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Scrollable list of cues */}
            <div className="max-h-[190px] overflow-y-auto space-y-2 pr-1 font-mono text-xs">
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
                      <span className={`font-bold ${cue.isPunchline ? 'text-red-400' : 'text-cyan-400'}`}>
                        [{cue.startTime}s – {cue.endTime}s] {cue.isPunchline ? '🔥 PUNCHLINE CLIMAX' : ''}
                      </span>
                      <span>Segment {idx + 1}</span>
                    </div>
                    <p className={`text-xs ${isActive ? 'text-green-300 font-bold' : 'text-white/80'}`}>
                      "{cue.spokenText}"
                    </p>
                    <div className="mt-1 pt-1 border-t border-white/5 text-[9px] text-amber-300/80 space-y-0.5">
                      <div>🎬 {cue.visualCue}</div>
                      <div>🔊 {cue.audioCue}</div>
                      <div>⏱️ {cue.pacingNote}</div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
