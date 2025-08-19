import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TutorialOverlay } from "@/components/tutorial-overlay";
import { UserManual } from "@/components/user-manual";
import { 
  Play, 
  BookOpen, 
  HelpCircle, 
  Calculator,
  Lightbulb,
  Target,
  BarChart3,
  TrendingUp,
  ArrowLeft
} from "lucide-react";
import { Link } from "wouter";

export function HelpPage() {
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <HelpCircle className="w-7 h-7 text-white" />
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Forecasting
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Help & Documentation
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Learn Monte Carlo forecasting
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tutorial">Tutorial</TabsTrigger>
            <TabsTrigger value="manual">User Manual</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Quick Start Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Play className="w-5 h-5 text-blue-600" />
                    <span>Interactive Tutorial</span>
                  </CardTitle>
                  <CardDescription>
                    Step-by-step guide for first-time users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Learn the fundamentals of Monte Carlo forecasting with our interactive tutorial. 
                    Perfect for getting started quickly.
                  </p>
                  <Button onClick={() => setShowTutorial(true)} className="w-full">
                    Start Tutorial
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    <span>Complete User Manual</span>
                  </CardTitle>
                  <CardDescription>
                    Comprehensive documentation and best practices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    In-depth guide covering all features, interpretation of results, 
                    and professional forecasting techniques.
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => {}}>
                    Browse Manual
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Feature Overview */}
            <Card>
              <CardHeader>
                <CardTitle>What Can You Do?</CardTitle>
                <CardDescription>
                  Overview of Monte Carlo forecasting capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold">Throughput Forecasting</h3>
                    <p className="text-sm text-muted-foreground">
                      Predict completion dates based on team velocity and historical throughput patterns
                    </p>
                  </div>
                  
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold">Cycle Time Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Use historical completion times to forecast individual item delivery
                    </p>
                  </div>
                  
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold">Statistical Modeling</h3>
                    <p className="text-sm text-muted-foreground">
                      Advanced distributions and 10,000+ Monte Carlo simulations for accuracy
                    </p>
                  </div>
                  
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto">
                      <Calculator className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold">Confidence Intervals</h3>
                    <p className="text-sm text-muted-foreground">
                      P50, P80, P95 predictions with interactive visualizations and risk analysis
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5" />
                  <span>Quick Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-green-700 dark:text-green-400">✓ For Best Results</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Use P80 dates for external commitments</li>
                      <li>• Update forecasts weekly as work progresses</li>
                      <li>• Include at least 4-6 weeks of historical data</li>
                      <li>• Break large items into smaller, uniform pieces</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-orange-700 dark:text-orange-400">⚡ Getting Started</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Choose Throughput model for velocity-based planning</li>
                      <li>• Choose Cycle Time model for individual items</li>
                      <li>• Start with recent, consistent historical data</li>
                      <li>• Review charts to understand forecast uncertainty</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tutorial">
            <Card>
              <CardHeader>
                <CardTitle>Interactive Tutorial</CardTitle>
                <CardDescription>
                  Learn Monte Carlo forecasting step by step
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto">
                  <Play className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Ready to Learn?</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Our interactive tutorial will guide you through creating your first Monte Carlo forecast. 
                    You'll learn both forecasting models and how to interpret the results.
                  </p>
                </div>
                <Button 
                  onClick={() => setShowTutorial(true)} 
                  size="lg"
                  className="px-8"
                >
                  Launch Tutorial
                </Button>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">1</div>
                    <p className="text-sm font-medium">Choose Model</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">2</div>
                    <p className="text-sm font-medium">Enter Data</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">3</div>
                    <p className="text-sm font-medium">Interpret Results</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual">
            <UserManual />
          </TabsContent>

          <TabsContent value="examples" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-World Examples</CardTitle>
                <CardDescription>
                  See how to apply Monte Carlo forecasting in different scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-6 border rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <span>Example 1: Sprint Planning</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Scenario</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• 45 user stories in backlog</li>
                          <li>• Team averages 8 stories/week</li>
                          <li>• Coefficient of variation: 0.3</li>
                          <li>• Starting next Monday</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Expected Results</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• P50: ~5.5 weeks (optimistic)</li>
                          <li>• P80: ~6.5 weeks (recommended)</li>
                          <li>• P95: ~8 weeks (conservative)</li>
                          <li>• Use P80 for sprint planning</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center space-x-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      <span>Example 2: Feature Delivery</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Scenario</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• 1 complex feature to deliver</li>
                          <li>• Historical cycle times:</li>
                          <li>&nbsp;&nbsp;- P50: 12 days</li>
                          <li>&nbsp;&nbsp;- P80: 18 days</li>
                          <li>&nbsp;&nbsp;- P95: 25 days</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Expected Results</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• P50: 12 days (50% chance)</li>
                          <li>• P80: 18 days (80% chance)</li>
                          <li>• P95: 25 days (95% chance)</li>
                          <li>• Promise P80, plan for P95</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center space-x-2">
                      <Calculator className="w-5 h-5 text-emerald-600" />
                      <span>Example 3: Release Planning</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Scenario</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• 120 items for next release</li>
                          <li>• 3 teams, 25 items/week total</li>
                          <li>• High variability (CV: 0.6)</li>
                          <li>• Need external commitment</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Expected Results</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• P50: ~4.8 weeks</li>
                          <li>• P80: ~6.2 weeks</li>
                          <li>• P95: ~8.5 weeks</li>
                          <li>• Commit to P80, buffer to P95</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <TutorialOverlay 
        isOpen={showTutorial} 
        onClose={() => setShowTutorial(false)} 
      />
    </div>
  );
}