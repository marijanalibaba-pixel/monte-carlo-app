import { useState } from "react";
import { Calculator, TrendingUp, BarChart3, Calendar, Zap } from "lucide-react";
import { SimulationInput, runMonteCarloSimulation, SimulationResult } from "@/lib/monte-carlo";
import { ModernInputSection } from "@/components/modern-input-section";
import { ModernResultsSection } from "@/components/modern-results-section";
import forecastLogo from "@assets/ChatGPT Image Aug 18, 2025, 10_50_05 PM_1755599064681.png";

export function Dashboard() {
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleSimulation = async (input: SimulationInput) => {
    setIsCalculating(true);
    try {
      const result = runMonteCarloSimulation(input);
      setResults(result);
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                  <img src={forecastLogo} alt="Forecast Pro Logo" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Forecast Pro
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  Monte Carlo Project Forecasting
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="hidden sm:flex items-center space-x-1 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full">
                <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!results ? (
          /* Welcome Screen */
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full mb-6">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Statistical Forecasting Tool
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Predict Your Project
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Completion Date
              </span>
            </h2>
            
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
              Use advanced Monte Carlo simulations to forecast project timelines with confidence intervals and visualizations
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 max-w-4xl mx-auto">
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Throughput Analysis
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Analyze team velocity and completion patterns
                </p>
              </div>
              
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  S-Curve Modeling
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Visualize cumulative probability distributions
                </p>
              </div>
              
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Date Predictions
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Get P50, P80, and P95 completion forecasts
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Results Header */
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Forecast Complete
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Your Project Timeline
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Based on {results.statistics.trials.toLocaleString()} Monte Carlo simulations
            </p>
          </div>
        )}

        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <ModernInputSection 
                onSimulate={handleSimulation} 
                isCalculating={isCalculating}
              />
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-8">
            {results ? (
              <ModernResultsSection 
                results={results} 
                startDate={new Date()} 
              />
            ) : (
              <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-3xl p-8 sm:p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Calculator className="w-10 h-10 text-slate-500 dark:text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Ready for Analysis
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Enter your project parameters and run a simulation to see detailed forecasts and visualizations
                </p>
                <div className="inline-flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                  <span>Waiting for input</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 border-t border-slate-200/50 dark:border-slate-700/50 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Powered by Monte Carlo simulation • Built for mobile and desktop
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}