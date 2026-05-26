import { describe, expect, it } from 'vitest';
import { assessInvestorRisk } from './investorProfile';
import { allocationBy, portfolioTotal, sampleHoldings, weightedAnnualCost } from './portfolio';
import { targetAllocationFromRisk } from './allocation';
import { calculateRebalanceActions } from './rebalancing';
import { buildSpainWarnings } from './spainWarnings';

const holdings = sampleHoldings();

describe('portfolio domain', () => {
  it('calculates portfolio total', () => {
    expect(portfolioTotal(holdings)).toBe(55000);
  });

  it('calculates allocation by asset class', () => {
    const allocation = allocationBy(holdings, 'assetClass');
    expect(allocation[0].key).toBe('renta-variable');
    expect(Math.round(allocation[0].percent)).toBe(64);
  });

  it('calculates weighted annual cost', () => {
    expect(weightedAnnualCost(holdings)).toBeGreaterThan(0.15);
    expect(weightedAnnualCost(holdings)).toBeLessThan(0.25);
  });

  it('assigns a dynamic profile for long horizon and high tolerance', () => {
    const risk = assessInvestorRisk({
      age: 40,
      horizonYears: 20,
      yearsToRetirement: 20,
      monthlyContribution: 1000,
      emergencyFundMonths: 6,
      drawdownTolerance: 'alta',
      incomeStability: 'alta',
      experience: 'intermedio',
      prefersFunds: true,
    });
    expect(risk.label).toBe('Dinámico');
    expect(risk.equityTarget).toBe(75);
  });

  it('creates target allocation from risk profile', () => {
    const risk = assessInvestorRisk({
      age: 45,
      horizonYears: 15,
      yearsToRetirement: 15,
      monthlyContribution: 500,
      emergencyFundMonths: 6,
      drawdownTolerance: 'media',
      incomeStability: 'media',
      experience: 'intermedio',
      prefersFunds: true,
    });
    const target = targetAllocationFromRisk(risk);
    expect(target.reduce((sum, line) => sum + line.targetPercent, 0)).toBe(100);
  });

  it('generates rebalance actions with threshold', () => {
    const target = targetAllocationFromRisk({
      label: 'Moderado',
      equityTarget: 55,
      bondTarget: 35,
      cashTarget: 10,
      maxSuggestedDrawdown: '20–25%',
      notes: [],
    });
    const actions = calculateRebalanceActions(holdings, target, 5);
    expect(actions.some((action) => action.action !== 'mantener')).toBe(true);
  });

  it('builds Spain-aware warnings', () => {
    const warnings = buildSpainWarnings(holdings);
    expect(warnings.some((warning) => warning.title === 'Herramienta educativa')).toBe(true);
  });
});
