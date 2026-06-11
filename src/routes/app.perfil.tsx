import { Link, createFileRoute } from "@tanstack/react-router";
import { 
  DollarSign, Users, Award, ArrowUpRight, Copy, Share2, 
  Wallet, TrendingUp, ChevronRight, Zap, Target, Star
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/perfil")({
  component: PartnerDashboard,
});

function PartnerDashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "financeiro" | "ranking">("dashboard");

  return (
    <div className="relative min-h-screen pb-20 pt-10 px-5">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-neon/10 blur-3xl" />
      </div>

      <header className="relative flex items-center justify-between fade-up">
        <div>
          <h1 className="font-display text-2xl font-bold">Partner Hub</h1>
          <p className="text-xs text-muted-foreground mt-1">Evolua com seus alunos</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-neon/40 bg-neon/10 px-3 py-1.5">
          <Star className="h-3 w-3 text-neon fill-neon" />
          <span className="text-[10px] font-bold text-neon uppercase tracking-widest">Nível 3</span>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="mt-8 flex gap-2 overflow-x-auto pb-2 fade-up" style={{ animationDelay: "0.1s" }}>
        <Tab active={activeTab === "dashboard"} label="Dashboard" onClick={() => setActiveTab("dashboard")} />
        <Tab active={activeTab === "financeiro"} label="Financeiro" onClick={() => setActiveTab("financeiro")} />
        <Tab active={activeTab === "ranking"} label="Ranking" onClick={() => setActiveTab("ranking")} />
      </div>

      {activeTab === "dashboard" && <OverviewTab />}
      {activeTab === "financeiro" && <FinancialTab />}
      {activeTab === "ranking" && <RankingTab />}
      
      {/* Floating Action (Example) */}
      <div className="mt-10 mb-6 text-center opacity-50">
        <p className="text-[10px] tracking-[0.4em] uppercase">Shub Life Partner Program</p>
      </div>
    </div>
  );
}

function Tab({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-5 py-2 text-xs font-semibold transition-all ${
        active 
          ? "bg-neon text-neon-foreground glow-neon" 
          : "border border-border bg-surface-elevated text-muted-foreground"
      }`}
    >
      {label}
    </button>
  );
}

/* ─────────────────────────── DASHBOARD OVERVIEW ─────────────────────────── */

function OverviewTab() {
  return (
    <div className="mt-6 space-y-6 fade-up" style={{ animationDelay: "0.2s" }}>
      {/* Main Stats Card */}
      <div className="relative overflow-hidden rounded-[28px] border border-neon/25 bg-surface p-6 shadow-elevated">
        <div className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full bg-neon/20 blur-3xl" />
        
        <div className="relative">
          <p className="text-[10px] uppercase tracking-[0.3em] text-neon font-bold">Saldo Disponível</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h2 className="font-display text-4xl font-bold">R$ 1.240,00</h2>
            <span className="text-xs text-neon font-semibold">+R$ 420 este mês</span>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <MiniStat icon={Users} label="Alunos" value="48" sub="+3 hoje" />
            <MiniStat icon={Award} label="Recorrência" value="R$ 840" sub="Previsão mensal" />
          </div>

          <button className="mt-6 w-full rounded-2xl bg-neon py-4 text-sm font-bold text-neon-foreground glow-neon active:scale-95 transition">
            Usar saldo para mensalidade
          </button>
        </div>
      </div>

      {/* Share Section */}
      <div className="rounded-3xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Share2 className="h-4 w-4 text-neon" /> Indicação
          </h3>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Seu código: DOUGLAS10</span>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-surface-elevated p-3 border border-border">
          <p className="flex-1 text-[11px] font-mono truncate text-muted-foreground">shublife.app/ref/douglas10</p>
          <button 
            onClick={() => {
              navigator.clipboard.writeText("shublife.app/ref/douglas10");
              toast.success("Link copiado!");
            }}
            className="grid h-8 w-8 place-items-center rounded-xl bg-neon text-neon-foreground glow-neon"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Recent Students */}
      <div>
        <div className="flex items-center justify-between px-1 mb-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Últimos Alunos</h3>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="space-y-3">
          <StudentItem name="Ana Silva" plan="Premium" status="Ativo" />
          <StudentItem name="Roberto Costa" plan="Premium" status="Ativo" />
          <StudentItem name="Carla Souza" plan="Basic" status="Pendente" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── FINANCIAL TAB ─────────────────────────── */

function FinancialTab() {
  return (
    <div className="mt-6 space-y-6 fade-up">
      <div className="rounded-3xl border border-border bg-surface p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-neon/10 text-neon border border-neon/20">
            <Wallet className="h-5 w-5" />
          </div>
          <h3 className="font-bold">Sua Carteira</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Saldo Pendente (Aguardando)</span>
            <span className="font-bold">R$ 150,00</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Total Utilizado</span>
            <span className="font-bold text-neon">R$ 480,00</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-sm text-muted-foreground">Último Repasse</span>
            <span className="font-bold">12 Jun 2026</span>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-5">
        <h3 className="text-sm font-bold mb-4 uppercase tracking-widest text-muted-foreground px-1">Histórico de Transações</h3>
        <div className="space-y-4">
          <TransactionItem title="Comissão: Ana Silva" value="+R$ 14,90" date="Ontem" type="credit" />
          <TransactionItem title="Abatimento Mensalidade" value="-R$ 29,90" date="10 Jun" type="debit" />
          <TransactionItem title="Comissão: Roberto Costa" value="+R$ 14,90" date="08 Jun" type="credit" />
          <TransactionItem title="Bônus Nível 3" value="+R$ 50,00" date="05 Jun" type="credit" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── RANKING TAB ─────────────────────────── */

function RankingTab() {
  return (
    <div className="mt-6 space-y-6 fade-up">
      <div className="relative overflow-hidden rounded-3xl border border-neon/30 bg-surface p-6 text-center">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neon/5 to-transparent" />
        <Trophy className="h-12 w-12 text-neon mx-auto mb-4 float-soft" />
        <h3 className="font-display text-xl font-bold">Você está no Top 5%</h3>
        <p className="text-xs text-muted-foreground mt-2">Rank #14 entre todos os parceiros</p>
        
        <div className="mt-6 flex justify-center gap-8">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Retenção</p>
            <p className="text-lg font-bold text-neon">94%</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Conversão</p>
            <p className="text-lg font-bold text-neon">12%</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground px-1">Ranking de Parceiros</h3>
        {[
          { pos: 1, name: "Dr. Marcelo", score: "2.4k pts", color: "text-yellow-400" },
          { pos: 2, name: "Personal Jussara", score: "2.1k pts", color: "text-gray-300" },
          { pos: 3, name: "Coach Bruno", score: "1.9k pts", color: "text-amber-600" },
          { pos: 14, name: "Você", score: "1.2k pts", color: "text-neon", highlight: true },
        ].map((item) => (
          <div 
            key={item.pos} 
            className={`flex items-center gap-4 rounded-2xl p-4 transition ${
              item.highlight ? "bg-neon/10 border border-neon/40 glow-neon" : "bg-surface-elevated border border-border"
            }`}
          >
            <span className={`font-display font-bold w-6 ${item.color}`}>#{item.pos}</span>
            <div className="flex-1">
              <p className="text-sm font-bold">{item.name}</p>
              <p className="text-[10px] text-muted-foreground uppercase">{item.score}</p>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-1 w-4 rounded-full ${item.highlight && i <= 2 ? "bg-neon" : "bg-border"}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────── HELPER COMPONENTS ─────────────────────────── */

function MiniStat({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-elevated/60 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-3.5 w-3.5 text-neon" />
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">{label}</span>
      </div>
      <p className="font-display text-lg font-bold">{value}</p>
      <p className="text-[9px] text-neon/80 mt-1 font-medium">{sub}</p>
    </div>
  );
}

function StudentItem({ name, plan, status }: { name: string; plan: string; status: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface-elevated p-4">
      <div className="h-10 w-10 rounded-full border border-neon/30 bg-surface grid place-items-center text-xs font-bold text-neon">
        {name.substring(0, 2).toUpperCase()}
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold">{name}</p>
        <p className="text-[10px] text-muted-foreground">{plan} Member</p>
      </div>
      <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded-full ${
        status === "Ativo" ? "text-neon bg-neon/10 border border-neon/20" : "text-muted-foreground bg-surface border border-border"
      }`}>
        {status}
      </span>
    </div>
  );
}

function TransactionItem({ title, value, date, type }: { title: string; value: string; date: string; type: "credit" | "debit" }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <div className={`grid h-8 w-8 place-items-center rounded-lg ${
          type === "credit" ? "bg-neon/10 text-neon" : "bg-white/5 text-muted-foreground"
        }`}>
          {type === "credit" ? <ArrowUpRight className="h-4 w-4" /> : <TrendingUp className="h-4 w-4 rotate-180" />}
        </div>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-[10px] text-muted-foreground">{date}</p>
        </div>
      </div>
      <span className={`font-display text-sm font-bold ${type === "credit" ? "text-neon" : "text-white"}`}>
        {value}
      </span>
    </div>
  );
}

function Trophy(props: any) {
  return (
    <svg 
      {...props} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
