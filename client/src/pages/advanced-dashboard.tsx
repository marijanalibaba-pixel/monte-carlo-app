import { useState } from "react";
import { track } from '@vercel/analytics';
import { Link } from "wouter";
import { exportToPDF, exportToCSV, ExportData } from "@/lib/export-utils";
import { MonteCarloEngine, ThroughputConfig, CycleTimeConfig, SimulationConfig, ForecastResult } from "@/lib/monte-carlo-engine";
import { ForecastScenario } from "@/lib/forecast-comparison";
import { AdvancedInputForm } from "@/components/advanced-input-form";
import { AdvancedVisualization } from "@/components/advanced-visualization";
import { ForecastComparisonPanel } from "@/components/forecast-comparison-panel";
import { CalculationMethodology } from "@/components/calculation-methodology";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Image,
  BookOpen,
  Calendar,
  Percent
} from "lucide-react";

export function AdvancedDashboard() {
  const [mode, setMode] = useState<'forecast' | 'probability' | 'target'>('forecast');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ForecastResult | null>(null);
  const [scenarios, setScenarios] = useState<ForecastScenario[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [lastConfig, setLastConfig] = useState<{
    type: 'throughput' | 'cycletime';
    startDate: Date;
    parameters?: any;
    mode?: string;
    targetDate?: Date;
  } | null>(null);

  const handleForecast = async (
    throughputConfig?: ThroughputConfig,
    cycleTimeConfig?: CycleTimeConfig,
    simConfig?: SimulationConfig,
    targetDate?: Date
  ) => {
    if (!simConfig) return;
    
    setIsRunning(true);
    
    try {
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 100));
      
      let forecastResult: ForecastResult;
      
      if (mode === 'forecast') {
        // Standard forecasting mode
        if (throughputConfig) {
          forecastResult = MonteCarloEngine.forecastByThroughput(throughputConfig, simConfig);
        } else if (cycleTimeConfig) {
          forecastResult = MonteCarloEngine.forecastByCycleTime(cycleTimeConfig, simConfig);
        } else {
          throw new Error('No configuration provided');
        }
      } else if (mode === 'probability' && targetDate) {
        // Probability calculation mode
        if (throughputConfig) {
          forecastResult = MonteCarloEngine.calculateCompletionProbability(simConfig, targetDate, throughputConfig, undefined);
        } else if (cycleTimeConfig) {
          forecastResult = MonteCarloEngine.calculateCompletionProbability(simConfig, targetDate, undefined, cycleTimeConfig);
        } else {
          throw new Error('No configuration provided');
        }
      } else if (mode === 'target' && targetDate) {
        // Reverse calculation mode
        if (throughputConfig) {
          forecastResult = MonteCarloEngine.calculateTargetRequirements(simConfig, targetDate, throughputConfig, undefined);
        } else if (cycleTimeConfig) {
          forecastResult = MonteCarloEngine.calculateTargetRequirements(simConfig, targetDate, undefined, cycleTimeConfig);
        } else {
          throw new Error('No configuration provided');
        }
      } else {
        throw new Error('Invalid mode or missing target date');
      }
      
      setLastConfig({ 
        type: throughputConfig ? 'throughput' : 'cycletime',
        startDate: simConfig.startDate,
        parameters: throughputConfig || cycleTimeConfig,
        mode,
        targetDate
      });
      
      // Track forecast completion
      track('forecast_completed', {
        mode,
        model_type: throughputConfig ? 'throughput' : 'cycletime',
        backlog_size: throughputConfig?.backlogSize || cycleTimeConfig?.backlogSize || 0,
        trials: simConfig.trials,
        has_target_date: !!targetDate,
        has_risk_factors: (simConfig.riskFactors?.length || 0) > 0,
        has_dependencies: !!simConfig.includeDependencies
      });
      
      setResult(forecastResult);
      
      // Scroll to top of results section after forecast completes
      setTimeout(() => {
        const resultsElement = document.getElementById('forecast-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // Fallback to scrolling to top if element not found
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 150); // Small delay to ensure results are rendered
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
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
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent truncate">Flow Forecasting</h1>
                <p className="text-xs sm:text-sm text-slate-600 truncate pt-[2px] pb-[2px]">Flow-based probabilistic dates 
                with SLEs, histograms & S-curves </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
              <Link href="/support">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                  <BookOpen className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Help</span>
                  <span className="sm:hidden">Help</span>
                </Button>
              </Link>
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
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
                Forecast with
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Statistical Precision
                </span>
              </h2>
              
              <p className="text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto mb-8">Monte Carlo modeling with Completion Time Distribution, Cumulative Probability (S-Curve), and risk analysis</p>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Advanced Distributions
                  </h3>
                  <p className="text-sm text-slate-600">
                    Lognormal, gamma, and beta distributions for realistic modeling
                  </p>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Bootstrap Sampling
                  </h3>
                  <p className="text-sm text-slate-600">
                    Use your historical data for authentic forecasting
                  </p>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Risk Analysis
                  </h3>
                  <p className="text-sm text-slate-600">
                    Comprehensive risk factors and dependency modeling
                  </p>
                </div>
              </div>
            </div>
            {/* Input Form */}
            {/* Mode Selection */}
            <Card className="border-2 border-dashed border-blue-200 bg-blue-50/30">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg">Choose Analysis Mode</CardTitle>
                <CardDescription>Select the type of analysis you want to perform</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={mode} onValueChange={(value) => setMode(value as 'forecast' | 'probability' | 'target')} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="forecast" className="flex items-center space-x-2">
                      <Calculator className="w-4 h-4" />
                      <span>Forecast</span>
                    </TabsTrigger>
                    <TabsTrigger value="probability" className="flex items-center space-x-2">
                      <Percent className="w-4 h-4" />
                      <span>Probability</span>
                    </TabsTrigger>
                    <TabsTrigger value="target" className="flex items-center space-x-2">
                      <Target className="w-4 h-4" />
                      <span>Target</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="mt-6 text-center">
                    {mode === 'forecast' && (
                      <div className="space-y-2">
                        <h3 className="font-semibold text-blue-700">Forecasting</h3>
                        <p className="text-sm text-blue-600">When your project will complete based on current parameters</p>
                      </div>
                    )}
                    {mode === 'probability' && (
                      <div className="space-y-2">
                        <h3 className="font-semibold text-green-700">Probability</h3>
                        <p className="text-sm text-green-600">The probability of completing by a specific target date</p>
                      </div>
                    )}
                    {mode === 'target' && (
                      <div className="space-y-2">
                        <h3 className="font-semibold text-purple-700">Date Calculator</h3>
                        <p className="text-sm text-purple-600">The best start date to hit your target deadline</p>
                      </div>
                    )}
                  </div>
                </Tabs>
              </CardContent>
            </Card>

            <AdvancedInputForm mode={mode} onForecast={handleForecast} isRunning={isRunning} />
          </div>)
        ) : (
          /* Results Phase */
          (<div id="forecast-results" className="space-y-8">
            {/* Mobile Landscape Tip */}
            <div className="sm:hidden bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-amber-800">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium">
                  For the best viewing experience of charts and data, try rotating to landscape mode
                </p>
              </div>
            </div>
            
            {/* Results Header */}
            <Card className="border-none bg-gradient-to-r from-emerald-50 to-teal-50">
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
              mode={lastConfig?.mode as 'forecast' | 'probability' | 'target' || 'forecast'}
              targetDate={lastConfig?.targetDate}
            />
            {/* Actions */}
            <div className="text-center pt-8 border-t border-slate-200">
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
      {/* Footer */}
      <div className="mt-20 border-t border-slate-200/50 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <p className="text-sm text-slate-500">
              Powered by advanced statistical modeling • Built for professional forecasting
            </p>
            
            {/* Support Section */}
            <div className="max-w-2xl mx-auto">
              <p className="text-xs text-slate-400 mb-3">
                If you like this little app and want to see more experiments like this, consider buying us a coffee. Every small support helps us keep building cool and free stuff that (hopefully) makes life a bit easier.
              </p>
              <div className="flex justify-center items-center space-x-6">
                <a 
                  href="https://buymeacoffee.com/flowforcasting" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-xs text-amber-600 hover:text-amber-700 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-.766-1.645a4.32 4.32 0 0 0-1.513-1.147c-.6-.28-1.248-.42-1.897-.41H6.39c-.65-.01-1.297.13-1.897.41a4.32 4.32 0 0 0-1.513 1.147c-.378.482-.647 1.047-.766 1.645L2.082 7.81c-.07.351-.05.713.058 1.054.108.341.297.65.55.896.253.246.567.426.913.523.346.097.708.109 1.058.035L6.39 9.653c.65.01 1.297-.13 1.897-.41a4.32 4.32 0 0 0 1.513-1.147c.378-.482.647-1.047.766-1.645L10.698 6c.119-.598.388-1.163.766-1.645a4.32 4.32 0 0 1 1.513-1.147c.6-.28 1.248-.42 1.897-.41h3.517c.65-.01 1.297.13 1.897.41a4.32 4.32 0 0 1 1.513 1.147c.378.482.647 1.047.766 1.645l.132.451z"/>
                  </svg>
                  <span>Buy Me Coffee</span>
                </a>
                <span className="text-slate-300">•</span>
                <a 
                  href="https://paypal.me/mtrnski" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.028-.026.057-.039.085-.94 4.814-4.169 6.523-8.097 6.523h-2.29c-.67 0-1.238.482-1.365 1.153l-.69 4.353-.066.412L6.26 22.7a.641.641 0 0 0 .633.737h4.607c.524 0 .968-.382 1.05-.9l.12-.76.445-2.817.029-.179c.082-.518.526-.9 1.05-.9h.66c3.533 0 6.295-1.336 7.102-5.202.337-1.615.203-2.963-.57-3.902z"/>
                  </svg>
                  <span>PayPal</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}