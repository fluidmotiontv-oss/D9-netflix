import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  Cpu, 
  BarChart3, 
  Activity, 
  ShieldCheck, 
  ChevronUp, 
  ChevronDown, 
  Sparkles,
  Maximize2,
  Globe,
  Film
} from 'lucide-react';
import Theater from '../Theater';
import AiIntelligenceHub from './AiIntelligenceHub';
import AnalyticsHub from './AnalyticsHub';
import SystemHealthMonitor from './SystemHealthMonitor';
import SecurityHardeningConsole from './SecurityHardeningConsole';
import LocalizationEngine from '../LocalizationEngine';
import VideoExportUtility from '../export/VideoExportUtility';
import { fetchSystemHealth } from '../../services/apiClient';

export type MasterModule = 'stage' | 'export' | 'localization' | 'ai' | 'analytics' | 'health' | 'security';

export default function MasterAppShell() {
  const [activeModule, setActiveModule] = useState<MasterModule>('stage');
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [gatewayStatus, setGatewayStatus] = useState<'online' | 'checking' | 'error'>('checking');
  const [gatewayLatency, setGatewayLatency] = useState<number | null>(null);

  useEffect(() => {
    // Initial and periodic quiet ping to verify gateway status
    const checkGateway = async () => {
      const { data, latencyMs, error } = await fetchSystemHealth();
      if (error || !data) {
        setGatewayStatus('error');
      } else {
        setGatewayStatus('online');
        setGatewayLatency(latencyMs);
      }
    };
    checkGateway();
    const timer = setInterval(checkGateway, 15000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'stage', label: 'Live Stage Special', icon: Tv, badge: '18-Min Apex' },
    { id: 'export', label: 'Video Export Studio', icon: Film, badge: '1m / 3m Clips' },
    { id: 'localization', label: 'Localization Engine', icon: Globe, badge: 'DE/ES/FR/JA' },
    { id: 'ai', label: 'AI Intelligence Engine', icon: Cpu, badge: 'Gemini v1' },
    { id: 'analytics', label: 'Analytics & Metrics', icon: BarChart3, badge: 'Telemetry' },
    { id: 'health', label: 'System Health', icon: Activity, badge: 'Heartbeat' },
    { id: 'security', label: 'Security Hardening', icon: ShieldCheck, badge: '18 Controls' },
  ] as const;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#020202] text-white select-none">
      {/* Collapsed HUD Pill for full-screen theater immersion */}
      {isNavCollapsed ? (
        <div className="fixed top-3 right-3 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 border border-white/20 backdrop-blur-md shadow-2xl">
          <div className="flex items-center gap-1.5 text-[10px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/80 font-bold uppercase">{activeModule}</span>
          </div>
          <div className="h-3 w-[1px] bg-white/20" />
          <button
            onClick={() => setIsNavCollapsed(false)}
            className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
            title="Expand Master Navigation Hub"
          >
            <ChevronDown className="w-3.5 h-3.5" />
            <span>Master HUD</span>
          </button>
        </div>
      ) : (
        /* Expanded Master Navigation Bar */
        <nav className="shrink-0 z-40 bg-black/90 border-b border-white/10 px-3 lg:px-6 py-2.5 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Gateway Telemetry */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                <Sparkles className="w-3.5 h-3.5 text-black font-black" />
              </div>
              <div>
                <span className="text-xs font-black tracking-wider uppercase bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                  MASTER UNIFIED
                </span>
                <span className="text-[9px] font-mono text-cyan-400 ml-1.5 px-1 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/30">
                  v1.0.0
                </span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
              <span className={`w-2 h-2 rounded-full ${gatewayStatus === 'online' ? 'bg-emerald-400 animate-pulse' : gatewayStatus === 'checking' ? 'bg-amber-400' : 'bg-red-400'}`} />
              <span className="text-white/60">
                {gatewayStatus === 'online' ? `GATEWAY: 200 OK (${gatewayLatency ?? 12}ms)` : 'GATEWAY: CHECKING'}
              </span>
            </div>
          </div>

          {/* Core Module Navigation Tabs */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto max-w-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id as MasterModule)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 text-white font-bold border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-300' : 'text-white/40'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="text-[8px] uppercase tracking-wider px-1 py-0.2 rounded bg-white/15 text-cyan-200 ml-0.5">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Tools: Fullscreen HUD Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNavCollapsed(true)}
              className="flex items-center gap-1 text-[10px] font-mono px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all"
              title="Minimize Header for Full-Screen Immersive Stage View"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Focus Stage</span>
            </button>
          </div>
        </nav>
      )}

      {/* Primary Application Workspace Content */}
      <main className="flex-1 w-full h-full overflow-hidden relative">
        {activeModule === 'stage' && <Theater />}
        {activeModule === 'export' && <VideoExportUtility isStandaloneView={true} />}
        {activeModule === 'localization' && <LocalizationEngine />}
        {activeModule === 'ai' && <AiIntelligenceHub />}
        {activeModule === 'analytics' && <AnalyticsHub />}
        {activeModule === 'health' && <SystemHealthMonitor />}
        {activeModule === 'security' && <SecurityHardeningConsole />}
      </main>
    </div>
  );
}
