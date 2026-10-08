import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function RiskChart({ data }) {
  return <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data}>
      <defs>
        <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#18a878" stopOpacity={.2} />
          <stop offset="100%" stopColor="#18a878" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid stroke="#edf0f3" vertical={false} />
      <XAxis dataKey="created_at" tickFormatter={value => new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} tickLine={false} axisLine={false} />
      <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
      <Tooltip />
      <Area type="monotone" dataKey="score" stroke="#16a173" fill="url(#riskFill)" strokeWidth={2} />
    </AreaChart>
  </ResponsiveContainer>;
}
