import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Users, DollarSign, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export const Route = createFileRoute("/inf/")({
  component: InfOverview,
});

function InfOverview() {
  const { user } = useCurrentUser();

  const { data, isLoading } = useQuery({
    queryKey: ["inf-overview", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const inf = await supabase
        .from("influencers")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (!inf.data) return null;
      const profile = inf.data as {
        id: string;
        code: string;
        commission_rate: number;
        current_balance: number;
        pending_balance: number;
        total_earned: number;
      };

      const [refs, comms] = await Promise.all([
        supabase
          .from("influencer_referrals")
          .select("id, status")
          .eq("influencer_id", profile.id),
        supabase
          .from("influencer_commissions")
          .select("amount, status")
          .eq("influencer_id", profile.id),
      ]);

      const all = refs.data ?? [];
      const active = all.filter((r) => (r as { status: string }).status === "active").length;
      const earned = (comms.data ?? []).reduce(
        (s, c) => s + Number((c as { amount: number }).amount),
        0,
      );

      return {
        profile,
        total: all.length,
        active,
        earned,
      };
    },
  });

  if (isLoading) {
    return <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>;
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted-foreground">
        Você ainda não foi habilitado como influenciador. Fale com o suporte.
      </div>
    );
  }

  const p = data.profile;
  const link = `${window.location.origin}/r/${p.code}`;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Olá, influenciador.</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Comissão recorrente de {(Number(p.commission_rate) * 100).toFixed(0)}% enquanto seu indicado mantiver a assinatura ativa.
        </p>
      </header>

      <div className="rounded-2xl border border-neon/40 bg-neon/5 p-5">
        <p className="text-[10px] uppercase tracking-wider text-neon">Seu link de indicação</p>
        <p className="mt-1 break-all font-display text-lg font-semibold">{link}</p>
        <button
          onClick={() => navigator.clipboard.writeText(link)}
          className="mt-3 rounded-full bg-neon px-4 py-2 text-xs font-semibold text-neon-foreground glow-neon"
        >
          Copiar link
        </button>
      </div>

      <section className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={Users} label="Indicados" value={String(data.total)} />
        <Kpi icon={TrendingUp} label="Ativos" value={String(data.active)} />
        <Kpi icon={DollarSign} label="Saldo disponível" value={brl(p.current_balance)} accent />
        <Kpi icon={DollarSign} label="A receber" value={brl(p.pending_balance)} />
        <Kpi icon={DollarSign} label="Total ganho" value={brl(p.total_earned)} />
      </section>
    </div>
  );
}

function brl(v: number | string) {
  return `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
}

function Kpi({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string; accent?: boolean }) {
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
