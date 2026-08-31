import { useState, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';
import Visualizer from './Visualizer';
import TimeSync from './TimeSync';
import PurchaseModal from './PurchaseModal';
import StonerDragonEffects from './StonerDragonEffects';
import { ACTS, PROMPTS } from '../data';
import { Wand2, Loader2, Sparkles, Download, Keyboard, Radio } from 'lucide-react';

export default function Theater() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [actsData, setActsData] = useState<any[]>(ACTS);
  const [currentAct, setCurrentAct] = useState(ACTS[0]);
  const [activeTab, setActiveTab] = useState<'acts' | 'prompts'>('acts');
  const [isDragonTime, setIsDragonTime] = useState(false);
  const [isBroadcast, setIsBroadcast] = useState(false);
  
  // Custom Effects
  const [isSmoking, setIsSmoking] = useState(false);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [pendingAct, setPendingAct] = useState<any>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [lastModalTime, setLastModalTime] = useState(0);
  
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const generatingActs = actsData.filter(a => a.status === 'generating_video' && a.operationName);
    if (generatingActs.length === 0) return;

    const interval = setInterval(async () => {
      for (const act of generatingActs) {
        try {
          const res = await fetch('/api/video-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operationName: act.operationName })
          });
          const status = await res.json();
          if (status.done) {
            setActsData(prev => prev.map(a => 
              a.id === act.id 
                ? { ...a, status: 'ready', videoUrl: `/api/video-download?op=${encodeURIComponent(a.operationName)}` } 
                : a
            ));
            
            if (currentAct.id === act.id) {
              setCurrentAct(prev => ({ ...prev, status: 'ready', videoUrl: `/api/video-download?op=${encodeURIComponent(act.operationName)}` }));
            }
          }
        } catch(e) {
          console.error('Polling error', e);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [actsData, currentAct.id]);

  const handleExportAct = () => {
    const exportData = {
      ...currentAct,
      _meta: {
        exportedAt: new Date().toISOString(),
        supportedWithJoints: true,
        message: "Thanks for supporting the temporal void with digital joints! Share this exported JSON act with your timeline."
      }
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dragon9-act-${currentAct.id || 'export'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept typing in inputs
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(p => !p);
      } else if (e.key.toLowerCase() === 's') {
        setIsDragonTime(p => !p);
      } else if (e.key.toLowerCase() === 'g') {
        if (!isGenerating) handleGenerateAct();
      } else if (e.key.toLowerCase() === 'e') {
        handleExportAct();
      } else if (e.key.toLowerCase() === 'b') {
        if (!isSmoking) setIsSmoking(true);
      } else if (e.key === '?') {
        setShowShortcuts(p => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const triggerModal = (nextAct?: any) => {
    const now = Date.now();
    const THREE_MINUTES = 3 * 60 * 1000;
    if (now - lastModalTime >= THREE_MINUTES) {
      setLastModalTime(now);
      setPendingAct(nextAct || null);
      setShowModal(true);
    } else {
      if (nextAct) setCurrentAct(nextAct);
      setIsPlaying(true);
    }
  };

  const handleActClick = (act: any) => {
    if (currentAct.id !== act.id) {
      triggerModal(act);
    }
  };

  const handleActComplete = () => {
    if (isBroadcast) {
      const currentIndex = actsData.findIndex(a => a.id === currentAct.id);
      const nextAct = actsData[currentIndex + 1];
      if (nextAct) {
        setCurrentAct(nextAct);
        setIsPlaying(true);
        setIsSmoking(true);
      } else {
        handleGenerateAct();
      }
      return;
    }
    const currentIndex = actsData.findIndex(a => a.id === currentAct.id);
    const nextAct = actsData[currentIndex + 1];
    triggerModal(nextAct);
  };

  const handleConfirmPurchase = () => {
    if (pendingAct) setCurrentAct(pendingAct);
    setShowModal(false);
    setPendingAct(null);
    setIsPlaying(true);
  };

  const handleSkip = () => {
    if (pendingAct) setCurrentAct(pendingAct);
    setShowModal(false);
    setPendingAct(null);
    setIsPlaying(true);
  };

  const handleGenerateAct = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-act', { method: 'POST' });
      const newAct = await res.json();
      
      if (res.ok) {
        newAct.icon = Sparkles; // Assign a default icon for generated acts
        setActsData(prev => [...prev, newAct]);
        setCurrentAct(newAct); // Immediately show the generating state
        setActiveTab('acts');
        if (isBroadcast) {
          setIsPlaying(true);
          setIsSmoking(true);
        }
      } else {
        alert(newAct.error || 'Failed to generate act');
      }
    } catch (e) {
      console.error(e);
      alert('Network error during generation');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0 col-span-full row-span-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)", backgroundSize: "40px 40px" }}></div>
      </div>

      {/* Header */}
      <header className="col-span-1 lg:col-span-2 row-start-1 flex justify-between items-center px-4 lg:px-10 py-4 lg:py-6 z-20 border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="flex items-center space-x-2 lg:space-x-4">
          <div className="text-red-600 font-black text-xl lg:text-2xl tracking-tighter uppercase">NUTFLOX</div>
          <div className="h-4 lg:h-5 w-[1px] bg-white/20"></div>
          <div className="text-[8px] lg:text-[10px] font-bold tracking-[0.2em] uppercase text-white/60 hidden sm:block">Original Special</div>
        </div>
        <div className="flex items-center space-x-3 lg:space-x-6 text-[10px] font-mono text-white/40 uppercase tracking-widest">
          <button
            onClick={() => {
              const next = !isBroadcast;
              setIsBroadcast(next);
              if (next) {
                setIsPlaying(true);
                setIsSmoking(true);
              }
            }}
            className={`flex items-center gap-2 px-3 py-1.5 border rounded transition-all font-mono uppercase text-xs ${isBroadcast ? 'border-red-500 text-red-500 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse' : 'border-white/20 text-white/70 hover:bg-white/5'}`}
          >
            <Radio className="w-4 h-4" />
            <span className="hidden sm:inline">{isBroadcast ? '🔴 BROADCAST LIVE' : 'Broadcast Standby'}</span>
          </button>

          <div className="flex items-center space-x-2 hidden md:flex">
            <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-orange-500 shadow-[0_0_8px_#f97316] animate-pulse' : 'bg-white/20'}`}></span>
            <span>{isPlaying ? 'STREAM: ACTIVE' : 'STREAM: STANDBY'}</span>
          </div>
          <div className="px-2 lg:px-3 py-1 border border-orange-500/50 text-orange-500 rounded bg-orange-500/10 hidden sm:block">HDR</div>
          
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            className={`flex items-center gap-2 px-2 lg:px-3 py-2 border rounded transition-all ${showShortcuts ? 'border-orange-500 text-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'border-white/20 text-white/70 hover:bg-white/5'}`}
            title="Shortcuts (?)"
          >
            <Keyboard className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleExportAct}
            className="hidden sm:flex items-center gap-2 px-3 py-2 border border-green-500/50 text-green-500 rounded bg-green-500/10 hover:bg-green-500/20 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all"
            title="Export Act (E)"
          >
            <Download className="w-4 h-4" />
            <span>Export Act</span>
          </button>

          <button 
            onClick={handleGenerateAct}
            disabled={isGenerating}
            className="flex items-center gap-2 px-3 lg:px-4 py-2 border border-orange-500/50 text-orange-500 rounded bg-orange-500/10 hover:bg-orange-500/20 hover:shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{isGenerating ? 'Synthesizing...' : 'Generate New Act'}</span>
          </button>
        </div>
      </header>

      {/* Main Content (Video & Visualizer) */}
      <div className="col-span-1 lg:col-start-1 row-start-2 flex flex-col p-4 lg:p-6 space-y-4 lg:space-y-6 relative lg:border-r border-white/5 overflow-y-auto lg:overflow-hidden min-h-0 z-10">
        <div className={`flex-1 rounded-2xl overflow-hidden border border-white/10 bg-black/50 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative transition-all duration-300 min-h-[250px] ${isSmoking ? 'stoned-camera-active' : ''}`}>
          <VideoPlayer 
            isPlaying={isPlaying} 
            setIsPlaying={setIsPlaying}
            currentAct={currentAct}
            onActComplete={handleActComplete}
          />
        </div>
        
        <div className="h-24 lg:h-32 shrink-0 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 text-[8px] font-mono opacity-30 uppercase">AUDIO_REACT_VISUALIZER</div>
          <Visualizer isPlaying={isPlaying} />
        </div>
      </div>

      {/* Right Side / Bottom: Sidebar Controls */}
      <aside className="col-span-1 lg:col-start-2 row-start-3 lg:row-start-2 flex flex-col p-4 lg:p-6 space-y-4 lg:space-y-6 bg-black/80 lg:bg-black/20 backdrop-blur-xl lg:backdrop-blur-md overflow-y-auto z-20 shadow-[0_-15px_40px_rgba(0,0,0,0.6)] lg:shadow-[-10px_0_30px_rgba(0,0,0,0.5)] border-t lg:border-t-0 lg:border-l border-white/10 min-h-0 relative">
          {/* Title Area */}
          <div className="text-center py-4 border-b border-white/10">
            <h1 className="text-2xl font-black tracking-tight uppercase mb-1">
              Dragon 9
            </h1>
            <div className="text-orange-500 font-bold uppercase tracking-wider text-sm">
              Synchronise Time
            </div>
          </div>

          {/* Time Sync Control */}
          <TimeSync isDragonTime={isDragonTime} setIsDragonTime={setIsDragonTime} />

          {/* Navigation Tabs */}
          <div className="flex w-full border-b border-white/10 mt-4">
             <button 
               className={`flex-1 pb-2 text-[10px] font-mono tracking-[0.2em] uppercase transition-colors border-b-2 ${activeTab === 'acts' ? 'border-orange-500 text-orange-500' : 'border-transparent text-white/50 hover:text-white'}`}
               onClick={() => setActiveTab('acts')}
             >
               Act Sequence
             </button>
             <button 
               className={`flex-1 pb-2 text-[10px] font-mono tracking-[0.2em] uppercase transition-colors border-b-2 ${activeTab === 'prompts' ? 'border-orange-500 text-orange-500' : 'border-transparent text-white/50 hover:text-white'}`}
               onClick={() => setActiveTab('prompts')}
             >
               Media Directives
             </button>
          </div>

          <div className="space-y-4 flex-1">
            {activeTab === 'acts' && actsData.map((act, index) => (
              <button
                key={act.id}
                onClick={() => handleActClick(act)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  currentAct.id === act.id 
                    ? 'bg-white/10 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]' 
                    : 'bg-white/5 border-white/10 hover:border-white/30'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className={`text-[10px] font-mono uppercase ${currentAct.id === act.id ? 'text-orange-500' : 'text-white/40'}`}>
                    ACT_0{index + 1}
                  </div>
                  <div className="text-[10px] font-mono text-white/30">{act.time}</div>
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-white/90 truncate mb-1">
                  {act.title}
                </h3>
                <p className="text-xs text-white/50 line-clamp-2">
                  {act.bit}
                </p>
              </button>
            ))}

            {activeTab === 'prompts' && PROMPTS.map((prompt) => (
              <div
                key={prompt.id}
                className="w-full text-left p-4 rounded-xl border bg-white/5 border-white/10 mb-4"
              >
                <h3 className="text-[10px] font-mono uppercase text-orange-500 mb-2">
                  {prompt.title}
                </h3>
                <p className="text-xs text-white/70 whitespace-pre-wrap leading-relaxed font-mono">
                  {prompt.prompt}
                </p>
              </div>
            ))}
          </div>
        </aside>

      {/* Interstitial Purchase Modal */}
      <PurchaseModal 
        isOpen={showModal} 
        onConfirm={handleConfirmPurchase} 
        onSkip={handleSkip} 
      />

      {/* Shortcuts Overlay */}
      {showShortcuts && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] z-50 animate-in fade-in slide-in-from-top-4 w-96 text-center">
          <h3 className="text-white font-black uppercase tracking-widest mb-6 flex items-center justify-center gap-2">
            <Keyboard className="w-5 h-5 text-orange-500" />
            Global Shortcuts
          </h3>
          <ul className="space-y-4 text-sm font-mono text-white/70">
            <li className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="bg-white/10 px-2 py-1 rounded text-white font-bold">[SPACE]</span>
              <span>Play / Pause</span>
            </li>
            <li className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="bg-white/10 px-2 py-1 rounded text-white font-bold">[S]</span>
              <span>Sync Dragon Time</span>
            </li>
            <li className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="bg-white/10 px-2 py-1 rounded text-white font-bold">[G]</span>
              <span>Generate New Act</span>
            </li>
            <li className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="bg-white/10 px-2 py-1 rounded text-white font-bold">[E]</span>
              <span>Export Act JSON</span>
            </li>
            <li className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="bg-white/10 px-2 py-1 rounded text-white font-bold">[B]</span>
              <span>Hit the Bong</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="bg-white/10 px-2 py-1 rounded text-white font-bold">[?]</span>
              <span>Toggle Shortcuts</span>
            </li>
          </ul>
        </div>
      )}

      {/* Global Special Effects Layer */}
      <StonerDragonEffects isSmoking={isSmoking} onComplete={() => setIsSmoking(false)} />
    </>
  );
}
