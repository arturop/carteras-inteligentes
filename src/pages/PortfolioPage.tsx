import type { Holding } from '../domain/portfolio';
import { allocationBy, portfolioTotal, weightedAnnualCost } from '../domain/portfolio';
import { formatAssetClass } from '../domain/allocation';
import { Card } from '../components/Card';
import { AllocationChart } from '../components/AllocationChart';

interface PortfolioPageProps {
  holdings: Holding[];
  onChange: (holdings: Holding[]) => void;
  onNext: () => void;
}

export function PortfolioPage({ holdings, onChange, onNext }: PortfolioPageProps) {
  const total = portfolioTotal(holdings);
  const assetAllocation = allocationBy(holdings, 'assetClass');
  const currencyAllocation = allocationBy(holdings, 'currency');
  const cost = weightedAnnualCost(holdings);

  function updateHolding(id: string, patch: Partial<Holding>) {
    onChange(holdings.map((holding) => (holding.id === id ? { ...holding, ...patch } : holding)));
  }

  function addHolding() {
    onChange([
      ...holdings,
      {
        id: 'holding-' + Date.now(),
        name: 'Nueva posición',
        productType: 'fondo',
        assetClass: 'renta-variable',
        amount: 1000,
        currency: 'EUR',
        region: 'Global',
        annualCostPct: 0.25,
      },
    ]);
  }

  function removeHolding(id: string) {
    onChange(holdings.filter((holding) => holding.id !== id));
  }

  return (
    <div className="page-stack">
      <div className="page-heading">
        <p className="eyebrow">Paso 2</p>
        <h2>Cartera actual</h2>
        <p>Introduce posiciones aproximadas. Para el MVP basta con importes y grandes categorías.</p>
      </div>

      <Card title="Posiciones" subtitle="Introduce cada fondo, ETF, acción o posición que tengas. No necesitas ser exacto: aproximaciones razonables son suficientes para el diagnóstico.">
        <div className="holdings-list">
          {holdings.map((holding) => (
            <div className="holding-row" key={holding.id}>
              <input aria-label="Nombre" placeholder="Ej: Indexa Capital RV Global" value={holding.name} onChange={(event) => updateHolding(holding.id, { name: event.target.value })} />
              <select value={holding.assetClass} onChange={(event) => updateHolding(holding.id, { assetClass: event.target.value as Holding['assetClass'] })}>
                <option value="renta-variable">Renta variable</option>
                <option value="renta-fija">Renta fija</option>
                <option value="monetario-liquidez">Monetario / liquidez</option>
                <option value="inmobiliario">Inmobiliario</option>
                <option value="otros">Otros</option>
              </select>
              <select value={holding.productType} onChange={(event) => updateHolding(holding.id, { productType: event.target.value as Holding['productType'] })}>
                <option value="fondo">Fondo</option>
                <option value="etf">ETF</option>
                <option value="accion">Acción</option>
                <option value="plan-pensiones">Plan pensiones</option>
                <option value="cash">Cash</option>
                <option value="otro">Otro</option>
              </select>
              <input aria-label="Importe" type="number" min="0" placeholder="0" value={holding.amount} onChange={(event) => updateHolding(holding.id, { amount: Number(event.target.value) })} />
              <input aria-label="Coste anual" type="number" min="0" step="0.01" placeholder="0.20" value={holding.annualCostPct} onChange={(event) => updateHolding(holding.id, { annualCostPct: Number(event.target.value) })} />
              <button className="ghost-button" type="button" onClick={() => removeHolding(holding.id)}>Eliminar</button>
            </div>
          ))}
        </div>
        <button className="secondary-button" onClick={addHolding} type="button">Añadir posición</button>
        <p className="card-body" style={{ marginTop: 12 }}>El coste anual es el TER del fondo o ETF más los costes de custodia y cambio de divisa si los tienes. Si no lo sabes, puedes dejarlo en 0 y revisarlo después.</p>
      </Card>

      <div className="two-column">
        <Card title="Resumen">
          <p><strong>Total:</strong> {Math.round(total).toLocaleString('es-ES')} €</p>
          <p><strong>Coste medio ponderado:</strong> {cost.toFixed(2)}% anual</p>
          <AllocationChart data={assetAllocation} title="Por tipo de activo" />
          <ul className="metric-list">
            {assetAllocation.map((line) => <li key={line.key}><span>{formatAssetClass(line.key)}</span><strong>{line.percent.toFixed(1)}%</strong></li>)}
          </ul>
        </Card>
        <Card title="Divisas">
          <ul className="metric-list">
            {currencyAllocation.map((line) => <li key={line.key}><span>{line.key}</span><strong>{line.percent.toFixed(1)}%</strong></li>)}
          </ul>
          <button className="primary-button" onClick={onNext} type="button">Ver cartera objetivo</button>
        </Card>
      </div>
    </div>
  );
}
