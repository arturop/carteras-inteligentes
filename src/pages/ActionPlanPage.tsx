import type { InvestorProfile } from '../domain/investorProfile';
import { assessInvestorRisk } from '../domain/investorProfile';
import type { Holding } from '../domain/portfolio';
import { targetAllocationFromRisk } from '../domain/allocation';
import { calculateRebalanceActions, rebalanceNarrative } from '../domain/rebalancing';
import { buildSpainWarnings } from '../domain/spainWarnings';
import type { AppState } from '../app/appState';
import { exportPlanJson } from '../storage/localPlanStore';
import { Card } from '../components/Card';

interface ActionPlanPageProps {
  state: AppState;
  profile: InvestorProfile;
  holdings: Holding[];
}

export function ActionPlanPage({ state, profile, holdings }: ActionPlanPageProps) {
  const risk = assessInvestorRisk(profile);
  const targets = targetAllocationFromRisk(risk);
  const actions = calculateRebalanceActions(holdings, targets);
  const warnings = buildSpainWarnings(holdings);
  const narrative = rebalanceNarrative(actions);

  function downloadJson() {
    const blob = new Blob([exportPlanJson(state)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'mi-plan-carteras-inteligentes.json';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="page-stack">
      <div className="page-heading">
        <p className="eyebrow">Paso 4</p>
        <h2>Plan de acción</h2>
        <p>Resumen práctico para documentar tu política de cartera y revisar periódicamente.</p>
      </div>

      <Card title="Mi política de cartera" tone="highlight">
        <p><strong>Perfil:</strong> {risk.label}</p>
        <p><strong>Asignación objetivo:</strong> {risk.equityTarget}% renta variable, {risk.bondTarget}% renta fija, {risk.cashTarget}% liquidez.</p>
        <p><strong>Regla de rebalanceo:</strong> revisar si una clase de activo se desvía más de 5 puntos porcentuales. Priorizar nuevas aportaciones antes de vender si hay impacto fiscal.</p>
      </Card>

      <Card title="Acciones sugeridas" tone="highlight">
        <ol className="action-list">
          {narrative.map((item) => <li key={item}>{item}</li>)}
          <li>Revisar costes totales: TER, custodia, cambio de divisa y fiscalidad de distribuciones.</li>
          <li>Antes de vender ETFs, acciones o fondos con plusvalías, revisar impacto fiscal en el IRPF.</li>
          <li>Si tienes fondos traspasables, prioriza traspasos frente a venta + recompra para diferir la tributación.</li>
          <li>Documentar tu política de inversión por escrito ayuda a no tomar decisiones impulsivas en caídas.</li>
        </ol>
      </Card>

      <Card title="Avisos para inversores en España">
        <div className="warnings-list">
          {warnings.map((warning) => (
            <div className={'warning-item ' + warning.level} key={warning.title}>
              <strong>{warning.title}</strong>
              <p>{warning.message}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Exportar y guardar">
        <p>Descarga una copia JSON local de tu plan. Puedes volver a importarla en cualquier momento desde el navegador. No se envía nada a ningún servidor.</p>
        <p className="card-body">También puedes copiar el texto del plan y guardarlo como documento para revisarlo periódicamente—por ejemplo, una vez al año o cuando cambie tu situación personal.</p>
        <button className="primary-button" type="button" onClick={downloadJson}>Descargar mi plan</button>
      </Card>
    </div>
  );
}
