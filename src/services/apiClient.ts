// Centralized Master API Gateway Client (/api/v1)

export interface SystemHealthResponse {
  status: string;
  uptime: number;
  timestamp: string;
  environment: string;
  nodeVersion: string;
  platform: string;
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
    arrayBuffers: number;
  };
  gateway: string;
}

export interface SystemMetricsResponse {
  status: string;
  uptimeSeconds: number;
  memoryHeapUsedMB: number;
  memoryHeapTotalMB: number;
  memoryRssMB: number;
  activeConnections: number;
  gateway: string;
  securityControls: {
    helmetActive: boolean;
    rateLimiterActive: boolean;
    corsActive: boolean;
    bodyLimitMB: number;
  };
}

export interface AiGenerateResponse {
  success: boolean;
  text: string;
  simulated?: boolean;
  quotaExhausted?: boolean;
  error?: string;
}

export async function fetchSystemHealth(): Promise<{ data?: SystemHealthResponse; latencyMs: number; error?: string }> {
  const start = performance.now();
  try {
    const res = await fetch('/api/v1/system/health');
    const latencyMs = Math.round(performance.now() - start);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to fetch health' }));
      return { latencyMs, error: err.error || `HTTP ${res.status}` };
    }
    const data = await res.json();
    return { data, latencyMs };
  } catch (err: any) {
    return { latencyMs: Math.round(performance.now() - start), error: err?.message || 'Network error' };
  }
}

export async function fetchSystemMetrics(): Promise<{ data?: SystemMetricsResponse; latencyMs: number; error?: string }> {
  const start = performance.now();
  try {
    const res = await fetch('/api/v1/system/metrics');
    const latencyMs = Math.round(performance.now() - start);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to fetch metrics' }));
      return { latencyMs, error: err.error || `HTTP ${res.status}` };
    }
    const data = await res.json();
    return { data, latencyMs };
  } catch (err: any) {
    return { latencyMs: Math.round(performance.now() - start), error: err?.message || 'Network error' };
  }
}

export async function generateAiContent(
  prompt: string,
  model = 'gemini-3.8-flash'
): Promise<{ data?: AiGenerateResponse; latencyMs: number; error?: string }> {
  const start = performance.now();
  try {
    const res = await fetch('/api/v1/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, model }),
    });
    const latencyMs = Math.round(performance.now() - start);
    const data = await res.json();
    if (!res.ok) {
      return { latencyMs, error: data.error || data.message || `HTTP ${res.status}` };
    }
    return { data, latencyMs };
  } catch (err: any) {
    return { latencyMs: Math.round(performance.now() - start), error: err?.message || 'Network error' };
  }
}
