import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Play, 
  Calendar as CalendarIcon, 
  BarChart3, 
  Clock, 
  TrendingUp,
  Sparkles,
  Zap
} from "lucide-react";
import { format } from "date-fns";
import { SimulationInput } from "@/lib/monte-carlo";

interface ModernInputSectionProps {
  onSimulate: (input: SimulationInput) => Promise<void>;
  isCalculating: boolean;
}

export function ModernInputSection({ onSimulate, isCalculating }: ModernInputSectionProps) {
  const [useCycleTime, setUseCycleTime] = useState(false);
  const [backlogSize, setBacklogSize] = useState(100);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [trials, setTrials] = useState(10000);

  // Throughput model states
  const [meanThroughput, setMeanThroughput] = useState(13);
  const [variabilityCV, setVariabilityCV] = useState(20);
  const [weeklyThroughputData, setWeeklyThroughputData] = useState("");

  // Cycle time model states
  const [p50CycleTime, setP50CycleTime] = useState(2);
  const [p80CycleTime, setP80CycleTime] = useState(4);
  const [p95CycleTime, setP95CycleTime] = useState(8);

  const handleSubmit = async () => {
    const input: SimulationInput = {
      backlogSize,
      startDate,
      trials,
      useCycleTime,
      meanThroughput: useCycleTime ? undefined : meanThroughput,
      variabilityCV: useCycleTime ? undefined : variabilityCV,
      historicalWeeklyData: weeklyThroughputData ? 
        weeklyThroughputData.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)) : 
        undefined,
      p50CycleTime: useCycleTime ? p50CycleTime : undefined,
      p80CycleTime: useCycleTime ? p80CycleTime : undefined,
      p95CycleTime: useCycleTime ? p95CycleTime : undefined,
    };
    
    await onSimulate(input);
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
          Configure Simulation
        </h3>
        <p className="text-sm text-slate-600
          Set up your project parameters for forecasting
        </p>
      </div>

      <div className="space-y-6">
        {/* Basic Parameters */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h4 className="font-semibold text-slate-900 Details</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="backlog-size" className="text-sm font-medium text-slate-700
                Backlog Size
              </Label>
              <Input
                id="backlog-size"
                type="number"
                value={backlogSize}
                onChange={(e) => setBacklogSize(parseInt(e.target.value) || 0)}
                className="bg-white/50 border-slate-200 rounded-xl"
                placeholder="Items to complete"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700
                Start Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-white/50 border-slate-200 rounded-xl justify-start"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border-slate-200 rounded-xl">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="trials" className="text-sm font-medium text-slate-700
              Simulation Trials
            </Label>
            <Input
              id="trials"
              type="number"
              value={trials}
              onChange={(e) => setTrials(parseInt(e.target.value) || 1000)}
              className="bg-white/50 border-slate-200 rounded-xl"
              placeholder="Number of simulations"
            />
            <p className="text-xs text-slate-500
              Higher values increase accuracy but take longer to compute
            </p>
          </div>
        </div>

        {/* Model Selection */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <h4 className="font-semibold text-slate-900 Model</h4>
          </div>

          <Tabs defaultValue="throughput" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100 rounded-xl p-1">
              <TabsTrigger 
                value="throughput" 
                onClick={() => setUseCycleTime(false)}
                className="rounded-lg data-[state=active]:bg-white
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Throughput</span>
                <span className="sm:hidden">Items/Week</span>
              </TabsTrigger>
              <TabsTrigger 
                value="cycletime" 
                onClick={() => setUseCycleTime(true)}
                className="rounded-lg data-[state=active]:bg-white
              >
                <Clock className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Cycle Time</span>
                <span className="sm:hidden">Days/Item</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="throughput" className="mt-6 space-y-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <h5 className="font-medium text-blue-900 mb-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Team Velocity Analysis
                </h5>
                <p className="text-sm text-blue-700
                  Forecast based on how many items your team completes per week
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mean-throughput" className="text-sm font-medium text-slate-700
                    Average Items/Week
                  </Label>
                  <Input
                    id="mean-throughput"
                    type="number"
                    value={meanThroughput}
                    onChange={(e) => setMeanThroughput(parseFloat(e.target.value) || 0)}
                    className="bg-white/50 border-slate-200 rounded-xl"
                    placeholder="Team velocity"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="variability" className="text-sm font-medium text-slate-700
                    Variability (%)
                  </Label>
                  <Input
                    id="variability"
                    type="number"
                    value={variabilityCV}
                    onChange={(e) => setVariabilityCV(parseFloat(e.target.value) || 0)}
                    className="bg-white/50 border-slate-200 rounded-xl"
                    placeholder="Coefficient of variation"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weekly-data" className="text-sm font-medium text-slate-700
                  Historical Weekly Data (Optional)
                </Label>
                <Textarea
                  id="weekly-data"
                  value={weeklyThroughputData}
                  onChange={(e) => setWeeklyThroughputData(e.target.value)}
                  className="bg-white/50 border-slate-200 rounded-xl resize-none"
                  placeholder="12, 15, 8, 14, 11, 16, 9..."
                  rows={3}
                />
                <p className="text-xs text-slate-500
                  Comma-separated weekly completion counts (8-30 values for bootstrap sampling)
                </p>
              </div>
            </TabsContent>

            <TabsContent value="cycletime" className="mt-6 space-y-4">
              <div className="bg-emerald-50 rounded-xl p-4">
                <h5 className="font-medium text-emerald-900 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Individual Item Duration
                </h5>
                <p className="text-sm text-emerald-700
                  Forecast based on how long individual items take to complete
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="p50-cycle" className="text-sm font-medium text-slate-700
                    P50 (Days)
                  </Label>
                  <Input
                    id="p50-cycle"
                    type="number"
                    value={p50CycleTime}
                    onChange={(e) => setP50CycleTime(parseFloat(e.target.value) || 0)}
                    className="bg-white/50 border-slate-200 rounded-xl"
                    placeholder="Median time"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="p80-cycle" className="text-sm font-medium text-slate-700
                    P80 (Days)
                  </Label>
                  <Input
                    id="p80-cycle"
                    type="number"
                    value={p80CycleTime}
                    onChange={(e) => setP80CycleTime(parseFloat(e.target.value) || 0)}
                    className="bg-white/50 border-slate-200 rounded-xl"
                    placeholder="80th percentile"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="p95-cycle" className="text-sm font-medium text-slate-700
                    P95 (Days)
                  </Label>
                  <Input
                    id="p95-cycle"
                    type="number"
                    value={p95CycleTime}
                    onChange={(e) => setP95CycleTime(parseFloat(e.target.value) || 0)}
                    className="bg-white/50 border-slate-200 rounded-xl"
                    placeholder="95th percentile"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Run Simulation Button */}
        <div className="pt-6">
          <Button
            onClick={handleSubmit}
            disabled={isCalculating}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isCalculating ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Running Simulation...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Run Monte Carlo Simulation</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}