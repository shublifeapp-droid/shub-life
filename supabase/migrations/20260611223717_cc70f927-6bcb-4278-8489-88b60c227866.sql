-- Fix Search Path and revoke broad execute
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

REVOKE ALL ON FUNCTION public.get_partner_stats(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_partner_stats(UUID) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.get_partner_stats(UUID) TO service_role;

-- Ensure all partner tables have updated_at
ALTER TABLE public.referrals ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE public.wallet_transactions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE public.partner_notifications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Add triggers for updated_at
CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON public.referrals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wallet_transactions_updated_at BEFORE UPDATE ON public.wallet_transactions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partner_notifications_updated_at BEFORE UPDATE ON public.partner_notifications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
