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
import type { YearProjection } from '../domain/assumptions';

interface ProjectionChartProps {
  data: YearProjection[];
}

function formatEuro(value: number): string {
  if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M €';
  if (value >= 1000) return (value / 1000).toFixed(0) + 'k €';
  return value + ' €';
}

export function ProjectionChart({ data }: ProjectionChartProps) {
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={320}>
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
            dataKey="optimisticValue"
            name="Optimista"
            stroke="#16a34a"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="centralValue"
            name="Central"
            stroke="#2563eb"
            strokeWidth={2.5}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="pessimisticValue"
            name="Pesimista"
            stroke="#dc2626"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
