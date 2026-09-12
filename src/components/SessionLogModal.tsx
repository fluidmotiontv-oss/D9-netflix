import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, 
  Download, 
  Copy, 
  Check, 
  Trash2, 
  X, 
  ShieldAlert, 
  Users, 
  Sparkles, 
  Flame, 
  Calendar, 
  Activity, 
  FileJson, 
  Clock, 
  Radio, 
  Zap, 
  RotateCcw,
  Skull
} from 'lucide-react';
import { 
  PerformanceSessionData, 
  SessionTimelineEvent, 
  exportSessionToJsonFile 
} from '../utils/sessionLog';
import { getHecklerPersona, HecklerPersonaId } from '../audio/hecklerPersonas';

export interface SessionLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionData: PerformanceSessionData;
  onClearSession: () => void;
}

export const SessionLogModal: React.FC<SessionLogModalProps> = ({
  isOpen,
  onClose,
  sessionData,
  onClearSession,
}) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'raw_json'>('timeline');
  const [filterType, setFilterType] = useState<'all' | 'heckle' | 'crowd_reaction' | 'roast' | 'act_change'>('all');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const filteredTimeline = filterType === 'all'
    ? sessionData.timeline
    : sessionData.timeline.filter(e => e.type === filterType);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(sessionData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getEventBadge = (event: SessionTimelineEvent) => {
    switch (event.type) {
      case 'meltdown':
        return (
          <span className="px-2 py-0.5 rounded-full bg-red-600/30 text-red-300 border border-red-500/50 text-[9px] font-mono font-black flex items-center gap-1 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]">
            <Skull className="w-2.5 h-2.5 text-red-400" />
            <span>MELTDOWN</span>
          </span>
        );
      case 'brutal_event':
        return (
          <span className="px-2 py-0.5 rounded-full bg-red-950/50 text-red-400 border border-red-800/40 text-[9px] font-mono font-bold flex items-center gap-1">
            <Skull className="w-2.5 h-2.5" />
            <span>BRUTAL MODE</span>
          </span>
        );
      case 'heckle':
        return (
          <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] font-mono font-bold flex items-center gap-1">
            <ShieldAlert className="w-2.5 h-2.5" />
            <span>HECKLE</span>
          </span>
        );
      case 'crowd_reaction':
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-mono font-bold flex items-center gap-1">
            <Users className="w-2.5 h-2.5" />
            <span>CROWD</span>
          </span>
        );
      case 'roast':
        return (
          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-mono font-bold flex items-center gap-1">
            <Flame className="w-2.5 h-2.5 text-orange-400" />
            <span>ROAST RETORT</span>
          </span>
        );
      case 'act_change':
        return (
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[9px] font-mono font-bold flex items-center gap-1">
            <Activity className="w-2.5 h-2.5" />
            <span>ACT SHIFT</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-[9px] font-mono">
            {event.type}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="bg-[#0e0e13] border border-white/15 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white uppercase tracking-wider">
                  Performance Session History Log
                </h2>
                <span className="px-2 py-0.5 rounded bg-white/10 text-[9px] font-mono text-white/60">
                  JSON EXPORT READY
                </span>
              </div>
              <p className="text-[11px] font-mono text-white/50">
                Chronological ledger of audience reactions, heckles deflected & comedic pacing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportSessionToJsonFile(sessionData)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:scale-105 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={handleCopyJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs border border-white/10 transition-all"
              title="Copy raw JSON payload to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 p-4 bg-black/60 border-b border-white/10 text-center font-mono">
          <div className="p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="text-[9px] text-white/40 uppercase">Total Events</div>
            <div className="text-base font-bold text-white mt-0.5">{sessionData.stats.totalEvents}</div>
          </div>
          <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="text-[9px] text-red-300 uppercase">Heckles Deflected</div>
            <div className="text-base font-bold text-red-400 mt-0.5">{sessionData.stats.hecklesHandled}</div>
          </div>
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="text-[9px] text-amber-300 uppercase">Crowd Reactions</div>
            <div className="text-base font-bold text-amber-400 mt-0.5">{sessionData.stats.crowdReactionsTriggered}</div>
          </div>
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="text-[9px] text-emerald-300 uppercase">Laughter / Cheers</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5">
              {sessionData.stats.laughterCount + sessionData.stats.cheerCount}
            </div>
          </div>
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <div className="text-[9px] text-purple-300 uppercase">Final Composure</div>
            <div className="text-base font-bold text-purple-400 mt-0.5">{sessionData.finalComposure}%</div>
          </div>
          <div className="p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="text-[9px] text-white/40 uppercase">Performer</div>
            <div className="text-xs font-bold text-white mt-1 truncate">{sessionData.performer}</div>
          </div>
        </div>

        {/* View Mode Tabs & Filters */}
        <div className="px-6 py-2.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                viewMode === 'timeline'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Visual Timeline ({filteredTimeline.length})</span>
            </button>

            <button
              onClick={() => setViewMode('raw_json')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                viewMode === 'raw_json'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>Raw JSON Object</span>
            </button>
          </div>

          {viewMode === 'timeline' && (
            <div className="flex items-center gap-1 overflow-x-auto text-[10px] font-mono">
              {(['all', 'heckle', 'crowd_reaction', 'roast', 'act_change'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-2 py-0.5 rounded capitalize transition-all ${
                    filterType === type
                      ? 'bg-white/20 text-white font-bold'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  {type.replace('_', ' ')}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {viewMode === 'raw_json' ? (
            <div className="relative">
              <pre className="p-4 rounded-xl bg-black/80 border border-white/10 font-mono text-xs text-amber-300/90 leading-relaxed overflow-x-auto select-text max-h-[420px]">
                {JSON.stringify(sessionData, null, 2)}
              </pre>
            </div>
          ) : filteredTimeline.length === 0 ? (
            <div className="text-center py-16 text-white/40 font-mono text-xs space-y-2">
              <Activity className="w-8 h-8 text-white/20 mx-auto mb-2 animate-pulse" />
              <p>No events recorded in this session yet.</p>
              <p className="text-[10px] text-white/30">
                Trigger hecklers or audience reactions during the pitch to build the performance timeline.
              </p>
            </div>
          ) : (
            <div className="relative border-l-2 border-white/10 ml-4 pl-4 space-y-4 font-mono">
              <AnimatePresence initial={false}>
                {filteredTimeline.map((evt, idx) => (
                  <motion.div 
                    key={evt.id} 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} // smooth GSAP-like spring/ease
                    className="relative group"
                  >
                    {/* Timeline dot */}
                    <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-amber-500 border-2 border-black" />

                    <div className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/15 transition-all text-left space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {getEventBadge(evt)}
                          <span className="text-xs font-bold text-white">{evt.label}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-white/40">
                          <span>Composure: {evt.composure}%</span>
                          <span>•</span>
                          <span>{evt.timeFormatted}</span>
                        </div>
                      </div>

                      {evt.details && (
                        <div className="flex gap-3 pl-1">
                          {evt.type === 'heckle' && evt.metadata?.personaId && (
                            <div className="shrink-0 w-12 h-12 rounded-lg border-2 border-red-500/30 overflow-hidden bg-black shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                              <img 
                                src={getHecklerPersona(evt.metadata.personaId as HecklerPersonaId).imageUrl} 
                                alt="Persona" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <p className={`text-xs text-white/70 font-light leading-relaxed ${evt.type === 'heckle' ? 'pt-1' : ''}`}>
                            "{evt.details}"
                          </p>
                        </div>
                      )}

                      {evt.metadata && Object.keys(evt.metadata).length > 0 && (
                        <div className="pt-1 text-[9px] text-white/40 flex flex-wrap gap-2">
                          {Object.entries(evt.metadata).map(([k, v]) => (
                            <span key={k} className="px-1.5 py-0.5 rounded bg-black/40 border border-white/5">
                              {k}: {String(v)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs font-mono">
          <button
            onClick={() => {
              if (window.confirm('Reset performance session log history?')) {
                onClearSession();
              }
            }}
            className="flex items-center gap-1.5 text-red-400/70 hover:text-red-400 transition-colors text-[11px]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Session History</span>
          </button>

          <div className="text-[10px] text-white/40 flex items-center gap-1.5">
            <span>Session ID:</span>
            <span className="font-bold text-white/60">{sessionData.sessionId}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SessionLogModal;
