import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  ArrowLeft, 
  BookOpen, 
  Calculator, 
  TrendingUp, 
  BarChart3, 
  Target, 
  AlertTriangle,
  Calendar,
  Clock,
  Users,
  Zap,
  Download,
  GitCompare,
  Info,
  HelpCircle,
  FileText,
  Image as ImageIcon,
  Gauge
} from "lucide-react";
import forecastLogo from "@assets/ChatGPT Image Aug 18, 2025, 10_50_05 PM_1755599064681.png";

export function Support() {
  const [activeCategory, setActiveCategory] = useState("getting-started");

  const categories = [
    { id: "getting-started", label: "Getting Started", icon: BookOpen },
    { id: "data-requirements", label: "Data Requirements", icon: FileText },
    { id: "understanding-results", label: "Understanding Results", icon: BarChart3 },
    { id: "forecasting-methods", label: "Forecasting Methods", icon: Calculator },
    { id: "export-features", label: "Export Features", icon: Download },
    { id: "terminology", label: "Terminology", icon: HelpCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to App</span>
                </Button>
              </Link>
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">Support & Documentation</h1>
                  <p className="text-slate-600 dark:text-slate-400 text-[12px] font-normal">Complete guide to Flow Forecasting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-32">
              <CardHeader>
                <CardTitle className="text-lg">Documentation</CardTitle>
                <CardDescription>Navigate through different sections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={activeCategory === category.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {category.label}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeCategory === "getting-started" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="w-5 h-5" />
                      <span>Getting Started</span>
                    </CardTitle>
                    <CardDescription>Learn how to use the Monte Carlo forecasting application</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-emerald-700 dark:text-emerald-300">Step 1: Choose Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-emerald-600 dark:text-emerald-400">Select either Throughput Analysis or Cycle Time Analysis based on your available data.</p>
                        </CardContent>
                      </Card>
                      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-blue-700 dark:text-blue-300">Step 2: Input Data</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-blue-600 dark:text-blue-400">Enter your project parameters like backlog size, team metrics, and simulation settings.</p>
                        </CardContent>
                      </Card>
                      <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-purple-700 dark:text-purple-300">Step 3: Run Forecast</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-purple-600 dark:text-purple-400">Click "Run Monte Carlo Forecast" to generate probabilistic completion date predictions.</p>
                        </CardContent>
                      </Card>
                      <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-amber-700 dark:text-amber-300">Step 4: Analyze Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-amber-600 dark:text-amber-400">Review confidence intervals, statistical analysis, and visualizations to make informed decisions.</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="quick-start">
                    <AccordionTrigger>Quick Start Guide</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 text-sm">
                        <p><strong>For new users:</strong> Start with Throughput Analysis if you know your team's average velocity. Use Cycle Time Analysis if you have historical completion time data.</p>
                        <p><strong>Minimum data needed:</strong> Backlog size, either team throughput OR cycle time percentiles, and a start date.</p>
                        <p><strong>Recommended trials:</strong> 10,000 simulations provide a good balance of accuracy and speed for most projects.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="common-workflow">
                    <AccordionTrigger>Common Workflow</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 text-sm">
                        <ol className="list-decimal list-inside space-y-2">
                          <li>Gather your historical data (velocity, cycle times, or throughput)</li>
                          <li>Count your backlog items that need completion</li>
                          <li>Choose the appropriate forecasting method</li>
                          <li>Enter your data and adjust simulation settings</li>
                          <li>Run the forecast and review confidence intervals</li>
                          <li>Save scenarios to compare different approaches</li>
                          <li>Export results for stakeholder communication</li>
                        </ol>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}

            {activeCategory === "data-requirements" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>Data Requirements</span>
                    </CardTitle>
                    <CardDescription>What data you need to get accurate forecasts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="throughput" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="throughput">Throughput Method</TabsTrigger>
                        <TabsTrigger value="cycletime">Cycle Time Method</TabsTrigger>
                      </TabsList>
                      <TabsContent value="throughput" className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Required Data</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="space-y-2">
                              <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">Required</Badge>
                              <ul className="list-disc list-inside space-y-1 text-sm">
                                <li><strong>Backlog Size:</strong> Total number of items to complete</li>
                                <li><strong>Average Throughput:</strong> Items completed per time period (week/sprint)</li>
                                <li><strong>Start Date:</strong> When the project begins</li>
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">Recommended</Badge>
                              <ul className="list-disc list-inside space-y-1 text-sm">
                                <li><strong>Throughput Variability:</strong> Coefficient of variation (CV) - typically 0.2-0.4</li>
                                <li><strong>Historical Data:</strong> Past throughput values for automatic CV calculation</li>
                                <li><strong>Weekly Capacity:</strong> Maximum items the team can handle per week</li>
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="cycletime" className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Required Data</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="space-y-2">
                              <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">Required</Badge>
                              <ul className="list-disc list-inside space-y-1 text-sm">
                                <li><strong>Backlog Size:</strong> Total number of items to complete</li>
                                <li><strong>P50 Cycle Time:</strong> Median time to complete one item (days)</li>
                                <li><strong>P80 Cycle Time:</strong> 80th percentile completion time</li>
                                <li><strong>P95 Cycle Time:</strong> 95th percentile completion time</li>
                                <li><strong>Start Date:</strong> When the project begins</li>
                              </ul>
                            </div>
                            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                              <div className="flex items-start space-x-2">
                                <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-amber-700 dark:text-amber-300">
                                  <p><strong>How to get percentiles:</strong> From your historical data, sort cycle times and find the 50th, 80th, and 95th percentile values. Most project management tools can calculate these automatically.</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Data Quality Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="data-collection">
                        <AccordionTrigger>Best Practices for Data Collection</AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc list-inside space-y-2 text-sm">
                            <li>Use at least 30 historical data points for reliable statistics</li>
                            <li>Ensure data represents similar work types and team composition</li>
                            <li>Exclude outliers or clearly non-representative periods</li>
                            <li>Use consistent time units (days, weeks) across all measurements</li>
                            <li>Count only completed items, not work in progress</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="common-issues">
                        <AccordionTrigger>Common Data Issues</AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc list-inside space-y-2 text-sm">
                            <li><strong>Inconsistent item sizing:</strong> Use story points or T-shirt sizes consistently</li>
                            <li><strong>Mixed work types:</strong> Separate features, bugs, and technical debt</li>
                            <li><strong>Team changes:</strong> Account for significant team composition changes</li>
                            <li><strong>Seasonal variations:</strong> Consider holidays, vacation periods</li>
                            <li><strong>Process changes:</strong> Use data from after major process improvements</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeCategory === "understanding-results" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5" />
                      <span>Understanding Results</span>
                    </CardTitle>
                    <CardDescription>How to interpret your forecast results and make decisions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
                        <CardHeader>
                          <CardTitle className="text-lg text-blue-700 dark:text-blue-300">Confidence Intervals</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-sm text-blue-600 dark:text-blue-400">
                            <p><strong>50% confidence:</strong> Half of simulations completed by this date</p>
                            <p><strong>80% confidence:</strong> More realistic target with buffer</p>
                            <p><strong>95% confidence:</strong> Conservative estimate with significant buffer</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20">
                        <CardHeader>
                          <CardTitle className="text-lg text-purple-700 dark:text-purple-300">Statistical Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-sm text-purple-600 dark:text-purple-400">
                            <p><strong>Mean:</strong> Average completion date across all simulations</p>
                            <p><strong>Median:</strong> Middle value - often more realistic than mean</p>
                            <p><strong>Standard Deviation:</strong> Measure of uncertainty/risk</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Chart Interpretation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="histogram">
                        <AccordionTrigger className="flex items-center">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Histogram Chart
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 text-sm">
                            <p>Shows the distribution of completion dates from all simulations:</p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                              <li><strong>Peak:</strong> Most likely completion timeframe</li>
                              <li><strong>Width:</strong> Indicates uncertainty - wider = more uncertain</li>
                              <li><strong>Skew:</strong> Asymmetry shows risk direction (right skew = delay risk)</li>
                              <li><strong>Reference lines:</strong> Show confidence interval boundaries</li>
                            </ul>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="scurve">
                        <AccordionTrigger className="flex items-center">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          S-Curve Chart
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 text-sm">
                            <p>Shows cumulative probability of completion by any given date:</p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                              <li><strong>X-axis:</strong> Completion dates</li>
                              <li><strong>Y-axis:</strong> Probability of completion by that date</li>
                              <li><strong>Steep sections:</strong> High probability of completion in that timeframe</li>
                              <li><strong>Flat sections:</strong> Low probability of completion in that timeframe</li>
                            </ul>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Making Decisions with Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Recommended Approach</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-green-600 dark:text-green-400">
                          <li>Use 80% confidence interval for stakeholder commitments</li>
                          <li>Use 50% confidence for internal planning and resource allocation</li>
                          <li>Use 95% confidence for critical deadlines with high penalty for delay</li>
                          <li>Compare multiple scenarios to understand impact of different approaches</li>
                        </ul>
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                        <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-2">Risk Assessment</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-amber-600 dark:text-amber-400">
                          <li>Large spread between 50% and 95% indicates high uncertainty</li>
                          <li>Right-skewed distribution suggests delay risks</li>
                          <li>High standard deviation means variable completion times</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeCategory === "forecasting-methods" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calculator className="w-5 h-5" />
                      <span>Forecasting Methods</span>
                    </CardTitle>
                    <CardDescription>Detailed explanation of throughput and cycle time analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="throughput" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="throughput">Throughput Analysis</TabsTrigger>
                        <TabsTrigger value="cycletime">Cycle Time Analysis</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="throughput" className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">When to Use Throughput Analysis</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <p className="text-sm">Best suited for teams that:</p>
                            <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                              <li>Work in regular sprints or iterations</li>
                              <li>Have consistent team velocity measurements</li>
                              <li>Complete multiple items per time period</li>
                              <li>Want to forecast based on team productivity</li>
                            </ul>
                            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                              <p className="text-sm text-blue-700 dark:text-blue-300"><strong>Example:</strong> A development team completes an average of 12 story points per sprint with a CV of 0.3, and needs to complete 100 story points.</p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">How It Works</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <ol className="list-decimal list-inside space-y-2 text-sm">
                              <li>Simulates team throughput using log-normal distribution</li>
                              <li>Accounts for variability in team performance</li>
                              <li>Considers capacity constraints if specified</li>
                              <li>Tracks completion progress over time periods</li>
                              <li>Records completion date when backlog reaches zero</li>
                            </ol>
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                              <p className="text-sm font-mono">Completion Time = Backlog Size ÷ Variable Throughput Rate</p>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="cycletime" className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">When to Use Cycle Time Analysis</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <p className="text-sm">Best suited for teams that:</p>
                            <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                              <li>Have historical cycle time data</li>
                              <li>Work on items with varying completion times</li>
                              <li>Want to model individual item completion patterns</li>
                              <li>Focus on flow efficiency rather than batch delivery</li>
                            </ul>
                            <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                              <p className="text-sm text-purple-700 dark:text-purple-300"><strong>Example:</strong> Items typically take 3 days (P50), 7 days (P80), and 14 days (P95) to complete, with 50 items in the backlog.</p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Processing Modes</CardTitle>
                            <CardDescription>Choose how to model parallel work within your team</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20">
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-sm text-emerald-700 dark:text-emerald-300">Worker Scheduling (Recommended)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-2">Items are assigned to the earliest available team member among parallel workers.</p>
                                  <ul className="list-disc list-inside text-xs space-y-1 text-emerald-600 dark:text-emerald-400">
                                    <li>More realistic team dynamics</li>
                                    <li>Faster workers can start new items earlier</li>
                                    <li>Usually produces shorter, more accurate forecasts</li>
                                  </ul>
                                </CardContent>
                              </Card>
                              <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20">
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-sm text-orange-700 dark:text-orange-300">Batch Processing</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-xs text-orange-600 dark:text-orange-400 mb-2">Items are processed in batches, with each batch completing when the slowest item finishes.</p>
                                  <ul className="list-disc list-inside text-xs space-y-1 text-orange-600 dark:text-orange-400">
                                    <li>More conservative estimates</li>
                                    <li>Built-in buffer for delays</li>
                                    <li>Simpler mental model</li>
                                  </ul>
                                </CardContent>
                              </Card>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                              <p className="text-sm text-blue-700 dark:text-blue-300">
                                <strong>WIP Limit:</strong> Both modes use a Work In Progress limit (default: 7) to represent team capacity. This determines how many items can be worked on simultaneously.
                              </p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">How It Works</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <ol className="list-decimal list-inside space-y-2 text-sm">
                              <li>Fits log-normal distribution to percentile data (P50, P80, P95)</li>
                              <li>Generates cycle time for each backlog item from the distribution</li>
                              <li>Models parallel work using WIP limit (team capacity)</li>
                              <li><strong>Worker Scheduling:</strong> Assigns items to earliest available worker</li>
                              <li><strong>Batch Processing:</strong> Groups items, waits for slowest in each batch</li>
                              <li>Project completes when the last item/batch finishes</li>
                            </ol>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-3">
                                <p className="text-sm font-mono text-emerald-700 dark:text-emerald-300">Worker Scheduling:<br/>Time = MAX(worker finish times)</p>
                              </div>
                              <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-3">
                                <p className="text-sm font-mono text-orange-700 dark:text-orange-300">Batch Processing:<br/>Time = SUM(batch completion times)</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Choosing the Right Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-green-700 dark:text-green-300">Use Throughput When:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-green-600 dark:text-green-400">
                          <li>You have velocity/throughput history</li>
                          <li>Team works in batches or sprints</li>
                          <li>Focus on team productivity</li>
                          <li>Items are relatively similar in size</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-purple-700 dark:text-purple-300">Use Cycle Time When:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-purple-600 dark:text-purple-400">
                          <li>You have individual completion times</li>
                          <li>Items vary significantly in complexity</li>
                          <li>Focus on flow and continuous delivery</li>
                          <li>Work happens in parallel streams</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeCategory === "export-features" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Download className="w-5 h-5" />
                      <span>Export Features</span>
                    </CardTitle>
                    <CardDescription>Share and save your forecast results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-red-700 dark:text-red-300 flex items-center">
                            <FileText className="w-5 h-5 mr-2" />
                            PDF Report
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc list-inside space-y-1 text-sm text-red-600 dark:text-red-400">
                            <li>Complete forecast analysis</li>
                            <li>Embedded charts and graphs</li>
                            <li>Statistical summary</li>
                            <li>Professional formatting</li>
                            <li>Ready for stakeholder sharing</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-green-700 dark:text-green-300 flex items-center">
                            <Download className="w-5 h-5 mr-2" />
                            CSV Data
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc list-inside space-y-1 text-sm text-green-600 dark:text-green-400">
                            <li>Raw simulation data</li>
                            <li>All completion dates</li>
                            <li>Percentile calculations</li>
                            <li>Input parameters</li>
                            <li>Importable to Excel/Sheets</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-blue-700 dark:text-blue-300 flex items-center">
                            <ImageIcon className="w-5 h-5 mr-2" />
                            Chart Images
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc list-inside space-y-1 text-sm text-blue-600 dark:text-blue-400">
                            <li>High-resolution PNG files</li>
                            <li>Histogram and S-curve charts</li>
                            <li>Publication quality</li>
                            <li>Perfect for presentations</li>
                            <li>Standalone visuals</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Scenario Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <GitCompare className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white">Save and Compare Scenarios</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Save multiple forecast scenarios to compare different approaches, team sizes, or timeframes side by side.</p>
                        </div>
                      </div>
                      <Accordion type="single" collapsible>
                        <AccordionItem value="scenario-tips">
                          <AccordionTrigger>Tips for Scenario Analysis</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              <li>Compare optimistic vs. realistic vs. pessimistic assumptions</li>
                              <li>Test impact of team size changes</li>
                              <li>Evaluate different scope reduction options</li>
                              <li>Model the effect of process improvements</li>
                              <li>Assess risk mitigation strategies</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeCategory === "terminology" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <HelpCircle className="w-5 h-5" />
                      <span>Terminology & Definitions</span>
                    </CardTitle>
                    <CardDescription>Key terms and concepts used in Monte Carlo forecasting</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="statistical-terms">
                        <AccordionTrigger>Statistical Terms</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 text-sm">
                            <div><strong>Mean:</strong> The mathematical average of all simulated completion dates.</div>
                            <div><strong>Median (P50):</strong> The middle value when all dates are sorted - 50% of simulations finished by this date.</div>
                            <div><strong>Mode:</strong> The most frequently occurring completion date in the simulations.</div>
                            <div><strong>Standard Deviation:</strong> Measures how spread out the completion dates are from the mean.</div>
                            <div><strong>Coefficient of Variation (CV):</strong> Standard deviation divided by mean, expressing variability as a percentage.</div>
                            <div><strong>Percentile (P80, P95):</strong> The value below which a certain percentage of simulations fall.</div>
                            <div><strong>Range:</strong> The difference between the earliest and latest completion dates.</div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="forecasting-terms">
                        <AccordionTrigger>Forecasting Terms</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 text-sm">
                            <div><strong>Monte Carlo Simulation:</strong> A statistical method that uses random sampling to model uncertainty and risk.</div>
                            <div><strong>Confidence Interval:</strong> A range of dates with a specific probability of containing the actual completion date.</div>
                            <div><strong>Simulation Trials:</strong> The number of times the forecast model runs to generate the probability distribution.</div>
                            <div><strong>Throughput:</strong> The rate at which a team completes work items (e.g., story points per sprint).</div>
                            <div><strong>Cycle Time:</strong> The time it takes to complete a single work item from start to finish.</div>
                            <div><strong>Backlog:</strong> The total amount of work to be completed (in items, points, or hours).</div>
                            <div><strong>Log-normal Distribution:</strong> A probability distribution used to model positive values with right-skewed patterns.</div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="agile-terms">
                        <AccordionTrigger>Agile & Project Terms</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 text-sm">
                            <div><strong>Velocity:</strong> The amount of work a team completes in a fixed time period (usually a sprint).</div>
                            <div><strong>Story Points:</strong> A unit of measure for expressing the relative size and complexity of user stories.</div>
                            <div><strong>Sprint:</strong> A fixed time period (usually 1-4 weeks) during which specific work is completed.</div>
                            <div><strong>Capacity:</strong> The maximum amount of work a team can handle in a given time period.</div>
                            <div><strong>WIP (Work in Progress):</strong> The number of items currently being worked on.</div>
                            <div><strong>Lead Time:</strong> The total time from when a request is made until it's completed.</div>
                            <div><strong>Dependencies:</strong> Work items that rely on other items to be completed first.</div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="risk-terms">
                        <AccordionTrigger>Risk & Uncertainty Terms</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 text-sm">
                            <div><strong>Risk Factor:</strong> An event or condition that could negatively impact project timeline.</div>
                            <div><strong>Variability:</strong> The degree to which actual performance differs from average performance.</div>
                            <div><strong>Uncertainty:</strong> The lack of complete knowledge about future outcomes.</div>
                            <div><strong>Buffer:</strong> Extra time built into estimates to account for uncertainty and risks.</div>
                            <div><strong>Confidence Level:</strong> The probability that the actual outcome will fall within the predicted range.</div>
                            <div><strong>Right-skewed:</strong> A distribution where most values cluster on the left with a long tail extending right (common in project timelines).</div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Common Abbreviations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div><strong>CV:</strong> Coefficient of Variation</div>
                        <div><strong>P50:</strong> 50th Percentile (Median)</div>
                        <div><strong>P80:</strong> 80th Percentile</div>
                        <div><strong>P95:</strong> 95th Percentile</div>
                        <div><strong>SD:</strong> Standard Deviation</div>
                      </div>
                      <div className="space-y-2">
                        <div><strong>MC:</strong> Monte Carlo</div>
                        <div><strong>CI:</strong> Confidence Interval</div>
                        <div><strong>PDF:</strong> Probability Density Function</div>
                        <div><strong>CDF:</strong> Cumulative Distribution Function</div>
                        <div><strong>SLE:</strong> Service Level Expectation</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="mt-20 border-t border-slate-200/50 dark:border-slate-700/50 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Monte Carlo Forecasting • Professional Statistical Analysis • Built for Project Success
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}