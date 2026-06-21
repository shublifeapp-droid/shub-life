import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Plus } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  goal?: string;
  progress?: number;
  onAdd?: () => void;
  trend?: string;
}

export function MetricCard({ icon: Icon, label, value, goal, progress, onAdd, trend }: MetricCardProps) {
  return (
    <motion.div whileTap={{ scale: 0.98 }} className="card-premium p-4">
      <div className="flex items-start justify-between">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-neon/10 text-neon">
          <Icon className="h-4 w-4" />
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="grid h-8 w-8 place-items-center rounded-full border border-neon/40 bg-neon/10 text-neon active:scale-95 transition-transform"
            aria-label={`Adicionar ${label}`}
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>
      <p className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="font-display text-xl font-bold">{value}</p>
      {goal && <p className="text-[10px] text-muted-foreground">Meta: {goal}</p>}
      {trend && <p className="text-[10px] text-neon">{trend}</p>}
      {progress !== undefined && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-neon transition-all duration-700" style={{ width: `${progress}%`, boxShadow: "0 0 6px var(--neon)" }} />
        </div>
      )}
    </motion.div>
  );
}
