export interface Profile {
  id: string;
  full_name: string;
  email: string;
  hostel?: string;
  room?: string;
  created_at: string;
}

export interface WaitingRecord {
  id: string;
  user_id: string;
  wait_seconds: number;
  lift_number: string;
  floor: string;
  crowd_level: 'Low' | 'Medium' | 'High';
  observation_date: string;
  observation_time: string;
  notes?: string;
  created_at: string;
}

export interface FeedbackRecord {
  id: string;
  user_id: string;
  rating: number;
  useful: 'Yes' | 'No' | 'Not sure';
  decision_help: 'Yes' | 'No' | 'Not sure';
  problem?: string;
  suggestion?: string;
  created_at: string;
}

export type CrowdLevel = 'Low' | 'Medium' | 'High';
