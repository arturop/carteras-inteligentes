import type { Holding } from './portfolio';
import { allocationBy, portfolioTotal, weightedAnnualCost } from './portfolio';

export interface SpainWarning {
  level: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
}

export function buildSpainWarnings(holdings: Holding[]): SpainWarning[] {
  const warnings: SpainWarning[] = [];
  const total = portfolioTotal(holdings);
  const cost = weightedAnnualCost(holdings);

  if (total === 0) {
    return [{ level: 'info', title: 'Sin cartera', message: 'Introduce al menos una posición para generar avisos.' }];
  }

  const etfOrStock = holdings.filter((holding) => holding.productType === 'etf' || holding.productType === 'accion');
  if (etfOrStock.length > 0) {
    warnings.push({
      level: 'warning',
      title: 'Fiscalidad al vender',
      message: 'ETFs y acciones pueden generar tributación al vender. En España, los traspasos fiscales suelen ser más flexibles entre fondos de inversión traspasables.',
    });
  }

  const nonEuro = allocationBy(holdings, 'currency').filter((line) => line.key !== 'EUR').reduce((sum, line) => sum + line.percent, 0);
  if (nonEuro > 30) {
    warnings.push({
      level: 'warning',
      title: 'Exposición a divisa',
      message: 'Más del 30% de la cartera está en divisas distintas del euro. Revisa si ese riesgo encaja con tus objetivos.',
    });
  }

  const spainExposure = allocationBy(holdings, 'region').find((line) => line.key === 'España')?.percent ?? 0;
  if (spainExposure > 25) {
    warnings.push({
      level: 'warning',
      title: 'Sesgo doméstico',
      message: 'La exposición a España supera el 25%. Puede tener sentido, pero revisa concentración geográfica y laboral/patrimonial.',
    });
  }

  if (cost > 0.75) {
    warnings.push({
      level: 'critical',
      title: 'Costes elevados',
      message: 'El coste medio ponderado supera el 0,75% anual. Los costes compuestos reducen mucho el resultado a largo plazo.',
    });
  } else if (cost > 0.35) {
    warnings.push({
      level: 'warning',
      title: 'Costes revisables',
      message: 'El coste medio ponderado está por encima de alternativas indexadas baratas. Revisa TER, custodia y cambio de divisa.',
    });
  }

  const largest = holdings.reduce((max, holding) => (holding.amount > max.amount ? holding : max), holdings[0]);
  if (largest && (largest.amount / total) * 100 > 35) {
    warnings.push({
      level: 'warning',
      title: 'Concentración',
      message: 'La posición más grande representa más del 35% de la cartera: ' + largest.name + '.',
    });
  }

  warnings.push({
    level: 'info',
    title: 'Herramienta educativa',
    message: 'Esto no es asesoramiento financiero personalizado. Antes de operar, revisa fiscalidad, costes y adecuación a tu situación.',
  });

  return warnings;
}
