import { useEffect, useState } from "react";

interface ScoreRingProps {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  showNumber?: boolean;
}

export function ScoreRing({ value, size = 200, stroke = 12, label = "SHUB", showNumber = true }: ScoreRingProps) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setV(value), 80);
    return () => clearTimeout(t);
  }, [value]);

  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (v / 100) * c;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`ringGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B7FF00" />
            <stop offset="100%" stopColor="#8FD400" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--surface-elevated)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#ringGrad-${size})`}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1.6s cubic-bezier(.22,1,.36,1)",
            filter: "drop-shadow(0 0 10px var(--neon))",
          }}
        />
      </svg>
      {showNumber && (
        <div className="absolute inset-0 grid place-items-center">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
          <p className="font-display font-bold leading-none" style={{ fontSize: size * 0.28 }}>{v}</p>
          <p className="mt-1 text-[10px] text-muted-foreground">de 100</p>
        </div>
      )}
    </div>
  );
}
