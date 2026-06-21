
CREATE TABLE public.personal_contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  personal_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  monthly_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','signed','canceled','completed')),
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.personal_contracts TO authenticated;
GRANT ALL ON public.personal_contracts TO service_role;
ALTER TABLE public.personal_contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "personal manage own contracts" ON public.personal_contracts FOR ALL TO authenticated
  USING (auth.uid() = personal_id) WITH CHECK (auth.uid() = personal_id);
CREATE POLICY "students view their contracts" ON public.personal_contracts FOR SELECT TO authenticated
  USING (auth.uid() = student_id);
CREATE INDEX idx_contracts_personal ON public.personal_contracts(personal_id);
CREATE INDEX idx_contracts_student ON public.personal_contracts(student_id);
CREATE TRIGGER trg_contracts_updated BEFORE UPDATE ON public.personal_contracts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.billing_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  personal_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES public.personal_contracts(id) ON DELETE SET NULL,
  amount NUMERIC(10,2) NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sent','paid','overdue','canceled')),
  recurrence TEXT NOT NULL DEFAULT 'monthly' CHECK (recurrence IN ('once','monthly')),
  notes TEXT,
  sent_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.billing_reminders TO authenticated;
GRANT ALL ON public.billing_reminders TO service_role;
ALTER TABLE public.billing_reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "personal manage own reminders" ON public.billing_reminders FOR ALL TO authenticated
  USING (auth.uid() = personal_id) WITH CHECK (auth.uid() = personal_id);
CREATE POLICY "students view their reminders" ON public.billing_reminders FOR SELECT TO authenticated
  USING (auth.uid() = student_id);
CREATE INDEX idx_reminders_personal ON public.billing_reminders(personal_id);
CREATE INDEX idx_reminders_student ON public.billing_reminders(student_id);
CREATE INDEX idx_reminders_due ON public.billing_reminders(due_date);
CREATE TRIGGER trg_reminders_updated BEFORE UPDATE ON public.billing_reminders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
