import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  ArrowLeft,
  BookOpen,
  Target,
  Calculator,
  BarChart3,
  TrendingUp,
  Clock,
  Calendar,
  Activity,
  Download,
  GitCompare,
  Info,
  HelpCircle,
  FileText,
  Image as ImageIcon,
  Gauge,
  Percent
} from "lucide-react";
import forecastLogo from "@assets/ChatGPT Image Aug 18, 2025, 10_50_05 PM_1755599064681.png";

export function Support() {
  const [activeCategory, setActiveCategory] = useState("getting-started");

  const categories = [
    { id: "getting-started", label: "Getting Started", icon: BookOpen },
    { id: "analysis-modes", label: "Analysis Modes", icon: Target },
    { id: "forecasting-methods", label: "Forecasting Methods", icon: Calculator },
    { id: "data-requirements", label: "Data Requirements", icon: FileText },
    { id: "understanding-results", label: "Understanding Results", icon: BarChart3 },
    { id: "export-features", label: "Export Features", icon: Download },
    { id: "terminology", label: "Terminology", icon: HelpCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
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
                  <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">Support & Documentation</h1>
                  <p className="text-slate-600 text-[12px] font-normal">Complete guide to Flow Forecasting</p>
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
                      className="w-full justify-start text-left"
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
            <Card>
              <CardContent className="p-8">
                {activeCategory === "getting-started" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 mb-4">Getting Started</h2>
                      <p className="text-lg text-slate-600 mb-8">
                        Welcome to Flow Forecasting! This guide will help you understand how to use our Monte Carlo simulation tool for project forecasting.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="border-emerald-200 bg-emerald-50/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-emerald-700">Step 1: Choose Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-emerald-600">Select either Throughput Analysis or Cycle Time Analysis based on your available data.</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-blue-200 bg-blue-50/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-blue-700">Step 2: Input Data</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-blue-600">Enter your project parameters like backlog size, team metrics, and simulation settings.</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-purple-200 bg-purple-50/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-purple-700">Step 3: Run Forecast</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-purple-600">Click "Run Monte Carlo Forecast" to generate probabilistic completion date predictions.</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-amber-200 bg-amber-50/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-amber-700">Step 4: Analyze Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-amber-600">Review confidence intervals, statistical analysis, and visualizations to make informed decisions.</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm text-amber-700">
                            <strong>Quick Start Tip:</strong> If you're new to Monte Carlo forecasting, start with a single project and use the default settings. You can always refine your approach as you become more familiar with the tool.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeCategory === "analysis-modes" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 mb-4">Analysis Modes</h2>
                      <p className="text-lg text-slate-600 mb-8">
                        Choose the right analysis mode based on what you want to learn about your project.
                      </p>
                    </div>

                    <Tabs defaultValue="forecast" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="forecast" className="flex items-center space-x-2">
                          <Target className="w-4 h-4" />
                          <span>Forecast</span>
                        </TabsTrigger>
                        <TabsTrigger value="probability" className="flex items-center space-x-2">
                          <Percent className="w-4 h-4" />
                          <span>Probability</span>
                        </TabsTrigger>
                        <TabsTrigger value="target" className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Target</span>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="forecast" className="space-y-6">
                        <Card className="border-blue-200 bg-blue-50/50">
                          <CardHeader>
                            <CardTitle className="text-lg text-blue-700">Confidence Intervals</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-sm text-blue-600">
                              <p className="mb-3">Understand the likelihood of different completion dates:</p>
                              <ul className="space-y-1 ml-4">
                                <li>• <strong>50% confidence:</strong> Most likely completion date range</li>
                                <li>• <strong>80% confidence:</strong> Conservative estimate with buffer</li>
                                <li>• <strong>95% confidence:</strong> Very conservative estimate for critical projects</li>
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-purple-200 bg-purple-50/50">
                          <CardHeader>
                            <CardTitle className="text-lg text-purple-700">Statistical Analysis</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-sm text-purple-600">
                              <p className="mb-3">Key metrics provided:</p>
                              <ul className="space-y-1 ml-4">
                                <li>• <strong>Mean completion date:</strong> Average across all simulations</li>
                                <li>• <strong>Standard deviation:</strong> Measure of variability</li>
                                <li>• <strong>Skewness:</strong> Distribution asymmetry indicator</li>
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="probability" className="space-y-6">
                        <Card className="border-green-200 bg-green-50/50">
                          <CardHeader>
                            <CardTitle className="text-lg text-green-700">Target Date Analysis</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-sm text-green-600">
                              <p className="mb-3">Enter a specific target date to learn:</p>
                              <ul className="space-y-1 ml-4">
                                <li>• Probability of completing by that date</li>
                                <li>• Risk level associated with the deadline</li>
                                <li>• Buffer days needed for higher confidence</li>
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="target" className="space-y-6">
                        <Card className="border-purple-200 bg-purple-50/50">
                          <CardHeader>
                            <CardTitle className="text-lg text-purple-700">Start Date Optimization</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-sm text-purple-600">
                              <p className="mb-3">Find the optimal start date for:</p>
                              <ul className="space-y-1 ml-4">
                                <li>• Meeting a fixed deadline</li>
                                <li>• Achieving desired confidence levels</li>
                                <li>• Planning resource allocation</li>
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}

                {activeCategory === "forecasting-methods" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 mb-4">Forecasting Methods</h2>
                      <p className="text-lg text-slate-600 mb-8">
                        Choose between two proven statistical approaches based on your available data.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="border-blue-200">
                        <CardHeader>
                          <Badge className="w-fit mb-2 bg-blue-100 text-blue-800">Velocity Based</Badge>
                          <CardTitle className="text-xl">Throughput Analysis</CardTitle>
                          <CardDescription>Uses team velocity data and work item counts</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-2">When to Use:</h4>
                            <ul className="text-sm text-slate-600 space-y-1">
                              <li>• You have historical velocity data</li>
                              <li>• Work is broken into countable items</li>
                              <li>• Team size and composition is stable</li>
                              <li>• Similar work complexity</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-2">Required Data:</h4>
                            <ul className="text-sm text-slate-600 space-y-1">
                              <li>• Backlog size (number of items)</li>
                              <li>• Average throughput per time period</li>
                              <li>• Throughput variability (coefficient of variation)</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-green-200">
                        <CardHeader>
                          <Badge className="w-fit mb-2 bg-green-100 text-green-800">Time Based</Badge>
                          <CardTitle className="text-xl">Cycle Time Analysis</CardTitle>
                          <CardDescription>Uses historical completion time data</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-2">When to Use:</h4>
                            <ul className="text-sm text-slate-600 space-y-1">
                              <li>• You have historical cycle time data</li>
                              <li>• Work items vary significantly in size</li>
                              <li>• Focus on individual item completion</li>
                              <li>• SLA or delivery time commitments</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-2">Required Data:</h4>
                            <ul className="text-sm text-slate-600 space-y-1">
                              <li>• Number of items to complete</li>
                              <li>• Historical percentile data (P50, P80, P95)</li>
                              <li>• Representative sample size</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm text-blue-700">
                            <strong>Method Selection Tip:</strong> If you're unsure which method to use, throughput analysis is often easier to start with if you track velocity. Cycle time analysis provides more granular insights but requires detailed timing data.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeCategory === "understanding-results" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 mb-4">Understanding Results</h2>
                      <p className="text-lg text-slate-600 mb-8">
                        Learn how to interpret and act on your Monte Carlo simulation results.
                      </p>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="visualizations">
                        <AccordionTrigger className="text-lg font-semibold">Charts and Visualizations</AccordionTrigger>
                        <AccordionContent className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="border-blue-200 bg-blue-50/30">
                              <CardHeader>
                                <CardTitle className="text-lg text-blue-700 flex items-center">
                                  <BarChart3 className="w-5 h-5 mr-2" />
                                  Histogram
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-blue-600">Shows the distribution of possible completion dates. Taller bars indicate more likely outcomes.</p>
                              </CardContent>
                            </Card>
                            
                            <Card className="border-purple-200 bg-purple-50/30">
                              <CardHeader>
                                <CardTitle className="text-lg text-purple-700 flex items-center">
                                  <TrendingUp className="w-5 h-5 mr-2" />
                                  S-Curve
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-purple-600">Cumulative probability chart showing the likelihood of completing by any given date.</p>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <h4 className="font-semibold text-amber-800 mb-2">Reading the Charts:</h4>
                            <ul className="text-sm text-amber-700 space-y-1">
                              <li>• Look for the peak in the histogram - this is your most likely completion date</li>
                              <li>• Use the S-curve to find confidence levels (50%, 80%, 95%)</li>
                              <li>• Wide distributions indicate higher uncertainty</li>
                              <li>• Skewed distributions suggest asymmetric risk</li>
                            </ul>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="statistics">
                        <AccordionTrigger className="text-lg font-semibold">Statistical Metrics</AccordionTrigger>
                        <AccordionContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-slate-900 mb-3">Core Statistics</h4>
                              <ul className="space-y-2 text-sm text-slate-600">
                                <li><strong>Mean:</strong> Average completion date across all simulations</li>
                                <li><strong>Median (P50):</strong> 50% chance of completing by this date</li>
                                <li><strong>Standard Deviation:</strong> Measure of variability in outcomes</li>
                                <li><strong>Skewness:</strong> Whether distribution leans early or late</li>
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-slate-900 mb-3">Confidence Levels</h4>
                              <ul className="space-y-2 text-sm text-slate-600">
                                <li><strong>P50 (50%):</strong> Balanced risk/opportunity</li>
                                <li><strong>P80 (80%):</strong> Conservative with buffer</li>
                                <li><strong>P95 (95%):</strong> Very safe estimate</li>
                                <li><strong>P99 (99%):</strong> Extremely conservative</li>
                              </ul>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="trend-analysis">
                        <AccordionTrigger className="text-lg font-semibold">Trend Analysis</AccordionTrigger>
                        <AccordionContent className="space-y-4">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                              <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-green-800 mb-2">Automatic Trend Detection</h4>
                                <p className="text-sm text-green-700 mb-3">
                                  When you provide historical throughput data (4+ data points), the app automatically performs trend analysis to show if your team's performance is improving, declining, or stable over time.
                                </p>
                                <ul className="text-sm text-green-700 space-y-1">
                                  <li>• <strong>Improving trend:</strong> Forecasts may be conservative</li>
                                  <li>• <strong>Declining trend:</strong> Consider process improvements</li>
                                  <li>• <strong>Stable trend:</strong> Historical data is most reliable</li>
                                  <li>• <strong>No clear trend:</strong> Natural variation in performance</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <h4 className="font-semibold text-amber-800 mb-2">Using Trend Insights:</h4>
                            <ul className="text-sm text-amber-700 space-y-1">
                              <li>• Factor trends into your confidence levels</li>
                              <li>• Address declining performance before committing to dates</li>
                              <li>• Use improving trends to negotiate shorter timelines</li>
                              <li>• Combine with team retrospectives for context</li>
                            </ul>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {activeCategory === "export-features" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 mb-4">Export Features</h2>
                      <p className="text-lg text-slate-600 mb-8">
                        Share your forecasting results with stakeholders using professional export formats.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-red-200">
                        <CardHeader>
                          <CardTitle className="text-lg text-red-700 flex items-center">
                            <FileText className="w-5 h-5 mr-2" />
                            PDF Report
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-red-600 mb-3">
                            Generate a comprehensive report including:
                          </p>
                          <ul className="text-sm text-red-600 space-y-1">
                            <li>• Executive summary with key dates</li>
                            <li>• All charts and visualizations</li>
                            <li>• Statistical analysis details</li>
                            <li>• Input parameters and assumptions</li>
                            <li>• Professional formatting for presentations</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-green-200">
                        <CardHeader>
                          <CardTitle className="text-lg text-green-700 flex items-center">
                            <Download className="w-5 h-5 mr-2" />
                            CSV Data
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-green-600 mb-3">
                            Export raw data for further analysis:
                          </p>
                          <ul className="text-sm text-green-600 space-y-1">
                            <li>• All simulation results</li>
                            <li>• Percentile calculations</li>
                            <li>• Date ranges and probabilities</li>
                            <li>• Import into Excel or other tools</li>
                            <li>• Create custom charts and reports</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm text-blue-700">
                            <strong>Export Tips:</strong> PDF reports are perfect for stakeholder meetings and documentation. CSV exports are ideal for further statistical analysis or creating custom dashboards in other tools.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeCategory === "terminology" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 mb-4">Terminology</h2>
                      <p className="text-lg text-slate-600 mb-8">
                        Key terms and concepts used in Monte Carlo forecasting.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Monte Carlo Simulation</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-slate-600">
                            A mathematical technique that uses random sampling to model complex systems and predict probable outcomes. Named after the Monte Carlo casino in Monaco.
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Throughput</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-slate-600">
                            The number of work items completed by a team in a given time period. Also known as velocity in agile contexts.
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Cycle Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-slate-600">
                            The time it takes to complete a single work item from start to finish. Used to predict completion times for individual items.
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Percentile (P50, P80, P95)</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-slate-600">
                            Statistical measures indicating the value below which a certain percentage of observations fall. P50 is the median, P80 means 80% of results fall below this value.
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Confidence Interval</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-slate-600">
                            A range of values that contains the true value with a specified probability. Higher confidence levels provide wider, more conservative ranges.
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Standard Deviation</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-slate-600">
                            A measure of variability in a dataset. Higher standard deviation indicates more uncertainty and wider ranges in forecasts.
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Skewness</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-slate-600">
                            A measure of the asymmetry of a distribution. Positive skew means the tail extends toward higher values (later dates).
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 border-t border-slate-200/50 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <p className="text-sm text-slate-500">
              Powered by advanced statistical modeling • Built for professional forecasting
            </p>
            
            {/* Support Section */}
            <div className="max-w-2xl mx-auto">
              <p className="text-xs text-slate-400 mb-3">
                If you like this little app and want to see more experiments like this, consider buying us a coffee. Every small support helps us keep building cool and free stuff that (hopefully) makes life a bit easier.
              </p>
              <div className="flex justify-center items-center space-x-6">
                <a 
                  href="https://buymeacoffee.com/flowforcasting" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-xs text-amber-600 hover:text-amber-700 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-.766-1.645a4.32 4.32 0 0 0-1.513-1.147c-.6-.28-1.248-.42-1.897-.41H6.39c-.65-.01-1.297.13-1.897.41a4.32 4.32 0 0 0-1.513 1.147c-.378.482-.647 1.047-.766 1.645L2.082 7.81c-.07.351-.05.713.058 1.054.108.341.297.65.55.896.253.246.567.426.913.523.346.097.708.109 1.058.035L6.39 9.653c.65.01 1.297-.13 1.897-.41a4.32 4.32 0 0 0 1.513-1.147c.378-.482.647-1.047.766-1.645L10.698 6c.119-.598.388-1.163.766-1.645a4.32 4.32 0 0 1 1.513-1.147c.6-.28 1.248-.42 1.897-.41h3.517c.65-.01 1.297.13 1.897.41a4.32 4.32 0 0 1 1.513 1.147c.378.482.647 1.047.766 1.645l.132.451z"/>
                  </svg>
                  <span>Buy Me Coffee</span>
                </a>
                <span className="text-slate-300">•</span>
                <a 
                  href="https://paypal.me/mtrnski" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.028-.026.057-.039.085-.94 4.814-4.169 6.523-8.097 6.523h-2.29c-.67 0-1.238.482-1.365 1.153l-.69 4.353-.066.412L6.26 22.7a.641.641 0 0 0 .633.737h4.607c.524 0 .968-.382 1.05-.9l.12-.76.445-2.817.029-.179c.082-.518.526-.9 1.05-.9h.66c3.533 0 6.295-1.336 7.102-5.202.337-1.615.203-2.963-.57-3.902z"/>
                  </svg>
                  <span>PayPal</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}