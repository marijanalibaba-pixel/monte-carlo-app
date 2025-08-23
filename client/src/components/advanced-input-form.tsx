import { useState, useEffect } from "react";
import { track } from '@vercel/analytics';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Clock, 
  Users, 
  AlertTriangle,
  BarChart3,
  Settings,
  Target,
  Zap,
  Info
} from "lucide-react";
import { format } from "date-fns";
import { ThroughputConfig, CycleTimeConfig, SimulationConfig, RiskFactor } from "@/lib/monte-carlo-engine";

interface AdvancedInputFormProps {
  mode: 'forecast' | 'probability' | 'target';
  onForecast: (
    throughputConfig?: ThroughputConfig,
    cycleTimeConfig?: CycleTimeConfig,
    simConfig?: SimulationConfig,
    targetDate?: Date
  ) => void;
  isRunning: boolean;
}

export function AdvancedInputForm({ mode, onForecast, isRunning }: AdvancedInputFormProps) {
  const [forecastType, setForecastType] = useState<'throughput' | 'cycletime'>('throughput');
  
  // Track forecast method changes
  useEffect(() => {
    track('forecast_method_selected', {
      method: forecastType
    });
  }, [forecastType]);
  
  // Common parameters
  const [backlogSize, setBacklogSize] = useState(100);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [targetDate, setTargetDate] = useState<Date>(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)); // 90 days from now
  const [trials, setTrials] = useState(10000);
  const [isTrialsTooltipOpen, setIsTrialsTooltipOpen] = useState(false);
  
  // Throughput parameters
  const [averageThroughput, setAverageThroughput] = useState(12);
  const [throughputVariability, setThroughputVariability] = useState(0.25);
  const [historicalData, setHistoricalData] = useState("");
  const [weeklyCapacity, setWeeklyCapacity] = useState(20);
  const [useCapacityLimit, setUseCapacityLimit] = useState(false);
  const [dataSourceType, setDataSourceType] = useState<'historical' | 'statistical'>('historical');
  const [timeUnit, setTimeUnit] = useState<'daily' | 'weekly'>('weekly');
  
  // Cycle time parameters
  const [p50CycleTime, setP50CycleTime] = useState(3);
  const [p80CycleTime, setP80CycleTime] = useState(7);
  const [p95CycleTime, setP95CycleTime] = useState(14);
  const [workingDaysPerWeek, setWorkingDaysPerWeek] = useState(5);
  const [processingMode, setProcessingMode] = useState<'batch-max' | 'worker-scheduling'>('worker-scheduling');
  const [wipLimit, setWipLimit] = useState(7);
  
  // Advanced options
  const [includeDependencies, setIncludeDependencies] = useState(false);
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Risk factor management
  const addRiskFactor = () => {
    setRiskFactors([...riskFactors, { name: "", probability: 0.1, impactDays: 5 }]);
  };
  
  const updateRiskFactor = (index: number, field: keyof RiskFactor, value: any) => {
    const updated = [...riskFactors];
    updated[index] = { ...updated[index], [field]: value };
    setRiskFactors(updated);
  };
  
  const removeRiskFactor = (index: number) => {
    setRiskFactors(riskFactors.filter((_, i) => i !== index));
  };
  
  const parseHistoricalData = (input: string): number[] => {
    return input
      .split(/[,\s]+/)
      .map(s => parseFloat(s.trim()))
      .filter(n => !isNaN(n) && n > 0);
  };
  
  const handleSubmit = () => {
    const simConfig: SimulationConfig = {
      trials,
      startDate,
      confidenceLevels: [0.5, 0.8, 0.95],
      includeDependencies,
      riskFactors: riskFactors.length > 0 ? riskFactors : undefined
    };
    
    if (forecastType === 'throughput') {
      let processedHistoricalData = dataSourceType === 'historical' && historicalData ? parseHistoricalData(historicalData) : undefined;
      let processedAverageThroughput = dataSourceType === 'statistical' ? averageThroughput : undefined;
      let processedWeeklyCapacity = useCapacityLimit ? weeklyCapacity : undefined;
      
      // Convert daily inputs to weekly (multiply by 7) for internal calculations
      if (timeUnit === 'daily') {
        if (processedHistoricalData) {
          processedHistoricalData = processedHistoricalData.map(val => val * 7);
        }
        if (processedAverageThroughput) {
          processedAverageThroughput = processedAverageThroughput * 7;
        }
        if (processedWeeklyCapacity) {
          processedWeeklyCapacity = processedWeeklyCapacity * 7;
        }
      }
      
      const throughputConfig: ThroughputConfig = {
        backlogSize,
        historicalThroughput: processedHistoricalData,
        averageThroughput: processedAverageThroughput,
        throughputVariability: dataSourceType === 'statistical' ? throughputVariability : undefined,
        weeklyCapacity: processedWeeklyCapacity,
        timeUnit: timeUnit // Add time unit for display purposes
      };
      
      onForecast(throughputConfig, undefined, simConfig, mode !== 'forecast' ? targetDate : undefined);
    } else {
      const cycleTimeConfig: CycleTimeConfig = {
        backlogSize,
        p50CycleTime,
        p80CycleTime,
        p95CycleTime,
        workingDaysPerWeek,
        processingMode,
        wipLimit
      };
      
      onForecast(undefined, cycleTimeConfig, simConfig, mode !== 'forecast' ? targetDate : undefined);
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="border-none bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
      </Card>
      {/* Getting Started Info */}
      <div className="text-center mb-8">
        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Create Multiple Forecasts
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Run single or multiple forecasts with different scenarios. Save your results and compare them side-by-side to make better-informed decisions.
          </p>
        </div>
      </div>
      {/* Core Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Project Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={`grid grid-cols-1 ${mode === 'target' ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6`}>
            <div className="space-y-2">
              <Label>Backlog Size</Label>
              <Input
                type="number"
                value={backlogSize}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || value === '0') {
                    setBacklogSize(0);
                  } else {
                    setBacklogSize(parseInt(value) || 0);
                  }
                }}
                onFocus={(e) => {
                  if (e.target.value === '0') {
                    e.target.select();
                  }
                }}
                className="text-lg"
              />
              <p className="text-sm text-muted-foreground">Total items to complete</p>
            </div>
            
            {mode !== 'target' && (
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
            
            {(mode === 'probability' || mode === 'target') && (
              <div className="space-y-2">
                <Label>Target Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {targetDate ? format(targetDate, "PPP") : "Pick target date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={targetDate}
                      onSelect={(date) => date && setTargetDate(date)}
                      initialFocus
                      disabled={mode === 'probability' ? (date) => date <= startDate : undefined}
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground mt-1">
                  {mode === 'probability' ? 'Check completion probability by this date' : 'Find recommended start dates for this deadline'}
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label>Simulation Trials</Label>
                <TooltipProvider>
                  <Tooltip open={isTrialsTooltipOpen} onOpenChange={setIsTrialsTooltipOpen}>
                    <TooltipTrigger asChild>
                      <button 
                        type="button"
                        onClick={() => setIsTrialsTooltipOpen(!isTrialsTooltipOpen)}
                        className="p-1 rounded hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <Info className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs p-3" onPointerDownOutside={() => setIsTrialsTooltipOpen(false)}>
                      <div className="space-y-2 text-sm">
                        <p className="font-semibold">What are Simulation Trials?</p>
                        <p>Each trial runs your project through different random scenarios to predict completion dates.</p>
                        <div className="space-y-1">
                          <p><strong>• 1K trials:</strong> Fast but less precise</p>
                          <p><strong>• 10K trials:</strong> Good balance of speed and accuracy</p> 
                          <p><strong>• 50K trials:</strong> Most accurate but slower</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">More trials = more reliable confidence intervals and percentiles</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="space-y-2">
                <Slider
                  value={[trials]}
                  onValueChange={(value) => setTrials(value[0])}
                  min={1000}
                  max={50000}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>1K</span>
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg text-[14px] pl-[12px] pr-[12px] pt-[6px] pb-[6px]">
                    <span className="font-bold text-[14px]">{trials.toLocaleString()}</span>
                    <span className="text-xs ml-1 opacity-90">trials</span>
                  </div>
                  <span>50K</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Forecasting Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Forecasting Method</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={forecastType} onValueChange={(value) => setForecastType(value as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="throughput" className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-[13px]">Throughput Analysis  </span>
              </TabsTrigger>
              <TabsTrigger value="cycletime" className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span className="text-[13px]">Cycle Time Analysis  </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="throughput" className="mt-6 space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Team Velocity Modeling
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Models how many items your team completes per {timeUnit === 'daily' ? 'day' : 'week'} using historical patterns or statistical parameters.
                </p>
              </div>

              {/* Time Unit Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Time Unit</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Card 
                    className={`cursor-pointer border-2 transition-all hover:shadow-md ${timeUnit === 'weekly' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => setTimeUnit('weekly')}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full border-2 transition-all ${timeUnit === 'weekly' ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}`} />
                        <h4 className="font-semibold text-sm">Weekly</h4>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Items per week</p>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className={`cursor-pointer border-2 transition-all hover:shadow-md ${timeUnit === 'daily' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => setTimeUnit('daily')}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full border-2 transition-all ${timeUnit === 'daily' ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}`} />
                        <h4 className="font-semibold text-sm">Daily</h4>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Items per day</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Data Source Selection */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card 
                    className={`cursor-pointer border-2 transition-all hover:shadow-md ${dataSourceType === 'historical' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => {
                      setDataSourceType('historical');
                      if (dataSourceType !== 'historical') {
                        setHistoricalData("15, 12, 18, 9, 14, 11, 16, 8, 13, 17, 10, 12, 14, 15, 11");
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-4 h-4 rounded-full border-2 transition-all ${dataSourceType === 'historical' ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`} />
                        <h4 className="font-semibold">Historical Data</h4>
                        <Badge variant="outline" className="text-xs">Recommended</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Use your actual {timeUnit} completion data (most recent first) for authentic patterns
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className={`cursor-pointer border-2 transition-all hover:shadow-md ${dataSourceType === 'statistical' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => {
                      setDataSourceType('statistical');
                      setHistoricalData("");
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-4 h-4 rounded-full border-2 transition-all ${dataSourceType === 'statistical' ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`} />
                        <h4 className="font-semibold">Statistical Parameters</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Define average throughput and variability manually
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Current Calculation Method Indicator */}
                <div className={`p-4 rounded-lg border-l-4 ${dataSourceType === 'historical' ? 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20' : 'border-l-orange-500 bg-orange-50 dark:bg-orange-950/20'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${dataSourceType === 'historical' ? 'bg-blue-500' : 'bg-orange-500'}`} />
                    <h4 className="font-semibold">
                      {dataSourceType === 'historical' ? 'Using Bootstrap Sampling' : 'Using Statistical Distribution'}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {dataSourceType === 'historical'
                      ? `Bootstrap sampling from ${historicalData ? parseHistoricalData(historicalData).length : 0} weeks of historical data (most recent week first) with authentic variability patterns`
                      : 'Generating throughput values from lognormal distribution with specified parameters'
                    }
                  </p>
                </div>

                {/* Historical Data Input */}
                {dataSourceType === 'historical' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">Historical {timeUnit === 'daily' ? 'Daily' : 'Weekly'} Data</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setHistoricalData("")}
                        className="text-xs"
                      >
                        Clear
                      </Button>
                    </div>
                    <Textarea
                      value={historicalData}
                      onChange={(e) => setHistoricalData(e.target.value)}
                      placeholder="15, 12, 18, 9, 14, 11, 16, 8, 13, 17..."
                      className="h-24 resize-none"
                    />
                    <p className="text-sm text-muted-foreground">
                      <strong>Enter in reverse chronological order:</strong> Start with last {timeUnit === 'daily' ? 'day' : 'week'}'s throughput, then the {timeUnit === 'daily' ? 'day' : 'week'} before, and so on.
                      {historicalData && (
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          {` Found ${parseHistoricalData(historicalData).length} ${timeUnit === 'daily' ? 'days' : 'weeks'} of data`}
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {/* Statistical Parameters */}
                {dataSourceType === 'statistical' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <div className="space-y-3">
                      <Label>Average {timeUnit === 'daily' ? 'Daily' : 'Weekly'} Throughput</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={averageThroughput}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || value === '0') {
                            setAverageThroughput(0);
                          } else {
                            setAverageThroughput(parseFloat(value) || 0);
                          }
                        }}
                        onFocus={(e) => {
                          if (e.target.value === '0') {
                            e.target.select();
                          }
                        }}
                        className="text-lg"
                      />
                      <p className="text-xs text-muted-foreground">Mean items completed per {timeUnit === 'daily' ? 'day' : 'week'}</p>
                    </div>

                    <div className="space-y-3">
                      <Label>Throughput Variability</Label>
                      <div className="space-y-2">
                        <Slider
                          value={[throughputVariability * 100]}
                          onValueChange={(value) => setThroughputVariability(value[0] / 100)}
                          min={5}
                          max={80}
                          step={5}
                        />
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>Low (5%)</span>
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-1.5 rounded-lg shadow-lg">
                            <span className="text-base font-bold">{Math.round(throughputVariability * 100)}%</span>
                            <span className="text-xs ml-1 opacity-90">CV</span>
                          </div>
                          <span>High (80%)</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Coefficient of variation (σ/μ)</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3 pt-4 border-t">
                  <Switch
                    checked={useCapacityLimit}
                    onCheckedChange={setUseCapacityLimit}
                  />
                  <Label>Apply weekly capacity limit</Label>
                  {useCapacityLimit && (
                    <Input
                      type="number"
                      value={weeklyCapacity}
                      onChange={(e) => setWeeklyCapacity(parseInt(e.target.value) || 0)}
                      className="w-20"
                    />
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cycletime" className="mt-6 space-y-6">
              <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-4">
                <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                  Individual Item Duration
                </h4>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  Models project completion based on how long individual items typically take to finish.
                </p>
              </div>

              {/* Processing Mode Selection */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card 
                    className={`cursor-pointer border-2 transition-all hover:shadow-md ${processingMode === 'worker-scheduling' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => setProcessingMode('worker-scheduling')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-4 h-4 rounded-full border-2 transition-all ${processingMode === 'worker-scheduling' ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}`} />
                        <h4 className="font-semibold">Worker Scheduling</h4>
                        <Badge variant="outline" className="text-xs">Recommended</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Items assigned to earliest available team member. More realistic and faster results.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className={`cursor-pointer border-2 transition-all hover:shadow-md ${processingMode === 'batch-max' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => setProcessingMode('batch-max')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-4 h-4 rounded-full border-2 transition-all ${processingMode === 'batch-max' ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}`} />
                        <h4 className="font-semibold">Batch Processing</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Process items in batches, wait for slowest. More conservative estimates.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Current Processing Mode Indicator */}
                <div className={`p-4 rounded-lg border-l-4 ${processingMode === 'worker-scheduling' ? 'border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' : 'border-l-orange-500 bg-orange-50 dark:bg-orange-950/20'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${processingMode === 'worker-scheduling' ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                    <h4 className="font-semibold">
                      {processingMode === 'worker-scheduling' ? 'Using Worker Scheduling' : 'Using Batch Processing'}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {processingMode === 'worker-scheduling'
                      ? `Items are assigned to the earliest available team member among ${wipLimit} parallel workers. This models realistic team dynamics where faster workers can start new items earlier.`
                      : `Items are processed in batches of ${wipLimit}, with each batch completing when the slowest item finishes. This provides conservative estimates with built-in buffers.`
                    }
                  </p>
                </div>

                {/* WIP Limit and Cycle Time Parameters */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label>WIP Limit</Label>
                    <Input
                      type="number"
                      value={wipLimit}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setWipLimit(7);
                        } else {
                          setWipLimit(parseInt(value) || 7);
                        }
                      }}
                      onFocus={(e) => {
                        if (e.target.value === '7') {
                          e.target.select();
                        }
                      }}
                      min={1}
                      max={20}
                    />
                    <p className="text-xs text-muted-foreground">Team capacity</p>
                  </div>

                  <div className="space-y-2">
                    <Label>P50 Cycle Time (days)</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={p50CycleTime}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || value === '0') {
                          setP50CycleTime(0);
                        } else {
                          setP50CycleTime(parseFloat(value) || 0);
                        }
                      }}
                      onFocus={(e) => {
                        if (e.target.value === '0') {
                          e.target.select();
                        }
                      }}
                    />
                    <p className="text-xs text-muted-foreground">Median time</p>
                  </div>

                  <div className="space-y-2">
                    <Label>P80 Cycle Time (days)</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={p80CycleTime}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || value === '0') {
                          setP80CycleTime(0);
                        } else {
                          setP80CycleTime(parseFloat(value) || 0);
                        }
                      }}
                      onFocus={(e) => {
                        if (e.target.value === '0') {
                          e.target.select();
                        }
                      }}
                    />
                    <p className="text-xs text-muted-foreground">80th percentile</p>
                  </div>

                  <div className="space-y-2">
                    <Label>P95 Cycle Time (days)</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={p95CycleTime}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || value === '0') {
                          setP95CycleTime(0);
                        } else {
                          setP95CycleTime(parseFloat(value) || 0);
                        }
                      }}
                      onFocus={(e) => {
                        if (e.target.value === '0') {
                          e.target.select();
                        }
                      }}
                    />
                    <p className="text-xs text-muted-foreground">95th percentile</p>
                  </div>

                  <div className="space-y-3">
                    <Label>Working Days/Week</Label>
                    <div className="space-y-2">
                      <Slider
                        value={[workingDaysPerWeek]}
                        onValueChange={(value) => setWorkingDaysPerWeek(value[0])}
                        min={1}
                        max={7}
                        step={1}
                      />
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>1 day</span>
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1.5 rounded-lg shadow-lg">
                          <span className="text-base font-bold">{workingDaysPerWeek}</span>
                          <span className="text-xs ml-1 opacity-90">days</span>
                        </div>
                        <span>7 days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      {/* Advanced Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Advanced Options</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Hide' : 'Show'}
            </Button>
          </CardTitle>
        </CardHeader>
        
        {showAdvanced && (
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Switch
                  checked={includeDependencies}
                  onCheckedChange={setIncludeDependencies}
                />
                <Label className="font-semibold">Include dependency modeling</Label>
              </div>
              
              {/* Dependency Modeling Explanation */}
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  What is Dependency Modeling?
                </h4>
                <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                  <p>
                    <strong>Dependencies</strong> are external factors that can delay your project beyond normal work variation:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>External teams:</strong> Waiting for API integrations, design reviews, or approvals</li>
                    <li><strong>Third-party services:</strong> Vendor delays, external system outages</li>
                    <li><strong>Resource constraints:</strong> Key person unavailable, infrastructure issues</li>
                    <li><strong>Regulatory approvals:</strong> Legal reviews, compliance checks</li>
                  </ul>
                  <p className="font-medium">
                    When enabled, the model uses PERT distribution to simulate these additional delays based on optimistic, most likely, and pessimistic scenarios.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Risk Factors</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addRiskFactor}
                  className="flex items-center space-x-1"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Add Risk</span>
                </Button>
              </div>

              {riskFactors.map((risk, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border rounded-lg">
                  <Input
                    placeholder="Risk name"
                    value={risk.name}
                    onChange={(e) => updateRiskFactor(index, 'name', e.target.value)}
                  />
                  <div className="space-y-1">
                    <Label className="text-xs">Probability</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={risk.probability}
                      onChange={(e) => updateRiskFactor(index, 'probability', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Impact (days)</Label>
                    <Input
                      type="number"
                      value={risk.impactDays}
                      onChange={(e) => updateRiskFactor(index, 'impactDays', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeRiskFactor(index)}
                    className="self-end"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
      {/* Run Simulation */}
      <div className="text-center">
        <Button
          onClick={handleSubmit}
          disabled={isRunning}
          size="lg"
          className="w-full md:w-auto px-12 py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          {isRunning ? (
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Running {trials.toLocaleString()} Simulations...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Zap className="w-6 h-6" />
              <span>Run Advanced Forecast</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}