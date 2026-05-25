import type { Holding } from './portfolio';
import { portfolioTotal } from './portfolio';
import type { TargetAllocation } from './allocation';
import { assetClassPercent, targetAmount } from './allocation';

export interface RebalanceAction {
  assetClass: string;
  currentPercent: number;
  targetPercent: number;
  driftPercent: number;
  targetAmount: number;
  actionAmount: number;
  action: 'comprar' | 'vender' | 'mantener';
}

export function calculateRebalanceActions(
  holdings: Holding[],
  targets: TargetAllocation[],
  thresholdPct = 5,
): RebalanceAction[] {
  const total = portfolioTotal(holdings);

  return targets.map((target) => {
    const currentPercent = assetClassPercent(holdings, target.assetClass);
    const driftPercent = currentPercent - target.targetPercent;
    const desiredAmount = targetAmount(total, target.targetPercent);
    const currentAmount = targetAmount(total, currentPercent);
    const actionAmount = desiredAmount - currentAmount;
    const action = Math.abs(driftPercent) < thresholdPct ? 'mantener' : actionAmount > 0 ? 'comprar' : 'vender';

    return {
      assetClass: target.assetClass,
      currentPercent,
      targetPercent: target.targetPercent,
      driftPercent,
      targetAmount: desiredAmount,
      actionAmount: Math.abs(actionAmount),
      action,
    };
  });
}

export function rebalanceNarrative(actions: RebalanceAction[]): string[] {
  return actions.map((item) => {
    if (item.action === 'mantener') {
      return 'Mantener ' + item.assetClass + ': está dentro de la banda de tolerancia.';
    }
    const verb = item.action === 'comprar' ? 'Aumentar' : 'Reducir';
    return verb + ' ' + item.assetClass + ' aproximadamente ' + Math.round(item.actionAmount).toLocaleString('es-ES') + ' €.';
  });
}
