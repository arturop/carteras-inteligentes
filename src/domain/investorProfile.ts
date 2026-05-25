export type InvestorExperience = 'principiante' | 'intermedio' | 'avanzado';
export type DrawdownTolerance = 'baja' | 'media' | 'alta' | 'muy-alta';
export type IncomeStability = 'baja' | 'media' | 'alta';

export interface InvestorProfile {
  age: number;
  horizonYears: number;
  monthlyContribution: number;
  emergencyFundMonths: number;
  drawdownTolerance: DrawdownTolerance;
  incomeStability: IncomeStability;
  experience: InvestorExperience;
  prefersFunds: boolean;
}

export interface RiskAssessment {
  label: 'Conservador' | 'Moderado' | 'Dinámico' | 'Agresivo';
  equityTarget: number;
  bondTarget: number;
  cashTarget: number;
  maxSuggestedDrawdown: string;
  notes: string[];
}

export const defaultProfile: InvestorProfile = {
  age: 45,
  horizonYears: 15,
  monthlyContribution: 500,
  emergencyFundMonths: 6,
  drawdownTolerance: 'media',
  incomeStability: 'media',
  experience: 'intermedio',
  prefersFunds: true,
};

export function assessInvestorRisk(profile: InvestorProfile): RiskAssessment {
  let score = 0;

  if (profile.horizonYears >= 20) score += 3;
  else if (profile.horizonYears >= 10) score += 2;
  else if (profile.horizonYears >= 5) score += 1;

  if (profile.drawdownTolerance === 'muy-alta') score += 3;
  if (profile.drawdownTolerance === 'alta') score += 2;
  if (profile.drawdownTolerance === 'media') score += 1;

  if (profile.incomeStability === 'alta') score += 1;
  if (profile.incomeStability === 'baja') score -= 1;

  if (profile.emergencyFundMonths < 3) score -= 2;
  if (profile.age > 60) score -= 1;
  if (profile.age < 35) score += 1;
  if (profile.experience === 'principiante') score -= 1;
  if (profile.experience === 'avanzado') score += 1;

  const notes: string[] = [];
  if (profile.emergencyFundMonths < 3) {
    notes.push('Antes de aumentar riesgo, refuerza el colchón de liquidez.');
  }
  if (profile.horizonYears < 5) {
    notes.push('Horizonte corto: conviene limitar renta variable y activos volátiles.');
  }
  if (profile.prefersFunds) {
    notes.push('Para inversores en España, los fondos traspasables pueden reducir fricción fiscal al rebalancear.');
  }

  if (score <= 1) {
    return {
      label: 'Conservador',
      equityTarget: 30,
      bondTarget: 55,
      cashTarget: 15,
      maxSuggestedDrawdown: '10–15%',
      notes,
    };
  }
  if (score <= 4) {
    return {
      label: 'Moderado',
      equityTarget: 55,
      bondTarget: 35,
      cashTarget: 10,
      maxSuggestedDrawdown: '20–25%',
      notes,
    };
  }
  if (score <= 7) {
    return {
      label: 'Dinámico',
      equityTarget: 75,
      bondTarget: 20,
      cashTarget: 5,
      maxSuggestedDrawdown: '30–35%',
      notes,
    };
  }
  return {
    label: 'Agresivo',
    equityTarget: 90,
    bondTarget: 5,
    cashTarget: 5,
    maxSuggestedDrawdown: '40% o más',
    notes,
  };
}
