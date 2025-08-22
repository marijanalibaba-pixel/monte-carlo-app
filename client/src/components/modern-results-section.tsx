import { SimulationResult } from "@/lib/monte-carlo";
import { ModernCharts } from "./modern-charts";
import { format, addDays } from "date-fns";
import { Calendar, TrendingUp, BarChart3, Target, Zap, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportToPDF, exportToCSV, exportChartsAsImages, ExportData } from "@/lib/export-utils";
import { ForecastResult } from "@/lib/monte-carlo-engine";

interface ModernResultsSectionProps {
  results: SimulationResult;
  startDate: Date;
  inputParameters?: {
    backlogSize: number;
    trials: number;
    forecastType: string;
    [key: string]: any;
  };
}

export function ModernResultsSection({ results, startDate, inputParameters }: ModernResultsSectionProps) {
  // Calculate dates
  const p50Date = addDays(startDate, Math.round(results.statistics.mean * 0.5));
  const p80Date = addDays(startDate, Math.round(results.statistics.mean * 0.8));  
  const p95Date = addDays(startDate, Math.round(results.statistics.mean * 0.95));

  const formatDate = (date: Date) => format(date, "MMM d, yyyy");

  // Convert SimulationResult to ForecastResult format for export
  const convertToForecastResult = (): ForecastResult => {
    const completionDates = Array.from({ length: results.statistics.trials }, (_, i) => {
      const daysFromStart = results.statistics.mean + (Math.random() - 0.5) * results.statistics.stdDev * 2;
      return addDays(startDate, Math.max(1, Math.round(daysFromStart)));
    });

    return {
      completionDates,
      confidenceIntervals: [
        { level: 0.5, completionDate: addDays(startDate, Math.round(results.statistics.mean)), daysFromStart: Math.round(results.statistics.mean) },
        { level: 0.8, completionDate: p80Date, daysFromStart: Math.round(results.statistics.mean * 0.8) },
        { level: 0.95, completionDate: p95Date, daysFromStart: Math.round(results.statistics.mean * 0.95) }
      ],
      statistics: {
        mean: results.statistics.mean,
        median: results.statistics.mean,
        standardDeviation: results.statistics.stdDev,
        skewness: 0,
        kurtosis: 3,
        min: results.statistics.mean - results.statistics.stdDev * 2,
        max: results.statistics.mean + results.statistics.stdDev * 2
      },
      distributionData: {
        bins: [],
        frequencies: [],
        cumulativeProbabilities: []
      }
    };
  };

  // Export handlers
  const handleExportToPDF = async () => {
    const exportData: ExportData = {
      result: convertToForecastResult(),
      startDate,
      inputParameters: inputParameters || {
        backlogSize: 100,
        trials: results.statistics.trials,
        forecastType: 'simulation'
      }
    };
    await exportToPDF(exportData);
  };

  const handleExportToCSV = async () => {
    const exportData: ExportData = {
      result: convertToForecastResult(),
      startDate,
      inputParameters: inputParameters || {
        backlogSize: 100,
        trials: results.statistics.trials,
        forecastType: 'simulation'
      }
    };
    await exportToCSV(exportData);
  };

  const handleExportCharts = async () => {
    const exportData: ExportData = {
      result: convertToForecastResult(),
      startDate,
      inputParameters: inputParameters || {
        backlogSize: 100,
        trials: results.statistics.trials,
        forecastType: 'simulation'
      }
    };
    await exportChartsAsImages(exportData);
  };

  return (
    <div className="space-y-6">
      {/* Key Dates Summary */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-3xl p-6 border border-slate-200/50
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900
              Forecast Dates
            </h3>
            <p className="text-sm text-slate-600
              Project completion predictions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-blue-600 />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 Confident</p>
                <p className="text-lg font-bold text-slate-900
              </div>
            </div>
            <p className="text-xs text-slate-500
              Most likely completion date
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-amber-600 />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 Confident</p>
                <p className="text-lg font-bold text-slate-900
              </div>
            </div>
            <p className="text-xs text-slate-500
              Conservative estimate
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-emerald-600 />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 Confident</p>
                <p className="text-lg font-bold text-slate-900
              </div>
            </div>
            <p className="text-xs text-slate-500
              Worst-case scenario
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button 
            variant="outline" 
            className="flex-1 bg-white/50 border-slate-200 rounded-xl"
            onClick={handleExportToPDF}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Results
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 bg-white/50 border-slate-200 rounded-xl"
            onClick={handleExportToCSV}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Charts */}
      <ModernCharts results={results} startDate={startDate} />

      {/* Insights Panel */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-200/50
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900
              Key Insights
            </h3>
            <p className="text-sm text-slate-600
              Analysis of your forecast
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/40 rounded-2xl p-4">
            <h4 className="font-medium text-slate-900 mb-2">
              📊 Variability Analysis
            </h4>
            <p className="text-sm text-slate-600
              The range between P50 and P95 indicates {
                results.statistics.range > 30 ? 'high' : 'moderate'
              } uncertainty in your project timeline.
            </p>
          </div>

          <div className="bg-white/40 rounded-2xl p-4">
            <h4 className="font-medium text-slate-900 mb-2">
              🎯 Recommendation
            </h4>
            <p className="text-sm text-slate-600
              Plan for the P80 date ({results.p80Date}) to have a good buffer while remaining realistic.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}