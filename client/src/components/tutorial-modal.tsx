import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, PlayCircle, Target, TrendingUp, BarChart3, Settings, Lightbulb, X } from "lucide-react";

interface TutorialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const tutorialSteps = [
  {
    title: "Welcome to Monte Carlo Pro",
    icon: <PlayCircle className="w-6 h-6" />,
    content: (
      <div className="space-y-4">
        <p className="text-slate-600 dark:text-slate-300">
          Monte Carlo Pro is a powerful forecasting tool that helps you predict project completion dates using statistical analysis.
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">What is Monte Carlo Simulation?</h4>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            A mathematical technique that uses random sampling to predict outcomes and assess risk in complex systems like project delivery.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <h5 className="font-medium text-green-800 dark:text-green-200">✓ Accurate Predictions</h5>
            <p className="text-xs text-green-700 dark:text-green-300">Get realistic date ranges</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
            <h5 className="font-medium text-purple-800 dark:text-purple-200">✓ Risk Assessment</h5>
            <p className="text-xs text-purple-700 dark:text-purple-300">Understand uncertainty</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Choose Your Forecasting Model",
    icon: <Target className="w-6 h-6" />,
    content: (
      <div className="space-y-4">
        <p className="text-slate-600 dark:text-slate-300">
          Select the model that best fits your available data:
        </p>
        <div className="space-y-3">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Throughput Model</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                Use when you know your team's <strong>weekly delivery rate</strong> (items completed per week)
              </p>
              <Badge variant="secondary" className="mt-2">Best for: Sprint teams, regular delivery</Badge>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <h4 className="font-semibold text-green-800 dark:text-green-200">Cycle Time Model</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                Use when you have <strong>historical data</strong> about how long individual items take
              </p>
              <Badge variant="secondary" className="mt-2">Best for: Kanban teams, flow-based work</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  },
  {
    title: "Input Your Project Data",
    icon: <Settings className="w-6 h-6" />,
    content: (
      <div className="space-y-4">
        <p className="text-slate-600 dark:text-slate-300">
          Enter the key parameters for your forecast:
        </p>
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Common Inputs:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">Backlog Size:</span>
                <span className="font-medium">Total items to complete</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">Simulations:</span>
                <span className="font-medium">How many scenarios to run (1000-10000)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">Start Date:</span>
                <span className="font-medium">When work begins</span>
              </div>
            </div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
            <h5 className="font-medium text-amber-800 dark:text-amber-200 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Pro Tip
            </h5>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              More simulations = more accurate results, but takes longer to compute
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Understanding the Results",
    icon: <BarChart3 className="w-6 h-6" />,
    content: (
      <div className="space-y-4">
        <p className="text-slate-600 dark:text-slate-300">
          Your forecast will show you probability-based completion dates:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-3 text-center">
              <h5 className="font-semibold text-green-800 dark:text-green-200">P50 (Median)</h5>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">50% chance of finishing by this date</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-3 text-center">
              <h5 className="font-semibold text-yellow-800 dark:text-yellow-200">P80</h5>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">80% confidence level</p>
            </CardContent>
          </Card>
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <CardContent className="p-3 text-center">
              <h5 className="font-semibold text-red-800 dark:text-red-200">P95</h5>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">95% confidence level</p>
            </CardContent>
          </Card>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Reading the Charts:</h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• <strong>Histogram:</strong> Shows distribution of possible completion dates</li>
            <li>• <strong>S-Curve:</strong> Shows cumulative probability over time</li>
            <li>• <strong>Percentile Lines:</strong> Key confidence intervals for planning</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    title: "Making Decisions",
    icon: <TrendingUp className="w-6 h-6" />,
    content: (
      <div className="space-y-4">
        <p className="text-slate-600 dark:text-slate-300">
          Use your forecast results to make informed project decisions:
        </p>
        <div className="space-y-3">
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Decision Framework:</h4>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Conservative</Badge>
                <span className="text-slate-600 dark:text-slate-300">Use P80 or P95 for external commitments</span>
              </div>
              <div className="flex gap-3">
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Balanced</Badge>
                <span className="text-slate-600 dark:text-slate-300">Use P50 for internal planning</span>
              </div>
              <div className="flex gap-3">
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Aggressive</Badge>
                <span className="text-slate-600 dark:text-slate-300">Use P20 for stretch goals</span>
              </div>
            </div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
            <h5 className="font-medium text-emerald-800 dark:text-emerald-200">Ready to Start!</h5>
            <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
              You're now ready to create accurate forecasts for your projects. Try running your first simulation!
            </p>
          </div>
        </div>
      </div>
    )
  }
];

export function TutorialModal({ open, onOpenChange }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    try {
      localStorage.setItem('monte-carlo-tutorial-completed', 'true');
    } catch (error) {
      console.warn('Failed to save tutorial completion:', error);
    }
    onOpenChange(false);
  };

  const currentStepData = tutorialSteps[currentStep];

  // Don't render until mounted to avoid hydration issues
  if (!mounted || !open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            {currentStepData.icon}
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {currentStepData.title}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="p-1 h-auto"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Progress indicator */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Step {currentStep + 1} of {tutorialSteps.length}
            </span>
            <div className="flex gap-1">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index <= currentStep 
                      ? 'bg-blue-500' 
                      : 'bg-slate-200 dark:bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="min-h-[300px]">
            {currentStepData.content}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            {currentStep === tutorialSteps.length - 1 ? (
              <Button onClick={handleComplete} className="flex items-center gap-2">
                Get Started
                <PlayCircle className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleNext} className="flex items-center gap-2">
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}