import { useMemo, useState } from 'react';
import type { InvestorProfile } from '../domain/investorProfile';
import { assessInvestorRisk } from '../domain/investorProfile';
import type { Holding } from '../domain/portfolio';
import { portfolioTotal } from '../domain/portfolio';
import { targetAllocationFromRisk } from '../domain/allocation';
import type { SimulationAssumptions, BenchmarkComparison } from '../domain/assumptions';
import { projectPortfolio, compareBenchmarks, formatCurrency } from '../domain/assumptions';
import { Card } from '../components/Card';

interface BenchmarksPageProps {
  profile: InvestorProfile;
  holdings: Holding[];
  assumptions: SimulationAssumptions;
  onNext: () => void;
}

function buildCombinedSeries(
  userProjection: BenchmarkComparison['userProjection'],
  benchmarks: BenchmarkComparison['benchmarks'],
) {
  return userProjection.years.map((year, idx) => {
    const point: Record<string, number | string> = {
      year: year.year,
      centralValue: year.centralValue,
    };
    benchmarks.forEach((bp) => {
      point[bp.benchmark.id] = bp.projection.years[idx]?.centralValue ?? 0;
    });
    return point;
  });
}

export function BenchmarksPage({ profile, holdings, assumptions, onNext }: BenchmarksPageProps) {
  const risk = assessInvestorRisk(profile);
  const targets = targetAllocationFromRisk(risk);
  const total = portfolioTotal(holdings);

  const [annualContribution, setAnnualContribution] = useState(6000);
  const [annualSpend, setAnnualSpend] = useState(36000);

  const [selectedBenchmarks, setSelectedBenchmarks] = useState<Set<string>>(
    new Set(['all-equity', 'sixty-forty', 'carver']),
  );

  const userProjection = useMemo(
    () => projectPortfolio(total, targets, assumptions, annualContribution, annualSpend),
    [total, targets, assumptions, annualContribution, annualSpend],
  );

  const comparison = useMemo(
    () => compareBenchmarks(userProjection, 'Mi cartera', '#0f2433', total, assumptions, annualContribution, annualSpend),
    [userProjection, total, assumptions, annualContribution, annualSpend],
  );

  const activeBenchmarks = comparison.benchmarks.filter((bp) => selectedBenchmarks.has(bp.benchmark.id));

  const combinedData = useMemo(
    () => buildCombinedSeries(userProjection, activeBenchmarks),
    [userProjection, activeBenchmarks],
  );

  const finalYear = assumptions.yearsToProject;
  const lastUserData = userProjection.years[userProjection.years.length - 1];

  function toggleBenchmark(id: string) {
    setSelectedBenchmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="page-stack">
      <div className="page-heading">
        <p className="eyebrow">Paso 4</p>
        <h2>Comparación con benchmarks</h2>
        <p>Carver pregunta: ¿Es que no puedes simplemente...? Ponemos tu cartera frente a alternativas simples.</p>
      </div>

      <Card title="Tu escenario base" tone="highlight">
        <div className="input-grid">
          <div className="input-group">
            <label htmlFor="bench-contribution">¿Cuánto invertirás al año? (€)</label>
            <input
              id="bench-contribution"
              type="number"
              min={0}
              step={500}
              value={annualContribution}
              onChange={(e) => setAnnualContribution(Math.max(0, Number(e.target.value) || 0))}
            />
            <p className="input-help">Cantidad que planeas aportar a tu cartera cada año (después de impuestos). Si no aportas regularmente, pon 0.</p>
          </div>
          <div className="input-group">
            <label htmlFor="bench-spend">¿Cuánto quieres poder vivir al año? (€)</label>
            <input
              id="bench-spend"
              type="number"
              min={0}
              step={1000}
              value={annualSpend}
              onChange={(e) => setAnnualSpend(Math.max(0, Number(e.target.value) || 0))}
            />
            <p className="input-help">El gasto anual que quieres cubrir con tu cartera cuando dejes de trabajar. La independencia se alcanza cuando el patrimonio llega a 25× esta cantidad (regla del 4%).</p>
          </div>
        </div>
      </Card>

      <Card title="Selecciona benchmarks para comparar" subtitle="Puedes activar o desactivar cada uno">
        <div className="benchmark-toggle-grid">
          {comparison.benchmarks.map((bp) => (
            <label key={bp.benchmark.id} className={'benchmark-toggle ' + (selectedBenchmarks.has(bp.benchmark.id) ? 'active' : '')}>
              <input
                type="checkbox"
                checked={selectedBenchmarks.has(bp.benchmark.id)}
                onChange={() => toggleBenchmark(bp.benchmark.id)}
              />
              <span className="benchmark-swatch" style={{ background: bp.benchmark.color }} />
              <span className="benchmark-name">{bp.benchmark.name}</span>
              <span className="benchmark-desc">{bp.benchmark.description}</span>
            </label>
          ))}
        </div>
      </Card>

      {activeBenchmarks.length > 0 && (
        <Card title="Tu cartera vs benchmarks" subtitle={`Evolución central a ${finalYear} años con los mismos supuestos`}>
          <ProjectionChartWrapper data={combinedData} activeBenchmarks={activeBenchmarks} userColor="#0f2433" />
        </Card>
      )}

      <Card title={`Resumen a ${finalYear} años`} subtitle="Valor final, drawdown máximo e independencia">
        <div className="benchmark-summary">
          <BenchmarkSummaryRow
            name="Mi cartera"
            color="#0f2433"
            finalValue={lastUserData?.centralValue ?? 0}
            drawdown={userProjection.maxDrawdownPct}
            independence={userProjection.independenceYear.central}
            years={finalYear}
            highlight
          />
          {activeBenchmarks.map((bp) => {
            const lastYearData = bp.projection.years[bp.projection.years.length - 1];
            return (
              <BenchmarkSummaryRow
                key={bp.benchmark.id}
                name={bp.benchmark.name}
                color={bp.benchmark.color}
                finalValue={lastYearData?.centralValue ?? 0}
                drawdown={bp.projection.maxDrawdownPct}
                independence={bp.projection.independenceYear.central}
                years={finalYear}
              />
            );
          })}
        </div>
        <p className="card-body">
          La diferencia entre una cartera y otra puede parecer pequeña año a año, pero a {finalYear} años se acumula.
          Carver insiste: si la diferencia no es significativa, elige la más simple.
        </p>
      </Card>

      <button className="primary-button" onClick={onNext} type="button">
        Ir al plan de acción
      </button>
    </div>
  );
}

function BenchmarkSummaryRow({
  name,
  color,
  finalValue,
  drawdown,
  independence,
  years,
  highlight,
}: {
  name: string;
  color: string;
  finalValue: number;
  drawdown: number;
  independence: number | null;
  years: number;
  highlight?: boolean;
}) {
  return (
    <div className={'benchmark-row ' + (highlight ? 'highlight' : '')}>
      <span className="benchmark-name-cell">
        <span className="benchmark-swatch-sm" style={{ background: color }} />
        {name}
      </span>
      <span>{formatCurrency(finalValue)}</span>
      <span>{drawdown.toFixed(1)}%</span>
      <span>{independence ? 'Año ' + independence : 'Fuera de ' + years + ' años'}</span>
    </div>
  );
}

function ProjectionChartWrapper({
  data,
  activeBenchmarks,
  userColor,
}: {
  data: Record<string, number | string>[];
  activeBenchmarks: Array<{ benchmark: { id: string; name: string; color: string } }>;
  userColor: string;
}) {
  return (
    <div className="chart-container">
      <ProjectionChartExtended data={data} activeBenchmarks={activeBenchmarks} userColor={userColor} />
    </div>
  );
}

function ProjectionChartExtended({
  data,
  activeBenchmarks,
  userColor,
}: {
  data: Record<string, number | string>[];
  activeBenchmarks: Array<{ benchmark: { id: string; name: string; color: string } }>;
  userColor: string;
}) {
  return (
    <BenchmarkLineChart data={data} activeBenchmarks={activeBenchmarks} userColor={userColor} />
  );
}

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

function BenchmarkLineChart({
  data,
  activeBenchmarks,
  userColor,
}: {
  data: Record<string, number | string>[];
  activeBenchmarks: Array<{ benchmark: { id: string; name: string; color: string } }>;
  userColor: string;
}) {
  const formatEuro = (value: number) => {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M €';
    if (value >= 1000) return (value / 1000).toFixed(0) + 'k €';
    return value + ' €';
  };

  return (
    <ResponsiveContainer width="100%" height={340}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="year" label={{ value: 'Año', position: 'insideBottom', offset: -2 }} />
        <YAxis tickFormatter={formatEuro} width={70} />
        <Tooltip
          formatter={(value: unknown) => formatEuro(Number(value))}
          labelFormatter={(label) => 'Año ' + label}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="centralValue"
          name="Mi cartera"
          stroke={userColor}
          strokeWidth={3}
          dot={false}
        />
        {activeBenchmarks.map((bp) => (
          <Line
            key={bp.benchmark.id}
            type="monotone"
            dataKey={bp.benchmark.id}
            name={bp.benchmark.name}
            stroke={bp.benchmark.color}
            strokeWidth={2}
            dot={false}
            strokeDasharray="4 2"
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
