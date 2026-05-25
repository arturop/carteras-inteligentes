import type { SimulationAssumptions } from '../domain/assumptions';
import { Card } from '../components/Card';
import { FormField, NumberInput } from '../components/FormField';

interface AssumptionsPageProps {
  assumptions: SimulationAssumptions;
  onChange: (assumptions: SimulationAssumptions) => void;
  onNext: () => void;
}

export function AssumptionsPage({ assumptions, onChange, onNext }: AssumptionsPageProps) {
  function updateReturn(assetClass: string, value: number) {
    onChange({
      ...assumptions,
      annualReturns: assumptions.annualReturns.map((r) =>
        r.assetClass === assetClass ? { ...r, expectedRealReturnPct: value } : r,
      ),
    });
  }

  return (
    <div className="page-stack">
      <div className="page-heading">
        <p className="eyebrow">Paso 2.5</p>
        <h2>Supuestos y escenarios</h2>
        <p>
          Estos son los números que usamos para simular tu cartera. Son suposiciones, no predicciones.
          Ajústalos a tu criterio: cuanto más conservador, mejor.
        </p>
      </div>

      <Card title="Rentabilidad real esperada por clase de activo" subtitle="Rentabilidad por encima de la inflación. Datos históricos orientativos; el futuro puede ser distinto.">
        <div className="assumptions-grid">
          {assumptions.annualReturns.map((asset) => (
            <div key={asset.assetClass} className="assumption-row">
              <div>
                <strong>{asset.label}</strong>
                <p>{asset.description}</p>
              </div>
              <div className="assumption-input">
                <NumberInput
                  value={asset.expectedRealReturnPct}
                  step={0.5}
                  onChange={(value) => updateReturn(asset.assetClass, value)}
                />
                <span>% real</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="two-column">
        <Card title="Parámetros de rebalanceo y costes">
          <div className="form-grid">
            <FormField label="Banda de rebalanceo (%)" help="Desviación máxima antes de recomendar rebalancear. Más bajo = más frecuentes, más alto = menos fricción.">
              <NumberInput
                value={assumptions.rebalanceThresholdPct}
                step={1}
                onChange={(rebalanceThresholdPct) => onChange({ ...assumptions, rebalanceThresholdPct })}
              />
            </FormField>
            <FormField label="Umbral de coste elevado (%)" help="A partir de este coste anual ponderado, la herramienta avisa.">
              <NumberInput
                value={assumptions.highCostThresholdPct}
                step={0.05}
                onChange={(highCostThresholdPct) => onChange({ ...assumptions, highCostThresholdPct })}
              />
            </FormField>
            <FormField label="Umbral de concentración (%)" help="Si una sola posición supera este % del total, se genera advertencia.">
              <NumberInput
                value={assumptions.concentrationThresholdPct}
                step={5}
                onChange={(concentrationThresholdPct) => onChange({ ...assumptions, concentrationThresholdPct })}
              />
            </FormField>
            <FormField label="Inflación esperada (%)" help="Para ajustar la rentabilidad nominal a valores reales.">
              <NumberInput
                value={assumptions.inflationPct}
                step={0.5}
                onChange={(inflationPct) => onChange({ ...assumptions, inflationPct })}
              />
            </FormField>
          </div>
        </Card>

        <Card title="Horizonte de simulación" tone="highlight">
          <FormField label="Años a proyectar" help="Periodo para los escenarios. A más años, más importan los costes y la diversificación.">
            <NumberInput
              value={assumptions.yearsToProject}
              step={5}
              onChange={(yearsToProject) => onChange({ ...assumptions, yearsToProject })}
            />
          </FormField>
          <p className="card-body">
            Los escenarios usan la <strong>rentabilidad real</strong> (descontada la inflación).
            La rentabilidad nominal será mayor, pero lo que importa es lo que puedes comprar con ese dinero.
          </p>
        </Card>
      </div>

      <Card title="Aviso importante" tone="warning">
        <p>
          Estas simulaciones son orientativas y se basan en suposiciones que tú decides.
          No son predicciones ni recomendaciones. El rendimiento pasado no garantiza resultados futuros.
          Úsalas para entender trade-offs, no para planificar al detalle.
        </p>
      </Card>

      <button className="primary-button" onClick={onNext} type="button">
        Ver cartera objetivo con estos supuestos
      </button>
    </div>
  );
}
