import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface InsightCardProps {
  icon: LucideIcon;
  message: string;
  detail?: string;
  accent?: boolean;
}

export function InsightCard({ icon: Icon, message, detail, accent }: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-start gap-3 rounded-2xl border p-4 ${
        accent ? "border-neon/30 bg-neon/5" : "border-border bg-surface"
      }`}
    >
      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${accent ? "bg-neon text-neon-foreground" : "bg-neon/10 text-neon"}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{message}</p>
        {detail && <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>}
      </div>
    </motion.div>
  );
}
