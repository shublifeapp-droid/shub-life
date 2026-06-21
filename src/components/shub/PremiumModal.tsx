import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import type { LucideIcon } from "lucide-react";

interface PremiumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icon?: LucideIcon;
  title: string;
  description?: string;
  variant?: "default" | "danger" | "success" | "upgrade";
  children?: React.ReactNode;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
}

const variantStyles = {
  default: "bg-neon/10 text-neon",
  danger: "bg-destructive/10 text-destructive",
  success: "bg-neon/10 text-neon",
  upgrade: "bg-gradient-to-br from-tier-gold/20 to-neon/20 text-tier-gold",
};

export function PremiumModal({
  open, onOpenChange, icon: Icon, title, description, variant = "default",
  children, primaryAction, secondaryAction,
}: PremiumModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface border-border max-w-sm rounded-3xl">
        <DialogHeader className="items-center text-center">
          {Icon && (
            <div className={`grid h-14 w-14 place-items-center rounded-2xl ${variantStyles[variant]} glow-neon-soft`}>
              <Icon className="h-7 w-7" />
            </div>
          )}
          <DialogTitle className="font-display text-xl">{title}</DialogTitle>
          {description && <DialogDescription className="text-center">{description}</DialogDescription>}
        </DialogHeader>
        {children}
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition active:scale-95 ${
                variant === "danger" ? "bg-destructive text-destructive-foreground" : "bg-neon text-neon-foreground glow-neon"
              }`}
            >
              {primaryAction.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="w-full rounded-2xl border border-border bg-surface-elevated px-4 py-3 text-sm font-semibold text-foreground active:scale-95 transition"
            >
              {secondaryAction.label}
            </button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
