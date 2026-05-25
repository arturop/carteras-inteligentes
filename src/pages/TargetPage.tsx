import type { InvestorProfile } from '../domain/investorProfile';
import { assessInvestorRisk } from '../domain/investorProfile';
import type { Holding } from '../domain/portfolio';
import { portfolioTotal } from '../domain/portfolio';
import { formatAssetClass, targetAllocationFromRisk, targetAmount } from '../domain/allocation';
import { calculateRebalanceActions } from '../domain/rebalancing';
import { Card } from '../components/Card';
import { AllocationChart } from '../components/AllocationChart';

interface TargetPageProps {
  profile: InvestorProfile;
  holdings: Holding[];
  onNext: () => void;
}

export function TargetPage({ profile, holdings, onNext }: TargetPageProps) {
  const risk = assessInvestorRisk(profile);
  const targets = targetAllocationFromRisk(risk);
  const total = portfolioTotal(holdings);
  const actions = calculateRebalanceActions(holdings, targets);

  return (
    <div className="page-stack">
      <div className="page-heading">
        <p className="eyebrow">Paso 3</p>
        <h2>Cartera objetivo</h2>
        <p>Una asignación estratégica sencilla, robusta y rebalanceable para tu perfil.</p>
      </div>

      <Card title={'Perfil ' + risk.label} tone="highlight">
        <div className="target-big">{risk.equityTarget}% RV · {risk.bondTarget}% RF · {risk.cashTarget}% liquidez</div>
        <p>Renta variable / renta fija / liquidez</p>
        <p>Caída temporal dolorosa orientativa: <strong>{risk.maxSuggestedDrawdown}</strong></p>
        <p className="card-body">Esta es una estimación de la caída que podrías ver en un mal año. No es una predicción: es una referencia para que decidas si puedes dormir tranquilo con esta cartera.</p>
      </Card>

      <div className="grid-3">
        {targets.map((target) => (
          <Card key={target.assetClass} title={target.label}>
            <div className="target-percent">{target.targetPercent}%</div>
            <p>{target.rationale}</p>
            <p><strong>Importe objetivo:</strong> {Math.round(targetAmount(total, target.targetPercent)).toLocaleString('es-ES')} €</p>
          </Card>
        ))}
      </div>

      <Card title="Diferencia frente a cartera actual">
        <AllocationChart
          data={targets.map((t) => ({ key: t.assetClass, amount: targetAmount(total, t.targetPercent), percent: t.targetPercent }))}
          title="Asignación objetivo"
        />
        <ul className="metric-list">
          {actions.map((action) => (
            <li key={action.assetClass}>
              <span>{formatAssetClass(action.assetClass)} · actual {action.currentPercent.toFixed(1)}% / objetivo {action.targetPercent.toFixed(1)}%</span>
              <strong>{action.action === 'mantener' ? 'Mantener' : action.action === 'comprar' ? 'Aumentar' : 'Reducir'}</strong>
            </li>
          ))}
        </ul>
        <button className="primary-button" onClick={onNext} type="button">Generar plan de acción</button>
      </Card>
    </div>
  );
}
