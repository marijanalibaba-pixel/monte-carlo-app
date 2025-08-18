import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle, X } from "lucide-react";

export function HelpManual() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) return null;

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <HelpCircle className="w-4 h-4" />
        Help & Manual
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Monte Carlo Pro - Complete Manual
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-1 h-auto"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Getting Started</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Monte Carlo Pro helps you forecast project completion dates using statistical analysis.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-blue-600 dark:text-blue-400">Throughput Model</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Use when you know your team's weekly delivery rate.
                    </p>
                    <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-300">
                      <li>• Weekly throughput (items per week)</li>
                      <li>• Coefficient of variation (0.1-0.5)</li>
                      <li>• Total backlog size</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-600 dark:text-green-400">Cycle Time Model</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Use when you have historical cycle time data.
                    </p>
                    <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-300">
                      <li>• P50: Median cycle time</li>
                      <li>• P80: 80th percentile</li>
                      <li>• P95: 95th percentile</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Understanding Results</h4>
                  <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                    <p>• <strong>P50 (Median):</strong> 50% chance of completion by this date</p>
                    <p>• <strong>P80:</strong> 80% confidence level - good for stakeholder commitments</p>
                    <p>• <strong>P95:</strong> 95% confidence level - use for critical deadlines</p>
                  </div>
                </div>
                
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Best Practices</h4>
                  <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    <li>• Use recent, relevant historical data</li>
                    <li>• Run 5,000-10,000 simulations for accuracy</li>
                    <li>• Consider team capacity changes</li>
                    <li>• Update forecasts regularly</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}