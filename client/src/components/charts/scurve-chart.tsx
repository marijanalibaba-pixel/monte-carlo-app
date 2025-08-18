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
      <div className="h-80">
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
              formatter={(value, name, props) => {
                const days = props.payload?.days;
                return [`${Number(value).toFixed(1)}%`, `Completion Probability at ${days} days`];
              }}
              labelFormatter={(value) => `Day ${value}`}
            />
            <Line 
              type="monotone" 
              dataKey="probability" 
              stroke="#6366f1" 
              strokeWidth={3}
              dot={false}
            />
            <ReferenceLine 
              x={p50Days} 
              stroke="#3b82f6" 
              strokeWidth={5} 
              strokeDasharray="10 5" 
              label={{ value: `P50`, position: "topRight", style: { fill: "#3b82f6", fontWeight: "bold", fontSize: "12px" } }}
              isFront={true}
            />
            <ReferenceLine 
              x={p80Days} 
              stroke="#f59e0b" 
              strokeWidth={5} 
              strokeDasharray="10 5" 
              label={{ value: `P80`, position: "topRight", style: { fill: "#f59e0b", fontWeight: "bold", fontSize: "12px" } }}
              isFront={true}
            />
            <ReferenceLine 
              x={p95Days} 
              stroke="#10b981" 
              strokeWidth={5} 
              strokeDasharray="10 5" 
              label={{ value: `P95`, position: "topRight", style: { fill: "#10b981", fontWeight: "bold", fontSize: "12px" } }}
              isFront={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 space-y-1">
        <div className="flex justify-between text-xs text-gray-500">
          <span>0% probability</span>
          <span>100% probability</span>
        </div>
        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-blue-500"></div>
            P50 ({p50Days}d)
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-amber-500"></div>
            P80 ({p80Days}d)
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-emerald-500"></div>
            P95 ({p95Days}d)
          </span>
        </div>
      </div>
    </div>
  );
}
