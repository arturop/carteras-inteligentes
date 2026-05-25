export interface AssetClassReturn {
  assetClass: string;
  label: string;
  expectedRealReturnPct: number;
  description: string;
}

export interface SimulationAssumptions {
  annualReturns: AssetClassReturn[];
  rebalanceThresholdPct: number;
  highCostThresholdPct: number;
  concentrationThresholdPct: number;
  inflationPct: number;
  yearsToProject: number;
}

export const defaultAssumptions: SimulationAssumptions = {
  annualReturns: [
    { assetClass: 'renta-variable', label: 'Renta variable global', expectedRealReturnPct: 5.5, description: 'Rentabilidad real histórica aproximada de un índice global diversificado.' },
    { assetClass: 'renta-fija', label: 'Renta fija de calidad', expectedRealReturnPct: 1.5, description: 'Bonos gobierno euro de calidad. Protege en crisis pero renta poco.' },
    { assetClass: 'monetario-liquidez', label: 'Monetario / cash', expectedRealReturnPct: 0.0, description: 'Cuenta corriente o monetario. No pierde nominal pero sí en inflación.' },
    { assetClass: 'inmobiliario', label: 'Inmobiliario', expectedRealReturnPct: 3.0, description: 'REITs o fondos inmobiliarios. Rentabilidad variable según ciclo.' },
    { assetClass: 'otros', label: 'Otros', expectedRealReturnPct: 2.0, description: 'Materias primas, oro, etc. Diversificador pero sin renta fija.' },
  ],
  rebalanceThresholdPct: 5,
  highCostThresholdPct: 0.75,
  concentrationThresholdPct: 35,
  inflationPct: 2.5,
  yearsToProject: 10,
};

export interface ScenarioResult {
  label: string;
  description: string;
  totalReturnPct: number;
  annualizedReturnPct: number;
  projectedValue: number;
  inflationAdjustedValue: number;
}

export function simulatePortfolio(
  currentValue: number,
  targetAllocation: Array<{ assetClass: string; targetPercent: number }>,
  assumptions: SimulationAssumptions,
): ScenarioResult[] {
  const weightedReturn = targetAllocation.reduce((sum, target) => {
    const assetReturn = assumptions.annualReturns.find((r) => r.assetClass === target.assetClass);
    const returnPct = assetReturn?.expectedRealReturnPct ?? 0;
    return sum + (target.targetPercent / 100) * returnPct;
  }, 0);

  const scenarios: Array<{ label: string; description: string; multiplier: number }> = [
    { label: 'Escenario pesimista', description: 'Rentabilidad real un 40% inferior a la esperada. Crisis prolongada, recuperación lenta.', multiplier: 0.6 },
    { label: 'Escenario central', description: 'Rentabilidad real cercana a la media histórica. Ni bonanza ni desastre.', multiplier: 1.0 },
    { label: 'Escenario optimista', description: 'Rentabilidad real un 30% superior. Crecimiento sólido, inflación controlada.', multiplier: 1.3 },
  ];

  return scenarios.map((scenario) => {
    const annualReturn = weightedReturn * scenario.multiplier;
    const years = assumptions.yearsToProject;
    const projectedValue = currentValue * Math.pow(1 + annualReturn / 100, years);
    const inflationAdjustedValue = projectedValue / Math.pow(1 + assumptions.inflationPct / 100, years);
    const totalReturnPct = ((projectedValue - currentValue) / currentValue) * 100;
    const annualizedReturnPct = (Math.pow(projectedValue / currentValue, 1 / years) - 1) * 100;

    return {
      label: scenario.label,
      description: scenario.description,
      totalReturnPct,
      annualizedReturnPct,
      projectedValue,
      inflationAdjustedValue,
    };
  });
}

export interface YearProjection {
  year: number;
  centralValue: number;
  optimisticValue: number;
  pessimisticValue: number;
  contributionsValue: number;
}

export interface ProjectionSummary {
  years: YearProjection[];
  maxDrawdownPct: number;
  annualContribution: number;
  annualSpend: number;
  independenceYear: { central: number | null; optimistic: number | null; pessimistic: number | null };
}

export function projectPortfolio(
  currentValue: number,
  targetAllocation: Array<{ assetClass: string; targetPercent: number }>,
  assumptions: SimulationAssumptions,
  annualContribution: number,
  annualSpend: number,
): ProjectionSummary {
  const weightedReturn = targetAllocation.reduce((sum, target) => {
    const assetReturn = assumptions.annualReturns.find((r) => r.assetClass === target.assetClass);
    const returnPct = assetReturn?.expectedRealReturnPct ?? 0;
    return sum + (target.targetPercent / 100) * returnPct;
  }, 0);

  const pessimisticReturn = weightedReturn * 0.6;
  const optimisticReturn = weightedReturn * 1.3;

  const years: YearProjection[] = [];
  let centralValue = currentValue;
  let optimisticValue = currentValue;
  let pessimisticValue = currentValue;
  let contributionsValue = 0;

  let peakValue = currentValue;
  let maxDrawdownPct = 0;

  const independenceYear: { central: number | null; optimistic: number | null; pessimistic: number | null } = {
    central: null,
    optimistic: null,
    pessimistic: null,
  };

  for (let year = 1; year <= assumptions.yearsToProject; year++) {
    contributionsValue += annualContribution;
    const totalCentral = centralValue + annualContribution - annualSpend;
    const totalOptimistic = optimisticValue + annualContribution - annualSpend;
    const totalPessimistic = pessimisticValue + annualContribution - annualSpend;

    centralValue = totalCentral * (1 + weightedReturn / 100);
    optimisticValue = totalOptimistic * (1 + optimisticReturn / 100);
    pessimisticValue = totalPessimistic * (1 + pessimisticReturn / 100);

    if (centralValue > peakValue) {
      peakValue = centralValue;
    }
    const drawdown = peakValue > 0 ? ((peakValue - centralValue) / peakValue) * 100 : 0;
    if (drawdown > maxDrawdownPct) {
      maxDrawdownPct = drawdown;
    }

    if (independenceYear.central === null && centralValue >= annualSpend * 25) {
      independenceYear.central = year;
    }
    if (independenceYear.optimistic === null && optimisticValue >= annualSpend * 25) {
      independenceYear.optimistic = year;
    }
    if (independenceYear.pessimistic === null && pessimisticValue >= annualSpend * 25) {
      independenceYear.pessimistic = year;
    }

    years.push({
      year,
      centralValue: Math.round(centralValue),
      optimisticValue: Math.round(optimisticValue),
      pessimisticValue: Math.round(pessimisticValue),
      contributionsValue: Math.round(contributionsValue),
    });
  }

  return {
    years,
    maxDrawdownPct: Math.round(maxDrawdownPct * 10) / 10,
    annualContribution,
    annualSpend,
    independenceYear,
  };
}

export function formatCurrency(value: number): string {
  return Math.round(value).toLocaleString('es-ES') + ' €';
}

export function formatPercent(value: number): string {
  return value.toFixed(1) + '%';
}
