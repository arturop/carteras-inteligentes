import { describe, expect, it } from 'vitest';
import { compareBenchmarks, projectPortfolio, benchmarks } from './assumptions';

describe('compareBenchmarks', () => {
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

  it('returns projections for all benchmarks', () => {
    const userProjection = projectPortfolio(50000, targets, assumptions, 6000, 0);
    const comparison = compareBenchmarks(userProjection, 'Mi cartera', '#000', 50000, assumptions, 6000, 0);
    expect(comparison.benchmarks).toHaveLength(benchmarks.length);
  });

  it('all-equity outperforms user portfolio with high equity allocation', () => {
    const userProjection = projectPortfolio(50000, targets, assumptions, 6000, 0);
    const comparison = compareBenchmarks(userProjection, 'Mi cartera', '#000', 50000, assumptions, 6000, 0);
    const allEquity = comparison.benchmarks.find((bp) => bp.benchmark.id === 'all-equity');
    const userFinal = userProjection.years[userProjection.years.length - 1].centralValue;
    const equityFinal = allEquity!.projection.years[allEquity!.projection.years.length - 1].centralValue;
    expect(equityFinal).toBeGreaterThan(userFinal);
  });

  it('all-bonds underperforms user portfolio with high equity allocation', () => {
    const userProjection = projectPortfolio(50000, targets, assumptions, 6000, 0);
    const comparison = compareBenchmarks(userProjection, 'Mi cartera', '#000', 50000, assumptions, 6000, 0);
    const allBonds = comparison.benchmarks.find((bp) => bp.benchmark.id === 'all-bonds');
    const userFinal = userProjection.years[userProjection.years.length - 1].centralValue;
    const bondsFinal = allBonds!.projection.years[allBonds!.projection.years.length - 1].centralValue;
    expect(bondsFinal).toBeLessThan(userFinal);
  });

  it('all-equity has higher drawdown than 60/40', () => {
    const userProjection = projectPortfolio(50000, targets, assumptions, 6000, 0);
    const comparison = compareBenchmarks(userProjection, 'Mi cartera', '#000', 50000, assumptions, 6000, 0);
    const allEquity = comparison.benchmarks.find((bp) => bp.benchmark.id === 'all-equity')!;
    const sixtyForty = comparison.benchmarks.find((bp) => bp.benchmark.id === 'sixty-forty')!;
    expect(allEquity.projection.maxDrawdownPct).toBeGreaterThanOrEqual(sixtyForty.projection.maxDrawdownPct);
  });

  it('preserves user projection in comparison result', () => {
    const userProjection = projectPortfolio(50000, targets, assumptions, 6000, 0);
    const comparison = compareBenchmarks(userProjection, 'Mi cartera', '#000', 50000, assumptions, 6000, 0);
    expect(comparison.userProjection).toEqual(userProjection);
    expect(comparison.userLabel).toBe('Mi cartera');
    expect(comparison.userColor).toBe('#000');
  });
});
