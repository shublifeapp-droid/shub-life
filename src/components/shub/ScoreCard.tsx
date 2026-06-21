import { motion } from "framer-motion";
import { ScoreRing } from "./ScoreRing";
import { LevelBadge, type Tier } from "./LevelBadge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ScoreCardProps {
  score: number;
  tier: Tier;
  trend?: number;
  message?: string;
}

export function ScoreCard({ score, tier, trend = 0, message = "Continue evoluindo." }: ScoreCardProps) {
  const TrendIcon = trend >= 0 ? TrendingUp : TrendingDown;
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-[28px] border border-neon/25 bg-surface p-6"
    >
      <div className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full bg-neon/25 blur-3xl" />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-neon">SHUB SCORE</p>
          <p className="mt-1 text-xs text-muted-foreground">{message}</p>
        </div>
        <LevelBadge tier={tier} />
      </div>
      <div className="relative mt-4 flex justify-center">
        <ScoreRing value={score} size={210} stroke={14} />
      </div>
      <div className="relative mt-4 flex items-center justify-center gap-2 text-xs">
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold ${trend >= 0 ? "bg-neon/10 text-neon" : "bg-destructive/10 text-destructive"}`}>
          <TrendIcon className="h-3 w-3" /> {trend >= 0 ? "+" : ""}{trend} essa semana
        </span>
      </div>
    </motion.section>
  );
}
