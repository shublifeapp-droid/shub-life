import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakCardProps {
  current: number;
  best: number;
}

export function StreakCard({ current, best }: StreakCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-3xl border border-neon/30 bg-gradient-to-br from-neon/10 to-transparent p-5"
    >
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-neon/20 blur-3xl" />
      <div className="relative flex items-center gap-4">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [-3, 3, -3] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="grid h-14 w-14 place-items-center rounded-2xl bg-neon text-neon-foreground glow-neon"
        >
          <Flame className="h-7 w-7 fill-current" />
        </motion.div>
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Streak atual</p>
          <p className="font-display text-3xl font-bold text-neon">{current} <span className="text-base text-foreground">dias</span></p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">Melhor: {best} dias</p>
        </div>
      </div>
    </motion.div>
  );
}
