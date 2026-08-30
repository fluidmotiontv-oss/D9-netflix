import { useState } from 'react';
import VideoPlayer from './VideoPlayer';
import Visualizer from './Visualizer';
import TimeSync from './TimeSync';
import { ACTS, PROMPTS } from '../data';
import { Flame, Leaf } from 'lucide-react';

export default function Theater() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAct, setCurrentAct] = useState(ACTS[0]);
  const [activeTab, setActiveTab] = useState<'acts' | 'prompts'>('acts');
  const [pendingAct, setPendingAct] = useState<any>(null);

  const handleActClick = (act: any) => {
    if (currentAct.id !== act.id) {
      setPendingAct(act);
    }
  };

  const handleConfirmPurchase = () => {
    setCurrentAct(pendingAct);
    setPendingAct(null);
    setIsPlaying(true);
  };

  const handleSkip = () => {
    setCurrentAct(pendingAct);
    setPendingAct(null);
    setIsPlaying(true);
  };

  return (
    <div className="h-screen w-full bg-[#020202] text-[#e0e0e0] font-sans flex flex-col relative overflow-hidden select-none">
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)", backgroundSize: "40px 40px" }}></div>
      </div>

      {/* Header */}
      <header className="flex justify-between items-center px-10 py-6 z-20 border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <div className="text-red-600 font-black text-2xl tracking-tighter uppercase">NETFLIX</div>
          <div className="h-5 w-[1px] bg-white/20"></div>
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/60">Original Special</div>
        </div>
        <div className="flex items-center space-x-6 text-[10px] font-mono text-white/40 uppercase tracking-widest">
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-orange-500 shadow-[0_0_8px_#f97316] animate-pulse' : 'bg-white/20'}`}></span>
            <span>{isPlaying ? 'STREAM: ACTIVE' : 'STREAM: STANDBY'}</span>
          </div>
          <div className="px-3 py-1 border border-orange-500/50 text-orange-500 rounded bg-orange-500/10">HDR</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden z-10 relative">
        {/* Left Side: Video & Visualizer */}
        <div className="flex-1 flex flex-col p-6 space-y-6 relative border-r border-white/5">
          <div className="flex-1 rounded-2xl overflow-hidden border border-white/10 bg-black/50 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative">
            <VideoPlayer 
              isPlaying={isPlaying} 
              setIsPlaying={setIsPlaying}
              currentAct={currentAct}
            />
          </div>
          
          <div className="h-32 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 text-[8px] font-mono opacity-30 uppercase">AUDIO_REACT_VISUALIZER</div>
            <Visualizer isPlaying={isPlaying} />
          </div>
        </div>

        {/* Right Side: Sidebar Controls */}
        <aside className="w-[450px] flex flex-col p-6 space-y-6 bg-black/20 backdrop-blur-md overflow-y-auto z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
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
          <TimeSync />

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
            {activeTab === 'acts' && ACTS.map((act, index) => (
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
      </main>

      {/* Interstitial Purchase Modal */}
      {pendingAct && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="bg-[#0a0a0a] border border-orange-500/50 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(249,115,22,0.2)] text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 p-3 text-[10px] font-mono opacity-30 uppercase text-orange-500">SUPPORT_REQ</div>
             
             <div className="flex justify-center mb-6 relative">
               <div className="w-20 h-20 bg-orange-500/10 rounded-full border border-orange-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                 <Flame className="w-10 h-10 text-orange-500 animate-pulse absolute" />
                 <Leaf className="w-5 h-5 text-green-500 absolute bottom-3 right-3 drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]" />
               </div>
             </div>

             <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Pass the Blunt?</h2>
             <p className="text-sm text-white/60 mb-8 leading-relaxed">
               Support the Dragon's temporal void maintenance. Purchase a digital joint for <span className="text-green-400 font-bold">$1.00</span> before proceeding to the next act.
             </p>

             <div className="flex flex-col space-y-3">
               <button 
                 onClick={handleConfirmPurchase}
                 className="w-full bg-orange-500/20 hover:bg-orange-500/40 border border-orange-500 text-orange-500 font-bold uppercase tracking-widest py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_25px_rgba(249,115,22,0.4)]"
               >
                 Buy a Joint ($1) & Continue
               </button>
               <button 
                 onClick={handleSkip}
                 className="w-full bg-transparent hover:bg-white/5 border border-white/20 text-white/50 hover:text-white uppercase text-xs tracking-widest py-3 rounded-lg transition-colors"
               >
                 Nah, I'm good
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
