import React, { useState } from 'react';
import { Sparkles, Send, Copy, Check, Clock, Bot, RefreshCw, Cpu, Layers } from 'lucide-react';
import { generateAiContent, AiGenerateResponse } from '../../services/apiClient';

interface PromptHistoryItem {
  id: string;
  prompt: string;
  response: string;
  model: string;
  latencyMs: number;
  timestamp: string;
  simulated?: boolean;
}

const PRESETS = [
  {
    title: 'Stand-Up Punchline Synthesizer',
    desc: 'Generate a dry, Kiwi-accented temporal punchline on mundane human realities.',
    prompt: 'Act as Dragon 9, a stoner comedian philosopher. Deliver a sharp, 2-sentence punchline connecting smart home doorbells to temporal dilation. Use the phrase "Times Up, Mother Fathers!".',
  },
  {
    title: 'Veo 3.1 Cinematic Storyboard Cue',
    desc: 'Render ultra-detailed video generation directives for anime hybrid footage.',
    prompt: 'Generate an 8K anime keyframe prompt for Veo 3.1: Super Puff stands on a reflective glass stage as volumetric violet smoke dissolves into a 432Hz sine wave grid. 16:9 widescreen, cinematic color grading, Rec.2020.',
  },
  {
    title: 'Terpene Harmonic Acoustic Frequency Matrix',
    desc: 'Map cannabis botanical terpenes to specific musical frequencies and comedy pacing.',
    prompt: 'Synthesize a scientific comedy breakdown correlating Myrcene (99.1%) with 432Hz room harmonics and 54-minute hour timing.',
  },
  {
    title: 'Heckler Counter-Attack Protocol',
    desc: 'Craft an instantaneous, devastating comedic comeback for an impatient audience member.',
    prompt: 'A heckler shouts "Get to the point already!". Provide an instant, lethal status-inversion comeback as Super Puff that silences the room with dry authority.',
  },
];

export default function AiIntelligenceHub() {
  const [prompt, setPrompt] = useState(PRESETS[0].prompt);
  const [model, setModel] = useState('gemini-3.8-flash');
  const [isLoading, setIsLoading] = useState(false);
  const [activeResponse, setActiveResponse] = useState<AiGenerateResponse | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<PromptHistoryItem[]>([]);

  const handleRunPrompt = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);

    const { data, latencyMs, error } = await generateAiContent(prompt, model);
    setIsLoading(false);
    setLatency(latencyMs);

    if (error) {
      setErrorMessage(error);
      return;
    }

    if (data) {
      setActiveResponse(data);
      const item: PromptHistoryItem = {
        id: 'hist-' + Date.now(),
        prompt,
        response: data.text,
        model,
        latencyMs,
        timestamp: new Date().toLocaleTimeString(),
        simulated: data.simulated,
      };
      setHistory(prev => [item, ...prev.slice(0, 9)]);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full overflow-y-auto p-4 lg:p-8 bg-[#040407] text-white/90">
      {/* Module Header */}
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Cpu className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold tracking-tight text-white">AI Intelligence & LLM Service Engine</h1>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                /api/v1/ai/generate
              </span>
            </div>
            <p className="text-xs text-white/60 font-light">
              Server-side isolated Gemini execution with intelligent rate-limiting, error fallbacks, and multi-model dispatch.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
              <Bot className="w-4 h-4 text-cyan-400" />
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="bg-transparent text-white/90 outline-none text-xs cursor-pointer"
              >
                <option value="gemini-3.8-flash" className="bg-neutral-900">Gemini 3.8 Flash (Apex)</option>
                <option value="gemini-3.7-flash" className="bg-neutral-900">Gemini 3.7 Flash</option>
                <option value="gemini-2.5-flash" className="bg-neutral-900">Gemini 2.5 Flash (Auto-Routed)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Presets Bar */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-white/40 flex items-center gap-1.5">
            <Layers className="w-3 h-3" />
            <span>Operational Prompt Presets</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(preset.prompt)}
                className="text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 transition-all group"
              >
                <div className="text-xs font-semibold text-white/90 group-hover:text-cyan-300 mb-1">
                  {preset.title}
                </div>
                <div className="text-[10px] text-white/50 line-clamp-2">
                  {preset.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input & Output Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Prompt Editor */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 flex flex-col">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Prompt Payload</span>
              </label>
              <span className="text-[10px] font-mono text-white/40">
                Characters: {prompt.length}
              </span>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter instructions, comedy bits, or technical prompt directives..."
              rows={9}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-mono text-white/90 placeholder-white/30 focus:outline-none focus:border-cyan-500/50 resize-none flex-1 leading-relaxed"
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-mono text-white/40">
                Rate Limit: 20 req/min
              </span>
              <button
                onClick={handleRunPrompt}
                disabled={isLoading || !prompt.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch to Gateway</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Response Inspector */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">
                  Gateway Output
                </span>
                {latency !== null && (
                  <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>{latency}ms</span>
                  </span>
                )}
                {activeResponse?.simulated && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Local Resilient Pipeline
                  </span>
                )}
              </div>

              {activeResponse?.text && (
                <button
                  onClick={() => handleCopy(activeResponse.text)}
                  className="flex items-center gap-1 text-[10px] font-mono text-white/50 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 overflow-y-auto min-h-[220px]">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-white/40 space-y-2 py-12">
                  <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                  <p className="text-xs font-mono">Streaming request via /api/v1/ai/generate...</p>
                </div>
              ) : errorMessage ? (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                  <strong>Gateway Exception:</strong> {errorMessage}
                </div>
              ) : activeResponse?.text ? (
                <div className="text-xs font-mono text-white/90 whitespace-pre-wrap leading-relaxed">
                  {activeResponse.text}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white/30 space-y-1 py-12 text-xs font-mono">
                  <span>No prompt dispatched yet.</span>
                  <span className="text-[10px] text-white/20">Select a preset or enter a custom prompt.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Execution History */}
        {history.length > 0 && (
          <div className="pt-4 border-t border-white/10 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-white/50">
              Session Dispatch History ({history.length})
            </h3>
            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300">
                        {item.model}
                      </span>
                      <span className="text-[10px] font-mono text-white/40">{item.timestamp}</span>
                      <span className="text-[10px] font-mono text-white/40">• {item.latencyMs}ms</span>
                    </div>
                    <p className="text-white/70 font-mono text-[11px] truncate max-w-2xl">
                      {item.prompt}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setPrompt(item.prompt);
                      setActiveResponse({ success: true, text: item.response, simulated: item.simulated });
                    }}
                    className="self-start md:self-center px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white/80 font-mono text-[10px] whitespace-nowrap transition-colors"
                  >
                    Restore Prompt
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
