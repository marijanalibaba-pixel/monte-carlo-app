import { SimulationResult } from "@/lib/monte-carlo";
import { format } from "date-fns";
import { HistogramChart } from "./charts/histogram-chart";
import { SCurveChart } from "./charts/scurve-chart";

interface ResultsSectionProps {
  results: SimulationResult;
  startDate: Date;
}

export function ResultsSection({ results, startDate }: ResultsSectionProps) {
  const formatResultDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  return (
    <div>
      {/* Percentile Results */}
      <div className="bg-gradient-to-r from-[hsl(var(--primary-50))] to-blue-50 rounded-lg border border-[hsl(var(--primary))/10] p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Completion Date Forecast</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-[hsl(var(--primary-600))]">
              {formatResultDate(results.p50Date)}
            </div>
            <div className="text-sm font-medium text-gray-700 mt-1">P50 (50% confidence)</div>
            <div className="text-xs text-gray-500 mt-1">Median completion date</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[hsl(var(--primary-600))]">
              {formatResultDate(results.p80Date)}
            </div>
            <div className="text-sm font-medium text-gray-700 mt-1">P80 (80% confidence)</div>
            <div className="text-xs text-gray-500 mt-1">Conservative estimate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[hsl(var(--primary-600))]">
              {formatResultDate(results.p95Date)}
            </div>
            <div className="text-sm font-medium text-gray-700 mt-1">P95 (95% confidence)</div>
            <div className="text-xs text-gray-500 mt-1">Worst-case scenario</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HistogramChart results={results} startDate={startDate} />
        <SCurveChart results={results} startDate={startDate} />
      </div>

      {/* Statistical Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
        <h4 className="text-base font-semibold text-gray-900 mb-4">Statistical Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-lg font-semibold text-gray-900">
              {results.statistics.trials.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Trials</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-lg font-semibold text-gray-900">
              {results.statistics.mean}
            </div>
            <div className="text-sm text-gray-600">Mean (days)</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-lg font-semibold text-gray-900">
              {results.statistics.stdDev}
            </div>
            <div className="text-sm text-gray-600">Std Dev (days)</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-lg font-semibold text-gray-900">
              {results.statistics.range}
            </div>
            <div className="text-sm text-gray-600">Range (days)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
