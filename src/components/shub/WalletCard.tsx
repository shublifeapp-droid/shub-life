import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";

interface WalletCardProps {
  balance: number;
  pending?: number;
  totalEarned?: number;
  currency?: string;
}

const fmt = (n: number, currency = "BRL") =>
  n.toLocaleString("pt-BR", { style: "currency", currency });

export function WalletCard({ balance, pending = 0, totalEarned = 0, currency = "BRL" }: WalletCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[28px] border border-neon/25 bg-gradient-to-br from-surface-elevated to-surface p-6"
    >
      <div className="pointer-events-none absolute -top-10 right-0 h-48 w-48 rounded-full bg-neon/15 blur-3xl" />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-neon" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Carteira SHUB</p>
        </div>
        <span className="rounded-full bg-neon/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-neon">{currency}</span>
      </div>
      <p className="relative mt-4 text-xs text-muted-foreground">Saldo disponível</p>
      <p className="relative font-display text-4xl font-bold tracking-tight">{fmt(balance, currency)}</p>
      <div className="relative mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-background/40 p-3">
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
            <ArrowDownRight className="h-3 w-3 text-tier-gold" /> Pendente
          </div>
          <p className="mt-1 font-display text-sm font-bold">{fmt(pending, currency)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-background/40 p-3">
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
            <ArrowUpRight className="h-3 w-3 text-neon" /> Total ganho
          </div>
          <p className="mt-1 font-display text-sm font-bold">{fmt(totalEarned, currency)}</p>
        </div>
      </div>
    </motion.div>
  );
}
