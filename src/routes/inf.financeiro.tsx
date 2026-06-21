import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export const Route = createFileRoute("/inf/financeiro")({
  component: InfFinance,
});

function InfFinance() {
  const { user } = useCurrentUser();
  const { data, isLoading } = useQuery({
    queryKey: ["inf-finance", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const inf = await supabase
        .from("influencers")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (!inf.data) return { profile: null, commissions: [] };
      const profile = inf.data as { id: string; current_balance: number; pending_balance: number; total_earned: number };
      const { data } = await supabase
        .from("influencer_commissions")
        .select("amount, status, created_at, period_month")
        .eq("influencer_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(100);
      return { profile, commissions: data ?? [] };
    },
  });

  if (isLoading || !data) return <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>;
  const p = data.profile;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Financeiro</h1>
        <p className="mt-1 text-sm text-muted-foreground">Comissões recorrentes das suas indicações.</p>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        <Kpi label="Disponível" value={brl(p?.current_balance ?? 0)} accent />
        <Kpi label="Pendente" value={brl(p?.pending_balance ?? 0)} />
        <Kpi label="Total ganho" value={brl(p?.total_earned ?? 0)} />
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Comissões</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead className="bg-surface-elevated/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-3">Valor</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Mês</th></tr>
            </thead>
            <tbody>
              {data.commissions.map((c, i) => {
                const row = c as { amount: number; status: string; created_at: string; period_month: string | null };
                return (
                  <tr key={i} className="border-t border-border">
                    <td className="px-4 py-3 font-display">{brl(row.amount)}</td>
                    <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${row.status === "paid" || row.status === "available" ? "bg-neon/10 text-neon" : "bg-yellow-500/10 text-yellow-400"}`}>{row.status}</span></td>
                    <td className="px-4 py-3 text-muted-foreground">{row.period_month ?? new Date(row.created_at).toLocaleDateString("pt-BR")}</td>
                  </tr>
                );
              })}
              {data.commissions.length === 0 && (
                <tr><td colSpan={3} className="px-4 py-10 text-center text-muted-foreground">Sem comissões ainda.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function brl(v: number | string) {
  return `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${accent ? "border-neon/40 bg-neon/5" : "border-border bg-surface"}`}>
      <div className="flex items-center gap-2 text-muted-foreground"><DollarSign className={`h-4 w-4 ${accent ? "text-neon" : ""}`} /><span className="text-[10px] uppercase tracking-wider">{label}</span></div>
      <p className="mt-3 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}
