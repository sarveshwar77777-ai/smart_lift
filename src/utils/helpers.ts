import { TimePeriod, DayOfWeek, CrowdLevel, WaitingRecord, EvaluationMetric, PredictionResult } from '../types';

/**
 * Automatically determine the time period from a date or hour.
 */
export function getTimePeriod(date: Date = new Date()): TimePeriod {
  const hour = date.getHours();
  if (hour >= 6 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 17) return 'Afternoon';
  if (hour >= 17 && hour < 22) return 'Evening';
  return 'Night';
}

/**
 * Get current day of week string
 */
export function getDayOfWeek(date: Date = new Date()): DayOfWeek {
  const days: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

/**
 * Infer crowd level from people waiting count
 */
export function crowdLevelFromPeople(count: number): CrowdLevel {
  if (count <= 2) return 'Low';
  if (count <= 6) return 'Medium';
  return 'High';
}

/**
 * Format duration in seconds to a friendly "Xm Ys" or "Xs" string
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

/**
 * Format timer milliseconds to MM:SS display
 */
export function formatTimerMs(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Explainable, transparent statistical prediction model.
 * Uses a distance-weighted historical k-nearest average based on:
 * - Crowd level / People count (weight: 3.0)
 * - Time period (weight: 2.0)
 * - Floor (weight: 1.5)
 * - Day of week (weight: 1.0)
 */
export function predictWaitingTime(
  records: WaitingRecord[],
  target: {
    crowdLevel: CrowdLevel;
    peopleWaiting?: number;
    timePeriod: TimePeriod;
    floor: string;
    dayOfWeek?: string;
  },
  excludeId?: string
): PredictionResult | null {
  const pool = excludeId ? records.filter(r => r.id !== excludeId) : records;
  if (pool.length === 0) return null;

  let totalWeight = 0;
  let weightedSum = 0;
  let exactCrowdMatches = 0;

  for (const record of pool) {
    let similarity = 0.2; // Base baseline weight

    // Crowd level matching (highest impact)
    if (record.crowd_level === target.crowdLevel) {
      similarity += 3.0;
      exactCrowdMatches++;
    } else if (
      (target.crowdLevel === 'Medium' && (record.crowd_level === 'Low' || record.crowd_level === 'High')) ||
      (record.crowd_level === 'Medium')
    ) {
      similarity += 1.0;
    }

    // Time period matching
    const recordPeriod = record.time_period || getTimePeriod(new Date(record.created_at || record.observation_date));
    if (recordPeriod === target.timePeriod) {
      similarity += 2.0;
    }

    // Floor matching
    if (target.floor !== 'Any' && record.floor === target.floor) {
      similarity += 1.5;
    }

    // Day of week matching
    if (target.dayOfWeek && target.dayOfWeek !== 'Any' && record.day_of_week === target.dayOfWeek) {
      similarity += 1.0;
    }

    weightedSum += record.wait_seconds * similarity;
    totalWeight += similarity;
  }

  const predicted = Math.round(weightedSum / totalWeight);

  // Determine confidence
  const confidence: 'Low' | 'Medium' | 'High' =
    pool.length >= 20 && exactCrowdMatches >= 5
      ? 'High'
      : pool.length >= 8 && exactCrowdMatches >= 2
      ? 'Medium'
      : 'Low';

  return {
    predictedSeconds: predicted,
    matchCount: pool.length,
    modelType: 'Multi-Factor Weighted Statistical Regression',
    confidence,
    factors: {
      crowdImpact: `${target.crowdLevel} crowd (${exactCrowdMatches} matching records)`,
      periodImpact: `${target.timePeriod} usage profile`,
      floorImpact: target.floor === 'Any' ? 'Hostel-wide average' : `Floor ${target.floor}`,
    },
  };
}

/**
 * Calculate MAE (Mean Absolute Error) and RMSE (Root Mean Squared Error)
 * using Leave-One-Out Cross-Validation (LOOCV) on real dataset.
 */
export function evaluateModelPerformance(records: WaitingRecord[]): {
  mae: number;
  rmse: number;
  evaluations: EvaluationMetric[];
} | null {
  if (records.length < 3) return null;

  const evaluations: EvaluationMetric[] = [];
  let totalAbsoluteError = 0;
  let totalSquaredError = 0;

  for (const record of records) {
    const period = record.time_period || getTimePeriod(new Date(record.created_at || record.observation_date));
    const prediction = predictWaitingTime(
      records,
      {
        crowdLevel: record.crowd_level,
        peopleWaiting: record.people_waiting,
        timePeriod: period,
        floor: record.floor,
        dayOfWeek: record.day_of_week,
      },
      record.id
    );

    if (prediction) {
      const pred = prediction.predictedSeconds;
      const act = record.wait_seconds;
      const err = Math.abs(act - pred);

      totalAbsoluteError += err;
      totalSquaredError += (act - pred) * (act - pred);

      evaluations.push({
        id: record.id,
        actualSeconds: act,
        predictedSeconds: pred,
        errorSeconds: err,
        crowd: record.crowd_level,
        period,
        floor: record.floor,
      });
    }
  }

  if (evaluations.length === 0) return null;

  const mae = Math.round((totalAbsoluteError / evaluations.length) * 10) / 10;
  const rmse = Math.round(Math.sqrt(totalSquaredError / evaluations.length) * 10) / 10;

  return {
    mae,
    rmse,
    evaluations,
  };
}
