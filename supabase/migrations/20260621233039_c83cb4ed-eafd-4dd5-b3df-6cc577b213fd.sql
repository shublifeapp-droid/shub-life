ALTER TABLE public.workouts REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.workouts;