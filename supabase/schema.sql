-- =============================================
-- SmartLift AI — Supabase Schema & Migrations
-- Run this entire file in the Supabase SQL Editor
-- =============================================

-- 1. Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name   TEXT NOT NULL DEFAULT '',
  email       TEXT NOT NULL DEFAULT '',
  hostel      TEXT,
  room        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Waiting records (core observational data)
CREATE TABLE IF NOT EXISTS waiting_records (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  wait_seconds     INTEGER NOT NULL CHECK (wait_seconds >= 0),
  people_waiting   INTEGER NOT NULL DEFAULT 0,
  time_period      TEXT NOT NULL DEFAULT 'Morning',
  day_of_week      TEXT NOT NULL DEFAULT 'Monday',
  lift_number      TEXT NOT NULL DEFAULT 'Lift 1',
  floor            TEXT NOT NULL DEFAULT 'Ground',
  crowd_level      TEXT NOT NULL CHECK (crowd_level IN ('Low','Medium','High')),
  observation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  observation_time TIME NOT NULL DEFAULT CURRENT_TIME,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Migration helpers for existing waiting_records table
ALTER TABLE waiting_records ADD COLUMN IF NOT EXISTS people_waiting INTEGER DEFAULT 0;
ALTER TABLE waiting_records ADD COLUMN IF NOT EXISTS time_period TEXT DEFAULT 'Morning';
ALTER TABLE waiting_records ADD COLUMN IF NOT EXISTS day_of_week TEXT DEFAULT 'Monday';

-- 3. Feedback & Student Validation
CREATE TABLE IF NOT EXISTS feedback (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating                    INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  easy_to_use               TEXT,
  timer_useful              TEXT,
  prediction_understandable TEXT,
  would_use_hostel          TEXT,
  most_useful_feature       TEXT,
  confusing_aspects         TEXT,
  improvement_suggestions   TEXT,
  useful                    TEXT CHECK (useful IN ('Yes','No','Not sure')),
  decision_help             TEXT CHECK (decision_help IN ('Yes','No','Not sure')),
  problem                   TEXT,
  suggestion                TEXT,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Migration helpers for existing feedback table
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS easy_to_use TEXT;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS timer_useful TEXT;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS prediction_understandable TEXT;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS would_use_hostel TEXT;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS most_useful_feature TEXT;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS confusing_aspects TEXT;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS improvement_suggestions TEXT;

-- =============================================
-- Row Level Security
-- =============================================
ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE waiting_records  ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback         ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Waiting records: users own their records; all authenticated users can read for collective analytics/prediction
DROP POLICY IF EXISTS "wr_select_all" ON waiting_records;
CREATE POLICY "wr_select_all"  ON waiting_records FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "wr_insert_own" ON waiting_records;
CREATE POLICY "wr_insert_own"  ON waiting_records FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "wr_delete_own" ON waiting_records;
CREATE POLICY "wr_delete_own"  ON waiting_records FOR DELETE USING (auth.uid() = user_id);

-- Feedback: users insert own; all authenticated can read for validation dashboard
DROP POLICY IF EXISTS "fb_select_all" ON feedback;
CREATE POLICY "fb_select_all"  ON feedback FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "fb_select_own" ON feedback;

DROP POLICY IF EXISTS "fb_insert_own" ON feedback;
CREATE POLICY "fb_insert_own"  ON feedback FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- Indexes
-- =============================================
CREATE INDEX IF NOT EXISTS idx_wr_user      ON waiting_records (user_id);
CREATE INDEX IF NOT EXISTS idx_wr_date      ON waiting_records (observation_date);
CREATE INDEX IF NOT EXISTS idx_wr_crowd     ON waiting_records (crowd_level);
CREATE INDEX IF NOT EXISTS idx_wr_period    ON waiting_records (time_period);
CREATE INDEX IF NOT EXISTS idx_wr_lift      ON waiting_records (lift_number);
CREATE INDEX IF NOT EXISTS idx_fb_user      ON feedback (user_id);

-- =============================================
-- Auto-confirm all new users (No email verification needed)
-- =============================================
CREATE OR REPLACE FUNCTION public.auto_confirm_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  NEW.email_confirmed_at = COALESCE(NEW.email_confirmed_at, NOW());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_confirm ON auth.users;
CREATE TRIGGER on_auth_user_created_confirm
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_new_user();

-- Auto-create profile after sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = CASE WHEN EXCLUDED.full_name <> '' THEN EXCLUDED.full_name ELSE public.profiles.full_name END;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Confirm all existing users in the database
UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;
