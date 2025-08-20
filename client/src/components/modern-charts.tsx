import { useState } from "react";
import { SimulationResult } from "@/lib/monte-carlo";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LineChart, Line } from "recharts";
import { BarChart3, TrendingUp, Target, Calendar } from "lucide-react";

interface ModernChartsProps {
  results: SimulationResult;
  startDate: Date;
}

export function ModernCharts({ results, startDate }: ModernChartsProps) {
  const [hoveredData, setHoveredData] = useState<{ days: number; value: number } | null>(null);

  // Create histogram data with high granularity
  const createHistogramData = () => {
    if (!results.completionDays || results.completionDays.length === 0) {
      return [];
    }
    
    const bins = 50; // Optimized for mobile
    const min = Math.min(...results.completionDays);
    const max = Math.max(...results.completionDays);
    
    if (min === max) {
      return [{
        days: min,
        count: results.completionDays.length,
        percentage: 100,
        date: new Date(startDate.getTime() + min * 24 * 60 * 60 * 1000).toLocaleDateString()
      }];
    }
    
    const binSize = (max - min) / bins;
    const histogram = Array(bins).fill(0).map((_, i) => ({
      days: Math.round(min + i * binSize),
      count: 0,
      percentage: 0,
      date: new Date(startDate.getTime() + (min + i * binSize) * 24 * 60 * 60 * 1000).toLocaleDateString()
    }));
    
    results.completionDays.forEach(days => {
      const binIndex = Math.min(Math.floor((days - min) / binSize), bins - 1);
      if (histogram[binIndex]) {
        histogram[binIndex].count++;
      }
    });
    
    // Calculate percentages
    const total = results.completionDays.length;
    histogram.forEach(bin => {
      bin.percentage = (bin.count / total) * 100;
    });
    
    return histogram.filter(bin => bin.count > 0);
  };

  // Create S-curve data
  const createSCurveData = () => {
    const sorted = [...results.completionDays].sort((a, b) => a - b);
    const total = sorted.length;
    
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
          date: new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000).toLocaleDateString()
        });
      });
    
    return data;
  };

  const histogramData = createHistogramData();
  const scurveData = createSCurveData();

  // Calculate percentiles correctly
  const getPercentileDays = (percentile: number) => {
    const sorted = [...results.completionDays].sort((a, b) => a - b);
    const idx = Math.floor(percentile * (sorted.length - 1));
    return sorted[idx];
  };

  const p50Days = getPercentileDays(0.5);
  const p80Days = getPercentileDays(0.8);
  const p95Days = getPercentileDays(0.95);

  const formatTooltip = (value: any, name: string, props: any) => {
    if (name === 'count') {
      return [`${value} simulations`, 'Frequency'];
    } else if (name === 'probability') {
      return [`${Number(value).toFixed(1)}%`, 'Completion Probability'];
    }
    return [value, name];
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">50% Confidence</p>
              <p className="text-2xl font-bold">{p50Days} days</p>
            </div>
            <Target className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">80% Confidence</p>
              <p className="text-2xl font-bold">{p80Days} days</p>
            </div>
            <Calendar className="w-8 h-8 text-amber-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">95% Confidence</p>
              <p className="text-2xl font-bold">{p95Days} days</p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-200" />
          </div>
        </div>
      </div>

      {/* Histogram Chart */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Completion Distribution
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Frequency of completion times
            </p>
          </div>
        </div>

        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={histogramData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
              <XAxis 
                dataKey="days"
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickFormatter={(value) => `${value}d`}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                formatter={formatTooltip}
                labelFormatter={(value) => `Day ${value}`}
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '14px'
                }}
              />
              <Bar 
                dataKey="count" 
                fill="url(#gradientBar)"
                radius={[4, 4, 0, 0]}
                stroke="#3b82f6"
                strokeWidth={1}
              />
              
              {/* Percentile lines */}
              <ReferenceLine 
                x={p50Days} 
                stroke="#3b82f6" 
                strokeWidth={3} 
                strokeDasharray="8 4"
                label={{ value: "P50", position: "topLeft" }}
              />
              <ReferenceLine 
                x={p80Days} 
                stroke="#f59e0b" 
                strokeWidth={3} 
                strokeDasharray="8 4"
                label={{ value: "P80", position: "topLeft" }}
              />
              <ReferenceLine 
                x={p95Days} 
                stroke="#10b981" 
                strokeWidth={3} 
                strokeDasharray="8 4"
                label={{ value: "P95", position: "topLeft" }}
              />
              
              <defs>
                <linearGradient id="gradientBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-1 bg-blue-500 rounded"></div>
            <span className="text-slate-600 dark:text-slate-400">P50 ({p50Days}d)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-1 bg-amber-500 rounded"></div>
            <span className="text-slate-600 dark:text-slate-400">P80 ({p80Days}d)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-1 bg-emerald-500 rounded"></div>
            <span className="text-slate-600 dark:text-slate-400">P95 ({p95Days}d)</span>
          </div>
        </div>
      </div>

      {/* S-Curve Chart */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Cumulative Probability (S-Curve)
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Likelihood of completion by each date
            </p>
          </div>
        </div>

        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={scurveData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
              <XAxis 
                dataKey="days"
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickFormatter={(value) => `${value}d`}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickFormatter={(value) => `${value}%`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                formatter={formatTooltip}
                labelFormatter={(value) => `Day ${value}`}
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '14px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="probability" 
                stroke="url(#gradientLine)"
                strokeWidth={4}
                dot={false}
                activeDot={{ r: 6, fill: "#3b82f6" }}
              />
              
              {/* Percentile lines */}
              <ReferenceLine 
                x={p50Days} 
                stroke="#3b82f6" 
                strokeWidth={3} 
                strokeDasharray="8 4"
                label={{ value: "P50", position: "topLeft" }}
              />
              <ReferenceLine 
                x={p80Days} 
                stroke="#f59e0b" 
                strokeWidth={3} 
                strokeDasharray="8 4"
                label={{ value: "P80", position: "topLeft" }}
              />
              <ReferenceLine 
                x={p95Days} 
                stroke="#10b981" 
                strokeWidth={3} 
                strokeDasharray="8 4"
                label={{ value: "P95", position: "topLeft" }}
              />
              
              <defs>
                <linearGradient id="gradientLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {results.statistics.trials.toLocaleString()}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Simulations</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {Math.round(results.statistics.mean)}d
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Average</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {Math.round(results.statistics.min)}d
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Minimum</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {Math.round(results.statistics.max)}d
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Maximum</p>
          </div>
        </div>
      </div>
    </div>
  );
}