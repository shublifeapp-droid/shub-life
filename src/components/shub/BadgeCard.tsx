import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Lock } from "lucide-react";
import { LevelBadge, type Tier } from "./LevelBadge";

interface BadgeCardProps {
  icon: LucideIcon;
  name: string;
  category?: string;
  description?: string;
  state: "locked" | "unlocked" | "elite";
  tier?: Tier;
}

export function BadgeCard({ icon: Icon, name, category, description, state, tier }: BadgeCardProps) {
  const locked = state === "locked";
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`relative overflow-hidden rounded-3xl border p-4 text-center transition ${
        locked ? "border-border bg-surface opacity-50" : state === "elite" ? "border-tier-elite/40 bg-gradient-to-br from-tier-elite/10 to-transparent" : "border-border bg-surface"
      }`}
    >
      <div className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${locked ? "bg-secondary text-muted-foreground" : "bg-neon/10 text-neon glow-neon-soft"}`}>
        {locked ? <Lock className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
      </div>
      <p className="mt-3 text-sm font-semibold">{name}</p>
      {category && <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{category}</p>}
      {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      {tier && !locked && (
        <div className="mt-3 flex justify-center"><LevelBadge tier={tier} size="sm" /></div>
      )}
    </motion.div>
  );
}
