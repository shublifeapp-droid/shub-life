import { motion } from "framer-motion";

interface LevelCardProps {
  xp: number;
  nextXp: number;
  levelName: string;
  levelNumber: number;
}

export function LevelCard({ xp, nextXp, levelName, levelNumber }: LevelCardProps) {
  const pct = Math.min(100, (xp / nextXp) * 100);
  return (
    <div className="card-premium p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Nível {levelNumber}</p>
          <p className="font-display text-xl font-bold">{levelName}</p>
        </div>
        <p className="font-display text-sm">
          <span className="text-neon font-bold">{xp.toLocaleString("pt-BR")}</span>
          <span className="text-muted-foreground"> / {nextXp.toLocaleString("pt-BR")} XP</span>
        </p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-neon to-tier-gold"
          style={{ boxShadow: "0 0 10px var(--neon)" }}
        />
      </div>
      <p className="mt-2 text-[10px] text-muted-foreground">
        Faltam {(nextXp - xp).toLocaleString("pt-BR")} XP para o próximo nível
      </p>
    </div>
  );
}
