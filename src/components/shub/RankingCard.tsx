interface RankingCardProps {
  position: number;
  name: string;
  city?: string;
  score: number;
  avatar?: string;
  highlight?: boolean;
}

const topColors = ["bg-tier-gold", "bg-tier-silver", "bg-tier-bronze"];

export function RankingCard({ position, name, city, score, avatar, highlight }: RankingCardProps) {
  const top3 = position <= 3;
  return (
    <div
      className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${
        highlight ? "border-neon/40 bg-neon/5" : top3 ? "border-neon/20 bg-surface" : "border-border bg-surface"
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold ${
            top3 ? `${topColors[position - 1]} text-background` : "bg-secondary"
          }`}
        >
          {position}
        </span>
        {avatar ? (
          <img src={avatar} alt={name} className="h-9 w-9 shrink-0 rounded-full object-cover" />
        ) : (
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-elevated text-xs font-bold uppercase">
            {name.substring(0, 2)}
          </div>
        )}
        <div className="min-w-0">
          <p className={`truncate text-sm ${highlight ? "font-bold text-neon" : "font-medium"}`}>{name}</p>
          {city && <p className="truncate text-[10px] text-muted-foreground">{city}</p>}
        </div>
      </div>
      <span className="font-display text-lg font-bold text-neon">{score}</span>
    </div>
  );
}
