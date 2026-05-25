import type { InvestorProfile } from '../domain/investorProfile';
import { defaultProfile } from '../domain/investorProfile';
import type { Holding } from '../domain/portfolio';
import { sampleHoldings } from '../domain/portfolio';
import type { SimulationAssumptions } from '../domain/assumptions';
import { defaultAssumptions } from '../domain/assumptions';

export type StepId = 'inicio' | 'perfil' | 'cartera' | 'supuestos' | 'objetivo' | 'plan';

export interface AppState {
  currentStep: StepId;
  profile: InvestorProfile;
  holdings: Holding[];
  assumptions: SimulationAssumptions;
}

export const initialAppState: AppState = {
  currentStep: 'inicio',
  profile: defaultProfile,
  holdings: sampleHoldings(),
  assumptions: defaultAssumptions,
};

export const steps: Array<{ id: StepId; label: string; description: string }> = [
  { id: 'inicio', label: 'Inicio', description: 'Privacidad y alcance' },
  { id: 'perfil', label: 'Perfil', description: 'Riesgo y horizonte' },
  { id: 'cartera', label: 'Cartera actual', description: 'Posiciones y exposición' },
  { id: 'supuestos', label: 'Supuestos', description: 'Rentabilidades y parámetros' },
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
