export interface Profile {
  id: string;
  full_name: string;
  email: string;
  hostel?: string;
  room?: string;
  created_at: string;
}

export type TimePeriod = 'Morning' | 'Afternoon' | 'Evening' | 'Night';
export type CrowdLevel = 'Low' | 'Medium' | 'High';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface WaitingRecord {
  id: string;
  user_id: string;
  wait_seconds: number;
  people_waiting?: number;
  time_period?: TimePeriod;
  day_of_week?: DayOfWeek | string;
  lift_number: string;
  floor: string;
  crowd_level: CrowdLevel;
  observation_date: string;
  observation_time: string;
  notes?: string | null;
  created_at: string;
}

export interface FeedbackRecord {
  id: string;
  user_id: string;
  rating: number; // 1 to 5 stars
  easy_to_use?: string | null; // 'Yes' | 'No' | 'Somewhat'
  timer_useful?: string | null; // 'Yes' | 'No' | 'Somewhat'
  prediction_understandable?: string | null; // 'Yes' | 'No' | 'Somewhat'
  would_use_hostel?: string | null; // 'Yes' | 'No' | 'Maybe'
  most_useful_feature?: string | null;
  confusing_aspects?: string | null;
  improvement_suggestions?: string | null;
  // Legacy fields
  useful?: 'Yes' | 'No' | 'Not sure' | null;
  decision_help?: 'Yes' | 'No' | 'Not sure' | null;
  problem?: string | null;
  suggestion?: string | null;
  created_at: string;
}

export interface PredictionResult {
  predictedSeconds: number;
  matchCount: number;
  modelType: string;
  confidence: 'Low' | 'Medium' | 'High';
  factors: {
    crowdImpact: string;
    periodImpact: string;
    floorImpact: string;
  };
}

export interface EvaluationMetric {
  id: string;
  actualSeconds: number;
  predictedSeconds: number;
  errorSeconds: number;
  crowd: CrowdLevel;
  period: string;
  floor: string;
}

