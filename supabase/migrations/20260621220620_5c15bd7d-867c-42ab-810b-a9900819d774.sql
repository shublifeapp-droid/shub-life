
-- 1) workouts: drop permissive "true" policies, restrict to authenticated stakeholders
DO $$
DECLARE p record;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='workouts' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.workouts', p.policyname);
  END LOOP;
END $$;

REVOKE SELECT ON public.workouts FROM anon;

CREATE POLICY "workouts_select_stakeholders"
  ON public.workouts FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid()
    OR personal_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin'::public.app_role)
  );

CREATE POLICY "workouts_personal_write"
  ON public.workouts FOR ALL
  TO authenticated
  USING (personal_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (personal_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role));

-- 2) rankings: only own row visible to user; admins see all
DO $$
DECLARE p record;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='rankings' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.rankings', p.policyname);
  END LOOP;
END $$;

REVOKE SELECT ON public.rankings FROM anon;

CREATE POLICY "rankings_select_self_or_admin"
  ON public.rankings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role));

-- 3) commissions: scope to personal owner or admin (students excluded)
DO $$
DECLARE p record;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='commissions' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.commissions', p.policyname);
  END LOOP;
END $$;

REVOKE SELECT ON public.commissions FROM anon;

CREATE POLICY "commissions_select_personal_or_admin"
  ON public.commissions FOR SELECT
  TO authenticated
  USING (personal_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role));

-- 4) get_partner_stats: switch to invoker so RLS applies; keep callable only by authenticated
ALTER FUNCTION public.get_partner_stats(uuid) SECURITY INVOKER;
REVOKE EXECUTE ON FUNCTION public.get_partner_stats(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_partner_stats(uuid) TO authenticated;
