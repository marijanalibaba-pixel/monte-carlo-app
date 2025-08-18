// Monte Carlo simulation utilities based on the Flutter implementation

export interface LognormalParams {
  mu: number;
  sigma: number;
}

export interface SimulationInput {
  backlogSize: number;
  trials: number;
  startDate: Date;
  useCycleTime: boolean;
  // Throughput model
  meanThroughput?: number;
  variabilityCV?: number;
  historicalWeeklyData?: number[];  // New: for bootstrap sampling
  // Cycle time model
  p50CycleTime?: number;
  p80CycleTime?: number;
  p95CycleTime?: number;
}

export interface SimulationResult {
  completionDays: number[];
  p50Date: string;
  p80Date: string;
  p95Date: string;
  statistics: {
    trials: number;
    mean: number;
    stdDev: number;
    range: number;
  };
}

const MAX_WEEKS = 104; // 2 years safety cap
const RNG_SEED = 42; // Fixed seed for reproducibility

// Simple seedable random number generator (LCG)
class SeededRandom {
  private seed: number;
  
  constructor(seed: number) {
    this.seed = seed;
  }
  
  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) % (2 ** 32);
    return this.seed / (2 ** 32);
  }
}

// Box-Muller transformation for normal random generation using seeded RNG
function randNorm(rng: SeededRandom): number {
  const u1 = Math.max(rng.next(), 1e-12);
  const u2 = rng.next();
  return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

// Generate lognormal random number using seeded RNG
function randLogNormal(mu: number, sigma: number, rng: SeededRandom): number {
  return Math.exp(mu + sigma * randNorm(rng));
}

// Bootstrap sampling from historical data
function sampleFromHistorical(historicalData: number[], rng: SeededRandom): number {
  const index = Math.floor(rng.next() * historicalData.length);
  return historicalData[index];
}

// Calculate percentile using nearest-rank (ceil) method
function percentile(arr: number[], p: number): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil(p * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(idx, sorted.length - 1))];
}

// Calculate descriptive statistics for historical data
function calculateHistoricalStats(data: number[]): {
  mean: number;
  median: number;
  stdDev: number;
  cv: number;
  count: number;
} {
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const median = percentile(data, 0.5);
  
  const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
  const stdDev = Math.sqrt(variance);
  const cv = mean > 0 ? (stdDev / mean) * 100 : 0;
  
  return {
    mean: Math.round(mean * 10) / 10,
    median: Math.round(median * 10) / 10,
    stdDev: Math.round(stdDev * 10) / 10,
    cv: Math.round(cv * 10) / 10,
    count: data.length
  };
}

// Fit lognormal distribution to cycle time percentiles
function fitCycleTimeLognormal(
  p50: number,
  p80: number | null,
  p95: number
): LognormalParams {
  const z50 = 0.0;
  const z80 = 0.8416212335729143; // NORM.S.INV(0.80)
  const z95 = 1.6448536269514722; // NORM.S.INV(0.95)

  const zs: number[] = [z50];
  const ys: number[] = [Math.log(p50)];

  if (p80 !== null && p80 > 0) {
    zs.push(z80);
    ys.push(Math.log(p80));
  }
  
  zs.push(z95);
  ys.push(Math.log(p95));

  const meanZ = zs.reduce((a, b) => a + b, 0) / zs.length;
  const meanY = ys.reduce((a, b) => a + b, 0) / ys.length;

  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < zs.length; i++) {
    numerator += (zs[i] - meanZ) * (ys[i] - meanY);
    denominator += (zs[i] - meanZ) * (zs[i] - meanZ);
  }

  const sigma = denominator === 0 
    ? (Math.log(p95) - Math.log(p50)) / (z95 - z50)
    : numerator / denominator;
    
  const mu = meanY - sigma * meanZ;
  
  return { mu, sigma: Math.abs(sigma) };
}

// Format date to YYYY-MM-DD string
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Add days to date
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Calculate statistics
function calculateStatistics(completionDays: number[]): {
  mean: number;
  stdDev: number;
  range: number;
} {
  const mean = completionDays.reduce((a, b) => a + b, 0) / completionDays.length;
  
  const variance = completionDays.reduce((acc, val) => {
    return acc + Math.pow(val - mean, 2);
  }, 0) / completionDays.length;
  
  const stdDev = Math.sqrt(variance);
  const range = Math.max(...completionDays) - Math.min(...completionDays);
  
  return { mean: Math.round(mean * 10) / 10, stdDev: Math.round(stdDev * 10) / 10, range };
}

export function runMonteCarloSimulation(input: SimulationInput): SimulationResult {
  const { backlogSize, trials, startDate, useCycleTime } = input;
  const results: number[] = [];
  const rng = new SeededRandom(RNG_SEED);

  if (useCycleTime) {
    // Cycle time model (unchanged)
    const { p50CycleTime, p80CycleTime, p95CycleTime } = input;
    if (!p50CycleTime || !p95CycleTime) {
      throw new Error('P50 and P95 cycle times are required');
    }

    const params = fitCycleTimeLognormal(p50CycleTime, p80CycleTime || null, p95CycleTime);
    
    for (let t = 0; t < trials; t++) {
      let done = 0;
      let weeks = 0;
      
      while (done < backlogSize && weeks < MAX_WEEKS) {
        const ctDays = randLogNormal(params.mu, params.sigma, rng);
        const weekly = 7.0 / Math.max(ctDays, 0.0001);
        done += weekly;
        weeks++;
      }
      
      results.push(weeks * 7);
    }
  } else {
    // Throughput model with historical data support
    const { meanThroughput, variabilityCV, historicalWeeklyData } = input;
    
    if (historicalWeeklyData && historicalWeeklyData.length > 0) {
      // Historical weekly data - bootstrap sampling
      console.log('Using historical data:', historicalWeeklyData);
      
      for (let t = 0; t < trials; t++) {
        let done = 0;
        let weeks = 0;
        
        while (done < backlogSize && weeks < MAX_WEEKS) {
          const weekly = sampleFromHistorical(historicalWeeklyData, rng);
          done += weekly;
          weeks++;
        }
        
        results.push(weeks * 7);
      }
      
      console.log('Bootstrap results sample:', results.slice(0, 10));
    } else {
      // Average weekly model
      if (!meanThroughput) {
        throw new Error('Mean throughput is required');
      }

      if (!variabilityCV || variabilityCV <= 0) {
        // Deterministic case
        const weeks = Math.ceil(backlogSize / meanThroughput);
        console.log('Deterministic case: weeks =', weeks, 'days =', weeks * 7);
        for (let t = 0; t < trials; t++) {
          results.push(weeks * 7);
        }
      } else {
        // Stochastic case with lognormal distribution
        const cv = variabilityCV / 100.0;
        const sigma = Math.sqrt(Math.log(1 + cv * cv));
        const mu = Math.log(meanThroughput) - sigma * sigma / 2;
        
        for (let t = 0; t < trials; t++) {
          let done = 0;
          let weeks = 0;
          
          while (done < backlogSize && weeks < MAX_WEEKS) {
            const weekly = Math.max(randLogNormal(mu, sigma, rng), 1e-6); // Clamp to avoid zero
            done += weekly;
            weeks++;
          }
          
          results.push(weeks * 7);
        }
      }
    }
  }

  // Calculate percentiles
  const p50Days = Math.round(percentile(results, 0.50));
  const p80Days = Math.round(percentile(results, 0.80));
  const p95Days = Math.round(percentile(results, 0.95));

  return {
    completionDays: results,
    p50Date: formatDate(addDays(startDate, p50Days)),
    p80Date: formatDate(addDays(startDate, p80Days)),
    p95Date: formatDate(addDays(startDate, p95Days)),
    statistics: {
      trials,
      ...calculateStatistics(results)
    }
  };
}
