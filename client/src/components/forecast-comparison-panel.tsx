import React, { useState } from "react";
import { ForecastScenario, ComparisonMetrics, ForecastComparison } from "@/lib/forecast-comparison";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, Cell
} from "recharts";
import { 
  GitCompare, 
  TrendingUp, 
  AlertTriangle, 
  Award, 
  Target,
  BarChart3,
  Activity,
  Zap,
  CheckCircle,
  XCircle,
  Minus
} from "lucide-react";
import { format } from "date-fns";

interface ForecastComparisonPanelProps {
  scenarios: ForecastScenario[];
  onRemoveScenario: (scenarioId: string) => void;
  onClearAll: () => void;
}

export function ForecastComparisonPanel({ 
  scenarios, 
  onRemoveScenario, 
  onClearAll 
}: ForecastComparisonPanelProps) {
  const [comparison, setComparison] = useState<ComparisonMetrics | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>('median');

  // Generate comparison when scenarios change
  React.useEffect(() => {
    if (scenarios.length >= 2) {
      const comparisonResult = ForecastComparison.compareForecasts(scenarios);
      setComparison(comparisonResult);
    } else {
      setComparison(null);
    }
  }, [scenarios]);

  if (scenarios.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <GitCompare className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            No Scenarios to Compare
          </h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            Run multiple forecasts to compare different scenarios and analyze trade-offs
          </p>
        </CardContent>
      </Card>
    );
  }

  if (scenarios.length === 1) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GitCompare className="w-5 h-5" />
            <span>Scenario Comparison</span>
          </CardTitle>
          <CardDescription>
            Add more scenarios to enable comparison analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-semibold">{scenarios[0].name}</h4>
                <p className="text-sm text-muted-foreground">
                  {Math.round(scenarios[0].result.statistics.median)} days median
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemoveScenario(scenarios[0].id)}
              >
                Remove
              </Button>
            </div>
            <p className="text-sm text-muted-foreground text-center py-4">
              Run additional forecasts with different parameters to compare scenarios
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!comparison) return null;

  // Prepare data for visualizations
  const comparisonData = scenarios.map((scenario, index) => ({
    name: scenario.name,
    median: scenario.result.statistics.median,
    mean: scenario.result.statistics.mean,
    stdDev: scenario.result.statistics.standardDeviation,
    cv: (scenario.result.statistics.standardDeviation / scenario.result.statistics.mean) * 100,
    p80: scenario.result.confidenceIntervals.find(ci => ci.level === 0.8)?.daysFromStart || 0,
    p95: scenario.result.confidenceIntervals.find(ci => ci.level === 0.9)?.daysFromStart || 0,
    min: scenario.result.statistics.min,
    max: scenario.result.statistics.max,
    color: getScenarioColor(index)
  }));

  const confidenceComparisonData = comparison.confidenceIntervals.map(ci => {
    const dataPoint: any = { level: `P${Math.round(ci.level * 100)}` };
    ci.scenarios.forEach(scenario => {
      const scenarioData = scenarios.find(s => s.id === scenario.scenarioId);
      if (scenarioData) {
        dataPoint[scenarioData.name] = scenario.days;
      }
    });
    return dataPoint;
  });

  // Risk assessment colors
  const getRiskColor = (scenario: ForecastScenario) => {
    const cv = scenario.result.statistics.standardDeviation / scenario.result.statistics.mean;
    if (cv < 0.2) return 'text-emerald-600 bg-emerald-50';
    if (cv < 0.4) return 'text-yellow-600 bg-yellow-50';
    if (cv < 0.6) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getRiskLevel = (scenario: ForecastScenario) => {
    const cv = scenario.result.statistics.standardDeviation / scenario.result.statistics.mean;
    if (cv < 0.2) return 'Low';
    if (cv < 0.4) return 'Medium';
    if (cv < 0.6) return 'High';
    return 'Very High';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <GitCompare className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Scenario Comparison</CardTitle>
                <CardDescription>
                  Analyzing {scenarios.length} forecast scenarios
                </CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onClearAll}>
              Clear All
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Scenarios Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Scenarios Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map((scenario, index) => (
              <div 
                key={scenario.id}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold truncate">{scenario.name}</h4>
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getScenarioColor(index) }}
                  />
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Median:</span>
                    <span className="font-medium">{Math.round(scenario.result.statistics.median)}d</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">P80:</span>
                    <span className="font-medium">
                      {scenario.result.confidenceIntervals.find(ci => ci.level === 0.8)?.daysFromStart || 0}d
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk:</span>
                    <Badge className={getRiskColor(scenario)} variant="outline">
                      {getRiskLevel(scenario)}
                    </Badge>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t">
                  <span className="text-xs text-muted-foreground">
                    {format(scenario.createdAt, 'MMM d, HH:mm')}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveScenario(scenario.id)}
                    className="h-8 w-8 p-0"
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Comparison */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="confidence">Confidence</TabsTrigger>
          <TabsTrigger value="recommendations">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Duration Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="median" name="Median (days)" radius={[4, 4, 0, 0]}>
                      {comparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk vs Duration Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                    <XAxis 
                      dataKey="median" 
                      tick={{ fontSize: 12 }}
                      name="Median Duration"
                      label={{ value: 'Median Duration (days)', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      dataKey="cv"
                      tick={{ fontSize: 12 }}
                      name="Risk"
                      label={{ value: 'Risk (CV %)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        typeof value === 'number' ? value.toFixed(1) : value,
                        name === 'cv' ? 'Risk (CV %)' : name
                      ]}
                      labelFormatter={(value) => `Scenario: ${value}`}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Scatter dataKey="cv" fill="#8884d8">
                      {comparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistical Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Central Tendency</h4>
                  <div className="space-y-3">
                    {comparisonData.map((scenario, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: scenario.color }}
                          />
                          <span className="font-medium">{scenario.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{scenario.median.toFixed(1)}d</div>
                          <div className="text-xs text-muted-foreground">median</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Risk Metrics</h4>
                  <div className="space-y-3">
                    {comparisonData.map((scenario, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: scenario.color }}
                          />
                          <span className="font-medium">{scenario.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{scenario.cv.toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">CV</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="confidence" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Confidence Intervals Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={confidenceComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="level" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    {scenarios.map((scenario, index) => (
                      <Line
                        key={scenario.id}
                        type="monotone"
                        dataKey={scenario.name}
                        stroke={getScenarioColor(index)}
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Analysis & Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Insights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200"
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-semibold text-emerald-900 Case</h4>"
                  </div>
                  <p className="text-emerald-800"
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900"
                  </div>
                  <p className="text-blue-800"
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200"
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <h4 className="font-semibold text-orange-900 Case</h4>"
                  </div>
                  <p className="text-orange-800"
                </div>
              </div>

              {/* Detailed Reasoning */}
              <div className="space-y-3">
                <h4 className="font-semibold">Detailed Analysis</h4>
                <div className="space-y-2">
                  {comparison.recommendations.reasoning.map((reason, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 bg-muted/50 rounded-lg">
                      <Zap className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Utility function to get consistent colors for scenarios
function getScenarioColor(index: number): string {
  const colors = [
    '#3b82f6', // Blue
    '#10b981', // Emerald  
    '#f59e0b', // Amber
    '#8b5cf6', // Purple
    '#ef4444', // Red
    '#06b6d4', // Cyan
    '#84cc16', // Lime
    '#f97316', // Orange
    '#ec4899', // Pink
    '#6366f1', // Indigo
  ];
  return colors[index % colors.length];
}