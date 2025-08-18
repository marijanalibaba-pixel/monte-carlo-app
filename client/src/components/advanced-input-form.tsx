import { useState } from "react";
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
  Zap
} from "lucide-react";
import { format } from "date-fns";
import { ThroughputConfig, CycleTimeConfig, SimulationConfig, RiskFactor } from "@/lib/monte-carlo-engine";

interface AdvancedInputFormProps {
  onForecast: (
    throughputConfig?: ThroughputConfig,
    cycleTimeConfig?: CycleTimeConfig,
    simConfig?: SimulationConfig
  ) => void;
  isRunning: boolean;
}

export function AdvancedInputForm({ onForecast, isRunning }: AdvancedInputFormProps) {
  const [forecastType, setForecastType] = useState<'throughput' | 'cycletime'>('throughput');
  
  // Common parameters
  const [backlogSize, setBacklogSize] = useState(100);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [trials, setTrials] = useState(10000);
  
  // Throughput parameters
  const [averageThroughput, setAverageThroughput] = useState(12);
  const [throughputVariability, setThroughputVariability] = useState(0.25);
  const [historicalData, setHistoricalData] = useState("");
  const [weeklyCapacity, setWeeklyCapacity] = useState(20);
  const [useCapacityLimit, setUseCapacityLimit] = useState(false);
  
  // Cycle time parameters
  const [p50CycleTime, setP50CycleTime] = useState(3);
  const [p85CycleTime, setP85CycleTime] = useState(7);
  const [p95CycleTime, setP95CycleTime] = useState(14);
  const [workingDaysPerWeek, setWorkingDaysPerWeek] = useState(5);
  
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
      confidenceLevels: [0.5, 0.8, 0.85, 0.9, 0.95, 0.99],
      includeDependencies,
      riskFactors: riskFactors.length > 0 ? riskFactors : undefined
    };
    
    if (forecastType === 'throughput') {
      const historicalThroughput = historicalData ? parseHistoricalData(historicalData) : undefined;
      
      const throughputConfig: ThroughputConfig = {
        backlogSize,
        historicalThroughput,
        averageThroughput: historicalThroughput ? undefined : averageThroughput,
        throughputVariability: historicalThroughput ? undefined : throughputVariability,
        weeklyCapacity: useCapacityLimit ? weeklyCapacity : undefined
      };
      
      onForecast(throughputConfig, undefined, simConfig);
    } else {
      const cycleTimeConfig: CycleTimeConfig = {
        backlogSize,
        p50CycleTime,
        p85CycleTime,
        p95CycleTime,
        workingDaysPerWeek
      };
      
      onForecast(undefined, cycleTimeConfig, simConfig);
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="border-none bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Advanced Monte Carlo Forecasting</CardTitle>
          <CardDescription className="text-lg">
            Professional-grade statistical modeling for project prediction
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Core Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Project Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Backlog Size</Label>
              <Input
                type="number"
                value={backlogSize}
                onChange={(e) => setBacklogSize(parseInt(e.target.value) || 0)}
                className="text-lg"
              />
              <p className="text-sm text-muted-foreground">Total items to complete</p>
            </div>
            
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
            
            <div className="space-y-2">
              <Label>Simulation Trials</Label>
              <div className="space-y-2">
                <Slider
                  value={[trials]}
                  onValueChange={(value) => setTrials(value[0])}
                  min={1000}
                  max={50000}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>1K</span>
                  <span className="font-medium">{trials.toLocaleString()}</span>
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
                <span>Throughput Analysis</span>
              </TabsTrigger>
              <TabsTrigger value="cycletime" className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Cycle Time Analysis</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="throughput" className="mt-6 space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Team Velocity Modeling
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Models how many items your team completes per week using historical patterns or statistical parameters.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">Historical Weekly Data (Recommended)</Label>
                  <Textarea
                    value={historicalData}
                    onChange={(e) => setHistoricalData(e.target.value)}
                    placeholder="12, 15, 8, 14, 11, 16, 9, 13, 17, 10, 12, 14, 8, 15, 11..."
                    className="mt-2 h-24 resize-none"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Comma or space separated weekly completion counts. 
                    {historicalData && ` (${parseHistoricalData(historicalData).length} weeks)`}
                  </p>
                </div>

                {!historicalData && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <div className="space-y-3">
                      <Label>Average Weekly Throughput</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={averageThroughput}
                        onChange={(e) => setAverageThroughput(parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Variability (CV)</Label>
                      <div className="space-y-2">
                        <Slider
                          value={[throughputVariability * 100]}
                          onValueChange={(value) => setThroughputVariability(value[0] / 100)}
                          min={5}
                          max={80}
                          step={5}
                        />
                        <div className="text-sm text-muted-foreground">
                          {Math.round(throughputVariability * 100)}% coefficient of variation
                        </div>
                      </div>
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

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>P50 Cycle Time (days)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={p50CycleTime}
                    onChange={(e) => setP50CycleTime(parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">Median time</p>
                </div>

                <div className="space-y-2">
                  <Label>P85 Cycle Time (days)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={p85CycleTime}
                    onChange={(e) => setP85CycleTime(parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">85th percentile</p>
                </div>

                <div className="space-y-2">
                  <Label>P95 Cycle Time (days)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={p95CycleTime}
                    onChange={(e) => setP95CycleTime(parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">95th percentile</p>
                </div>

                <div className="space-y-2">
                  <Label>Working Days/Week</Label>
                  <Input
                    type="number"
                    value={workingDaysPerWeek}
                    onChange={(e) => setWorkingDaysPerWeek(parseInt(e.target.value) || 5)}
                    min={1}
                    max={7}
                  />
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
            <div className="flex items-center space-x-3">
              <Switch
                checked={includeDependencies}
                onCheckedChange={setIncludeDependencies}
              />
              <Label>Include dependency modeling</Label>
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