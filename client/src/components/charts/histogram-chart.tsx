import { SimulationResult } from "@/lib/monte-carlo";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { BarChart3 } from "lucide-react";

interface HistogramChartProps {
  results: SimulationResult;
  startDate: Date;
}

export function HistogramChart({ results, startDate }: HistogramChartProps) {
  // Create histogram data
  const createHistogramData = () => {
    const bins = 20;
    const min = Math.min(...results.completionDays);
    const max = Math.max(...results.completionDays);
    const binSize = (max - min) / bins;
    
    const histogram = Array(bins).fill(0).map((_, i) => ({
      bin: Math.round(min + i * binSize),
      count: 0,
      date: new Date(startDate.getTime() + (min + i * binSize) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
    
    results.completionDays.forEach(days => {
      const binIndex = Math.min(Math.floor((days - min) / binSize), bins - 1);
      histogram[binIndex].count++;
    });
    
    return histogram.filter(bin => bin.count > 0);
  };

  const histogramData = createHistogramData();
  
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
        <BarChart3 className="text-[hsl(var(--primary-500))] mr-2 h-4 w-4" />
        Completion Distribution (Histogram)
      </h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={histogramData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="bin"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}d`}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value) => [value, 'Frequency']}
              labelFormatter={(value) => `${value} days`}
            />
            <Bar 
              dataKey="count" 
              fill="hsl(var(--primary-500))" 
              fillOpacity={0.6}
              stroke="hsl(var(--primary-600))"
              strokeWidth={1}
            />
            <ReferenceLine x={p50Days} stroke="#ef4444" strokeWidth={2} label={{ value: "P50", position: "top" }} />
            <ReferenceLine x={p80Days} stroke="#f97316" strokeWidth={2} label={{ value: "P80", position: "top" }} />
            <ReferenceLine x={p95Days} stroke="#22c55e" strokeWidth={2} label={{ value: "P95", position: "top" }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex justify-between text-xs text-gray-500">
        <span>Early completion →</span>
        <span>← Late completion</span>
      </div>
    </div>
  );
}
