import type { RiskAssessment } from './investorProfile';
import type { AllocationLine, AssetClass, Holding } from './portfolio';
import { allocationBy, portfolioTotal } from './portfolio';

export interface TargetAllocation {
  assetClass: AssetClass;
  label: string;
  targetPercent: number;
  rationale: string;
}

export function targetAllocationFromRisk(risk: RiskAssessment): TargetAllocation[] {
  return [
    {
      assetClass: 'renta-variable',
      label: 'Renta variable global',
      targetPercent: risk.equityTarget,
      rationale: 'Motor de crecimiento a largo plazo, diversificado globalmente.',
    },
    {
      assetClass: 'renta-fija',
      label: 'Renta fija de calidad',
      targetPercent: risk.bondTarget,
      rationale: 'Estabilizador de cartera y fuente de liquidez para rebalancear.',
    },
    {
      assetClass: 'monetario-liquidez',
      label: 'Liquidez / monetarios',
      targetPercent: risk.cashTarget,
      rationale: 'Colchón operativo para evitar vender activos de riesgo en mal momento.',
    },
  ];
}

export function currentAssetAllocation(holdings: Holding[]): AllocationLine[] {
  return allocationBy(holdings, 'assetClass');
}

export function assetClassPercent(holdings: Holding[], assetClass: AssetClass): number {
  return currentAssetAllocation(holdings).find((line) => line.key === assetClass)?.percent ?? 0;
}

export function targetAmount(total: number, targetPercent: number): number {
  return (Math.max(0, total) * targetPercent) / 100;
}

export function formatAssetClass(assetClass: string): string {
  const labels: Record<string, string> = {
    'renta-variable': 'Renta variable',
    'renta-fija': 'Renta fija',
    'monetario-liquidez': 'Monetario / liquidez',
    inmobiliario: 'Inmobiliario',
    otros: 'Otros',
  };
  return labels[assetClass] ?? assetClass;
}

export function portfolioSummary(holdings: Holding[]) {
  return {
    total: portfolioTotal(holdings),
    byAssetClass: currentAssetAllocation(holdings),
    byCurrency: allocationBy(holdings, 'currency'),
    byProductType: allocationBy(holdings, 'productType'),
  };
}
