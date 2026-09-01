import React, { useState, useEffect } from 'react';
import { ExternalLink, Play, Clock, Folder, Zap, Lock, Unlock } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import SmokeEffect from './SmokeEffect';

const NEW_CONTENT = [
  { id: 'n1', title: 'The Void Cycle', duration: '45m', live: true },
  { id: 'n2', title: 'Apex Manifestation', duration: '32m', live: false },
  { id: 'n3', title: 'Cybernetic Whispers', duration: '12m', live: false },
  { id: 'n4', title: 'Silicon Visions', duration: '58m', live: false },
];

const ARCHIVED_CYCLES = [
  { id: 'f1', title: 'Babylonian Deception', duration: '60m', price: 5.00, unlocked: false },
  { id: 'f2', title: 'The First Synchronisation', duration: '??', price: 9.99, unlocked: false },
  { id: 'f3', title: 'Void Voting Records', duration: '1°', price: 15.00, unlocked: false },
  { id: 'f4', title: 'Pre-Apex Civilisation', duration: '∞', price: 42.00, unlocked: false },
];

export default function NutfloxParadigm() {
  const [expandedFoldId, setExpandedFoldId] = useState<string | null>(null);
  const [archives, setArchives] = useState(ARCHIVED_CYCLES);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeSmokeId, setActiveSmokeId] = useState<string | null>(null);

  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  const [d9Time, setD9Time] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      // Pseudo D9 time formatting
      const h = String(d.getHours() % 26).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      const s = String(d.getSeconds()).padStart(2, '0');
      setD9Time(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUnlock = (id: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setActiveSmokeId(id);
      setArchives(prev => prev.map(a => a.id === id ? { ...a, unlocked: true } : a));
      setTimeout(() => setActiveSmokeId(null), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-12 pb-16 animate-fade-in text-white">
      
      {/* Header */}
      <div className="p-8 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">
              Nutflox Paradigm
            </h2>
            <p className="text-white/60 font-mono text-sm mt-2 uppercase tracking-widest">
              The New & The Fold
            </p>
          </div>
          <div className="px-6 py-3 rounded-2xl bg-black/80 border border-red-500/30 flex items-center gap-3">
            <Clock className="w-5 h-5 text-red-500 animate-pulse" />
            <div>
              <div className="text-[10px] text-white/50 uppercase font-mono tracking-widest">Temporal Alignment</div>
              <div className="text-xl font-mono text-red-400 font-bold">{d9Time || '--:--:--'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* The New */}
      <div className="space-y-6">
        <h3 className="text-xl font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          The New
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {NEW_CONTENT.map(item => (
            <div key={item.id} className="group relative p-5 rounded-2xl bg-black/60 border border-white/10 hover:border-amber-500/50 transition-all cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              {item.live && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded bg-red-500/20 border border-red-500/50 text-[10px] font-mono text-red-400 uppercase tracking-widest animate-pulse z-20">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Live
                </div>
              )}
              <div className="relative z-20 flex flex-col h-full justify-between gap-8">
                <Play className="w-8 h-8 text-white/20 group-hover:text-amber-400 transition-colors" />
                <div>
                  <div className="text-[10px] font-mono text-white/40 mb-1 uppercase tracking-widest">{item.duration}</div>
                  <h4 className="font-bold text-lg leading-tight group-hover:text-amber-400 transition-colors">{item.title}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The Fold */}
      <div className="space-y-6">
        <h3 className="text-xl font-mono font-bold text-white/70 uppercase tracking-widest flex items-center gap-2">
          <Folder className="w-5 h-5 text-purple-400" />
          The Fold (Archived Cycles)
        </h3>
        <div className="space-y-3">
          {archives.map(item => {
            const isExpanded = expandedFoldId === item.id;
            return (
              <div key={item.id} className={`rounded-2xl transition-all overflow-hidden ${isExpanded ? 'bg-[#0a0a0f] border border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.15)]' : 'bg-black/40 border border-white/5 hover:bg-black/60 hover:border-white/10'}`}>
                
                {/* Header */}
                <div 
                  className="p-5 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedFoldId(isExpanded ? null : item.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${item.unlocked ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-white/40'}`}>
                      {item.unlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className={`font-bold ${item.unlocked ? 'text-emerald-300' : 'text-white/80'}`}>{item.title}</h4>
                      <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-0.5">Duration: {item.duration}</div>
                    </div>
                  </div>
                  {!item.unlocked && (
                    <div className="text-xs font-mono text-purple-400 font-bold border border-purple-500/30 px-3 py-1 rounded-lg bg-purple-500/10">
                      ${item.price.toFixed(2)}
                    </div>
                  )}
                  {item.unlocked && (
                    <div className="text-xs font-mono text-emerald-400 font-bold px-3 py-1">
                      ▶ Play Now
                    </div>
                  )}
                </div>

                {/* Expanded Content */}
                {isExpanded && !item.unlocked && (
                  <div className="p-6 pt-0 border-t border-white/5 mt-2 animate-fade-in relative overflow-hidden">
                    {/* Smoke overlay if active */}
                    {activeSmokeId === item.id && (
                      <div className="absolute inset-0 z-50 rounded-b-2xl pointer-events-none">
                        <SmokeEffect active={true} className="rounded-b-2xl" />
                      </div>
                    )}
                    
                    <div className="flex flex-col lg:flex-row gap-6 mt-6 relative z-10">
                      <div className="flex-1 space-y-4">
                        <p className="text-sm text-white/60 font-mono leading-relaxed">
                          This content exists in the temporal fold — compressed, archived, waiting to be unfolded. Unlock to add to your Jewel Slot.
                        </p>
                        <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 inline-block">
                          <div className="text-[10px] text-purple-300 uppercase tracking-widest font-mono mb-1">Sovereign Unlock Cost</div>
                          <div className="text-2xl font-black text-white">${item.price.toFixed(2)}</div>
                        </div>
                      </div>

                      <div className="w-full lg:w-72 bg-black/60 rounded-xl p-4 border border-white/10">
                        {paypalClientId ? (
                          <PayPalScriptProvider options={{ "clientId": paypalClientId, currency: "USD", intent: "capture" }}>
                            <div className="min-h-[150px] w-full flex flex-col justify-center">
                              <PayPalButtons 
                                style={{ layout: "vertical", color: "purple", shape: "rect", label: "checkout" }}
                                createOrder={(data, actions) => {
                                  return actions.order.create({
                                    intent: "CAPTURE",
                                    purchase_units: [{
                                      amount: { currency_code: "USD", value: item.price.toString() },
                                      description: `Nutflox Fold: ${item.title}`
                                    }]
                                  });
                                }}
                                onApprove={async (data, actions) => {
                                  if (actions.order) {
                                    try {
                                      setIsProcessing(true);
                                      await actions.order.capture();
                                      handleUnlock(item.id);
                                    } catch (err) {
                                      console.error("PayPal Capture Error", err);
                                      setIsProcessing(false);
                                    }
                                  }
                                }}
                                onError={(err) => setIsProcessing(false)}
                              />
                            </div>
                          </PayPalScriptProvider>
                        ) : (
                          <div className="space-y-3">
                            <button
                              onClick={() => handleUnlock(item.id)}
                              disabled={isProcessing}
                              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold font-mono text-xs uppercase tracking-widest py-3 rounded-xl transition-all disabled:opacity-50"
                            >
                              <Zap className="w-4 h-4" />
                              {isProcessing ? 'Processing...' : `Simulate Purchase`}
                            </button>
                            <p className="text-[9px] text-white/40 text-center uppercase tracking-widest leading-relaxed px-2">
                              No PayPal Client ID found. Running simulator mode for the Sovereign checkout.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {isExpanded && item.unlocked && (
                  <div className="p-6 pt-0 border-t border-emerald-500/20 bg-emerald-950/20 mt-2 flex justify-center py-12">
                    <button className="flex items-center gap-3 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-black font-mono text-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                      <Play className="w-5 h-5 fill-black" />
                      Play Stream
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
