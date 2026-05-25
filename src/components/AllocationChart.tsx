import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { AllocationLine } from '../domain/portfolio';
import { formatAssetClass } from '../domain/allocation';

interface AllocationChartProps {
  data: AllocationLine[];
  title?: string;
}

const COLORS = ['#155e75', '#0e7490', '#22d3ee', '#67e8f9', '#a5f3fc', '#cffafe'];

export function AllocationChart({ data, title }: AllocationChartProps) {
  const chartData = data.map((item) => ({
    name: formatAssetClass(item.key),
    value: Math.round(item.percent * 10) / 10,
  }));

  return (
    <div className="allocation-chart">
      {title && <h3>{title}</h3>}
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            label={({ name, value }) => `${name} ${value}%`}
            labelLine={false}
          >
            {chartData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%` as string} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
