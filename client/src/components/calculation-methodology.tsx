import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, BarChart3, Calculator, TrendingUp, Database, Activity } from "lucide-react";

export function CalculationMethodology() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5" />
          <span>Calculation Methodology</span>
        </CardTitle>
        <CardDescription>
          Understanding how the Montecarlo engine performs throughput analysis using different data sources
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="historical" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="historical" className="flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span>Historical Data Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="statistical" className="flex items-center space-x-2">
              <Calculator className="w-4 h-4" />
              <span>Statistical Parameters</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="historical" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Badge variant="default" className="bg-blue-500">Bootstrap Sampling</Badge>
                <Badge variant="outline">Recommended</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    <span>Data Processing</span>
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <p className="font-medium mb-2">1. Historical Data Parsing</p>
                      <p className="text-muted-foreground">
                        Input weekly completion data is parsed from comma or space-separated values. 
                        Each value represents items completed in one week.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <p className="font-medium mb-2">2. Bootstrap Sampling</p>
                      <p className="text-muted-foreground">
                        For each simulation trial, we randomly sample (with replacement) from your historical 
                        weekly completion values. This preserves the authentic patterns and variability in your data.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <p className="font-medium mb-2">3. Realistic Variation</p>
                      <p className="text-muted-foreground">
                        Since we sample with replacement, the simulation captures both your team's typical 
                        performance and the natural week-to-week variation you actually experience.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    <span>Simulation Process</span>
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-gray-50 dark:bg-gray-950/20 rounded-lg">
                      <p className="font-medium mb-2">Weekly Simulation Loop</p>
                      <div className="space-y-1 text-muted-foreground">
                        <p>• Start with your backlog size</p>
                        <p>• Each week: randomly sample from historical values</p>
                        <p>• Subtract completed items from remaining backlog</p>
                        <p>• Continue until backlog reaches zero</p>
                        <p>• Record total weeks needed</p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <p className="font-medium mb-2">Why This Works</p>
                      <p className="text-muted-foreground">
                        Bootstrap sampling is a proven statistical technique that uses your actual performance 
                        data to predict future outcomes. It doesn't assume any particular distribution - 
                        it uses your real patterns.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20 rounded-r-lg">
                <h5 className="font-semibold mb-2">Example Calculation</h5>
                <p className="text-sm text-muted-foreground mb-2">
                  Historical data: [12, 15, 8, 14, 11, 16, 9, 13, 17, 10] items per week
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Trial 1:</strong> Week 1: sample = 14, Week 2: sample = 9, Week 3: sample = 16...
                  <br />
                  <strong>Trial 2:</strong> Week 1: sample = 11, Week 2: sample = 15, Week 3: sample = 8...
                  <br />
                  Each trial randomly samples different values, creating realistic forecast variation.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="statistical" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Badge variant="secondary" className="bg-orange-500 text-white">Lognormal Distribution</Badge>
                <Badge variant="outline">Mathematical Model</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center space-x-2">
                    <Calculator className="w-5 h-5 text-orange-500" />
                    <span>Parameter Configuration</span>
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <p className="font-medium mb-2">Average Weekly Throughput (μ)</p>
                      <p className="text-muted-foreground">
                        The mean number of items your team completes per week. This becomes the 
                        expected value of the lognormal distribution after parameter transformation.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <p className="font-medium mb-2">Throughput Variability (CV)</p>
                      <p className="text-muted-foreground">
                        Coefficient of Variation = σ/μ. This controls how much your weekly throughput 
                        varies. Higher values create more uncertainty in the forecast.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <p className="font-medium mb-2">Mathematical Transform</p>
                      <p className="text-muted-foreground">
                        We convert your mean and CV into lognormal parameters:
                        <br />• σ² = ln(1 + CV²)
                        <br />• μ_ln = ln(mean) - σ²/2
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    <span>Distribution Sampling</span>
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-gray-50 dark:bg-gray-950/20 rounded-lg">
                      <p className="font-medium mb-2">Random Generation Process</p>
                      <div className="space-y-1 text-muted-foreground">
                        <p>• Generate normal random values using Box-Muller transformation</p>
                        <p>• Apply lognormal parameters: exp(μ_ln + σ × normal_sample)</p>
                        <p>• Result: positive throughput values with specified mean and variability</p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                      <p className="font-medium mb-2">Why Lognormal Distribution?</p>
                      <p className="text-muted-foreground">
                        Throughput values are always positive and often right-skewed. Lognormal 
                        distribution naturally models this behavior, preventing negative throughput 
                        while allowing for occasional high-performance weeks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/20 rounded-r-lg">
                <h5 className="font-semibold mb-2">Example Calculation</h5>
                <p className="text-sm text-muted-foreground mb-2">
                  Input: Average = 12 items/week, Variability = 25% CV
                </p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>Step 1:</strong> σ² = ln(1 + 0.25²) = ln(1.0625) ≈ 0.0606</p>
                  <p><strong>Step 2:</strong> σ = √0.0606 ≈ 0.246</p>
                  <p><strong>Step 3:</strong> μ_ln = ln(12) - 0.0606/2 ≈ 2.455</p>
                  <p><strong>Result:</strong> Sample from LogNormal(2.455, 0.246) to get weekly throughput values</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-950/20 rounded-lg">
          <h4 className="font-semibold mb-3 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Common Simulation Process</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <p className="font-medium">1. Trial Setup</p>
              <p className="text-muted-foreground">
                Run 10,000 independent simulation trials to build a robust statistical forecast.
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-medium">2. Weekly Progression</p>
              <p className="text-muted-foreground">
                Each trial simulates week-by-week progress until the backlog is completed.
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-medium">3. Statistical Analysis</p>
              <p className="text-muted-foreground">
                Analyze completion times across all trials to generate percentile forecasts and confidence intervals.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}