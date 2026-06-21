import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Users, DollarSign, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export const Route = createFileRoute("/pro/")({
  component: ProOverview,
});

function ProOverview() {
  const { user } = useCurrentUser();

  const { data, isLoading } = useQuery({
    queryKey: ["pro-overview", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [students, commissions, partner] = await Promise.all([
        supabase.from("personal_students").select("id, status").eq("personal_id", user!.id),
        supabase.from("commissions").select("amount, status").eq("personal_id", user!.id),
        supabase.from("partner_profiles").select("*").eq("id", user!.id).maybeSingle(),
      ]);
      const all = students.data ?? [];
      const active = all.filter((s) => (s as { status: string }).status === "active").length;
      const earned = (commissions.data ?? []).reduce((a, c) => a + Number((c as { amount: number }).amount), 0);
      const pending = (commissions.data ?? []).filter((c) => (c as { status: string }).status === "pending").reduce((a, c) => a + Number((c as { amount: number }).amount), 0);
      return {
        students: all.length,
        active,
        earned,
        pending,
        balance: Number((partner.data as { current_balance?: number } | null)?.current_balance ?? 0),
      };
    },
  });

  if (isLoading || !data) return <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Olá, treinador.</h1>
        <p className="mt-1 text-sm text-muted-foreground">Resumo da sua atuação.</p>
      </header>

      <section className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={Users} label="Alunos totais" value={String(data.students)} />
        <Kpi icon={Trophy} label="Alunos ativos" value={String(data.active)} />
        <Kpi icon={DollarSign} label="Saldo disponível" value={`R$ ${data.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} accent />
        <Kpi icon={DollarSign} label="A receber" value={`R$ ${data.pending.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} />
        <Kpi icon={DollarSign} label="Total ganho" value={`R$ ${data.earned.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} />
      </section>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${accent ? "border-neon/40 bg-neon/5" : "border-border bg-surface"}`}>
      <div className="flex items-center gap-2 text-muted-foreground"><Icon className={`h-4 w-4 ${accent ? "text-neon" : ""}`} /><span className="text-[10px] uppercase tracking-wider">{label}</span></div>
      <p className="mt-3 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}
