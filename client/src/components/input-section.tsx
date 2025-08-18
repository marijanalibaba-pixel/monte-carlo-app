import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Play } from "lucide-react";
import { format } from "date-fns";

interface InputSectionProps {
  useCycleTime: boolean;
  backlogSize: number;
  setBacklogSize: (value: number) => void;
  trials: number;
  setTrials: (value: number) => void;
  startDate: Date;
  setStartDate: (date: Date) => void;
  meanThroughput: number;
  setMeanThroughput: (value: number) => void;
  variabilityCV: number;
  setVariabilityCV: (value: number) => void;
  weeklyThroughputData: string;
  setWeeklyThroughputData: (value: string) => void;
  p50CycleTime: number;
  setP50CycleTime: (value: number) => void;
  p80CycleTime: number;
  setP80CycleTime: (value: number) => void;
  p95CycleTime: number;
  setP95CycleTime: (value: number) => void;
  onRunForecast: () => void;
  isLoading: boolean;
}

export function InputSection({
  useCycleTime,
  backlogSize,
  setBacklogSize,
  trials,
  setTrials,
  startDate,
  setStartDate,
  meanThroughput,
  setMeanThroughput,
  variabilityCV,
  setVariabilityCV,
  weeklyThroughputData,
  setWeeklyThroughputData,
  p50CycleTime,
  setP50CycleTime,
  p80CycleTime,
  setP80CycleTime,
  p95CycleTime,
  setP95CycleTime,
  onRunForecast,
  isLoading
}: InputSectionProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Simulation Parameters</h3>
      
      {/* Shared Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor="backlogSize">Backlog Size (items)</Label>
          <Input
            id="backlogSize"
            type="number"
            value={backlogSize}
            onChange={(e) => setBacklogSize(Number(e.target.value))}
            min="1"
            className="text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="trials">Trials</Label>
          <Input
            id="trials"
            type="number"
            value={trials}
            onChange={(e) => setTrials(Number(e.target.value))}
            min="1000"
            max="50000"
            className="text-sm"
          />
        </div>
      </div>

      {/* Start Date */}
      <div className="mb-6">
        <Label className="block text-sm font-medium text-gray-700 mb-2">Start Date</Label>
        <div className="flex items-center space-x-3">
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(startDate, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  if (date) {
                    setStartDate(date);
                    setCalendarOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <span className="text-sm text-gray-600">{format(startDate, "yyyy-MM-dd")}</span>
        </div>
      </div>

      {/* Model-Specific Inputs */}
      {!useCycleTime ? (
        <div className="space-y-4">
          <h4 className="text-base font-medium text-gray-800 mb-3">Throughput Model Parameters</h4>
          
          <Tabs defaultValue="simple" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="simple">Simple Parameters</TabsTrigger>
              <TabsTrigger value="historical">Historical Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="simple" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meanThroughput">Average Weekly Throughput</Label>
                  <Input
                    id="meanThroughput"
                    type="number"
                    value={meanThroughput}
                    onChange={(e) => setMeanThroughput(Number(e.target.value))}
                    min="0.1"
                    step="0.1"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="variability">Variability (CV%) — 0 = deterministic</Label>
                  <Input
                    id="variability"
                    type="number"
                    value={variabilityCV}
                    onChange={(e) => setVariabilityCV(Number(e.target.value))}
                    min="0"
                    max="200"
                    className="text-sm"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="historical" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weeklyData">Weekly Throughput History</Label>
                <p className="text-xs text-gray-500">
                  Enter 8-30 weekly throughput values (integers ≥ 0), separated by commas. Use 0 for holidays/slow weeks. At least one week must be greater than 0.
                </p>
                <Textarea
                  id="weeklyData"
                  placeholder="Example: 12, 15, 8, 11, 0, 14, 13, 9, 16, 12, 10, 7, 15"
                  value={weeklyThroughputData}
                  onChange={(e) => setWeeklyThroughputData(e.target.value)}
                  className="text-sm min-h-[80px]"
                />
                <p className="text-xs text-gray-400">
                  Bootstrap sampling will be used - statistics calculated automatically
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="space-y-4">
          <h4 className="text-base font-medium text-gray-800 mb-3">Cycle Time Model Parameters (days per item)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="p50CycleTime">P50 (median)</Label>
              <Input
                id="p50CycleTime"
                type="number"
                value={p50CycleTime}
                onChange={(e) => setP50CycleTime(Number(e.target.value))}
                min="0.1"
                step="0.01"
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p80CycleTime">P80 (optional)</Label>
              <Input
                id="p80CycleTime"
                type="number"
                value={p80CycleTime}
                onChange={(e) => setP80CycleTime(Number(e.target.value))}
                min="0.1"
                step="0.01"
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p95CycleTime">P95</Label>
              <Input
                id="p95CycleTime"
                type="number"
                value={p95CycleTime}
                onChange={(e) => setP95CycleTime(Number(e.target.value))}
                min="0.1"
                step="0.01"
                className="text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="mt-8 border-t border-gray-200 pt-6">
        <Button
          onClick={onRunForecast}
          disabled={isLoading}
          size="lg"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 text-lg shadow-lg"
        >
          {isLoading ? (
            <>
              <div className="animate-spin inline-block w-5 h-5 border-2 border-white border-r-transparent rounded-full mr-3" />
              Running Simulation...
            </>
          ) : (
            <>
              <Play className="mr-3 h-5 w-5" />
              Run Monte Carlo Forecast
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
