
-- 1) Add 'influencer' to app_role enum (if not present)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'influencer' AND enumtypid = 'public.app_role'::regtype) THEN
    ALTER TYPE public.app_role ADD VALUE 'influencer';
  END IF;
END$$;

-- 2) influencers
CREATE TABLE IF NOT EXISTS public.influencers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  display_name TEXT,
  commission_rate NUMERIC(5,4) NOT NULL DEFAULT 0.20,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','paused','blocked')),
  current_balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  pending_balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_earned   NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.influencers TO authenticated;
GRANT ALL ON public.influencers TO service_role;
ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Influencer reads own profile" ON public.influencers
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admin reads all influencers" ON public.influencers
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin manages influencers" ON public.influencers
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER trg_influencers_updated
  BEFORE UPDATE ON public.influencers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) influencer_referrals
CREATE TABLE IF NOT EXISTS public.influencer_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID NOT NULL REFERENCES public.influencers(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','canceled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (influencer_id, referred_user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.influencer_referrals TO authenticated;
GRANT ALL ON public.influencer_referrals TO service_role;
ALTER TABLE public.influencer_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Influencer reads own referrals" ON public.influencer_referrals
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.influencers i WHERE i.id = influencer_id AND i.user_id = auth.uid())
  );
CREATE POLICY "Admin manages referrals" ON public.influencer_referrals
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE INDEX IF NOT EXISTS idx_inf_ref_influencer ON public.influencer_referrals(influencer_id);
CREATE INDEX IF NOT EXISTS idx_inf_ref_user ON public.influencer_referrals(referred_user_id);

CREATE TRIGGER trg_inf_ref_updated
  BEFORE UPDATE ON public.influencer_referrals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4) influencer_commissions
CREATE TABLE IF NOT EXISTS public.influencer_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID NOT NULL REFERENCES public.influencers(id) ON DELETE CASCADE,
  referral_id UUID REFERENCES public.influencer_referrals(id) ON DELETE SET NULL,
  amount NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','available','paid','canceled')),
  period_month DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.influencer_commissions TO authenticated;
GRANT ALL ON public.influencer_commissions TO service_role;
ALTER TABLE public.influencer_commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Influencer reads own commissions" ON public.influencer_commissions
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.influencers i WHERE i.id = influencer_id AND i.user_id = auth.uid())
  );
CREATE POLICY "Admin manages inf commissions" ON public.influencer_commissions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE INDEX IF NOT EXISTS idx_inf_comm_influencer ON public.influencer_commissions(influencer_id);

CREATE TRIGGER trg_inf_comm_updated
  BEFORE UPDATE ON public.influencer_commissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
