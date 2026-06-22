import { Link, createFileRoute } from "@tanstack/react-router";
import { Check, Sparkles, ArrowRight, Zap, Trophy, Users, Brain } from "lucide-react";
import { Logo } from "@/components/shub/Logo";
import { PLANS } from "@/lib/shub/plans";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SHUB LIFE — Muito além do treino" },
      { name: "description", content: "Comece grátis. Treino, score diário, desafios e evolução real. Planos premium opcionais." },
    ],
  }),
  component: Landing,
});

const studentPlans = PLANS.filter((p) => p.audience === "student");
const personalPlans = PLANS.filter((p) => p.audience === "personal");
const freePlan = studentPlans.find((p) => p.code === "shub_free")!;
const premiumPlan = studentPlans.find((p) => p.code === "shub_premium")!;

const features = [
  { icon: Zap, title: "SHUB SCORE diário", desc: "Sua performance traduzida em um número que evolui com você." },
  { icon: Trophy, title: "Desafios & rankings", desc: "Compete com a comunidade e desbloqueia conquistas." },
  { icon: Brain, title: "IA de evolução", desc: "Insights inteligentes sobre treino, sono e hábitos." },
  { icon: Users, title: "Comunidade premium", desc: "Conecte-se com atletas e profissionais da elite." },
];

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "var(--gradient-radial-neon)" }} />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-neon/20 blur-3xl" />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Logo className="h-10 w-auto" />
        <nav className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
            Entrar
          </Link>
          <Link
            to="/cadastro"
            className="rounded-full bg-neon px-5 py-2 text-sm font-semibold text-neon-foreground glow-neon active:scale-95 transition"
          >
            Criar conta
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-4xl px-5 pt-12 pb-16 text-center fade-up">
        <span className="inline-flex items-center gap-2 rounded-full border border-neon/30 bg-neon/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-neon">
          <Sparkles className="h-3 w-3" /> Comece grátis
        </span>
        <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] md:text-6xl">
          Muito além do treino.<br />
          <span className="text-neon">Sua evolução real.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
          Treino, saúde mental, hábitos, nutrição e performance humana — tudo num único app premium.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/cadastro"
            className="inline-flex items-center gap-2 rounded-full bg-neon px-7 py-3.5 text-sm font-bold text-neon-foreground glow-neon active:scale-95 transition"
          >
            Começar grátis <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/login"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
          >
            Já tenho conta →
          </Link>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Sem cartão de crédito. Cancele quando quiser.</p>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-3xl border border-border bg-surface p-5">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-neon/10 text-neon">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold">{f.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans — Alunos */}
      <section className="relative z-10 mx-auto max-w-5xl px-5 py-16">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-neon">Para alunos</p>
          <h2 className="mt-2 font-display text-4xl font-bold">Escolha o seu ritmo</h2>
          <p className="mt-2 text-sm text-muted-foreground">Comece grátis. Faça upgrade quando quiser.</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {/* FREE — destaque principal */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-neon/50 bg-gradient-to-br from-neon/15 via-neon/5 to-transparent p-6 ring-neon glow-neon-soft">
            <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-neon px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neon-foreground">
              <Sparkles className="h-3 w-3" /> Comece aqui
            </span>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{freePlan.label}</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-display text-5xl font-bold text-neon">Grátis</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Para sempre. Sem pegadinhas.</p>
            <ul className="mt-5 space-y-2.5">
              {freePlan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-neon" /> {f}
                </li>
              ))}
            </ul>
            <Link
              to="/cadastro"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-neon px-4 py-3.5 text-sm font-bold text-neon-foreground glow-neon active:scale-95 transition"
            >
              Criar conta grátis <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* PREMIUM */}
          <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{premiumPlan.label}</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-display text-5xl font-bold">R$ 19,90</span>
              <span className="text-xs text-muted-foreground">/mês</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">7 dias grátis para testar.</p>
            <ul className="mt-5 space-y-2.5">
              {premiumPlan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-neon" /> {f}
                </li>
              ))}
            </ul>
            <Link
              to="/cadastro"
              className="mt-6 flex w-full items-center justify-center rounded-2xl border border-border bg-surface-elevated px-4 py-3.5 text-sm font-semibold text-foreground active:scale-95 transition"
            >
              Testar premium
            </Link>
          </div>
        </div>
      </section>

      {/* Plans — Profissionais */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-16">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-neon">Para profissionais</p>
          <h2 className="mt-2 font-display text-4xl font-bold">Gerencie sua carteira de alunos</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Treinos personalizados, contratos, cobranças e ganhos recorrentes.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {personalPlans.map((plan) => {
            const isStarter = plan.code === "personal_starter";
            const isPro = plan.code === "personal_pro";
            return (
              <div
                key={plan.code}
                className={`relative overflow-hidden rounded-3xl p-6 ${
                  isPro
                    ? "border-2 border-neon/50 bg-gradient-to-br from-neon/15 via-neon/5 to-transparent ring-neon glow-neon-soft"
                    : "border border-border bg-surface"
                }`}
              >
                {isPro && (
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-neon px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neon-foreground">
                    <Sparkles className="h-3 w-3" /> Popular
                  </span>
                )}
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{plan.label}</p>
                <div className="mt-2 flex items-baseline gap-1">
                  {plan.monthlyPrice === 0 ? (
                    <span className="font-display text-4xl font-bold text-neon">Grátis</span>
                  ) : (
                    <>
                      <span className="font-display text-4xl font-bold">
                        R$ {plan.monthlyPrice.toFixed(2).replace(".", ",")}
                      </span>
                      <span className="text-xs text-muted-foreground">/mês</span>
                    </>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {isStarter ? "Até 3 alunos grátis" : isPro ? "Até 10 alunos" : "Alunos ilimitados"}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-neon" /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/cadastro"
                  className={`mt-6 flex w-full items-center justify-center rounded-2xl px-4 py-3.5 text-sm font-bold active:scale-95 transition ${
                    isPro
                      ? "bg-neon text-neon-foreground glow-neon"
                      : "border border-border bg-surface-elevated text-foreground"
                  }`}
                >
                  Quero ser profissional
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 mx-auto max-w-3xl px-5 py-20 text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Pronto para evoluir?</h2>
        <p className="mt-3 text-sm text-muted-foreground">Junte-se à comunidade SHUB LIFE. É grátis.</p>
        <Link
          to="/cadastro"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-neon px-8 py-3.5 text-sm font-bold text-neon-foreground glow-neon active:scale-95 transition"
        >
          Começar grátis agora <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <footer className="relative z-10 border-t border-border px-5 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SHUB LIFE. Todos os direitos reservados.
      </footer>
    </div>
  );
}
