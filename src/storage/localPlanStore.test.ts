import { describe, expect, it } from 'vitest';
import { exportPlanJson, importPlanJson } from './localPlanStore';
import { defaultProfile } from '../domain/investorProfile';
import { sampleHoldings } from '../domain/portfolio';
import { defaultAssumptions } from '../domain/assumptions';
import type { AppState } from '../app/appState';

const sampleState: AppState = {
  currentStep: 'perfil',
  profile: defaultProfile,
  holdings: sampleHoldings(),
  assumptions: defaultAssumptions,
  annualContribution: 0,
  annualSpend: 0,
};

describe('plan import/export', () => {
  it('exports a JSON string with state', () => {
    const json = exportPlanJson(sampleState);
    const parsed = JSON.parse(json);
    expect(parsed.state.profile.age).toBe(defaultProfile.age);
    expect(parsed.state.holdings.length).toBe(3);
    expect(parsed.state.assumptions.rebalanceThresholdPct).toBe(5);
  });

  it('imports a valid exported JSON', () => {
    const json = exportPlanJson(sampleState);
    const imported = importPlanJson(json);
    expect(imported).not.toBeNull();
    expect(imported!.profile.age).toBe(defaultProfile.age);
    expect(imported!.holdings.length).toBe(3);
    expect(imported!.assumptions.annualReturns.length).toBe(5);
  });

  it('rejects invalid JSON', () => {
    expect(importPlanJson('not json')).toBeNull();
  });

  it('rejects JSON without state', () => {
    expect(importPlanJson('{"foo":"bar"}')).toBeNull();
  });

  it('rejects state without holdings', () => {
    expect(importPlanJson('{"state":{"profile":{"age":45},"currentStep":"inicio"}}')).toBeNull();
  });

  it('adds default assumptions to imported state without them', () => {
    const legacyState = { currentStep: 'inicio', profile: defaultProfile, holdings: sampleHoldings() };
    const json = JSON.stringify({ state: legacyState });
    const imported = importPlanJson(json);
    expect(imported).not.toBeNull();
    expect(imported!.assumptions).toBeDefined();
    expect(imported!.assumptions.rebalanceThresholdPct).toBe(5);
  });
});
