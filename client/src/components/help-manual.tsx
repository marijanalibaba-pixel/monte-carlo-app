import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Target, TrendingUp, BarChart3, Settings, Calculator, Lightbulb, AlertTriangle } from "lucide-react";

export function HelpManual() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4" />
          Help & Manual
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Monte Carlo Pro - Complete Manual
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  What is Monte Carlo Forecasting?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600 dark:text-slate-300">
                  Monte Carlo simulation is a mathematical technique that uses random sampling to model complex systems and predict outcomes. In project forecasting, it helps you understand the range of possible completion dates and their probabilities.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">How it Works</h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Runs thousands of simulations</li>
                      <li>• Each simulation models uncertainty</li>
                      <li>• Aggregates results into probabilities</li>
                      <li>• Provides confidence intervals</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Benefits</h4>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li>• More accurate than single estimates</li>
                      <li>• Quantifies uncertainty and risk</li>
                      <li>• Supports data-driven decisions</li>
                      <li>• Improves stakeholder communication</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="models" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-600 dark:text-blue-400">Throughput Model</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Based on how many items your team completes per week.
                  </p>
                  <div className="space-y-2">
                    <h5 className="font-medium">Required Inputs:</h5>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>Throughput:</strong> Items per week</li>
                      <li>• <strong>Coefficient of Variation:</strong> Variability (0.1-0.5)</li>
                      <li>• <strong>Backlog Size:</strong> Total items</li>
                    </ul>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Best for Sprint Teams
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600 dark:text-green-400">Cycle Time Model</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Based on historical data of how long individual items take.
                  </p>
                  <div className="space-y-2">
                    <h5 className="font-medium">Required Inputs:</h5>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>P50:</strong> Median cycle time</li>
                      <li>• <strong>P80:</strong> 80th percentile</li>
                      <li>• <strong>P95:</strong> 95th percentile</li>
                    </ul>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Best for Kanban Teams
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Model Selection Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="throughput-when">
                    <AccordionTrigger>When to use Throughput Model?</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm">
                        <li>✓ You work in regular sprints</li>
                        <li>✓ You track items completed per iteration</li>
                        <li>✓ Your team has consistent delivery patterns</li>
                        <li>✓ You want to forecast based on velocity</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="cycletime-when">
                    <AccordionTrigger>When to use Cycle Time Model?</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm">
                        <li>✓ You have historical cycle time data</li>
                        <li>✓ You work in continuous flow (Kanban)</li>
                        <li>✓ Items vary significantly in size</li>
                        <li>✓ You want to account for item-level variability</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inputs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Input Parameters Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="backlog">
                    <AccordionTrigger>Backlog Size</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm mb-2">Total number of items (stories, tasks, features) to complete.</p>
                      <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded">
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          <strong>Tip:</strong> Include only well-defined, ready-to-work items. Exclude vague or undefined work.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="simulations">
                    <AccordionTrigger>Number of Simulations</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm mb-2">How many scenarios to run (1,000 - 10,000).</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>1,000:</span> <span>Fast, good for initial estimates</span>
                        </div>
                        <div className="flex justify-between">
                          <span>5,000:</span> <span>Balanced speed and accuracy</span>
                        </div>
                        <div className="flex justify-between">
                          <span>10,000:</span> <span>Most accurate, takes longer</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="throughput-params">
                    <AccordionTrigger>Throughput Parameters</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 text-sm">
                        <div>
                          <strong>Weekly Throughput:</strong> Average items completed per week
                          <p className="text-slate-500">Calculate from recent sprint data</p>
                        </div>
                        <div>
                          <strong>Coefficient of Variation:</strong> Measures variability (0.1 = low, 0.5 = high)
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded mt-1">
                            <p>Formula: CV = Standard Deviation ÷ Mean</p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="cycletime-params">
                    <AccordionTrigger>Cycle Time Parameters</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 text-sm">
                        <div>
                          <strong>P50 (Median):</strong> Time that 50% of items complete within
                        </div>
                        <div>
                          <strong>P80:</strong> Time that 80% of items complete within
                        </div>
                        <div>
                          <strong>P95:</strong> Time that 95% of items complete within
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
                          <p><strong>Get this data from:</strong> Jira, Azure DevOps, or other tracking tools</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Understanding Your Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                    <h4 className="font-semibold text-green-800 dark:text-green-200">P50 (Median)</h4>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">50% chance of completing by this date</p>
                    <Badge className="mt-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Internal Planning</Badge>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-center">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">P80</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">80% confidence level</p>
                    <Badge className="mt-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Balanced Commitment</Badge>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
                    <h4 className="font-semibold text-red-800 dark:text-red-200">P95</h4>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">95% confidence level</p>
                    <Badge className="mt-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Conservative Estimate</Badge>
                  </div>
                </div>

                <Accordion type="single" collapsible>
                  <AccordionItem value="histogram">
                    <AccordionTrigger>Reading the Histogram</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm">
                        <li>• Shows the distribution of possible completion dates</li>
                        <li>• Higher bars = more likely outcomes</li>
                        <li>• Width shows the range of uncertainty</li>
                        <li>• Peak shows the most probable completion date</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="scurve">
                    <AccordionTrigger>Reading the S-Curve</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm">
                        <li>• Shows cumulative probability over time</li>
                        <li>• Y-axis: Probability of completion (0-100%)</li>
                        <li>• X-axis: Date</li>
                        <li>• Steeper curves = less uncertainty</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Lightbulb className="w-5 h-5" />
                    Best Practices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>✓ Use recent, relevant historical data</li>
                    <li>✓ Include similar types of work items</li>
                    <li>✓ Account for team capacity changes</li>
                    <li>✓ Consider holidays and planned time off</li>
                    <li>✓ Update forecasts regularly</li>
                    <li>✓ Communicate uncertainty to stakeholders</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="w-5 h-5" />
                    Common Pitfalls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>✗ Using outdated historical data</li>
                    <li>✗ Mixing different types of work</li>
                    <li>✗ Ignoring external dependencies</li>
                    <li>✗ Over-committing to aggressive dates</li>
                    <li>✗ Not accounting for scope changes</li>
                    <li>✗ Treating forecasts as fixed commitments</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Decision Framework
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">When to Use Each Percentile:</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex gap-3 items-start">
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 min-w-fit">P20-P30</Badge>
                        <span>Stretch goals, optimistic scenarios</span>
                      </div>
                      <div className="flex gap-3 items-start">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 min-w-fit">P50</Badge>
                        <span>Internal planning, sprint goals</span>
                      </div>
                      <div className="flex gap-3 items-start">
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 min-w-fit">P80</Badge>
                        <span>Stakeholder commitments, roadmap planning</span>
                      </div>
                      <div className="flex gap-3 items-start">
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 min-w-fit">P95</Badge>
                        <span>Critical deadlines, customer commitments</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}