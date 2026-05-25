import type { InvestorProfile } from '../domain/investorProfile';
import { defaultProfile } from '../domain/investorProfile';
import type { Holding } from '../domain/portfolio';
import { sampleHoldings } from '../domain/portfolio';

export type StepId = 'inicio' | 'perfil' | 'cartera' | 'objetivo' | 'plan';

export interface AppState {
  currentStep: StepId;
  profile: InvestorProfile;
  holdings: Holding[];
}

export const initialAppState: AppState = {
  currentStep: 'inicio',
  profile: defaultProfile,
  holdings: sampleHoldings(),
};

export const steps: Array<{ id: StepId; label: string; description: string }> = [
  { id: 'inicio', label: 'Inicio', description: 'Privacidad y alcance' },
  { id: 'perfil', label: 'Perfil', description: 'Riesgo y horizonte' },
  { id: 'cartera', label: 'Cartera actual', description: 'Posiciones y exposición' },
  { id: 'objetivo', label: 'Cartera objetivo', description: 'Asignación estratégica' },
  { id: 'plan', label: 'Plan', description: 'Acciones y rebalanceo' },
];

export function nextStep(step: StepId): StepId {
  const index = steps.findIndex((item) => item.id === step);
  return steps[Math.min(index + 1, steps.length - 1)].id;
}

export function previousStep(step: StepId): StepId {
  const index = steps.findIndex((item) => item.id === step);
  return steps[Math.max(index - 1, 0)].id;
}
