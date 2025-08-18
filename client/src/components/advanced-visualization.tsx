import { useMemo } from "react";
import { ForecastResult } from "@/lib/monte-carlo-engine";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
  LineChart, Line, Area, AreaChart, ScatterChart, Scatter, Cell
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  TrendingUp, BarChart3, Target, Calendar, AlertTriangle, 
  Activity, Gauge, PieChart, Zap, Award, HelpCircle
} from "lucide-react";
import { format, addDays } from "date-fns";

interface AdvancedVisualizationProps {
  result: ForecastResult;
  startDate: Date;
}

// Statistical explanation tooltips
const StatTooltip = ({ children, explanation }: { children: React.ReactNode; explanation: string }) => (
  <TooltipProvider>
    <UITooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center space-x-1 cursor-help">
          {children}
          <HelpCircle className="w-3 h-3 text-muted-foreground" />
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs p-3">
        <p className="text-sm">{explanation}</p>
      </TooltipContent>
    </UITooltip>
  </TooltipProvider>
);

export function AdvancedVisualization({ result, startDate }: AdvancedVisualizationProps) {
  
  // Prepare histogram data with evenly distributed bins
  const histogramData = useMemo(() => {
    const sortedDays = result.completionDates.map(date => {
      return Math.round((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    }).sort((a, b) => a - b);
    
    const minDays = sortedDays[0];
    const maxDays = sortedDays[sortedDays.length - 1];
    const binCount = 25; // Fixed number of evenly distributed bins
    const binWidth = (maxDays - minDays) / binCount;
    

    
    const histogram = Array(binCount).fill(0).map((_, index) => {
      const binStart = minDays + index * binWidth;
      const binEnd = binStart + binWidth;
      const binCenter = binStart + binWidth / 2;
      
      const count = sortedDays.filter(day => day >= binStart && day < binEnd).length;
      const frequency = (count / sortedDays.length) * 100;
      
      return {
        days: Math.round(binCenter),
        frequency,
        count,
        date: format(addDays(startDate, binCenter), 'MMM d'),
        binStart: Math.round(binStart),
        binEnd: Math.round(binEnd)
      };
    });
    
    return histogram;
  }, [result, startDate]);

  // Prepare S-curve data with smooth distribution
  const scurveData = useMemo(() => {
    const sortedDays = result.completionDates.map(date => {
      return Math.round((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    }).sort((a, b) => a - b);
    
    const minDays = sortedDays[0];
    const maxDays = sortedDays[sortedDays.length - 1];
    const points = 50; // Number of points for smooth curve
    
    return Array(points).fill(0).map((_, index) => {
      const day = minDays + (index / (points - 1)) * (maxDays - minDays);
      const countBelow = sortedDays.filter(d => d <= day).length;
      const probability = (countBelow / sortedDays.length) * 100;
      
      return {
        days: Math.round(day),
        probability,
        date: format(addDays(startDate, day), 'MMM d, yyyy')
      };
    });
  }, [result, startDate]);

  // Enhanced confidence intervals with color coding
  const confidenceColors = {
    0.5: '#3b82f6',   // Blue
    0.8: '#f59e0b',   // Amber  
    0.85: '#ef4444',  // Red
    0.9: '#10b981',   // Emerald
    0.95: '#8b5cf6',  // Purple
    0.99: '#f97316'   // Orange
  };

  const getConfidenceColor = (level: number): string => {
    return confidenceColors[level as keyof typeof confidenceColors] || '#6b7280';
  };

  // Risk assessment based on distribution shape
  const riskAssessment = useMemo(() => {
    const { statistics } = result;
    const cv = statistics.standardDeviation / statistics.mean;
    const range = statistics.max - statistics.min;
    
    let riskLevel: 'Low' | 'Medium' | 'High' | 'Very High';
    let riskColor: string;
    
    if (cv < 0.2 && statistics.skewness < 1) {
      riskLevel = 'Low';
      riskColor = 'text-emerald-600 bg-emerald-50';
    } else if (cv < 0.4 && statistics.skewness < 2) {
      riskLevel = 'Medium';
      riskColor = 'text-yellow-600 bg-yellow-50';
    } else if (cv < 0.6) {
      riskLevel = 'High';
      riskColor = 'text-orange-600 bg-orange-50';
    } else {
      riskLevel = 'Very High';
      riskColor = 'text-red-600 bg-red-50';
    }

    return { riskLevel, riskColor, cv, range };
  }, [result]);

  // Custom tooltip formatter
  const formatTooltip = (value: any, name: string, props: any) => {
    if (name === 'frequency') {
      return [`${Number(value).toFixed(1)}%`, 'Probability'];
    } else if (name === 'probability') {
      return [`${Number(value).toFixed(1)}%`, 'Cumulative Probability'];
    }
    return [value, name];
  };

  return (
    <div className="space-y-8">
      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Most Likely</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {Math.round(result.statistics.median)} days
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {format(addDays(startDate, result.statistics.median), 'MMM d, yyyy')}
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Conservative</p>
                <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                  {result.confidenceIntervals.find(ci => ci.level === 0.8)?.daysFromStart || 0} days
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300">80% confidence</p>
              </div>
              <Calendar className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/20 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Worst Case</p>
                <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                  {result.confidenceIntervals.find(ci => ci.level === 0.95)?.daysFromStart || 0} days
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">95% confidence</p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br border ${riskAssessment.riskColor}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Risk Level</p>
                <p className="text-2xl font-bold">{riskAssessment.riskLevel}</p>
                <p className="text-xs">CV: {(riskAssessment.cv * 100).toFixed(0)}%</p>
              </div>
              <AlertTriangle className="w-8 h-8" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confidence Intervals Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Confidence Intervals</span>
          </CardTitle>
          <CardDescription>
            Forecast dates at different confidence levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {result.confidenceIntervals.map((ci) => (
              <div 
                key={ci.level}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div>
                  <Badge 
                    variant="outline" 
                    style={{ 
                      borderColor: getConfidenceColor(ci.level),
                      color: getConfidenceColor(ci.level)
                    }}
                  >
                    P{Math.round(ci.level * 100)}
                  </Badge>
                  <p className="mt-1 font-semibold">{ci.daysFromStart} days</p>
                  <p className="text-sm text-muted-foreground">
                    {format(ci.completionDate, 'MMM d, yyyy')}
                  </p>
                </div>
                <div 
                  className="w-3 h-12 rounded-full"
                  style={{ backgroundColor: getConfidenceColor(ci.level) }}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Distribution Histogram */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Completion Time Distribution</span>
          </CardTitle>
          <CardDescription>
            Frequency of different completion times across {result.completionDates.length.toLocaleString()} simulations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 relative">
            {/* Percentile lines overlay for histogram - GUARANTEED VISIBILITY */}
            <div className="absolute inset-0 pointer-events-none z-10">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                {result.confidenceIntervals
                  .filter(interval => [0.5, 0.8, 0.95].includes(interval.level))
                  .map((interval) => {
                  const minDay = Math.min(...histogramData.map(d => d.days));
                  const maxDay = Math.max(...histogramData.map(d => d.days));
                  const xPercent = ((interval.daysFromStart - minDay) / (maxDay - minDay)) * 85 + 10;
                  
                  let color = '#6b7280';
                  if (interval.level === 0.5) color = '#3b82f6';
                  if (interval.level === 0.8) color = '#f59e0b';
                  if (interval.level === 0.95) color = '#ef4444';
                  
                  return (
                    <g key={`hist-overlay-${interval.level}`}>
                      <line
                        x1={`${xPercent}%`}
                        y1="15%"
                        x2={`${xPercent}%`}
                        y2="85%"
                        stroke={color}
                        strokeWidth="2"
                        strokeDasharray="6 3"
                        vectorEffect="non-scaling-stroke"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={histogramData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis 
                  dataKey="days"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}d`}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={formatTooltip}
                  labelFormatter={(value) => `Day ${value}`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="frequency" radius={[2, 2, 0, 0]}>
                  {histogramData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#gradient-${index % 3})`} 
                    />
                  ))}
                </Bar>
                

                
                <defs>
                  <linearGradient id="gradient-0" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  </linearGradient>
                  <linearGradient id="gradient-1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.3}/>
                  </linearGradient>
                  <linearGradient id="gradient-2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
            {/* Legend for histogram */}
            <div className="flex justify-center mt-4 space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-blue-500" style={{borderTop: '2px dashed #3b82f6'}}></div>
                <span className="text-sm text-muted-foreground">P50 (50% confidence)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-amber-500" style={{borderTop: '2px dashed #f59e0b'}}></div>
                <span className="text-sm text-muted-foreground">P80 (80% confidence)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-red-500" style={{borderTop: '2px dashed #ef4444'}}></div>
                <span className="text-sm text-muted-foreground">P95 (95% confidence)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* S-Curve (Cumulative Probability) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Cumulative Probability (S-Curve)</span>
          </CardTitle>
          <CardDescription>
            Likelihood of completing the project by each date
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 relative">
            {/* Percentile lines overlay - DIRECT SVG APPROACH */}
            <div className="absolute inset-0 pointer-events-none z-10">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                {result.confidenceIntervals
                  .filter(interval => [0.5, 0.8, 0.95].includes(interval.level))
                  .map((interval) => {
                  const minDay = Math.min(...scurveData.map(d => d.days));
                  const maxDay = Math.max(...scurveData.map(d => d.days));
                  const xPercent = ((interval.daysFromStart - minDay) / (maxDay - minDay)) * 85 + 10; // Account for margins
                  
                  let color = '#6b7280';
                  if (interval.level === 0.5) color = '#3b82f6';
                  if (interval.level === 0.8) color = '#f59e0b';
                  if (interval.level === 0.95) color = '#ef4444';
                  
                  return (
                    <g key={`overlay-${interval.level}`}>
                      <line
                        x1={`${xPercent}%`}
                        y1="15%"
                        x2={`${xPercent}%`}
                        y2="85%"
                        stroke={color}
                        strokeWidth="2"
                        strokeDasharray="6 3"
                        vectorEffect="non-scaling-stroke"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scurveData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
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
                  formatter={formatTooltip}
                  labelFormatter={(value) => `Day ${value}`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="probability" 
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#scurveGradient)"
                />
                


                <defs>
                  <linearGradient id="scurveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
            {/* Legend for S-curve */}
            <div className="flex justify-center mt-4 space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-blue-500" style={{borderTop: '2px dashed #3b82f6'}}></div>
                <span className="text-sm text-muted-foreground">P50 (50% confidence)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-amber-500" style={{borderTop: '2px dashed #f59e0b'}}></div>
                <span className="text-sm text-muted-foreground">P80 (80% confidence)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-red-500" style={{borderTop: '2px dashed #ef4444'}}></div>
                <span className="text-sm text-muted-foreground">P95 (95% confidence)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistical Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gauge className="w-5 h-5" />
            <span>Statistical Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Central Tendency</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <StatTooltip explanation="Average completion time across all simulation trials. Can be affected by extreme values.">
                    <span className="text-muted-foreground">Mean:</span>
                  </StatTooltip>
                  <span className="font-medium">{result.statistics.mean.toFixed(1)} days</span>
                </div>
                <div className="flex justify-between">
                  <StatTooltip explanation="Middle value when all completion times are sorted. Less affected by extreme values, often more realistic for planning.">
                    <span className="text-muted-foreground">Median:</span>
                  </StatTooltip>
                  <span className="font-medium">{result.statistics.median.toFixed(1)} days</span>
                </div>
                <div className="flex justify-between">
                  <StatTooltip explanation="Most frequently occurring completion time in the simulation results.">
                    <span className="text-muted-foreground">Mode:</span>
                  </StatTooltip>
                  <span className="font-medium">{histogramData.reduce((a, b) => a.frequency > b.frequency ? a : b).days} days</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Variability</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <StatTooltip explanation="Standard Deviation measures how spread out the completion times are. Lower values indicate more predictable outcomes.">
                    <span className="text-muted-foreground">Std Dev:</span>
                  </StatTooltip>
                  <span className="font-medium">{result.statistics.standardDeviation.toFixed(1)} days</span>
                </div>
                <div className="flex justify-between">
                  <StatTooltip explanation="Coefficient of Variation (CV) = Standard Deviation / Mean. Shows relative variability. <15% = Low risk, 15-30% = Medium risk, >30% = High risk.">
                    <span className="text-muted-foreground">CV:</span>
                  </StatTooltip>
                  <span className="font-medium">{(riskAssessment.cv * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <StatTooltip explanation="Difference between fastest and slowest completion times in the simulation. Shows the total spread of possible outcomes.">
                    <span className="text-muted-foreground">Range:</span>
                  </StatTooltip>
                  <span className="font-medium">{riskAssessment.range.toFixed(0)} days</span>
                </div>
              </div>
            </div>


          </div>
        </CardContent>
      </Card>
    </div>
  );
}