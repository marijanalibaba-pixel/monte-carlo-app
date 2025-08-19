import { useState } from "react";
import { MonteCarloEngine, ThroughputConfig, CycleTimeConfig, SimulationConfig, ForecastResult } from "@/lib/monte-carlo-engine";
import { ForecastScenario } from "@/lib/forecast-comparison";
import { AdvancedInputForm } from "@/components/advanced-input-form";
import { AdvancedVisualization } from "@/components/advanced-visualization";
import { ForecastComparisonPanel } from "@/components/forecast-comparison-panel";
import { CalculationMethodology } from "@/components/calculation-methodology";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calculator, 
  TrendingUp, 
  BarChart3, 
  Zap, 
  BarChart, 
  Target,
  ArrowRight,
  Sparkles,
  Activity,
  GitCompare
} from "lucide-react";

export function AdvancedDashboard() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ForecastResult | null>(null);
  const [scenarios, setScenarios] = useState<ForecastScenario[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [lastConfig, setLastConfig] = useState<{
    type: 'throughput' | 'cycletime';
    startDate: Date;
    parameters?: any;
  } | null>(null);

  const handleForecast = async (
    throughputConfig?: ThroughputConfig,
    cycleTimeConfig?: CycleTimeConfig,
    simConfig?: SimulationConfig
  ) => {
    if (!simConfig) return;
    
    setIsRunning(true);
    
    try {
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 100));
      
      let forecastResult: ForecastResult;
      
      if (throughputConfig) {
        forecastResult = MonteCarloEngine.forecastByThroughput(throughputConfig, simConfig);
        setLastConfig({ 
          type: 'throughput', 
          startDate: simConfig.startDate,
          parameters: throughputConfig 
        });
      } else if (cycleTimeConfig) {
        forecastResult = MonteCarloEngine.forecastByCycleTime(cycleTimeConfig, simConfig);
        setLastConfig({ 
          type: 'cycletime', 
          startDate: simConfig.startDate,
          parameters: cycleTimeConfig 
        });
      } else {
        throw new Error('No configuration provided');
      }
      
      setResult(forecastResult);
    } catch (error) {
      console.error('Forecast error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const clearResults = () => {
    setResult(null);
    setLastConfig(null);
  };

  const saveAsScenario = () => {
    if (!result || !lastConfig) return;
    
    const scenarioName = `Scenario ${scenarios.length + 1}`;
    const newScenario: ForecastScenario = {
      id: crypto.randomUUID(),
      name: scenarioName,
      description: `${lastConfig.type} analysis`,
      result,
      config: {
        type: lastConfig.type,
        backlogSize: lastConfig.parameters?.backlogSize || 0,
        startDate: lastConfig.startDate,
        parameters: lastConfig.parameters
      },
      createdAt: new Date()
    };
    
    setScenarios(prev => [...prev, newScenario]);
    setShowComparison(true);
  };

  const removeScenario = (scenarioId: string) => {
    setScenarios(prev => prev.filter(s => s.id !== scenarioId));
  };

  const clearAllScenarios = () => {
    setScenarios([]);
    setShowComparison(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <BarChart className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                  Monte Carlo Pro
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Advanced Statistical Forecasting Engine
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-emerald-50 border-emerald-200 text-emerald-700">
                <Activity className="w-3 h-3 mr-1" />
                Real-time
              </Badge>
              {scenarios.length > 0 && (
                <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
                  <GitCompare className="w-3 h-3 mr-1" />
                  {scenarios.length} scenarios
                </Badge>
              )}
              {result && (
                <>
                  <Button variant="outline" size="sm" onClick={saveAsScenario}>
                    Save Scenario
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearResults}>
                    New Forecast
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!result ? (
          /* Input Phase */
          (<div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full mb-6">
                <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Professional Montecarlo Simulation
                </span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                Forecast with
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Statistical Precision
                </span>
              </h2>
              
              <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">Advanced Montecarlo modeling with Completion Time Distributions, Cumulative Probability (S-Curve) and risk analysis</p>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Advanced Distributions
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Lognormal, gamma, and beta distributions for realistic modeling
                  </p>
                </div>
                
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Bootstrap Sampling
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Use your historical data for authentic forecasting
                  </p>
                </div>
                
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Risk Analysis
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Comprehensive risk factors and dependency modeling
                  </p>
                </div>
              </div>
            </div>
            {/* Input Form */}
            <AdvancedInputForm onForecast={handleForecast} isRunning={isRunning} />
          </div>)
        ) : (
          /* Results Phase */
          (<div className="space-y-8">
            {/* Results Header */}
            <Card className="border-none bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl">Forecast Complete</CardTitle>
                <CardDescription className="text-lg">
                  Analysis of {result.completionDates.length.toLocaleString()} Montecarlo simulations
                  {lastConfig && (
                    <span className="block mt-2">
                      <Badge variant="outline" className="mr-2">
                        {lastConfig.type === 'throughput' ? 'Throughput Model' : 'Cycle Time Model'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Started {lastConfig.startDate.toLocaleDateString()}
                      </span>
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
            </Card>
            {/* Visualization */}
            <AdvancedVisualization 
              result={result} 
              startDate={lastConfig?.startDate || new Date()} 
            />
            {/* Actions */}
            <div className="text-center pt-8 border-t border-slate-200 dark:border-slate-700">
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                <Button
                  onClick={saveAsScenario}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700"
                >
                  <GitCompare className="w-4 h-4" />
                  <span>Save for Comparison</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={clearResults}
                  className="flex items-center space-x-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Run New Forecast</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <span>Export Results</span>
                </Button>
              </div>
            </div>
          </div>)
        )}

        {/* Comparison Panel */}
        {(showComparison || scenarios.length > 0) && (
          <div className="mt-12">
            <ForecastComparisonPanel
              scenarios={scenarios}
              onRemoveScenario={removeScenario}
              onClearAll={clearAllScenarios}
            />
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="mt-20 border-t border-slate-200/50 dark:border-slate-700/50 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Powered by advanced statistical modeling • Built for professional forecasting
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}