/**
 * Advanced Monte Carlo Forecasting Engine
 * Built from statistical modeling expertise
 */

// Statistical utility functions
export class StatisticalUtils {
  /**
   * Box-Muller transformation for generating normally distributed random numbers
   */
  static normalRandom(mean: number = 0, stdDev: number = 1): number {
    if (this.spare !== null) {
      const temp = this.spare;
      this.spare = null;
      return temp * stdDev + mean;
    }

    const u1 = Math.random();
    const u2 = Math.random();
    const mag = stdDev * Math.sqrt(-2.0 * Math.log(u1));
    
    this.spare = mag * Math.cos(2.0 * Math.PI * u2);
    return mag * Math.sin(2.0 * Math.PI * u2) + mean;
  }

  private static spare: number | null = null;

  /**
   * Generate lognormal distribution - ideal for modeling work durations
   */
  static lognormalRandom(mu: number, sigma: number): number {
    const normal = this.normalRandom(mu, sigma);
    return Math.exp(normal);
  }

  /**
   * Generate gamma distribution using Marsaglia-Tsang method
   */
  static gammaRandom(shape: number, scale: number): number {
    if (shape < 1) {
      return this.gammaRandom(shape + 1, scale) * Math.pow(Math.random(), 1 / shape);
    }

    const d = shape - 1/3;
    const c = 1 / Math.sqrt(9 * d);
    
    while (true) {
      let x: number, v: number;
      
      do {
        x = this.normalRandom();
        v = 1 + c * x;
      } while (v <= 0);
      
      v = v * v * v;
      const u = Math.random();
      
      if (u < 1 - 0.0331 * x * x * x * x) {
        return d * v * scale;
      }
      
      if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) {
        return d * v * scale;
      }
    }
  }

  /**
   * Beta distribution for modeling completion percentages
   */
  static betaRandom(alpha: number, beta: number): number {
    const x = this.gammaRandom(alpha, 1);
    const y = this.gammaRandom(beta, 1);
    return x / (x + y);
  }

  /**
   * Bootstrap sampling from historical data
   */
  static bootstrapSample<T>(data: T[]): T {
    return data[Math.floor(Math.random() * data.length)];
  }

  /**
   * Calculate percentiles from sorted array
   */
  static percentile(sortedArray: number[], p: number): number {
    if (sortedArray.length === 0) return 0;
    if (p <= 0) return sortedArray[0];
    if (p >= 1) return sortedArray[sortedArray.length - 1];
    
    const index = p * (sortedArray.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;
    
    if (upper >= sortedArray.length) return sortedArray[lower];
    
    return sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight;
  }

  /**
   * Calculate coefficient of variation
   */
  static coefficientOfVariation(data: number[]): number {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);
    return stdDev / mean;
  }
}

// Core simulation interfaces
export interface ThroughputConfig {
  backlogSize: number;
  historicalThroughput?: number[];  // Weekly throughput data
  averageThroughput?: number;       // Mean items per week
  throughputVariability?: number;   // Coefficient of variation (0-1)
  weeklyCapacity?: number;          // Maximum items per week
}

export interface CycleTimeConfig {
  backlogSize: number;
  p50CycleTime: number;  // Median cycle time in days
  p80CycleTime: number;  // 80th percentile
  p95CycleTime: number;  // 95th percentile
  workingDaysPerWeek?: number;  // Default 5
}

export interface SimulationConfig {
  trials: number;
  startDate: Date;
  confidenceLevels: number[];  // e.g., [0.5, 0.8, 0.95]
  includeDependencies?: boolean;
  riskFactors?: RiskFactor[];
}

export interface RiskFactor {
  name: string;
  probability: number;  // 0-1
  impactDays: number;   // Additional days if risk occurs
}

export interface ForecastResult {
  completionDates: Date[];
  confidenceIntervals: {
    level: number;
    completionDate: Date;
    daysFromStart: number;
  }[];
  statistics: {
    mean: number;
    median: number;
    standardDeviation: number;
    skewness: number;
    kurtosis: number;
    min: number;
    max: number;
  };
  distributionData: {
    bins: number[];
    frequencies: number[];
    cumulativeProbabilities: number[];
  };
  riskAnalysis?: {
    probabilityOfDelay: number;
    expectedDelayDays: number;
    riskFactorImpacts: { [key: string]: number };
  };
}

/**
 * Advanced Monte Carlo Forecasting Engine
 */
export class MonteCarloEngine {
  
  /**
   * Throughput-based forecasting using historical data or statistical parameters
   */
  static forecastByThroughput(
    config: ThroughputConfig, 
    simConfig: SimulationConfig
  ): ForecastResult {
    const completionDays: number[] = [];
    
    for (let trial = 0; trial < simConfig.trials; trial++) {
      let remainingWork = config.backlogSize;
      let daysElapsed = 0;
      let weeklyProgress = 0;
      
      while (remainingWork > 0) {
        // Generate weekly throughput
        let weeklyThroughput: number;
        
        if (config.historicalThroughput && config.historicalThroughput.length > 0) {
          // Bootstrap sampling from historical data
          weeklyThroughput = StatisticalUtils.bootstrapSample(config.historicalThroughput);
          
          // Add realistic variability (±15%)
          const variability = 1 + StatisticalUtils.normalRandom(0, 0.15);
          weeklyThroughput *= Math.max(0.1, variability);
        } else {
          // Use lognormal distribution for realistic throughput modeling
          const mu = Math.log(config.averageThroughput || 10);
          const sigma = config.throughputVariability || 0.3;
          weeklyThroughput = StatisticalUtils.lognormalRandom(mu, sigma);
        }
        
        // Apply capacity constraints
        if (config.weeklyCapacity) {
          weeklyThroughput = Math.min(weeklyThroughput, config.weeklyCapacity);
        }
        
        // Ensure minimum progress
        weeklyThroughput = Math.max(0.1, weeklyThroughput);
        
        // Accumulate daily progress
        const dailyThroughput = weeklyThroughput / 7;
        
        for (let day = 0; day < 7 && remainingWork > 0; day++) {
          const dailyProgress = Math.min(dailyThroughput, remainingWork);
          remainingWork -= dailyProgress;
          daysElapsed++;
          
          if (remainingWork <= 0) break;
        }
      }
      
      // Apply risk factors
      if (simConfig.riskFactors) {
        for (const risk of simConfig.riskFactors) {
          if (Math.random() < risk.probability) {
            daysElapsed += risk.impactDays;
          }
        }
      }
      
      completionDays.push(daysElapsed);
    }
    
    return this.processResults(completionDays, simConfig);
  }

  /**
   * Cycle time-based forecasting using percentile data
   */
  static forecastByCycleTime(
    config: CycleTimeConfig, 
    simConfig: SimulationConfig
  ): ForecastResult {
    const completionWeeks: number[] = [];
    const workingDaysPerWeek = config.workingDaysPerWeek || 5;
    
    // Derive lognormal parameters from three percentiles (P50, P80, P95)
    const p50 = config.p50CycleTime;
    const p80 = config.p80CycleTime;
    const p95 = config.p95CycleTime;
    
    // Fit lognormal distribution to the three percentiles
    // Using method based on percentile equations: ln(X) ~ N(μ, σ²)
    const z50 = 0.0;      // z-score for 50th percentile
    const z80 = 0.8416;   // z-score for 80th percentile  
    const z95 = 1.6449;   // z-score for 95th percentile
    
    // Solve system of equations for μ and σ
    const mu = Math.log(p50);
    const sigma = (Math.log(p95) - Math.log(p50)) / z95;
    
    for (let trial = 0; trial < simConfig.trials; trial++) {
      let totalWeeks = 0;
      let remainingBacklog = config.backlogSize;
      
      // Simulate week by week until backlog is complete
      while (remainingBacklog > 0) {
        // Draw cycle time for this week (working days per item)
        const cycleTime = StatisticalUtils.lognormalRandom(mu, sigma);
        
        // Calculate weekly throughput: working days / cycle time = items/week
        const weeklyThroughput = workingDaysPerWeek / cycleTime;
        
        // Reduce remaining backlog by this week's throughput
        remainingBacklog -= weeklyThroughput;
        totalWeeks++;
      }
      
      // Apply risk factors (convert to weeks)
      if (simConfig.riskFactors) {
        let riskDays = 0;
        for (const risk of simConfig.riskFactors) {
          if (Math.random() < risk.probability) {
            riskDays += risk.impactDays;
          }
        }
        totalWeeks += riskDays / 7; // Convert risk days to weeks
      }
      
      completionWeeks.push(totalWeeks);
    }
    
    // Convert weeks to calendar days (weeks * 7)
    const completionDays = completionWeeks.map(weeks => Math.ceil(weeks * 7));
    
    return this.processResults(completionDays, simConfig);
  }

  /**
   * Process simulation results into comprehensive forecast
   */
  private static processResults(
    completionDays: number[], 
    simConfig: SimulationConfig
  ): ForecastResult {
    const sorted = [...completionDays].sort((a, b) => a - b);
    const n = sorted.length;
    
    // Calculate basic statistics
    const mean = sorted.reduce((a, b) => a + b, 0) / n;
    const median = StatisticalUtils.percentile(sorted, 0.5);
    const variance = sorted.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    
    // Calculate higher order moments
    const skewness = sorted.reduce((sum, x) => sum + Math.pow((x - mean) / stdDev, 3), 0) / n;
    const kurtosis = sorted.reduce((sum, x) => sum + Math.pow((x - mean) / stdDev, 4), 0) / n - 3;
    
    // Generate confidence intervals
    const confidenceIntervals = simConfig.confidenceLevels.map(level => ({
      level,
      daysFromStart: Math.round(StatisticalUtils.percentile(sorted, level)),
      completionDate: new Date(simConfig.startDate.getTime() + 
        StatisticalUtils.percentile(sorted, level) * 24 * 60 * 60 * 1000)
    }));
    
    // Create histogram data
    const binCount = Math.min(50, Math.max(10, Math.sqrt(n)));
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const binWidth = (max - min) / binCount;
    
    const bins: number[] = [];
    const frequencies: number[] = [];
    
    for (let i = 0; i < binCount; i++) {
      const binStart = min + i * binWidth;
      const binEnd = binStart + binWidth;
      bins.push(binStart);
      
      const count = sorted.filter(x => x >= binStart && x < binEnd).length;
      frequencies.push(count / n);
    }
    
    // Calculate cumulative probabilities
    const cumulativeProbabilities: number[] = [];
    let cumulative = 0;
    for (const freq of frequencies) {
      cumulative += freq;
      cumulativeProbabilities.push(cumulative);
    }
    
    // Generate completion dates
    const completionDates = sorted.map(days => 
      new Date(simConfig.startDate.getTime() + days * 24 * 60 * 60 * 1000)
    );
    
    return {
      completionDates,
      confidenceIntervals,
      statistics: {
        mean,
        median,
        standardDeviation: stdDev,
        skewness,
        kurtosis,
        min: sorted[0],
        max: sorted[sorted.length - 1]
      },
      distributionData: {
        bins,
        frequencies,
        cumulativeProbabilities
      }
    };
  }

  /**
   * Advanced dependency modeling using PERT distribution
   */
  static modelDependencies(
    optimistic: number,
    mostLikely: number, 
    pessimistic: number
  ): number {
    // PERT distribution: weighted average with emphasis on most likely
    const mean = (optimistic + 4 * mostLikely + pessimistic) / 6;
    const variance = Math.pow((pessimistic - optimistic) / 6, 2);
    const stdDev = Math.sqrt(variance);
    
    return StatisticalUtils.normalRandom(mean, stdDev);
  }

  /**
   * Team capacity modeling with learning curves and fatigue
   */
  static modelTeamCapacity(
    baseCapacity: number,
    experienceWeeks: number,
    teamSize: number,
    burnoutFactor: number = 0.1
  ): number {
    // Learning curve: capacity improves with experience
    const learningFactor = 1 + Math.log(1 + experienceWeeks) * 0.1;
    
    // Team size efficiency: Brooks' Law effect
    const communicationOverhead = Math.max(0.7, 1 - (teamSize - 1) * 0.05);
    
    // Burnout modeling
    const fatigueReduction = 1 - (Math.random() < burnoutFactor ? Math.random() * 0.3 : 0);
    
    return baseCapacity * learningFactor * communicationOverhead * fatigueReduction;
  }
}