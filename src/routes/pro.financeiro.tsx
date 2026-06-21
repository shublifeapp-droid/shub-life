import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export const Route = createFileRoute("/pro/financeiro")({
  component: ProFinance,
});

function ProFinance() {
  const { user } = useCurrentUser();
  const { data, isLoading } = useQuery({
    queryKey: ["pro-finance", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [partner, commissions] = await Promise.all([
        supabase.from("partner_profiles").select("*").eq("id", user!.id).maybeSingle(),
        supabase.from("commissions").select("amount, status, created_at").eq("personal_id", user!.id).order("created_at", { ascending: false }).limit(50),
      ]);
      return { partner: partner.data, commissions: commissions.data ?? [] };
    },
  });

  if (isLoading || !data) return <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>;

  const p = data.partner as { current_balance: number; pending_balance: number; total_earned: number; affiliate_code: string } | null;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Financeiro</h1>
        <p className="mt-1 text-sm text-muted-foreground">Comissões e saldo.</p>
      </header>

      {p?.affiliate_code && (
        <div className="rounded-2xl border border-neon/40 bg-neon/5 p-5">
          <p className="text-[10px] uppercase tracking-wider text-neon">Seu código de afiliado</p>
          <p className="mt-1 font-display text-2xl font-bold">{p.affiliate_code}</p>
        </div>
      )}

      <section className="grid gap-3 md:grid-cols-3">
        <Kpi label="Disponível" value={`R$ ${Number(p?.current_balance ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} accent />
        <Kpi label="Pendente" value={`R$ ${Number(p?.pending_balance ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} />
        <Kpi label="Total ganho" value={`R$ ${Number(p?.total_earned ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} />
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Comissões</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead className="bg-surface-elevated/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-3">Valor</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Data</th></tr>
            </thead>
            <tbody>
              {data.commissions.map((c, i) => {
                const row = c as { amount: number; status: string; created_at: string };
                return (
                  <tr key={i} className="border-t border-border">
                    <td className="px-4 py-3 font-display">R$ {Number(row.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${row.status === "paid" ? "bg-neon/10 text-neon" : "bg-yellow-500/10 text-yellow-400"}`}>{row.status}</span></td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(row.created_at).toLocaleDateString("pt-BR")}</td>
                  </tr>
                );
              })}
              {data.commissions.length === 0 && (<tr><td colSpan={3} className="px-4 py-10 text-center text-muted-foreground">Sem comissões ainda.</td></tr>)}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${accent ? "border-neon/40 bg-neon/5" : "border-border bg-surface"}`}>
      <div className="flex items-center gap-2 text-muted-foreground"><DollarSign className={`h-4 w-4 ${accent ? "text-neon" : ""}`} /><span className="text-[10px] uppercase tracking-wider">{label}</span></div>
      <p className="mt-3 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}
