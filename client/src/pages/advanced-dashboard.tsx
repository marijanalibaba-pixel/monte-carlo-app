import { useState } from "react";
import { track } from '@vercel/analytics';
import { exportToPDF, exportToCSV, exportChartsAsImages, ExportData } from "@/lib/export-utils";
import { MonteCarloEngine, ThroughputConfig, CycleTimeConfig, SimulationConfig, ForecastResult } from "@/lib/monte-carlo-engine";
import { ForecastScenario } from "@/lib/forecast-comparison";
import { AdvancedInputForm } from "@/components/advanced-input-form";
import { AdvancedVisualization } from "@/components/advanced-visualization";
import { ForecastComparisonPanel } from "@/components/forecast-comparison-panel";
import { CalculationMethodology } from "@/components/calculation-methodology";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import forecastLogo from "@assets/ChatGPT Image Aug 18, 2025, 10_50_05 PM_1755599064681.png";
import { 
  Calculator, 
  TrendingUp, 
  BarChart3, 
  Zap, 
  Brain, 
  Target,
  ArrowRight,
  Sparkles,
  Activity,
  GitCompare,
  Download,
  FileText,
  Image
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
        
        // Track forecast completion
        track('forecast_completed', {
          model_type: 'throughput',
          backlog_size: throughputConfig.backlogSize,
          trials: simConfig.trials,
          has_historical_data: !!throughputConfig.historicalThroughput,
          has_capacity_limit: !!throughputConfig.weeklyCapacity,
          has_risk_factors: (simConfig.riskFactors?.length || 0) > 0,
          has_dependencies: !!simConfig.includeDependencies
        });
      } else if (cycleTimeConfig) {
        forecastResult = MonteCarloEngine.forecastByCycleTime(cycleTimeConfig, simConfig);
        setLastConfig({ 
          type: 'cycletime', 
          startDate: simConfig.startDate,
          parameters: cycleTimeConfig 
        });
        
        // Track forecast completion
        track('forecast_completed', {
          model_type: 'cycletime',
          backlog_size: cycleTimeConfig.backlogSize,
          trials: simConfig.trials,
          p50_cycle_time: cycleTimeConfig.p50CycleTime,
          p80_cycle_time: cycleTimeConfig.p80CycleTime,
          p95_cycle_time: cycleTimeConfig.p95CycleTime,
          has_risk_factors: (simConfig.riskFactors?.length || 0) > 0,
          has_dependencies: !!simConfig.includeDependencies
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
    
    // Track scenario save
    track('scenario_saved', {
      model_type: lastConfig.type,
      total_scenarios: scenarios.length + 1,
      backlog_size: lastConfig.parameters?.backlogSize || 0
    });
  };

  const removeScenario = (scenarioId: string) => {
    setScenarios(prev => prev.filter(s => s.id !== scenarioId));
  };

  const clearAllScenarios = () => {
    setScenarios([]);
    setShowComparison(false);
  };

  // Export handlers
  const handleExportToPDF = async () => {
    if (!result || !lastConfig) return;
    
    const exportData: ExportData = {
      result,
      startDate: lastConfig.startDate,
      inputParameters: {
        backlogSize: lastConfig.parameters?.backlogSize || 100,
        trials: result.statistics ? 10000 : 1000,
        forecastType: lastConfig.type
      }
    };
    await exportToPDF(exportData);
  };

  const handleExportToCSV = async () => {
    if (!result || !lastConfig) return;
    
    const exportData: ExportData = {
      result,
      startDate: lastConfig.startDate,
      inputParameters: {
        backlogSize: lastConfig.parameters?.backlogSize || 100,
        trials: result.statistics ? 10000 : 1000,
        forecastType: lastConfig.type
      }
    };
    await exportToCSV(exportData);
  };

  const handleExportCharts = async () => {
    if (!result || !lastConfig) return;
    
    const exportData: ExportData = {
      result,
      startDate: lastConfig.startDate,
      inputParameters: {
        backlogSize: lastConfig.parameters?.backlogSize || 100,
        trials: result.statistics ? 10000 : 1000,
        forecastType: lastConfig.type
      }
    };
    await exportChartsAsImages(exportData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 min-w-0">
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                  <img src={forecastLogo} alt="Forecast Pro Logo" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent truncate">Flow Forecasting</h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate">Flow-based probabilistic dates with SLEs, histograms & S-curves</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
              <Badge variant="outline" className="bg-emerald-50 border-emerald-200 text-emerald-700 hidden sm:flex">
                <Activity className="w-3 h-3 mr-1" />
                Real-time
              </Badge>
              {scenarios.length > 0 && (
                <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700 hidden md:flex">
                  <GitCompare className="w-3 h-3 mr-1" />
                  {scenarios.length} scenarios
                </Badge>
              )}
              {result && (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button variant="outline" size="sm" onClick={saveAsScenario} className="text-xs sm:text-sm px-2 sm:px-3">
                    <span className="hidden sm:inline">Save Scenario</span>
                    <span className="sm:hidden">Save</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearResults} className="text-xs sm:text-sm px-2 sm:px-3">
                    <span className="hidden sm:inline">New Forecast</span>
                    <span className="sm:hidden">New</span>
                  </Button>
                </div>
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
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-8 shadow-lg">
                <Calculator className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                Forecast with
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Statistical Precision
                </span>
              </h2>
              
              <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">Monte Carlo modeling with Completion Time Distribution, Cumulative Probability (S-Curve), and risk analysis</p>

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
            {/* Mobile Landscape Tip */}
            <div className="sm:hidden bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-200">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium">
                  For the best viewing experience of charts and data, try rotating to landscape mode
                </p>
              </div>
            </div>
            
            {/* Results Header */}
            <Card className="border-none bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl">Forecast Complete</CardTitle>
                <CardDescription className="text-lg">
                  Analysis of {result.completionDates.length.toLocaleString()} Monte Carlo simulations
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export Results</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleExportToPDF}>
                      <FileText className="w-4 h-4 mr-2" />
                      Export PDF Report
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportToCSV}>
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV Data
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportCharts}>
                      <Image className="w-4 h-4 mr-2" />
                      Export Chart Images
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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