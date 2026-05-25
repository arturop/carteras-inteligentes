import { useMemo, useState } from 'react';
import type { InvestorProfile } from '../domain/investorProfile';
import { assessInvestorRisk } from '../domain/investorProfile';
import type { Holding } from '../domain/portfolio';
import { portfolioTotal } from '../domain/portfolio';
import { targetAllocationFromRisk } from '../domain/allocation';
import type { SimulationAssumptions } from '../domain/assumptions';
import { projectPortfolio, formatCurrency } from '../domain/assumptions';
import { Card } from '../components/Card';
import { ProjectionChart } from '../components/ProjectionChart';

interface EvolutionPageProps {
  profile: InvestorProfile;
  holdings: Holding[];
  assumptions: SimulationAssumptions;
  onNext: () => void;
}

export function EvolutionPage({ profile, holdings, assumptions, onNext }: EvolutionPageProps) {
  const risk = assessInvestorRisk(profile);
  const targets = targetAllocationFromRisk(risk);
  const total = portfolioTotal(holdings);

  const [annualContribution, setAnnualContribution] = useState(6000);
  const [annualSpend, setAnnualSpend] = useState(36000);

  const projection = useMemo(
    () => projectPortfolio(total, targets, assumptions, annualContribution, annualSpend),
    [total, targets, assumptions, annualContribution, annualSpend],
  );

  const independenceYears = projection.independenceYear;
  const hasIndependence = independenceYears.central !== null || independenceYears.optimistic !== null;

  const isSpendUnsustainable = annualSpend > 0 && annualSpend > total + annualContribution * assumptions.yearsToProject;

  return (
    <div className="page-stack">
      <div className="page-heading">
        <p className="eyebrow">Paso 3.5</p>
        <h2>Evolución de tu cartera</h2>
        <p>Proyección año año bajo tus supuestos. Basada en la filosofía de Rob Carver.</p>
      </div>

      <Card title="Tu escenario base" tone="highlight">
        <div className="input-grid">
          <div className="input-group">
            <label htmlFor="annualContribution">¿Cuánto invertirás al año? (€)</label>
            <input
              id="annualContribution"
              type="number"
              min={0}
              step={500}
              value={annualContribution}
              onChange={(e) => setAnnualContribution(Math.max(0, Number(e.target.value) || 0))}
            />
            <p className="input-help">Cantidad que planeas aportar a tu cartera cada año (después de impuestos). Si no aportas regularmente, pon 0.</p>
          </div>
          <div className="input-group">
            <label htmlFor="annualSpend">¿Cuánto quieres poder vivir al año? (€)</label>
            <input
              id="annualSpend"
              type="number"
              min={0}
              step={1000}
              value={annualSpend}
              onChange={(e) => setAnnualSpend(Math.max(0, Number(e.target.value) || 0))}
            />
            <p className="input-help">El gasto anual que quieres cubrir con tu cartera cuando dejes de trabajar. La independencia se alcanza cuando el patrimonio llega a 25× esta cantidad (regla del 4%).</p>
          </div>
        </div>
        <div className="highlight-grid">
          <div><strong>Patrimonio actual:</strong> {formatCurrency(total)}</div>
          <div><strong>Caída máxima estimada:</strong> {projection.maxDrawdownPct.toFixed(1)}%</div>
          <div><strong>Horizonte:</strong> {assumptions.yearsToProject} años</div>
        </div>
      </Card>

      <Card title="Proyección de patrimonio" subtitle="Tres escenarios basados en tus supuestos">
        <ProjectionChart data={projection.years} />
        <p className="card-body">
          Línea <strong>azul</strong> = escenario central. <strong>Verde</strong> = optimista. <strong>Rojo</strong> = pesimista.
          La banda entre optimista y pesimista es amplia porque el futuro es incierto. Carver insiste en que no confíes en una sola línea.
        </p>
      </Card>

      {isSpendUnsustainable && (
        <Card title="⚠️ Gasto insostenible" tone="warning">
          <p>
            Tu gasto anual ({formatCurrency(annualSpend)}) es superior a todo lo que vas a tener disponible
            en el horizonte ({formatCurrency(total + annualContribution * assumptions.yearsToProject)} entre patrimonio
            actual y aportaciones). La cartera se agotará antes del año {projection.years.find((y) => y.centralValue === 0)?.year ?? assumptions.yearsToProject + 1}.
          </p>
          <p className="card-body">
            Revisa el gasto objetivo o aumenta la aportación anual. La proyección asume que cuando no queda nada, no puedes seguir gastando.
          </p>
        </Card>
      )}

      {!hasIndependence && !isSpendUnsustainable && annualSpend > 0 && (
        <Card title="Independencia fuera del horizonte" tone="warning">
          <p>
            Ni siquiera en el escenario optimista alcanzas los {formatCurrency(annualSpend * 25)} necesarios
            para sostener un gasto de {formatCurrency(annualSpend)}/año (regla del 4%).
          </p>
          <p className="card-body">
            Puedes ajustar la aportación anual, el gasto objetivo o las rentabilidades esperadas en Supuestos para ver cómo cambia el resultado.
          </p>
        </Card>
      )}

      {hasIndependence && (
        <Card title="¿Cuándo alcanzas la independencia?" subtitle="Basado en la regla del 4%: patrimonio ≥ 25 × gasto anual">
          <div className="grid-3">
            <Card title="Pesimista" tone={independenceYears.pessimistic ? 'default' : 'warning'}>
              <div className="target-big">
                {independenceYears.pessimistic
                  ? 'Año ' + independenceYears.pessimistic
                  : 'Fuera del horizonte'}
              </div>
              <p>{independenceYears.pessimistic
                ? 'En el peor caso, alcanzarías la independencia proyectada en este año.'
                : 'En el peor caso no alcanzarías el objetivo en el horizonte simulado.'}</p>
            </Card>
            <Card title="Central" tone="highlight">
              <div className="target-big">
                {independenceYears.central
                  ? 'Año ' + independenceYears.central
                  : 'Fuera del horizonte'}
              </div>
              <p>{independenceYears.central
                ? 'Bajo tus supuestos centrales, este sería el año estimado.'
                : 'Con tus supuestos centrales no alcanzarías el objetivo en el horizonte simulado.'}</p>
            </Card>
            <Card title="Optimista">
              <div className="target-big">
                {independenceYears.optimistic
                  ? 'Año ' + independenceYears.optimistic
                  : 'Fuera del horizonte'}
              </div>
              <p>{independenceYears.optimistic
                ? 'Escenario favorable: alcanzarías antes la independencia financiera proyectada.'
                : 'Incluso en el mejor caso no alcanzarías el objetivo en el horizonte simulado.'}</p>
            </Card>
          </div>
          <p className="card-body">
            Estos años son orientativos. No son predicciones. Si el resultado te parece lejano, puedes ajustar aportación, gasto objetivo o rentabilidades esperadas en Supuestos.
          </p>
        </Card>
      )}

      <Card title="La caída dolorosa" subtitle="Carver dedica mucho espacio a esto: prepárate para perder">
        <p>
          En el escenario central, la caída máxima estimada del patrimonio es del{' '}
          <strong>{projection.maxDrawdownPct.toFixed(1)}%</strong>. Eso significa que, en el peor momento,
          podrías ver tu cartera un {projection.maxDrawdownPct.toFixed(1)}% por debajo de su máximo anterior.
        </p>
        <p className="card-body">
          Si hoy tienes {formatCurrency(total)}, una caída del {projection.maxDrawdownPct.toFixed(1)}% supondría ver el valor bajar a{' '}
          <strong>{formatCurrency(total * (1 - projection.maxDrawdownPct / 100))}</strong> en el peor momento.
          ¿Puedes dormir tranquilo con eso? Si no, vuelve a Supuestos y reduce la renta variable.
        </p>
      </Card>

      <button className="primary-button" onClick={onNext} type="button">
        Ir al plan de acción
      </button>
    </div>
  );
}
