import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, ArrowRight, Zap, Trophy, Brain, Users, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/shub/Logo";
import { saveRefCode } from "@/lib/shub/referral";
import { PLANS } from "@/lib/shub/plans";

export const Route = createFileRoute("/r/$code")({
  ssr: false,
  component: ReferralLanding,
});

const premiumPlan = PLANS.find((p) => p.code === "shub_premium")!;

interface InfluencerInfo {
  display_name: string | null;
  code: string;
  nickname: string | null;
  avatar_url: string | null;
}

function ReferralLanding() {
  const { code } = Route.useParams();

  useEffect(() => {
    if (code) saveRefCode(code);
  }, [code]);

  const { data, isLoading } = useQuery({
    queryKey: ["referral-landing", code],
    queryFn: async () => {
      const { data: inf } = await supabase
        .from("influencers")
        .select("display_name, code, user_id")
        .eq("code", code.toUpperCase())
        .eq("status", "active")
        .maybeSingle();
      if (!inf) return null;
      const { data: profile } = await supabase
        .from("profiles")
        .select("nickname, avatar_url")
        .eq("id", inf.user_id)
        .maybeSingle();
      return {
        display_name: inf.display_name,
        code: inf.code,
        nickname: profile?.nickname ?? null,
        avatar_url: profile?.avatar_url ?? null,
      } as InfluencerInfo;
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-neon" />
      </div>
    );
  }

  const name = data?.display_name || data?.nickname || "seu mentor";

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "var(--gradient-radial-neon)" }} />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-neon/20 blur-3xl" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Logo className="h-10 w-auto" />
        <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
          Entrar
        </Link>
      </header>

      <section className="relative z-10 mx-auto max-w-4xl px-5 pt-8 pb-16 text-center fade-up">
        {data?.avatar_url && (
          <img
            src={data.avatar_url}
            alt={name}
            className="mx-auto mb-5 h-20 w-20 rounded-full border-2 border-neon object-cover glow-neon-soft"
          />
        )}
        <span className="inline-flex items-center gap-2 rounded-full border border-neon/30 bg-neon/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-neon">
          <Sparkles className="h-3 w-3" /> Convite de {name}
        </span>
        <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] md:text-6xl">
          Você foi convidado por <span className="text-neon">{name}</span>.<br />
          Evolua com o SHUB LIFE.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
          Treino, score diário, desafios e performance humana de elite. Comece grátis usando o código{" "}
          <span className="font-mono font-bold text-neon">{data?.code ?? code.toUpperCase()}</span>.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/cadastro"
            className="inline-flex items-center gap-2 rounded-full bg-neon px-7 py-3.5 text-sm font-semibold text-neon-foreground glow-neon active:scale-95 transition"
          >
            Criar minha conta grátis <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
            Já tenho conta
          </Link>
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-5xl gap-4 px-5 pb-16 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Zap, title: "SHUB SCORE diário", desc: "Sua performance em um número que evolui com você." },
          { icon: Trophy, title: "Desafios & rankings", desc: "Compete com a comunidade e desbloqueia conquistas." },
          { icon: Brain, title: "IA de evolução", desc: "Insights sobre treino, sono e hábitos." },
          { icon: Users, title: "Comunidade premium", desc: "Atletas e profissionais da elite." },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-border bg-surface p-5">
            <f.icon className="h-5 w-5 text-neon" />
            <h3 className="mt-3 font-display text-base font-semibold">{f.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </section>

      <section className="relative z-10 mx-auto max-w-3xl px-5 pb-20">
        <div className="rounded-[32px] border border-neon/40 bg-surface p-8 text-center glow-neon-soft">
          <p className="text-[10px] uppercase tracking-[0.2em] text-neon">Plano Premium</p>
          <h3 className="mt-2 font-display text-3xl font-bold">{premiumPlan.name}</h3>
          <p className="mt-2 font-display text-4xl font-bold text-neon">
            R$ {premiumPlan.priceBrl.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            <span className="text-sm text-muted-foreground">/mês</span>
          </p>
          <ul className="mx-auto mt-5 max-w-sm space-y-2 text-left text-sm">
            {premiumPlan.features.slice(0, 5).map((feat) => (
              <li key={feat} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-neon" /> {feat}
              </li>
            ))}
          </ul>
          <Link
            to="/cadastro"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-neon px-6 py-3 text-sm font-semibold text-neon-foreground glow-neon active:scale-95 transition"
          >
            Começar agora <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
