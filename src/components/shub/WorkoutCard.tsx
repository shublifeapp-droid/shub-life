import { motion } from "framer-motion";
import { Play, Clock, Dumbbell } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface WorkoutCardProps {
  id: string;
  name: string;
  duration: string;
  exerciseCount: number;
  progress?: number;
}

export function WorkoutCard({ id, name, duration, exerciseCount, progress = 0 }: WorkoutCardProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="card-premium p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-[0.2em] text-neon">Treino do dia</p>
          <h3 className="mt-1 font-display text-lg font-bold truncate">{name}</h3>
          <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {duration}</span>
            <span className="inline-flex items-center gap-1"><Dumbbell className="h-3 w-3" /> {exerciseCount} exercícios</span>
          </div>
        </div>
        <Link
          to="/app/treinos/$id"
          params={{ id }}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-neon text-neon-foreground glow-neon active:scale-95 transition-transform"
        >
          <Play className="h-5 w-5 fill-current" />
        </Link>
      </div>
      {progress > 0 && (
        <div className="mt-4">
          <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-neon transition-all duration-700" style={{ width: `${progress}%`, boxShadow: "0 0 8px var(--neon)" }} />
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">{progress}% concluído</p>
        </div>
      )}
    </motion.div>
  );
}
