import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon: Icon = Inbox, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface/50 px-6 py-12 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-neon/10 text-neon glow-neon-soft">
        <Icon className="h-7 w-7" />
      </div>
      <p className="mt-4 font-display text-base font-semibold">{title}</p>
      {description && <p className="mt-1 max-w-xs text-xs text-muted-foreground">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 rounded-full bg-neon px-5 py-2 text-sm font-semibold text-neon-foreground glow-neon active:scale-95 transition-transform"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
