import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ModelToggle } from "@/components/model-toggle";
import { InputSection } from "@/components/input-section";
import { ResultsSection } from "@/components/results-section";
import { runMonteCarloSimulation, SimulationResult } from "@/lib/monte-carlo";
import { AlertTriangle } from "lucide-react";

export default function ForecastPage() {
  const { toast } = useToast();
  
  // Model state
  const [useCycleTime, setUseCycleTime] = useState(false);
  
  // Shared inputs
  const [backlogSize, setBacklogSize] = useState(50);
  const [trials, setTrials] = useState(10000);
  const [startDate, setStartDate] = useState(new Date());
  
  // Throughput model inputs
  const [meanThroughput, setMeanThroughput] = useState(12);
  const [variabilityCV, setVariabilityCV] = useState(30);
  const [weeklyThroughputData, setWeeklyThroughputData] = useState("");
  
  // Cycle time model inputs
  const [p50CycleTime, setP50CycleTime] = useState(3.94);
  const [p80CycleTime, setP80CycleTime] = useState(14.6);
  const [p95CycleTime, setP95CycleTime] = useState(34.06);
  
  // Results
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Parse and validate weekly throughput data according to spec
  const parseWeeklyData = (): { values: number[], mean: number, median: number, stdDev: number, cv: number } | null => {
    if (!weeklyThroughputData.trim()) return null;
    
    // Parse comma-separated values, allowing integers >= 0 (zeros are valid for holidays/slow weeks)
    const values = weeklyThroughputData
      .split(',')
      .map(v => parseInt(v.trim(), 10))
      .filter(v => !isNaN(v) && v >= 0);
    
    // Require >= 8 weeks, ideally 13-26, but allow up to 30
    if (values.length < 8) {
      toast({
        title: "Invalid Data",
        description: "Please enter at least 8 weekly throughput values. Use 0 for holidays/slow weeks.",
        variant: "destructive",
      });
      return null;
    }
    
    if (values.length > 30) {
      toast({
        title: "Too Much Data",
        description: "Please enter no more than 30 weekly throughput values.",
        variant: "destructive",
      });
      return null;
    }
    
    // Check that at least one week has > 0 throughput
    if (values.every(v => v === 0)) {
      toast({
        title: "Invalid Data",
        description: "At least one week must have throughput > 0.",
        variant: "destructive",
      });
      return null;
    }
    
    // Calculate statistics
    const mean = values.reduce((a, b) => a + b) / values.length;
    const sortedValues = [...values].sort((a, b) => a - b);
    const median = sortedValues.length % 2 === 0 
      ? (sortedValues[sortedValues.length / 2 - 1] + sortedValues[sortedValues.length / 2]) / 2
      : sortedValues[Math.floor(sortedValues.length / 2)];
    
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    const cv = mean > 0 ? (stdDev / mean) * 100 : 0;
    
    return { 
      values, 
      mean: Math.round(mean * 10) / 10, 
      median: Math.round(median * 10) / 10,
      stdDev: Math.round(stdDev * 10) / 10, 
      cv: Math.round(cv * 10) / 10
    };
  };

  const validateInputs = (): boolean => {
    if (!backlogSize || backlogSize <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid backlog size greater than 0.",
        variant: "destructive",
      });
      return false;
    }

    if (!trials || trials < 1000 || trials > 50000) {
      toast({
        title: "Validation Error",
        description: "Please enter a number of trials between 1,000 and 50,000.",
        variant: "destructive",
      });
      return false;
    }

    if (useCycleTime) {
      if (!p50CycleTime || p50CycleTime <= 0 || !p95CycleTime || p95CycleTime <= 0) {
        toast({
          title: "Validation Error",
          description: "Please enter valid P50 and P95 cycle time values.",
          variant: "destructive",
        });
        return false;
      }
      
      if (p50CycleTime >= p95CycleTime) {
        toast({
          title: "Validation Error",
          description: "P95 must be greater than P50.",
          variant: "destructive",
        });
        return false;
      }

      if (p80CycleTime > 0 && (p80CycleTime <= p50CycleTime || p80CycleTime >= p95CycleTime)) {
        toast({
          title: "Validation Error",
          description: "P80 must be between P50 and P95.",
          variant: "destructive",
        });
        return false;
      }
    } else {
      // Check if using historical data or simple parameters
      const weeklyData = parseWeeklyData();
      
      if (weeklyData) {
        // Using historical data - no need to validate mean/CV as they'll be calculated
        return true;
      } else if (weeklyThroughputData.trim()) {
        // User tried to enter data but it's invalid
        return false; // parseWeeklyData already showed error
      } else {
        // Using simple parameters
        if (!meanThroughput || meanThroughput <= 0) {
          toast({
            title: "Validation Error",
            description: "Please enter a valid average weekly throughput greater than 0 or provide historical data.",
            variant: "destructive",
          });
          return false;
        }
      }
    }

    return true;
  };

  const handleRunForecast = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    setResults(null);

    try {
      // Run simulation in a timeout to allow UI to update
      setTimeout(() => {
        try {
          let finalMeanThroughput = meanThroughput;
          let finalVariabilityCV = variabilityCV;
          
          // Check if using historical data and prepare input
          let historicalData: number[] | undefined;
          
          if (!useCycleTime && weeklyThroughputData.trim()) {
            const weeklyData = parseWeeklyData();
            if (weeklyData) {
              historicalData = weeklyData.values;
              
              toast({
                title: "Using Historical Data",
                description: `${weeklyData.values.length} weeks: Mean=${weeklyData.mean}, Median=${weeklyData.median}, CV=${weeklyData.cv}%`,
              });
            }
          }
          
          const simulationInput = {
            backlogSize,
            trials,
            startDate,
            useCycleTime,
            meanThroughput: useCycleTime ? undefined : finalMeanThroughput,
            variabilityCV: useCycleTime ? undefined : finalVariabilityCV,
            historicalWeeklyData: historicalData,
            p50CycleTime: useCycleTime ? p50CycleTime : undefined,
            p80CycleTime: useCycleTime && p80CycleTime > 0 ? p80CycleTime : undefined,
            p95CycleTime: useCycleTime ? p95CycleTime : undefined,
          };

          const result = runMonteCarloSimulation(simulationInput);
          setResults(result);
          
          toast({
            title: "Simulation Complete",
            description: `Monte Carlo simulation completed with ${trials.toLocaleString()} trials.`,
          });
        } catch (error) {
          toast({
            title: "Simulation Error",
            description: error instanceof Error ? error.message : "An error occurred during simulation.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }, 100);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Simulation Error",
        description: error instanceof Error ? error.message : "An error occurred during simulation.",
        variant: "destructive",
      });
    }
  };

  const handleModelToggle = (value: boolean) => {
    setUseCycleTime(value);
    setResults(null); // Clear results when switching models
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Monte Carlo Forecast</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <ModelToggle 
          useCycleTime={useCycleTime} 
          onToggle={handleModelToggle}
        />
        
        <InputSection
          useCycleTime={useCycleTime}
          backlogSize={backlogSize}
          setBacklogSize={setBacklogSize}
          trials={trials}
          setTrials={setTrials}
          startDate={startDate}
          setStartDate={setStartDate}
          meanThroughput={meanThroughput}
          setMeanThroughput={setMeanThroughput}
          variabilityCV={variabilityCV}
          setVariabilityCV={setVariabilityCV}
          weeklyThroughputData={weeklyThroughputData}
          setWeeklyThroughputData={setWeeklyThroughputData}
          p50CycleTime={p50CycleTime}
          setP50CycleTime={setP50CycleTime}
          p80CycleTime={p80CycleTime}
          setP80CycleTime={setP80CycleTime}
          p95CycleTime={p95CycleTime}
          setP95CycleTime={setP95CycleTime}
          onRunForecast={handleRunForecast}
          isLoading={isLoading}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center mb-6">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-[hsl(var(--primary-500))] border-r-transparent rounded-full mb-4"></div>
            <p className="text-gray-600">Running Monte Carlo simulation...</p>
            <p className="text-sm text-gray-500 mt-1">This may take a few moments</p>
          </div>
        )}

        {/* Results */}
        {results && !isLoading && (
          <ResultsSection results={results} startDate={startDate} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>Monte Carlo forecasting using lognormal distribution modeling</p>
          <p className="mt-1">© 2024 Forecast Analytics Tool</p>
        </div>
      </footer>
    </div>
  );
}
