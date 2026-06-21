/**
 * Wallet engine — personal trainer earnings & withdrawal logic.
 */
export type TxKind = "commission" | "withdrawal" | "discount" | "bonus" | "refund";
export type TxStatus = "pending" | "available" | "paid" | "canceled";

export interface WalletTransaction {
  id: string;
  kind: TxKind;
  status: TxStatus;
  amount: number;        // BRL, positive = credit, negative = debit
  createdAt: string;
}

export interface WalletSummary {
  available: number;
  pending: number;
  totalEarned: number;
  totalWithdrawn: number;
}

export function summarize(txs: WalletTransaction[]): WalletSummary {
  let available = 0, pending = 0, totalEarned = 0, totalWithdrawn = 0;
  for (const t of txs) {
    if (t.status === "canceled") continue;
    if (t.amount > 0) {
      if (t.status === "available" || t.status === "paid") available += t.amount;
      if (t.status === "pending") pending += t.amount;
      totalEarned += t.amount;
    } else {
      if (t.kind === "withdrawal") totalWithdrawn += Math.abs(t.amount);
      available += t.amount; // debit available
    }
  }
  return {
    available: Math.max(0, Math.round(available * 100) / 100),
    pending: Math.round(pending * 100) / 100,
    totalEarned: Math.round(totalEarned * 100) / 100,
    totalWithdrawn: Math.round(totalWithdrawn * 100) / 100,
  };
}

export const MIN_WITHDRAWAL_BRL = 50;
export function canWithdraw(summary: WalletSummary, amount: number): boolean {
  return amount >= MIN_WITHDRAWAL_BRL && amount <= summary.available;
}
