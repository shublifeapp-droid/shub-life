import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users, DollarSign, Activity, TrendingUp, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const [users, subs, activeSubs, commissions, activities, posts] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("subscriptions").select("price"),
        supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("commissions").select("amount, status"),
        supabase.from("running_activities").select("id", { count: "exact", head: true }),
        supabase.from("posts").select("id", { count: "exact", head: true }),
      ]);
      const mrr = (subs.data ?? [])
        .reduce((s, r) => s + Number((r as { price: number }).price ?? 0), 0);
      const pendingCommissions = (commissions.data ?? [])
        .filter((c) => (c as { status: string }).status === "pending")
        .reduce((s, c) => s + Number((c as { amount: number }).amount ?? 0), 0);
      return {
        totalUsers: users.count ?? 0,
        activeSubs: activeSubs.count ?? 0,
        mrr,
        pendingCommissions,
        activities: activities.count ?? 0,
        posts: posts.count ?? 0,
      };
    },
  });

  if (isLoading || !data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Visão geral</h1>
        <p className="mt-1 text-sm text-muted-foreground">Saúde global da plataforma SHUB LIFE.</p>
      </header>

      <section className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={Users} label="Usuários" value={data.totalUsers.toLocaleString("pt-BR")} />
        <Kpi icon={TrendingUp} label="Assinaturas ativas" value={data.activeSubs.toLocaleString("pt-BR")} />
        <Kpi icon={DollarSign} label="MRR (R$)" value={data.mrr.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} />
        <Kpi icon={DollarSign} label="Comissões a pagar" value={`R$ ${data.pendingCommissions.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} accent />
        <Kpi icon={Activity} label="Corridas registradas" value={data.activities.toLocaleString("pt-BR")} />
        <Kpi icon={Activity} label="Posts comunidade" value={data.posts.toLocaleString("pt-BR")} />
      </section>
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-5 ${accent ? "border-neon/40 bg-neon/5" : "border-border bg-surface"}`}>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className={`h-4 w-4 ${accent ? "text-neon" : ""}`} />
        <span className="text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-3 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}
