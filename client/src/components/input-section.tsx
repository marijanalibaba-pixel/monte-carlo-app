import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
            min="100"
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
      <div className="mt-6">
        <Button
          onClick={onRunForecast}
          disabled={isLoading}
          className="w-full md:w-auto bg-[hsl(var(--primary-600))] hover:bg-[hsl(var(--primary-700))] text-white font-medium py-3 px-6 transition-colors duration-200 shadow-sm"
        >
          {isLoading ? (
            <>
              <div className="animate-spin inline-block w-4 h-4 border-2 border-white border-r-transparent rounded-full mr-2" />
              Running...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Run Forecast
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
