import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Calculator, 
  BarChart3, 
  TrendingUp, 
  Target,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  BookOpen,
  Settings,
  HelpCircle
} from "lucide-react";

export function UserManual() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          User Manual
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300">
          Complete guide to Monte Carlo forecasting
        </p>
      </div>

      <Tabs defaultValue="getting-started" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="interpretation">Results</TabsTrigger>
          <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
        </TabsList>

        <TabsContent value="getting-started" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="w-5 h-5" />
                <span>What is Monte Carlo Forecasting?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Monte Carlo forecasting uses statistical simulation to predict project completion dates. 
                Instead of single-point estimates, it provides <strong>confidence intervals</strong> that 
                show the range of possible outcomes.
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                      Why Use Monte Carlo?
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Traditional estimates often fail because they don't account for variability. 
                      Monte Carlo simulation runs thousands of scenarios to give you realistic 
                      probabilities of different completion dates.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-sm font-bold">P50</span>
                  </div>
                  <p className="text-sm font-medium">50% Confidence</p>
                  <p className="text-xs text-muted-foreground">Likely completion</p>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-sm font-bold">P80</span>
                  </div>
                  <p className="text-sm font-medium">80% Confidence</p>
                  <p className="text-xs text-muted-foreground">Recommended for planning</p>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-sm font-bold">P95</span>
                  </div>
                  <p className="text-sm font-medium">95% Confidence</p>
                  <p className="text-xs text-muted-foreground">Conservative estimate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Start Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-medium">Choose Your Model</h4>
                    <p className="text-sm text-muted-foreground">Select Throughput (velocity-based) or Cycle Time (historical data) model</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-medium">Enter Your Data</h4>
                    <p className="text-sm text-muted-foreground">Input backlog size, throughput rates, or historical percentiles</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-medium">Run Simulation</h4>
                    <p className="text-sm text-muted-foreground">Click "Run Forecast" to generate 10,000 Monte Carlo simulations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-medium">Interpret Results</h4>
                    <p className="text-sm text-muted-foreground">Use P80 date for planning, view charts for detailed analysis</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Throughput Model</span>
                </CardTitle>
                <CardDescription>Best for teams with established velocity patterns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Badge variant="outline" className="mb-2">Velocity-Based Forecasting</Badge>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm">Backlog Size</h4>
                    <p className="text-sm text-muted-foreground">
                      Total number of items remaining to complete (stories, tasks, features)
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm">Weekly Throughput</h4>
                    <p className="text-sm text-muted-foreground">
                      Average number of items your team completes per week
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm">Coefficient of Variation</h4>
                    <p className="text-sm text-muted-foreground">
                      Measures consistency (0.2 = very consistent, 0.5 = moderate, 0.8+ = highly variable)
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-medium text-green-900 dark:text-green-100">
                        When to Use
                      </h5>
                      <ul className="text-xs text-green-800 dark:text-green-200 mt-1 space-y-1">
                        <li>• You track team velocity</li>
                        <li>• You have at least 4-6 weeks of data</li>
                        <li>• Work items are similarly sized</li>
                        <li>• Team composition is stable</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Cycle Time Model</span>
                </CardTitle>
                <CardDescription>Best for workflow analysis and process improvement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Badge variant="outline" className="mb-2">Historical Data Driven</Badge>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm">P50 (Median)</h4>
                    <p className="text-sm text-muted-foreground">
                      50% of your historical items completed faster than this time
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm">P80 (80th Percentile)</h4>
                    <p className="text-sm text-muted-foreground">
                      80% of items completed faster - represents good performance
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm">P95 (95th Percentile)</h4>
                    <p className="text-sm text-muted-foreground">
                      Only 5% took longer - captures your worst-case scenarios
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-medium text-green-900 dark:text-green-100">
                        When to Use
                      </h5>
                      <ul className="text-xs text-green-800 dark:text-green-200 mt-1 space-y-1">
                        <li>• You have individual item completion times</li>
                        <li>• Items vary significantly in size</li>
                        <li>• You want to forecast single item delivery</li>
                        <li>• You're analyzing workflow efficiency</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Model Selection Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span>Use Throughput When:</span>
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Planning releases or sprints</li>
                      <li>• You have stable team velocity</li>
                      <li>• Work items are reasonably uniform</li>
                      <li>• You need portfolio-level forecasts</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center space-x-2">
                      <Target className="w-4 h-4 text-purple-600" />
                      <span>Use Cycle Time When:</span>
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Forecasting individual features</li>
                      <li>• Items have high size variability</li>
                      <li>• Improving workflow processes</li>
                      <li>• Service level agreements (SLAs)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interpretation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Understanding Your Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="confidence-levels">
                  <AccordionTrigger>Confidence Levels (P50, P80, P95)</AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <p>
                      Confidence levels tell you the probability of completing by a certain date:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">P50</Badge>
                        <span className="text-sm">50% chance of completion - optimistic but realistic</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">P80</Badge>
                        <span className="text-sm">80% chance of completion - recommended for planning</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">P95</Badge>
                        <span className="text-sm">95% chance of completion - conservative buffer</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="histogram">
                  <AccordionTrigger>Histogram Chart</AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <p>
                      The histogram shows the distribution of possible completion dates:
                    </p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• <strong>Peak</strong>: Most likely completion period</li>
                      <li>• <strong>Width</strong>: Uncertainty range (wider = more variable)</li>
                      <li>• <strong>Tail</strong>: Low-probability but possible late completions</li>
                      <li>• <strong>Vertical lines</strong>: P50, P80, P95 confidence markers</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="scurve">
                  <AccordionTrigger>S-Curve (Cumulative Probability)</AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <p>
                      The S-curve shows cumulative probability of completion over time:
                    </p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• <strong>X-axis</strong>: Dates</li>
                      <li>• <strong>Y-axis</strong>: Probability of completion by that date</li>
                      <li>• <strong>Steep sections</strong>: High confidence periods</li>
                      <li>• <strong>Flat sections</strong>: Lower probability of completion</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Making Decisions with Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-green-700 mb-2">For Internal Planning</h4>
                  <p className="text-sm text-muted-foreground">
                    Use <strong>P50 date</strong> for team goals and internal milestones. 
                    It's achievable but keeps urgency.
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-orange-700 mb-2">For External Commitments</h4>
                  <p className="text-sm text-muted-foreground">
                    Use <strong>P80 date</strong> for customer promises and project deadlines. 
                    Good balance of confidence and competitiveness.
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-red-700 mb-2">For Risk Management</h4>
                  <p className="text-sm text-muted-foreground">
                    Use <strong>P95 date</strong> for dependencies and critical path items. 
                    Provides safe buffer for important deliverables.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="best-practices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Best Practices</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="data-quality">
                  <AccordionTrigger>Data Quality</AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <h5 className="font-medium text-green-900 dark:text-green-100 mb-1">
                          ✓ Good Practices
                        </h5>
                        <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                          <li>• Use at least 4-6 weeks of historical data</li>
                          <li>• Include recent data (last 3 months preferred)</li>
                          <li>• Exclude holidays and major disruptions</li>
                          <li>• Ensure consistent team composition</li>
                          <li>• Use data from similar work types</li>
                        </ul>
                      </div>
                      
                      <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <h5 className="font-medium text-red-900 dark:text-red-100 mb-1">
                          ✗ Common Mistakes
                        </h5>
                        <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
                          <li>• Using only 1-2 weeks of data</li>
                          <li>• Including setup/learning phases</li>
                          <li>• Mixing different team configurations</li>
                          <li>• Using estimates instead of actuals</li>
                          <li>• Ignoring seasonal variations</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="regular-updates">
                  <AccordionTrigger>Regular Updates</AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <p>
                      Forecasts become more accurate as work progresses and you collect more data:
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• <strong>Weekly updates</strong>: Adjust backlog size as work completes</li>
                      <li>• <strong>Monthly recalibration</strong>: Update throughput rates with new data</li>
                      <li>• <strong>Quarterly reviews</strong>: Assess model accuracy and adjust methodology</li>
                      <li>• <strong>Major changes</strong>: Rerun when team size or scope changes significantly</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="communication">
                  <AccordionTrigger>Communicating Results</AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium mb-2">For Stakeholders</h5>
                        <p className="text-sm text-muted-foreground mb-2">
                          "Based on our historical performance, we have an 80% confidence of 
                          completing by [P80 date]. This accounts for normal variability in our work."
                        </p>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2">For Teams</h5>
                        <p className="text-sm text-muted-foreground mb-2">
                          "Our target is [P50 date], but we should plan for [P80 date] to account 
                          for uncertainty. Here's what could impact our timeline..."
                        </p>
                      </div>
                      
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div>
                            <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                              Pro Tip
                            </h5>
                            <p className="text-xs text-blue-800 dark:text-blue-200">
                              Always explain the confidence level and what could cause delays. 
                              This builds trust and sets realistic expectations.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="troubleshooting">
                  <AccordionTrigger>Common Issues</AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <div className="space-y-4">
                      <div className="p-3 border border-orange-200 dark:border-orange-800 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5" />
                          <div>
                            <h5 className="text-sm font-medium text-orange-900 dark:text-orange-100">
                              Forecast seems too optimistic
                            </h5>
                            <p className="text-xs text-orange-800 dark:text-orange-200 mt-1">
                              Check if your historical data includes learning periods, different team sizes, 
                              or excludes typical interruptions. Consider using P80 instead of P50.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 border border-orange-200 dark:border-orange-800 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5" />
                          <div>
                            <h5 className="text-sm font-medium text-orange-900 dark:text-orange-100">
                              Very wide confidence intervals
                            </h5>
                            <p className="text-xs text-orange-800 dark:text-orange-200 mt-1">
                              High variability in your data. Consider breaking work into smaller, 
                              more uniform items, or analyze what causes the variation.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 border border-orange-200 dark:border-orange-800 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5" />
                          <div>
                            <h5 className="text-sm font-medium text-orange-900 dark:text-orange-100">
                              Results don't match experience
                            </h5>
                            <p className="text-xs text-orange-800 dark:text-orange-200 mt-1">
                              Verify your input data matches your current situation. Consider if 
                              there have been recent changes to team, process, or work complexity.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}