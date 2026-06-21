import { motion } from "framer-motion";
import { Trophy, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type BadgeKind = "ativo" | "novo" | "popular";

interface ChallengeCardProps {
  title: string;
  daysLeft: number;
  participants: number;
  progress: number;
  badge?: BadgeKind;
  icon?: LucideIcon;
  reward?: string;
}

const badgeStyles: Record<BadgeKind, string> = {
  ativo: "bg-neon/15 text-neon border-neon/40",
  novo: "bg-tier-gold/15 text-tier-gold border-tier-gold/40",
  popular: "bg-tier-elite/15 text-tier-elite border-tier-elite/40",
};

export function ChallengeCard({
  title, daysLeft, participants, progress, badge, icon: Icon = Trophy, reward,
}: ChallengeCardProps) {
  return (
    <motion.div whileHover={{ y: -2 }} className="card-premium p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-neon/10 text-neon">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-semibold">{title}</p>
            {badge && (
              <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${badgeStyles[badge]}`}>
                {badge}
              </span>
            )}
          </div>
          {reward && <p className="text-xs text-muted-foreground">{reward}</p>}
          <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
            <span>{daysLeft}d restantes</span>
            <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {participants}</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-neon transition-all duration-700" style={{ width: `${progress}%`, boxShadow: "0 0 8px var(--neon)" }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
