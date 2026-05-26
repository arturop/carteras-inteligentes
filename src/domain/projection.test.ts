import { describe, expect, it } from 'vitest';
import { projectPortfolio } from './assumptions';

describe('projectPortfolio', () => {
  const targets = [
    { assetClass: 'renta-variable', targetPercent: 55 },
    { assetClass: 'renta-fija', targetPercent: 35 },
    { assetClass: 'monetario-liquidez', targetPercent: 10 },
  ];

  const assumptions = {
    annualReturns: [
      { assetClass: 'renta-variable', label: 'Renta variable global', expectedRealReturnPct: 5.5, description: '' },
      { assetClass: 'renta-fija', label: 'Renta fija de calidad', expectedRealReturnPct: 1.5, description: '' },
      { assetClass: 'monetario-liquidez', label: 'Monetario / cash', expectedRealReturnPct: 0.0, description: '' },
      { assetClass: 'inmobiliario', label: 'Inmobiliario', expectedRealReturnPct: 3.0, description: '' },
      { assetClass: 'otros', label: 'Otros', expectedRealReturnPct: 2.0, description: '' },
    ],
    rebalanceThresholdPct: 5,
    highCostThresholdPct: 0.75,
    concentrationThresholdPct: 35,
    inflationPct: 2.5,
    yearsToProject: 10,
  };

  const retirementYears = assumptions.yearsToProject; // no decumulation in default tests

  it('returns one entry per projected year', () => {
    const result = projectPortfolio(50000, targets, assumptions, 0, 0, retirementYears);
    expect(result.years).toHaveLength(10);
    expect(result.years[0].year).toBe(1);
    expect(result.years[9].year).toBe(10);
  });

  it('optimistic value always exceeds central value', () => {
    const result = projectPortfolio(50000, targets, assumptions, 0, 0, retirementYears);
    result.years.forEach((year) => {
      expect(year.optimisticValue).toBeGreaterThan(year.centralValue);
    });
  });

  it('pessimistic value never exceeds central value', () => {
    const result = projectPortfolio(50000, targets, assumptions, 0, 0, retirementYears);
    result.years.forEach((year) => {
      expect(year.pessimisticValue).toBeLessThanOrEqual(year.centralValue);
    });
  });

  it('contributions accumulate over time', () => {
    const result = projectPortfolio(50000, targets, assumptions, 6000, 0, retirementYears);
    expect(result.years[0].contributionsValue).toBe(6000);
    expect(result.years[9].contributionsValue).toBe(60000);
  });

  it('detects a drawdown after a loss year', () => {
    const zeroReturnAssumptions = {
      ...assumptions,
      annualReturns: assumptions.annualReturns.map((r) => ({ ...r, expectedRealReturnPct: 0 })),
    };
    // With zero return and no contributions, value stays flat — no drawdown
    const flat = projectPortfolio(50000, targets, zeroReturnAssumptions, 0, 0, retirementYears);
    expect(flat.maxDrawdownPct).toBe(0);
  });

  it('reports independence year when spending target is reachable', () => {
    // 600k patrimonio, 12k/año aportación, 24k/año gasto → objetivo 600k (25×)
    const result = projectPortfolio(600000, targets, assumptions, 12000, 24000, retirementYears);
    expect(result.independenceYear.optimistic).not.toBeNull();
    expect(result.independenceYear.optimistic).toBeLessThanOrEqual(10);
  });

  it('reports null independence when spending is too high', () => {
    const result = projectPortfolio(50000, targets, assumptions, 0, 100000, retirementYears);
    expect(result.independenceYear.optimistic).toBeNull();
    expect(result.independenceYear.central).toBeNull();
    expect(result.independenceYear.pessimistic).toBeNull();
  });
});
