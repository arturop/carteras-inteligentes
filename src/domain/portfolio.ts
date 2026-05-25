export type AssetClass = 'renta-variable' | 'renta-fija' | 'monetario-liquidez' | 'inmobiliario' | 'otros';
export type ProductType = 'fondo' | 'etf' | 'accion' | 'bono' | 'plan-pensiones' | 'deposito' | 'cash' | 'otro';

export interface Holding {
  id: string;
  name: string;
  productType: ProductType;
  assetClass: AssetClass;
  amount: number;
  currency: 'EUR' | 'USD' | 'GBP' | 'CHF' | 'OTHER';
  region: 'Global' | 'Europa' | 'España' | 'Estados Unidos' | 'Emergentes' | 'Otro';
  annualCostPct: number;
}

export interface AllocationLine {
  key: string;
  amount: number;
  percent: number;
}

export function portfolioTotal(holdings: Holding[]): number {
  return holdings.reduce((sum, holding) => sum + Math.max(0, holding.amount), 0);
}

export function allocationBy<K extends keyof Holding>(holdings: Holding[], key: K): AllocationLine[] {
  const total = portfolioTotal(holdings);
  const buckets = new Map<string, number>();

  holdings.forEach((holding) => {
    const bucket = String(holding[key]);
    buckets.set(bucket, (buckets.get(bucket) ?? 0) + Math.max(0, holding.amount));
  });

  return Array.from(buckets.entries())
    .map(([bucketKey, amount]) => ({
      key: bucketKey,
      amount,
      percent: total === 0 ? 0 : (amount / total) * 100,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function weightedAnnualCost(holdings: Holding[]): number {
  const total = portfolioTotal(holdings);
  if (total === 0) return 0;
  return holdings.reduce((sum, holding) => {
    return sum + (Math.max(0, holding.amount) / total) * Math.max(0, holding.annualCostPct);
  }, 0);
}

export function sampleHoldings(): Holding[] {
  return [
    {
      id: 'rv-global',
      name: 'Fondo indexado renta variable global',
      productType: 'fondo',
      assetClass: 'renta-variable',
      amount: 35000,
      currency: 'EUR',
      region: 'Global',
      annualCostPct: 0.18,
    },
    {
      id: 'rf-eur',
      name: 'Fondo renta fija euro corto plazo',
      productType: 'fondo',
      assetClass: 'renta-fija',
      amount: 15000,
      currency: 'EUR',
      region: 'Europa',
      annualCostPct: 0.22,
    },
    {
      id: 'cash',
      name: 'Liquidez / monetario',
      productType: 'cash',
      assetClass: 'monetario-liquidez',
      amount: 5000,
      currency: 'EUR',
      region: 'España',
      annualCostPct: 0,
    },
  ];
}
