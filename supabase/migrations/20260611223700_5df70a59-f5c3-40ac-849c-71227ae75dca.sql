-- 1. Partner Profiles (Trainer/Affiliate specific data)
CREATE TABLE public.partner_profiles (
  id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  affiliate_code TEXT UNIQUE,
  status TEXT DEFAULT 'pending', -- 'pending', 'active', 'suspended'
  partner_level INTEGER DEFAULT 1, -- Levels 1-5 for gamification
  total_earned DECIMAL(12,2) DEFAULT 0,
  current_balance DECIMAL(12,2) DEFAULT 0,
  pending_balance DECIMAL(12,2) DEFAULT 0,
  students_count INTEGER DEFAULT 0,
  active_premium_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

GRANT SELECT, UPDATE ON public.partner_profiles TO authenticated;
GRANT ALL ON public.partner_profiles TO service_role;

ALTER TABLE public.partner_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view their own partner profile" ON public.partner_profiles
  FOR SELECT USING (auth.uid() = id);

-- 2. Referrals (User to Partner mapping)
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL REFERENCES public.partner_profiles(id),
  referred_user_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT DEFAULT 'active', -- 'active', 'churned'
  commission_rate DECIMAL(5,2) DEFAULT 10.00, -- 10% standard
  is_lifetime BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(referred_user_id) -- One referral per student rule
);

GRANT SELECT ON public.referrals TO authenticated;
GRANT ALL ON public.referrals TO service_role;

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view their own referrals" ON public.referrals
  FOR SELECT USING (auth.uid() = partner_id);

-- 3. Digital Wallet Transactions
CREATE TABLE public.wallet_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL REFERENCES public.partner_profiles(id),
  amount DECIMAL(12,2) NOT NULL,
  type TEXT NOT NULL, -- 'commission', 'withdrawal', 'subscription_offset', 'bonus'
  status TEXT DEFAULT 'completed', -- 'pending', 'completed', 'failed'
  description TEXT,
  reference_id UUID, -- Links to a payment or referral
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

GRANT SELECT ON public.wallet_transactions TO authenticated;
GRANT ALL ON public.wallet_transactions TO service_role;

ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view their own transactions" ON public.wallet_transactions
  FOR SELECT USING (auth.uid() = partner_id);

-- 4. Partner Notifications
CREATE TABLE public.partner_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL REFERENCES public.partner_profiles(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT, -- 'new_student', 'commission_received', 'balance_update'
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

GRANT SELECT, UPDATE ON public.partner_notifications TO authenticated;
GRANT ALL ON public.partner_notifications TO service_role;

ALTER TABLE public.partner_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can manage their notifications" ON public.partner_notifications
  FOR ALL USING (auth.uid() = partner_id);

-- 5. Helper Functions
CREATE OR REPLACE FUNCTION public.get_partner_stats(p_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_earned', total_earned,
    'current_balance', current_balance,
    'students_count', students_count,
    'active_premium_count', active_premium_count
  ) INTO result
  FROM public.partner_profiles
  WHERE id = p_id;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grants for updated_at trigger
CREATE TRIGGER update_partner_profiles_updated_at BEFORE UPDATE ON public.partner_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
