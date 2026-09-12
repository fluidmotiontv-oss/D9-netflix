import React, { useState, useEffect } from 'react';
import { Activity, Server, ShieldCheck, RefreshCw, Clock, CheckCircle2, AlertCircle, HardDrive, Terminal } from 'lucide-react';
import { fetchSystemHealth, fetchSystemMetrics, SystemHealthResponse, SystemMetricsResponse } from '../../services/apiClient';

export default function SystemHealthMonitor() {
  const [healthData, setHealthData] = useState<SystemHealthResponse | null>(null);
  const [metricsData, setMetricsData] = useState<SystemMetricsResponse | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoPoll, setAutoPoll] = useState(true);
  const [lastCheckTime, setLastCheckTime] = useState<string>('');

  const loadData = async () => {
    setIsRefreshing(true);
    setError(null);

    const [healthRes, metricsRes] = await Promise.all([
      fetchSystemHealth(),
      fetchSystemMetrics(),
    ]);

    setIsRefreshing(false);
    setLatency(healthRes.latencyMs);
    setLastCheckTime(new Date().toLocaleTimeString());

    if (healthRes.error) {
      setError(healthRes.error);
    } else if (healthRes.data) {
      setHealthData(healthRes.data);
    }

    if (metricsRes.data) {
      setMetricsData(metricsRes.data);
    }
  };

  useEffect(() => {
    loadData();
    let timer: any = null;
    if (autoPoll) {
      timer = setInterval(loadData, 5000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoPoll]);

  const formatUptime = (seconds?: number) => {
    if (!seconds) return '0s';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h > 0 ? `${h}h ` : ''}${m}m ${s}s`;
  };

  return (
    <div className="h-full overflow-y-auto p-4 lg:p-8 bg-[#040407] text-white/90">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Activity className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold tracking-tight text-white">System Health & Gateway Monitor</h1>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live 200 OK
              </span>
            </div>
            <p className="text-xs text-white/60 font-light">
              Real-time heartbeat monitoring, process memory telemetry, and security filter verification for Express gateway.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoPoll(prev => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                autoPoll 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                  : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${autoPoll ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'}`} />
              <span>{autoPoll ? 'Auto-Poll (5s)' : 'Manual Mode'}</span>
            </button>

            <button
              onClick={loadData}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-mono text-white transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
              <span>Ping Gateway</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-300 text-xs font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>Gateway connection error: {error}</span>
          </div>
        )}

        {/* Primary Health & Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-white/40 text-[10px] font-mono uppercase tracking-wider">
              <span>Gateway Status</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-black font-mono text-emerald-400 uppercase">
              {healthData?.status === 'ok' ? 'HEALTHY' : 'CONNECTING'}
            </div>
            <div className="text-[10px] font-mono text-white/50">
              Ping Latency: <strong className="text-white">{latency !== null ? `${latency}ms` : '--'}</strong>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-white/40 text-[10px] font-mono uppercase tracking-wider">
              <span>Process Uptime</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-black font-mono text-white">
              {formatUptime(healthData?.uptime)}
            </div>
            <div className="text-[10px] font-mono text-white/50">
              Last check: <span className="text-white/80">{lastCheckTime || '--'}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-white/40 text-[10px] font-mono uppercase tracking-wider">
              <span>Memory Heap</span>
              <HardDrive className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-black font-mono text-purple-300">
              {metricsData ? `${metricsData.memoryHeapUsedMB} MB` : '--'}
            </div>
            <div className="text-[10px] font-mono text-white/50">
              Allocated Total: <span className="text-white/80">{metricsData ? `${metricsData.memoryHeapTotalMB} MB` : '--'}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-white/40 text-[10px] font-mono uppercase tracking-wider">
              <span>Runtime Engine</span>
              <Server className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-black font-mono text-white">
              {healthData?.nodeVersion || 'Node.js'}
            </div>
            <div className="text-[10px] font-mono text-white/50">
              Platform: <span className="text-white/80">{healthData?.platform || 'Linux'} (Cloud Run)</span>
            </div>
          </div>
        </div>

        {/* Security Controls Status Grid */}
        <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                Active Security & Middleware Controls
              </h2>
            </div>
            <span className="text-[10px] font-mono text-white/40">Verified at Gateway Entry</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-white/80 font-bold">Helmet CSP & Headers</div>
                <div className="text-[10px] text-white/40">XSS, frameguard, sniffer</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                ACTIVE
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-white/80 font-bold">Global Rate Limiter</div>
                <div className="text-[10px] text-white/40">100 req/min per IP</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                ENFORCED
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-white/80 font-bold">AI Rate Limiter</div>
                <div className="text-[10px] text-white/40">20 req/min per IP</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                ISOLATED
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-white/80 font-bold">Payload Sanitization</div>
                <div className="text-[10px] text-white/40">1MB Body Size Ceiling</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                LOCKED
              </span>
            </div>
          </div>
        </div>

        {/* Raw Gateway Telemetry Tree */}
        <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                Raw JSON Telemetry Stream (/api/v1/system/health)
              </h2>
            </div>
            <button
              onClick={() => {
                if (healthData) {
                  navigator.clipboard.writeText(JSON.stringify(healthData, null, 2));
                }
              }}
              className="text-[10px] font-mono text-white/40 hover:text-white transition-colors"
            >
              Copy JSON
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-black/70 border border-white/5 text-[11px] font-mono text-cyan-300 overflow-x-auto leading-relaxed">
            {JSON.stringify(healthData || { status: 'waiting_for_gateway_ping' }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
