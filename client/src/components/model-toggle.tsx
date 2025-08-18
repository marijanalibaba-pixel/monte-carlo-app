import { Switch } from "@/components/ui/switch";

interface ModelToggleProps {
  useCycleTime: boolean;
  onToggle: (value: boolean) => void;
}

export function ModelToggle({ useCycleTime, onToggle }: ModelToggleProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 mb-1">Forecasting Model</h3>
          <p className="text-sm text-gray-600">
            {useCycleTime ? 'Cycle-time model (days per item)' : 'Throughput model (items per week)'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700">Throughput</span>
          <Switch
            checked={useCycleTime}
            onCheckedChange={onToggle}
            className="data-[state=checked]:bg-[hsl(var(--primary-600))]"
          />
          <span className="text-sm font-medium text-gray-700">Cycle Time</span>
        </div>
      </div>
    </div>
  );
}
