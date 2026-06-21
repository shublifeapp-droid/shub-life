import { createFileRoute } from "@tanstack/react-router";
import { Check, X, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/assinatura")({
  component: AssinaturaPage,
});

const features = [
  { label: "SHUB SCORE diário", free: true, premium: true },
  { label: "Treino do dia", free: true, premium: true },
  { label: "Histórico ilimitado", free: false, premium: true },
  { label: "Insights de IA", free: false, premium: true },
  { label: "Desafios exclusivos", free: false, premium: true },
  { label: "Sem anúncios", free: false, premium: true },
  { label: "Suporte prioritário", free: false, premium: true },
];

const faq = [
  { q: "Posso cancelar quando quiser?", a: "Sim. Sem fidelidade, cancele em 1 clique nas configurações." },
  { q: "Quais formas de pagamento?", a: "Cartão de crédito, Pix e Apple/Google Pay." },
  { q: "Tem teste grátis?", a: "Sim, 7 dias grátis ao começar." },
];

function AssinaturaPage() {
  return (
    <div className="px-5 pt-12 pb-10">
      <header className="fade-up">
        <p className="text-[10px] uppercase tracking-[0.3em] text-neon">PLANOS</p>
        <h1 className="mt-1 font-display text-3xl font-bold">Desbloqueie tudo</h1>
        <p className="mt-1 text-sm text-muted-foreground">Performance sem limites.</p>
      </header>

      <div className="mt-6 grid grid-cols-1 gap-3">
        <PlanCard name="SHUB FREE" price="Grátis" cta="Plano atual" current />
        <PlanCard
          name="SHUB LIFE PREMIUM"
          price="R$ 19,99"
          period="/mês"
          cta="Começar 7 dias grátis"
          highlight
          tag="Mais escolhido"
        />
      </div>

      <h2 className="mt-8 font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Comparativo
      </h2>
      <div className="mt-3 card-premium overflow-hidden">
        <div className="grid grid-cols-[1fr_60px_80px] border-b border-border bg-surface-elevated/40 px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>Recurso</span>
          <span className="text-center">Free</span>
          <span className="text-center text-neon">Premium</span>
        </div>
        {features.map((f) => (
          <div key={f.label} className="grid grid-cols-[1fr_60px_80px] items-center border-b border-border px-4 py-3 text-sm last:border-0">
            <span>{f.label}</span>
            <span className="flex justify-center">{f.free ? <Check className="h-4 w-4 text-neon" /> : <X className="h-4 w-4 text-muted-foreground" />}</span>
            <span className="flex justify-center">{f.premium ? <Check className="h-4 w-4 text-neon" /> : <X className="h-4 w-4 text-muted-foreground" />}</span>
          </div>
        ))}
      </div>

      <h2 className="mt-8 font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">FAQ</h2>
      <div className="mt-3 space-y-2">
        {faq.map((f) => (
          <details key={f.q} className="card-premium group p-4">
            <summary className="cursor-pointer text-sm font-semibold marker:hidden list-none flex justify-between items-center">
              {f.q}
              <span className="text-neon group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="mt-2 text-xs text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

function PlanCard({
  name, price, period, cta, current, highlight, tag,
}: {
  name: string; price: string; period?: string; cta: string;
  current?: boolean; highlight?: boolean; tag?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border p-5 ${
        highlight ? "border-neon/40 bg-gradient-to-br from-neon/10 to-transparent ring-neon" : "border-border bg-surface"
      }`}
    >
      {tag && (
        <span className="absolute right-4 top-4 rounded-full bg-neon px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neon-foreground">
          {tag}
        </span>
      )}
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{name}</p>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-display text-3xl font-bold">{price}</span>
        {period && <span className="text-xs text-muted-foreground">{period}</span>}
      </div>
      <button
        disabled={current}
        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
          current
            ? "border border-border bg-surface-elevated text-muted-foreground"
            : "bg-neon text-neon-foreground glow-neon active:scale-95"
        }`}
      >
        {highlight && <Sparkles className="h-4 w-4" />}
        {cta}
      </button>
    </div>
  );
}
