import { Award } from "lucide-react";

export type Tier = "bronze" | "silver" | "gold" | "elite";

const config: Record<Tier, { label: string; color: string; glow: string }> = {
  bronze: { label: "Bronze", color: "var(--tier-bronze)", glow: "rgba(205, 127, 50, 0.4)" },
  silver: { label: "Silver", color: "var(--tier-silver)", glow: "rgba(192, 192, 192, 0.4)" },
  gold: { label: "Gold", color: "var(--tier-gold)", glow: "rgba(255, 215, 0, 0.5)" },
  elite: { label: "Elite", color: "var(--tier-elite)", glow: "rgba(183, 255, 0, 0.5)" },
};

export function LevelBadge({ tier, size = "md" }: { tier: Tier; size?: "sm" | "md" | "lg" }) {
  const cfg = config[tier];
  const sizes = {
    sm: "h-6 px-2 text-[10px]",
    md: "h-8 px-3 text-xs",
    lg: "h-10 px-4 text-sm",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold uppercase tracking-wider ${sizes[size]}`}
      style={{
        borderColor: cfg.color,
        color: cfg.color,
        background: `linear-gradient(135deg, ${cfg.glow}, transparent)`,
        boxShadow: `0 0 16px ${cfg.glow}`,
      }}
    >
      <Award className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}
