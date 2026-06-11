-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  nickname TEXT,
  bio TEXT,
  avatar_url TEXT,
  shub_score INTEGER DEFAULT 0,
  goals TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT SELECT ON public.profiles TO anon;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Public can view profiles" ON public.profiles
  FOR SELECT USING (true);

-- Pillars data (daily scores)
CREATE TABLE public.pillars_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  treino INTEGER DEFAULT 0,
  sono INTEGER DEFAULT 0,
  nutricao INTEGER DEFAULT 0,
  agua INTEGER DEFAULT 0,
  humor INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, date)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pillars_data TO authenticated;
GRANT ALL ON public.pillars_data TO service_role;

ALTER TABLE public.pillars_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own pillars data" ON public.pillars_data
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Workouts
CREATE TABLE public.workouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- e.g., 'Push', 'Pull', 'Legs', 'Cardio'
  intensity TEXT, -- 'Low', 'Medium', 'High'
  duration_minutes INTEGER,
  estimated_calories INTEGER,
  exercises JSONB, -- List of exercises with sets/reps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

GRANT SELECT ON public.workouts TO authenticated;
GRANT ALL ON public.workouts TO service_role;
GRANT SELECT ON public.workouts TO anon;

ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view workouts" ON public.workouts
  FOR SELECT USING (true);

-- Workout logs
CREATE TABLE public.workout_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  workout_id UUID REFERENCES public.workouts,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  duration_actual INTEGER,
  calories_burned INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.workout_logs TO authenticated;
GRANT ALL ON public.workout_logs TO service_role;

ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own workout logs" ON public.workout_logs
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Water logs
CREATE TABLE public.water_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  amount_ml INTEGER NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.water_logs TO authenticated;
GRANT ALL ON public.water_logs TO service_role;

ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own water logs" ON public.water_logs
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Sleep logs
CREATE TABLE public.sleep_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_minutes INTEGER,
  deep_sleep_minutes INTEGER,
  rem_sleep_minutes INTEGER,
  light_sleep_minutes INTEGER,
  awake_minutes INTEGER,
  stages_data JSONB, -- Detailed timeline of sleep stages
  score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.sleep_logs TO authenticated;
GRANT ALL ON public.sleep_logs TO service_role;

ALTER TABLE public.sleep_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own sleep logs" ON public.sleep_logs
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Challenges
CREATE TABLE public.challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  xp_reward INTEGER DEFAULT 0,
  type TEXT, -- 'daily', 'weekly'
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

GRANT SELECT ON public.challenges TO authenticated;
GRANT ALL ON public.challenges TO service_role;
GRANT SELECT ON public.challenges TO anon;

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view challenges" ON public.challenges
  FOR SELECT USING (true);

-- Challenge participations
CREATE TABLE public.challenge_participations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.challenges ON DELETE CASCADE,
  progress_percent INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'failed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.challenge_participations TO authenticated;
GRANT ALL ON public.challenge_participations TO service_role;

ALTER TABLE public.challenge_participations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own participations" ON public.challenge_participations
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- AI Insights
CREATE TABLE public.ai_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  content TEXT NOT NULL,
  category TEXT, -- 'performance', 'health', 'motivation'
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

GRANT SELECT, UPDATE ON public.ai_insights TO authenticated;
GRANT ALL ON public.ai_insights TO service_role;

ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view and update their own insights" ON public.ai_insights
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
