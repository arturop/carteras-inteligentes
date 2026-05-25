import type { AppState } from '../app/appState';
import { defaultAssumptions } from '../domain/assumptions';

const STORAGE_KEY = 'carteras-inteligentes-plan-v1';

export function savePlan(state: AppState): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadPlan(): AppState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed.assumptions) {
      parsed.assumptions = defaultAssumptions;
    }
    return parsed;
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
      const state = parsed.state as AppState;
      if (!state.assumptions) {
        state.assumptions = defaultAssumptions;
      }
      return state;
    }
    return null;
  } catch {
    return null;
  }
}
