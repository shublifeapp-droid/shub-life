import { Check, Sparkles } from "lucide-react";

interface SubscriptionCardProps {
  name: string;
  price: string;
  period?: string;
  features: string[];
  cta: string;
  popular?: boolean;
  current?: boolean;
  onClick?: () => void;
}

export function SubscriptionCard({ name, price, period, features, cta, popular, current, onClick }: SubscriptionCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border p-5 ${
        popular ? "border-neon/40 bg-gradient-to-br from-neon/10 to-transparent ring-neon" : "border-border bg-surface"
      }`}
    >
      {popular && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-neon px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neon-foreground">
          <Sparkles className="h-3 w-3" /> Popular
        </span>
      )}
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{name}</p>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-display text-3xl font-bold">{price}</span>
        {period && <span className="text-xs text-muted-foreground">{period}</span>}
      </div>
      <ul className="mt-4 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neon" /> {f}
          </li>
        ))}
      </ul>
      <button
        onClick={onClick}
        disabled={current}
        className={`mt-5 w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
          current
            ? "border border-border bg-surface-elevated text-muted-foreground"
            : popular
              ? "bg-neon text-neon-foreground glow-neon active:scale-95"
              : "border border-border bg-surface-elevated text-foreground active:scale-95"
        }`}
      >
        {current ? "Plano atual" : cta}
      </button>
    </div>
  );
}
