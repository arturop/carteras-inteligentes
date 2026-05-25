import type { AppState } from '../app/appState';

const STORAGE_KEY = 'carteras-inteligentes-plan-v1';

export function savePlan(state: AppState): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadPlan(): AppState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppState;
  } catch {
    return null;
  }
}

export function clearPlan(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}

export function exportPlanJson(state: AppState): string {
  return JSON.stringify({ exportedAt: new Date().toISOString(), app: 'Carteras Inteligentes', version: 1, state }, null, 2);
}

export function importPlanJson(raw: string): AppState | null {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.state && parsed.state.profile && Array.isArray(parsed.state.holdings)) {
      return parsed.state as AppState;
    }
    return null;
  } catch {
    return null;
  }
}
