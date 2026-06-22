/**
 * Planos, comissão e regras da carteira SHUB PARTNER
 */

export const COMMISSION_RATE = 0.1; // 10% recorrente vitalício

export interface PlanDef {
  code: "shub_free" | "shub_premium" | "personal_starter" | "personal_pro" | "personal_premium";
  audience: "student" | "personal";
  label: string;
  monthlyPrice: number;
  studentLimit?: number;
  features: string[];
}

export const PLANS: PlanDef[] = [
  {
    code: "shub_free",
    audience: "student",
    label: "SHUB FREE",
    monthlyPrice: 0,
    features: ["Treinos básicos", "Score diário", "Comunidade limitada"],
  },
  {
    code: "shub_premium",
    audience: "student",
    label: "SHUB LIFE PREMIUM",
    monthlyPrice: 19.9,
    features: [
      "Score completo + tendências",
      "Desafios e rankings",
      "IA de evolução",
      "Comunidade premium",
    ],
  },
  {
    code: "personal_starter",
    audience: "personal",
    label: "STARTER",
    monthlyPrice: 0,
    studentLimit: 3,
    features: ["Até 3 alunos grátis", "Dashboard básico", "Programa Partner"],
  },
  {
    code: "personal_pro",
    audience: "personal",
    label: "PRO",
    monthlyPrice: 29.9,
    studentLimit: 10,
    features: ["Até 10 alunos", "Carteira completa", "Relatórios"],
  },
  {
    code: "personal_premium",
    audience: "personal",
    label: "PREMIUM",
    monthlyPrice: 49.9,
    studentLimit: 9999,
    features: ["Alunos ilimitados", "IA de evolução", "Suporte prioritário"],
  },
];

export function getPlan(code: PlanDef["code"]): PlanDef | undefined {
  return PLANS.find((p) => p.code === code);
}

/** Comissão recorrente gerada quando aluno mantém SHUB LIFE PREMIUM */
export function calculateCommission(monthlyPrice: number): number {
  return Math.round(monthlyPrice * COMMISSION_RATE * 100) / 100;
}

export interface WalletState {
  balance: number;
  pending: number;
  totalEarned: number;
}

export interface DiscountResult {
  applied: number;
  remainingFee: number;
  newBalance: number;
}

/** Abate automaticamente a mensalidade do personal usando saldo da carteira */
export function applyMonthlyDiscount(wallet: WalletState, monthlyFee: number): DiscountResult {
  const applied = Math.min(wallet.balance, monthlyFee);
  return {
    applied,
    remainingFee: Math.max(0, monthlyFee - applied),
    newBalance: wallet.balance - applied,
  };
}
