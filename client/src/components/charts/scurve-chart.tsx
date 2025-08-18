import { SimulationResult } from "@/lib/monte-carlo";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { TrendingUp } from "lucide-react";

interface SCurveChartProps {
  results: SimulationResult;
  startDate: Date;
}

export function SCurveChart({ results, startDate }: SCurveChartProps) {
  // Create S-curve data
  const createSCurveData = () => {
    const sorted = [...results.completionDays].sort((a, b) => a - b);
    const total = sorted.length;
    
    // Group similar values and calculate cumulative probability
    const grouped: { [key: number]: number } = {};
    sorted.forEach(days => {
      grouped[days] = (grouped[days] || 0) + 1;
    });
    
    const data: Array<{ days: number; probability: number; date: string }> = [];
    let cumulative = 0;
    
    Object.keys(grouped)
      .map(Number)
      .sort((a, b) => a - b)
      .forEach(days => {
        cumulative += grouped[days];
        data.push({
          days,
          probability: (cumulative / total) * 100,
          date: new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
      });
    
    return data;
  };

  const scurveData = createSCurveData();
  
  const getPercentileDays = (percentile: number) => {
    const sorted = [...results.completionDays].sort((a, b) => a - b);
    const idx = Math.ceil(percentile * sorted.length) - 1;
    return sorted[Math.max(0, Math.min(idx, sorted.length - 1))];
  };

  const p50Days = getPercentileDays(0.5);
  const p80Days = getPercentileDays(0.8);
  const p95Days = getPercentileDays(0.95);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
        <TrendingUp className="text-[hsl(var(--primary-500))] mr-2 h-4 w-4" />
        Cumulative Probability (S-curve)
      </h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={scurveData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="days"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}d`}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Completion Probability']}
              labelFormatter={(value) => `${value} days`}
            />
            <Line 
              type="monotone" 
              dataKey="probability" 
              stroke="hsl(var(--primary-600))" 
              strokeWidth={2}
              dot={false}
            />
            <ReferenceLine x={p50Days} stroke="#ef4444" strokeWidth={2} label={{ value: "P50", position: "top" }} />
            <ReferenceLine x={p80Days} stroke="#f97316" strokeWidth={2} label={{ value: "P80", position: "top" }} />
            <ReferenceLine x={p95Days} stroke="#22c55e" strokeWidth={2} label={{ value: "P95", position: "top" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex justify-between text-xs text-gray-500">
        <span>0% probability</span>
        <span>100% probability</span>
      </div>
    </div>
  );
}
