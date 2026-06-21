import type { LucideIcon } from "lucide-react";
import { Trophy, MessageCircle, Flame, Bell } from "lucide-react";

export type NotificationKind = "conquista" | "comentario" | "desafio" | "sistema";

const kindConfig: Record<NotificationKind, { icon: LucideIcon; color: string }> = {
  conquista: { icon: Trophy, color: "bg-tier-gold/20 text-tier-gold" },
  comentario: { icon: MessageCircle, color: "bg-neon/10 text-neon" },
  desafio: { icon: Flame, color: "bg-destructive/10 text-destructive" },
  sistema: { icon: Bell, color: "bg-secondary text-foreground" },
};

interface NotificationCardProps {
  kind: NotificationKind;
  title: string;
  description: string;
  time: string;
  unread?: boolean;
}

export function NotificationCard({ kind, title, description, time, unread }: NotificationCardProps) {
  const cfg = kindConfig[kind];
  const Icon = cfg.icon;
  return (
    <div className={`card-premium flex items-start gap-3 p-4 ${unread ? "ring-neon" : ""}`}>
      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${cfg.color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold">{title}</p>
          <span className="shrink-0 text-[10px] text-muted-foreground">{time}</span>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      {unread && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-neon glow-neon" />}
    </div>
  );
}
