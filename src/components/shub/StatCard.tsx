import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  delta?: number;
}

export function StatCard({ icon: Icon, label, value, delta }: StatCardProps) {
  const positive = (delta ?? 0) >= 0;
  const TrendIcon = positive ? TrendingUp : TrendingDown;
  return (
    <div className="card-premium p-4">
      <div className="flex items-center justify-between">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-neon/10 text-neon">
          <Icon className="h-4 w-4" />
        </div>
        {delta !== undefined && (
          <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${positive ? "text-neon" : "text-destructive"}`}>
            <TrendIcon className="h-3 w-3" /> {positive ? "+" : ""}{delta}%
          </span>
        )}
      </div>
      <p className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="font-display text-2xl font-bold">{value}</p>
    </div>
  );
}
