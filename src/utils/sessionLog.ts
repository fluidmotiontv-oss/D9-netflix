/**
 * Session Log & Performance History Utility
 * Records the chronological timeline of heckles, crowd reactions, act transitions, and performer roasts.
 */

export interface SessionTimelineEvent {
  id: string;
  timestamp: number;
  timeFormatted: string;
  type: 'heckle' | 'crowd_reaction' | 'roast' | 'act_change' | 'strain_change' | 'brutal_event' | 'meltdown' | 'politician_event';
  category?: string;
  label: string;
  details?: string;
  composure: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
  metadata?: Record<string, any>;
}

export interface PerformanceSessionData {
  sessionId: string;
  performer: string;
  sessionStartTime: number;
  sessionStartFormatted: string;
  lastUpdatedTime: number;
  activeStrain: string;
  currentRank: string;
  totalXp: number;
  finalComposure: number;
  stats: {
    totalEvents: number;
    hecklesHandled: number;
    crowdReactionsTriggered: number;
    laughterCount: number;
    applauseCount: number;
    booCount: number;
    cheerCount: number;
    gaspCount: number;
  };
  timeline: SessionTimelineEvent[];
}

const STORAGE_KEY = 'dragon9_performance_session_log_v1';

export function createNewSession(strainName: string = 'Cosmic OG', rankTitle: string = 'Timing Alchemist'): PerformanceSessionData {
  const now = Date.now();
  return {
    sessionId: `perf-session-${now}`,
    performer: 'Dragon 9',
    sessionStartTime: now,
    sessionStartFormatted: new Date(now).toISOString(),
    lastUpdatedTime: now,
    activeStrain: strainName,
    currentRank: rankTitle,
    totalXp: 450,
    finalComposure: 100,
    stats: {
      totalEvents: 0,
      hecklesHandled: 0,
      crowdReactionsTriggered: 0,
      laughterCount: 0,
      applauseCount: 0,
      booCount: 0,
      cheerCount: 0,
      gaspCount: 0,
    },
    timeline: [],
  };
}

export function loadSessionLog(): PerformanceSessionData {
  if (typeof window === 'undefined') return createNewSession();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to load session log:', e);
  }
  return createNewSession();
}

export function saveSessionLog(session: PerformanceSessionData): void {
  if (typeof window === 'undefined') return;
  try {
    session.lastUpdatedTime = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (e) {
    console.warn('Failed to save session log:', e);
  }
}

export function exportSessionToJsonFile(session: PerformanceSessionData): void {
  const jsonStr = JSON.stringify(session, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dragon9-performance-history-${new Date(session.sessionStartTime).toISOString().slice(0, 10)}-${session.sessionId.slice(-6)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
