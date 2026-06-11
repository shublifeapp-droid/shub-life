-- Explicitly revoke from anon role to satisfy linter
REVOKE EXECUTE ON FUNCTION public.get_partner_stats(UUID) FROM anon;
