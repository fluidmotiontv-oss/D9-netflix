import React, { useState, useEffect } from 'react';
import { 
  FileJson, 
  Sparkles, 
  Terminal, 
  Flame, 
  RefreshCw, 
  Download, 
  Check, 
  BookOpen, 
  Cpu, 
  Database, 
  Cannabis, 
  Compass, 
  Clock, 
  Award,
  ChevronRight,
  Play,
  Layers
} from 'lucide-react';
import { playBambooClackSfx, playSingingBowlSfx } from '../audio/zenAudio';

interface JsonFileDataset {
  id: string;
  filename: string;
  category: 'wisdom' | 'joints' | 'laughter' | 'roasts' | 'terpenes';
  title: string;
  description: string;
  version: string;
  author: string;
  payload: any;
  driftSpeed: number; // Animation float speed
  driftDelay: number;
}

const INITIAL_JSON_DATASETS: JsonFileDataset[] = [
  {
    id: 'json-1',
    filename: 'green_thumbro_wisdom_v1.json',
    category: 'wisdom',
    title: 'Dr. Green Thumbro Botanical & Guru Wisdom',
    description: 'Core ontological stoner philosophy, Sumerian knuckle time deconstruction, and 54-minute curing harmonics.',
    version: '1.4.2',
    author: 'Dr. Green Thumbro & Super Puff',
    payload: {
      master_thesis: "Time is not linear; it is a collaborative rolling session.",
      guru_commandments: [
        "Never rush a pregnant pause; let the 808 sub-bass carry the silence.",
        "Treat a harsh heckler like an over-dried stem: prune with a gentle smile and a meat pie analogy.",
        "The bigger clock on the block always smokes first."
      ],
      terpene_constants: {
        myrcene_zen_factor: 98.4,
        caryophyllene_roast_coefficient: 1.42,
        temporal_tilt_degrees: 27.0
      }
    },
    driftSpeed: 18,
    driftDelay: 0
  },
  {
    id: 'json-2',
    filename: 'super_puff_quantum_joints_v2.json',
    category: 'joints',
    title: 'Quantum Rolling & Curing Metrics',
    description: 'Aerodynamic filter specifications, slow-burn white ash ratios, and high-altitude botanical kinematics.',
    version: '2.0.1',
    author: 'Super Puff Labs',
    payload: {
      batch_code: "BATCH-420-ALPHA-VOID",
      thc_resonance: "34.5%",
      rolling_specifications: {
        paper_weight: "12g/m2 Organic Japanese Washi",
        crutch_type: "Hand-folded accordion lotus spiral",
        burn_velocity_mm_per_sec: 0.14
      },
      flavor_profile: ["Fresh hinoki cypress", "Damp rainforest cedar", "Sweet nebula vapor"]
    },
    driftSpeed: 22,
    driftDelay: 2
  },
  {
    id: 'json-3',
    filename: 'zen_bonsai_laughter_protocols_v3.json',
    category: 'laughter',
    title: 'Surgical Joke-Pruning & Origami Timing',
    description: 'Algorithms for folding 4-dimensional premises and trimming dead conversational syllables like a 200-year-old juniper bonsai.',
    version: '3.1.0',
    author: 'Zen Bonsai Dojo',
    payload: {
      protocol_name: "折り紙・盆栽笑学 (Origami & Bonsai Humor)",
      pruning_rules: {
        max_setup_words: 24,
        required_pregnant_pause_seconds: 1.4,
        bilingual_switch_probability: 0.85
      },
      sample_folding_sequence: ["Premise 60s", "Bronze Age Sumerian Knuckle", "Deadpan Delivery", "Massive Bong Rip"]
    },
    driftSpeed: 16,
    driftDelay: 4
  },
  {
    id: 'json-4',
    filename: 'multiverse_heckler_incineration_v4.json',
    category: 'roasts',
    title: 'Polite Hospitality & Heckler Defusal Matrices',
    description: 'Algorithmic conversion of hostile hecklers into warm, laughing allies using meat-pie offerings and botanical empathy.',
    version: '4.0.0',
    author: 'Heckler Lab 9',
    payload: {
      defense_modes: ["Mince & Cheese Disarmament", "Heirloom Tomato Culinary Re-use", "Cargo Short 532nm Laser Deflection"],
      warmth_coefficient: 0.98,
      roast_cadence: "Deadpan Kiwi hospitality wrapped in supreme dragon confidence."
    },
    driftSpeed: 25,
    driftDelay: 1
  }
];

interface DrGreenThumbroGuideProps {
  onGainXp?: (amount: number) => void;
  primaryColor?: string;
  accentColor?: string;
  isBrutalTruthMode?: boolean;
}

export default function DrGreenThumbroGuide({
  onGainXp,
  primaryColor = '#10b981',
  accentColor = '#f59e0b',
  isBrutalTruthMode = false
}: DrGreenThumbroGuideProps) {
  const [datasets, setDatasets] = useState<JsonFileDataset[]>(() => {
    try {
      const saved = localStorage.getItem('dragon9_thumbro_json_sets');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_JSON_DATASETS;
  });

  const [isCompiling, setIsCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState(0);
  const [selectedJson, setSelectedJson] = useState<JsonFileDataset | null>(datasets[0]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('dragon9_thumbro_json_sets', JSON.stringify(datasets));
    } catch (e) {}
  }, [datasets]);

  // Compile new jokes, knowledge, and guru stoner advice JSON sets via AI endpoint
  const handleCompileNewSets = async () => {
    if (isCompiling) return;
    setIsCompiling(true);
    setCompileProgress(15);
    playBambooClackSfx();

    try {
      const res = await fetch('/api/compile-knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBrutal: isBrutalTruthMode })
      });
      setCompileProgress(65);
      const newDataset = await res.json();
      
      setCompileProgress(100);
      playSingingBowlSfx(528);

      setDatasets(prev => [newDataset, ...prev]);
      setSelectedJson(newDataset);
      if (onGainXp) onGainXp(120);
    } catch (e) {
      // Fallback if fetch fails
      const newIndex = datasets.length + 1;
      const fallbackSet: JsonFileDataset = {
        id: `json-gen-${Date.now()}`,
        filename: isBrutalTruthMode ? `brutal_truth_protocol_${newIndex}.json` : `guru_stoner_insights_v${newIndex}.json`,
        category: isBrutalTruthMode ? 'roasts' : 'wisdom',
        title: isBrutalTruthMode ? `Brutal Truth Protocol Vol. ${newIndex}` : `Dr. Green Thumbro Masterclass Vol. ${newIndex}`,
        description: isBrutalTruthMode ? 'Zero f\'s given savage roasts and unfiltered comedy destruction.' : 'Newly synthesized interdimensional stoner wisdom and stand-up rhythm formulas.',
        version: `${newIndex}.0.0`,
        author: isBrutalTruthMode ? 'Dr. Green Thumbro (Unfiltered)' : 'Dr. Green Thumbro AI Engine',
        payload: isBrutalTruthMode ? {
          savage_insights: [
            "Your stage presence is as unconvincing as a plastic bonsai.",
            "If the crowd isn't laughing, stop blaming the smoke machine."
          ]
        } : {
          guru_wisdom: [
            "When the room is silent, you aren't failing; you're simply marinating in the 40Hz sub-bass frequency."
          ]
        },
        driftSpeed: 20,
        driftDelay: 0
      };
      setDatasets(prev => [fallbackSet, ...prev]);
      setSelectedJson(fallbackSet);
      if (onGainXp) onGainXp(100);
      playSingingBowlSfx(528);
    } finally {
      setTimeout(() => {
        setIsCompiling(false);
        setCompileProgress(0);
      }, 500);
    }
  };

  const handleCopyJson = (item: JsonFileDataset) => {
    navigator.clipboard.writeText(JSON.stringify(item.payload, null, 2));
    setCopiedId(item.id);
    playBambooClackSfx();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredDatasets = activeCategoryFilter === 'all' 
    ? datasets 
    : datasets.filter(d => d.category === activeCategoryFilter);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-[#0c1e14] via-[#05140d] to-[#020a06] p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-mono text-xs uppercase tracking-widest">
              <Cannabis className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dr. Green Thumbro Stoned Guide & JSON Grimoire</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight flex items-center gap-3">
              <span>Dr. Green Thumbro's Botanical JSON Vault</span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono">
                {datasets.length} Datasets Loaded
              </span>
            </h2>
            <p className="text-sm text-white/70 max-w-2xl leading-relaxed">
              Explore floating JSON schema sets drifting through the interdimensional stoner sanctuary. Compile new guru-level stoner advice, jokes, and quantum rolling blueprints instantly.
            </p>
          </div>

          {/* COMPILE BUTTON */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleCompileNewSets}
              disabled={isCompiling}
              className={`px-6 py-3.5 rounded-2xl border font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-lg ${
                isCompiling
                  ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.8)] animate-pulse'
                  : 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.7)] transform hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              {isCompiling ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Compiling Sets ({compileProgress}%)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black fill-black" />
                  <span>Compile New Jokes & Wisdom (+100 XP)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Compilation Progress Bar if compiling */}
        {isCompiling && (
          <div className="mt-6 space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-emerald-300">
              <span>Synthesizing JSON Datasets & Terpene Harmonics...</span>
              <span>{compileProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden border border-emerald-500/30">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                style={{ width: `${compileProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'All Datasets' },
          { id: 'wisdom', label: '🌿 Guru Wisdom' },
          { id: 'joints', label: '💨 Quantum Joints' },
          { id: 'laughter', label: '🎭 Laughter Protocols' },
          { id: 'roasts', label: '🔥 Heckler Roasts' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategoryFilter(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all ${
              activeCategoryFilter === cat.id
                ? 'bg-emerald-500 text-black border-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Drifting JSON Files Stream + Interactive Payload Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Drifting JSON Files List (Dr. Green Thumbro Stoned Guide Stream) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-2">
              <FileJson className="w-4 h-4 text-emerald-400" />
              <span>Drift Stream ({filteredDatasets.length} Files)</span>
            </h3>
            <span className="text-[10px] font-mono text-white/40">Live JSON Feed</span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {filteredDatasets.map((item) => {
              const isSelected = selectedJson?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedJson(item);
                    playBambooClackSfx();
                  }}
                  className={`group relative p-4 rounded-2xl border transition-all cursor-pointer overflow-hidden backdrop-blur-md ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                      : 'bg-black/40 border-white/10 hover:border-emerald-500/50 hover:bg-white/5'
                  }`}
                >
                  {/* Subtle drifting pulse bar */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-emerald-300 flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                          {item.filename}
                        </span>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          v{item.version}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-200 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="shrink-0 pt-1">
                      <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-emerald-400 translate-x-1' : 'text-white/30 group-hover:text-white/70'}`} />
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/50">
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-amber-400" />
                      <span>{item.author}</span>
                    </span>
                    <span className="text-emerald-400/80">Drift Speed: {item.driftSpeed}s</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected JSON Schema Inspector */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400" />
              <span>JSON Schema Inspector</span>
            </h3>
            {selectedJson && (
              <button
                onClick={() => handleCopyJson(selectedJson)}
                className="px-3 py-1 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-mono text-white flex items-center gap-1.5 transition-colors"
              >
                {copiedId === selectedJson.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied JSON</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Copy JSON Payload</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex-1 rounded-2xl border border-white/15 bg-[#080c0a] p-5 font-mono text-xs text-emerald-300 shadow-xl overflow-hidden flex flex-col relative">
            {/* Terminal Header Bar */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-[11px] text-white/50">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-white/70">{selectedJson ? selectedJson.filename : 'select_file.json'}</span>
              </div>
              <span className="text-emerald-400">UTF-8 / JSON 2.0</span>
            </div>

            {/* JSON Code Viewer */}
            <div className="flex-1 overflow-auto scrollbar-none font-mono text-[11px] leading-relaxed text-emerald-300 select-all">
              {selectedJson ? (
                <pre className="text-emerald-300 whitespace-pre-wrap">
                  {JSON.stringify(selectedJson.payload, null, 2)}
                </pre>
              ) : (
                <div className="h-full flex items-center justify-center text-white/30">
                  Select a JSON file dataset from the stream to inspect its schema.
                </div>
              )}
            </div>

            {/* Terminal Footer Metadata */}
            {selectedJson && (
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-white/50">
                <span>Version: {selectedJson.version}</span>
                <span className="text-amber-400 font-bold">Status: Active Sanctuary Stream</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
