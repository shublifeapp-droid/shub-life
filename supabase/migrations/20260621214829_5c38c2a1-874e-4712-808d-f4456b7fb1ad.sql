
-- ============ running_activities ============
CREATE TABLE public.running_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL DEFAULT 'run' CHECK (activity_type IN ('run','walk','free','challenge')),
  start_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_time TIMESTAMPTZ,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  distance_km NUMERIC(8,3) NOT NULL DEFAULT 0,
  avg_pace NUMERIC(6,2),
  avg_speed NUMERIC(6,2),
  calories INTEGER NOT NULL DEFAULT 0,
  route_polyline TEXT,
  map_image_url TEXT,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  shub_score_delta INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.running_activities TO authenticated;
GRANT ALL ON public.running_activities TO service_role;

ALTER TABLE public.running_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own running activities"
  ON public.running_activities FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_running_activities_user_start ON public.running_activities (user_id, start_time DESC);
CREATE INDEX idx_running_activities_type ON public.running_activities (activity_type);

CREATE TRIGGER trg_running_activities_updated_at
  BEFORE UPDATE ON public.running_activities
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ gps_points ============
CREATE TABLE public.gps_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id UUID NOT NULL REFERENCES public.running_activities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  latitude NUMERIC(10,7) NOT NULL,
  longitude NUMERIC(10,7) NOT NULL,
  altitude NUMERIC(7,2),
  speed NUMERIC(6,2),
  accuracy NUMERIC(6,2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.gps_points TO authenticated;
GRANT ALL ON public.gps_points TO service_role;

ALTER TABLE public.gps_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own gps points"
  ON public.gps_points FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_gps_points_activity ON public.gps_points (activity_id, recorded_at);
CREATE INDEX idx_gps_points_user ON public.gps_points (user_id);
