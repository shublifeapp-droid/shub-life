import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/financeiro")({
  component: AdminFinance,
});

interface Sub { price: number; status: string; plan_type: string; created_at: string }
interface Com { amount: number; status: string; personal_id: string; created_at: string }

function AdminFinance() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-finance"],
    queryFn: async () => {
      const [subs, commissions] = await Promise.all([
        supabase.from("subscriptions").select("price, status, plan_type, created_at"),
        supabase.from("commissions").select("amount, status, personal_id, created_at").order("created_at", { ascending: false }).limit(200),
      ]);
      return { subs: (subs.data ?? []) as Sub[], commissions: (commissions.data ?? []) as Com[] };
    },
  });

  if (isLoading || !data) return <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>;

  const mrr = data.subs.filter((s) => s.status === "active").reduce((a, s) => a + Number(s.price), 0);
  const pending = data.commissions.filter((c) => c.status === "pending").reduce((a, c) => a + Number(c.amount), 0);
  const paid = data.commissions.filter((c) => c.status === "paid").reduce((a, c) => a + Number(c.amount), 0);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Financeiro</h1>
        <p className="mt-1 text-sm text-muted-foreground">Receita, comissões e pagamentos.</p>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        <Kpi label="MRR" value={`R$ ${mrr.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} accent />
        <Kpi label="Comissões pendentes" value={`R$ ${pending.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} />
        <Kpi label="Comissões pagas" value={`R$ ${paid.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} />
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Comissões recentes</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead className="bg-surface-elevated/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-3">Personal</th><th className="px-4 py-3">Valor</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Data</th></tr>
            </thead>
            <tbody>
              {data.commissions.map((c, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-4 py-3 font-mono text-[11px]">{c.personal_id.slice(0, 8)}…</td>
                  <td className="px-4 py-3 font-display">R$ {Number(c.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${c.status === "paid" ? "bg-neon/10 text-neon" : "bg-yellow-500/10 text-yellow-400"}`}>{c.status}</span></td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(c.created_at).toLocaleDateString("pt-BR")}</td>
                </tr>
              ))}
              {data.commissions.length === 0 && (<tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">Nenhuma comissão ainda.</td></tr>)}
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
