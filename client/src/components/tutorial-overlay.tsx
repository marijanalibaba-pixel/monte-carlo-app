import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Play, 
  Calculator,
  BarChart3,
  TrendingUp,
  Target,
  Lightbulb,
  CheckCircle
} from "lucide-react";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  content: string;
  target?: string;
  position: 'center' | 'top' | 'bottom' | 'left' | 'right';
  icon: React.ReactNode;
  action?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: "welcome",
    title: "Welcome to Monte Carlo Forecasting",
    description: "Your professional project prediction tool",
    content: "This tutorial will guide you through creating accurate project forecasts using statistical modeling. You'll learn to predict completion dates with confidence intervals using two powerful methods.",
    position: "center",
    icon: <Calculator className="w-6 h-6" />,
  },
  {
    id: "models",
    title: "Two Forecasting Models",
    description: "Choose the right approach for your data",
    content: "**Throughput Model**: Use when you have team velocity data (items completed per week). Perfect for ongoing projects with established patterns.\n\n**Cycle Time Model**: Use when you have historical completion times. Ideal for workflow analysis and process improvement.",
    position: "center",
    icon: <BarChart3 className="w-6 h-6" />,
  },
  {
    id: "throughput",
    title: "Throughput Model Setup",
    description: "Predict based on team velocity",
    content: "Enter your **backlog size** (items remaining) and **weekly throughput**:\n\n• **Average throughput**: Items completed per week\n• **Coefficient of variation**: Measures consistency (0.2 = very consistent, 0.8 = highly variable)\n• **Start date**: When forecasting begins",
    position: "center",
    icon: <TrendingUp className="w-6 h-6" />,
    action: "Try the Throughput model first"
  },
  {
    id: "cycletime",
    title: "Cycle Time Model Setup", 
    description: "Predict based on historical completion times",
    content: "Enter **percentile data** from your historical cycle times:\n\n• **P50**: Half of items complete faster (median)\n• **P80**: 80% of items complete faster\n• **P95**: 95% of items complete faster\n\nExample: If P50=5 days, P80=8 days, P95=12 days",
    position: "center",
    icon: <Target className="w-6 h-6" />,
    action: "Switch to Cycle Time if you have historical data"
  },
  {
    id: "results",
    title: "Understanding Your Forecast",
    description: "Read confidence intervals and charts",
    content: "Your results show:\n\n• **Histogram**: Distribution of possible completion dates\n• **S-Curve**: Cumulative probability over time\n• **Confidence Levels**: P50 (likely), P80 (confident), P95 (very safe)\n\n**P80 is recommended** for most planning purposes.",
    position: "center",
    icon: <CheckCircle className="w-6 h-6" />,
  },
  {
    id: "tips",
    title: "Pro Tips for Accuracy",
    description: "Get the most reliable forecasts",
    content: "• **Update regularly**: Rerun forecasts as work progresses\n• **Use P80 for planning**: Good balance of confidence and realism\n• **Compare scenarios**: Save different forecasts to see impact of changes\n• **Historical data wins**: Real cycle times beat estimates every time",
    position: "center",
    icon: <Lightbulb className="w-6 h-6" />,
  }
];

interface TutorialOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TutorialOverlay({ isOpen, onClose }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setHasStarted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const step = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  const handleStart = () => {
    setHasStarted(true);
  };

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto shadow-2xl border-2">
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                {step.icon}
              </div>
              <div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {hasStarted && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>Step {currentStep + 1} of {tutorialSteps.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {!hasStarted ? (
            <div className="text-center space-y-6">
              <div className="text-lg leading-relaxed">
                {step.content}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={handleStart} className="flex items-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>Start Tutorial</span>
                </Button>
                <Button variant="outline" onClick={handleSkip}>
                  Skip Tutorial
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div className="whitespace-pre-line leading-relaxed">
                  {step.content}
                </div>
              </div>

              {step.action && (
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-blue-900 dark:text-blue-100">
                      {step.action}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Button>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" onClick={handleSkip}>
                    Skip Tutorial
                  </Button>
                  <Button onClick={handleNext} className="flex items-center space-x-2">
                    <span>{currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}