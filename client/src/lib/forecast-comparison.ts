/**
 * Forecast Comparison Engine
 * Advanced statistical comparison of multiple Monte Carlo forecasts
 */

import { ForecastResult } from './monte-carlo-engine';

export interface ForecastScenario {
  id: string;
  name: string;
  description?: string;
  result: ForecastResult;
  config: {
    type: 'throughput' | 'cycletime';
    backlogSize: number;
    startDate: Date;
    parameters: any;
  };
  createdAt: Date;
}

export interface ComparisonMetrics {
  scenarios: ForecastScenario[];
  statistics: {
    meanDifference: number[];
    medianDifference: number[];
    standardDeviationDifference: number[];
    riskDifference: number[];
  };
  confidenceIntervals: {
    level: number;
    scenarios: {
      scenarioId: string;
      days: number;
      date: Date;
      difference?: number;
    }[];
  }[];
  riskAnalysis: {
    mostOptimistic: ForecastScenario;
    mostPessimistic: ForecastScenario;
    mostReliable: ForecastScenario;
    riskSpread: number;
  };
  recommendations: {
    bestCase: string;
    worstCase: string;
    recommended: string;
    reasoning: string[];
  };
}

export class ForecastComparison {
  /**
   * Compare multiple forecast scenarios
   */
  static compareForecasts(scenarios: ForecastScenario[]): ComparisonMetrics {
    if (scenarios.length < 2) {
      throw new Error('At least two scenarios required for comparison');
    }

    const statistics = this.calculateStatisticsDifferences(scenarios);
    const confidenceIntervals = this.compareConfidenceIntervals(scenarios);
    const riskAnalysis = this.analyzeRisk(scenarios);
    const recommendations = this.generateRecommendations(scenarios, riskAnalysis);

    return {
      scenarios,
      statistics,
      confidenceIntervals,
      riskAnalysis,
      recommendations
    };
  }

  /**
   * Calculate statistical differences between scenarios
   */
  private static calculateStatisticsDifferences(scenarios: ForecastScenario[]) {
    const baseline = scenarios[0].result.statistics;
    
    const meanDifference = scenarios.map(s => 
      s.result.statistics.mean - baseline.mean
    );
    
    const medianDifference = scenarios.map(s => 
      s.result.statistics.median - baseline.median
    );
    
    const standardDeviationDifference = scenarios.map(s => 
      s.result.statistics.standardDeviation - baseline.standardDeviation
    );
    
    const riskDifference = scenarios.map(s => {
      const cv1 = baseline.standardDeviation / baseline.mean;
      const cv2 = s.result.statistics.standardDeviation / s.result.statistics.mean;
      return cv2 - cv1;
    });

    return {
      meanDifference,
      medianDifference,
      standardDeviationDifference,
      riskDifference
    };
  }

  /**
   * Compare confidence intervals across scenarios
   */
  private static compareConfidenceIntervals(scenarios: ForecastScenario[]) {
    const confidenceLevels = [0.5, 0.8, 0.95];
    
    return confidenceLevels.map(level => {
      const scenarioData = scenarios.map(scenario => {
        const ci = scenario.result.confidenceIntervals.find(c => c.level === level);
        return {
          scenarioId: scenario.id,
          days: ci?.daysFromStart || 0,
          date: ci?.completionDate || new Date(),
        };
      });

      // Calculate differences from baseline
      const baseline = scenarioData[0].days;
      scenarioData.forEach((data, index) => {
        if (index > 0) {
          (data as any).difference = data.days - baseline;
        }
      });

      return {
        level,
        scenarios: scenarioData
      };
    });
  }

  /**
   * Analyze risk characteristics across scenarios
   */
  private static analyzeRisk(scenarios: ForecastScenario[]) {
    const cvs = scenarios.map(s => {
      const stats = s.result.statistics;
      return {
        scenario: s,
        cv: stats.standardDeviation / stats.mean,
        range: stats.max - stats.min,
        skewness: stats.skewness
      };
    });

    const mostOptimistic = scenarios.reduce((min, current) => 
      current.result.statistics.median < min.result.statistics.median ? current : min
    );

    const mostPessimistic = scenarios.reduce((max, current) => 
      current.result.statistics.median > max.result.statistics.median ? current : max
    );

    const mostReliable = cvs.reduce((min, current) => 
      current.cv < min.cv ? current : min
    ).scenario;

    const riskSpread = Math.max(...cvs.map(c => c.cv)) - Math.min(...cvs.map(c => c.cv));

    return {
      mostOptimistic,
      mostPessimistic,
      mostReliable,
      riskSpread
    };
  }

  /**
   * Generate recommendations based on comparison
   */
  private static generateRecommendations(scenarios: ForecastScenario[], riskAnalysis: any) {
    const reasoning: string[] = [];
    
    // Best case analysis
    const bestCaseScenario = riskAnalysis.mostOptimistic;
    reasoning.push(`${bestCaseScenario.name} offers the most optimistic timeline with ${Math.round(bestCaseScenario.result.statistics.median)} days median completion.`);

    // Worst case analysis
    const worstCaseScenario = riskAnalysis.mostPessimistic;
    reasoning.push(`${worstCaseScenario.name} represents the most conservative estimate with ${Math.round(worstCaseScenario.result.statistics.median)} days median completion.`);

    // Reliability analysis
    const reliableScenario = riskAnalysis.mostReliable;
    const reliableCv = reliableScenario.result.statistics.standardDeviation / reliableScenario.result.statistics.mean;
    reasoning.push(`${reliableScenario.name} shows the most consistent predictions with ${(reliableCv * 100).toFixed(1)}% coefficient of variation.`);

    // Risk spread analysis
    if (riskAnalysis.riskSpread > 0.3) {
      reasoning.push('High variability between scenarios suggests significant uncertainty in project parameters.');
    } else if (riskAnalysis.riskSpread < 0.1) {
      reasoning.push('Low variability between scenarios indicates consistent forecasting across different assumptions.');
    }

    // Balanced recommendation
    let recommendedScenario: string;
    const medianDurations = scenarios.map(s => s.result.statistics.median);
    const avgMedian = medianDurations.reduce((a, b) => a + b, 0) / medianDurations.length;
    
    const balancedScenario = scenarios.find(s => 
      Math.abs(s.result.statistics.median - avgMedian) === 
      Math.min(...scenarios.map(sc => Math.abs(sc.result.statistics.median - avgMedian)))
    );

    recommendedScenario = balancedScenario?.name || reliableScenario.name;
    reasoning.push(`${recommendedScenario} provides a balanced approach considering both timeline and risk factors.`);

    return {
      bestCase: bestCaseScenario.name,
      worstCase: worstCaseScenario.name,
      recommended: recommendedScenario,
      reasoning
    };
  }

  /**
   * Calculate scenario sensitivity analysis
   */
  static calculateSensitivity(baseScenario: ForecastScenario, scenarios: ForecastScenario[]) {
    const baseline = baseScenario.result.statistics.median;
    
    return scenarios.map(scenario => {
      const difference = scenario.result.statistics.median - baseline;
      const percentChange = (difference / baseline) * 100;
      
      return {
        scenarioId: scenario.id,
        scenarioName: scenario.name,
        absoluteChange: difference,
        percentChange,
        riskChange: this.calculateRiskChange(baseScenario, scenario)
      };
    });
  }

  /**
   * Calculate risk change between two scenarios
   */
  private static calculateRiskChange(base: ForecastScenario, comparison: ForecastScenario) {
    const baseCv = base.result.statistics.standardDeviation / base.result.statistics.mean;
    const comparisonCv = comparison.result.statistics.standardDeviation / comparison.result.statistics.mean;
    
    return {
      coefficientOfVariationChange: comparisonCv - baseCv,
      rangeChange: (comparison.result.statistics.max - comparison.result.statistics.min) - 
                   (base.result.statistics.max - base.result.statistics.min),
      skewnessChange: comparison.result.statistics.skewness - base.result.statistics.skewness
    };
  }

  /**
   * Generate Monte Carlo convergence analysis
   */
  static analyzeConvergence(scenarios: ForecastScenario[]) {
    return scenarios.map(scenario => {
      const trials = scenario.result.completionDates.length;
      const means: number[] = [];
      const stepSize = Math.floor(trials / 20); // 20 data points
      
      for (let i = stepSize; i <= trials; i += stepSize) {
        const subset = scenario.result.completionDates.slice(0, i);
        const daysArray = subset.map(date => {
          const startTime = scenario.config.startDate.getTime();
          const completionTime = date.getTime();
          return (completionTime - startTime) / (1000 * 60 * 60 * 24);
        });
        const mean = daysArray.reduce((a, b) => a + b, 0) / daysArray.length;
        means.push(mean);
      }
      
      // Calculate convergence rate (decrease in variance over iterations)
      const convergenceRate = this.calculateConvergenceRate(means);
      
      return {
        scenarioId: scenario.id,
        scenarioName: scenario.name,
        convergenceData: means.map((mean, index) => ({
          trials: (index + 1) * stepSize,
          mean
        })),
        convergenceRate,
        isConverged: convergenceRate < 0.01 // Considered converged if rate < 1%
      };
    });
  }

  /**
   * Calculate convergence rate from means array
   */
  private static calculateConvergenceRate(means: number[]): number {
    if (means.length < 3) return 1;
    
    const lastThree = means.slice(-3);
    const variance = lastThree.reduce((sum, val, _, arr) => {
      const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
      return sum + Math.pow(val - mean, 2);
    }, 0) / lastThree.length;
    
    const coefficientOfVariation = Math.sqrt(variance) / (means[means.length - 1]);
    return coefficientOfVariation;
  }
}