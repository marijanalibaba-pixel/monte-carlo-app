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
    if (!results.completionDays || results.completionDays.length === 0) {
      return [];
    }
    
    const bins = 50;
    const min = Math.min(...results.completionDays);
    const max = Math.max(...results.completionDays);
    
    // Handle case where all values are the same
    if (min === max) {
      return [{
        bin: min,
        count: results.completionDays.length,
        date: new Date(startDate.getTime() + min * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }];
    }
    
    const binSize = (max - min) / bins;
    
    const histogram = Array(bins).fill(0).map((_, i) => ({
      bin: Math.round(min + i * binSize),
      count: 0,
      date: new Date(startDate.getTime() + (min + i * binSize) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
    
    results.completionDays.forEach(days => {
      const binIndex = Math.min(Math.floor((days - min) / binSize), bins - 1);
      if (histogram[binIndex]) {
        histogram[binIndex].count++;
      }
    });
    
    return histogram.filter(bin => bin && bin.count > 0);
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
      <div className="h-80">
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
            <ReferenceLine 
              x={p50Days} 
              stroke="#3b82f6" 
              strokeWidth={4} 
              strokeDasharray="8 4" 
              label={{ value: `P50 (${p50Days}d)`, position: "top", style: { fill: "#3b82f6", fontWeight: "bold" } }}
            />
            <ReferenceLine 
              x={p80Days} 
              stroke="#f59e0b" 
              strokeWidth={4} 
              strokeDasharray="8 4" 
              label={{ value: `P80 (${p80Days}d)`, position: "top", style: { fill: "#f59e0b", fontWeight: "bold" } }}
            />
            <ReferenceLine 
              x={p95Days} 
              stroke="#10b981" 
              strokeWidth={4} 
              strokeDasharray="8 4" 
              label={{ value: `P95 (${p95Days}d)`, position: "top", style: { fill: "#10b981", fontWeight: "bold" } }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 space-y-1">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Early completion →</span>
          <span>← Late completion</span>
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
