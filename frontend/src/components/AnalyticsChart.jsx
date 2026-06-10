import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

const defaultColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AnalyticsChart({
  title,
  subtitle,
  chartType = "bar",
  data = [],
  categories = [],
  series = [],
  dataKey = "value",
  nameKey = "name",
  colors = defaultColors
}) {
  const chartData = data.length
    ? data
    : categories.map((label, index) => ({
        [nameKey]: label,
        [dataKey]: series[index] ?? 0
      }));

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <div>
          <h3>{title}</h3>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="chart-card__empty">No chart data available</div>
      ) : (
        <div className="chart-card__figure">
          <ResponsiveContainer width="100%" height={320}>
            {chartType === "line" ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey={nameKey} tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />
                <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={dataKey} stroke={colors[0]} strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            ) : chartType === "pie" ? (
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie
                  data={chartData}
                  dataKey={dataKey}
                  nameKey={nameKey}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill={colors[0]}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
              </PieChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey={nameKey} tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />
                <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey={dataKey} fill={colors[0]} radius={[10, 10, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
