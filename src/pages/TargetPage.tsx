import type { InvestorProfile } from '../domain/investorProfile';
import { assessInvestorRisk } from '../domain/investorProfile';
import type { Holding } from '../domain/portfolio';
import { portfolioTotal } from '../domain/portfolio';
import { formatAssetClass, targetAllocationFromRisk, targetAmount } from '../domain/allocation';
import { calculateRebalanceActions } from '../domain/rebalancing';
import { Card } from '../components/Card';

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
        <p>Caída temporal dolorosa orientativa: <strong>{risk.maxSuggestedDrawdown}</strong></p>
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
