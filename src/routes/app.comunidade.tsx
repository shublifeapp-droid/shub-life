import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { 
  Zap, DollarSign, Wallet, Users, ArrowRight, CheckCircle2, 
  ChevronRight, Star, ShieldCheck, TrendingUp
} from "lucide-react";
import { toast } from "sonner";


export const Route = createFileRoute("/app/comunidade")({
  component: AffiliateLanding,
});

function AffiliateLanding() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-background pb-28 pt-12 px-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none opacity-20">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-neon blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-[-50px] w-[300px] h-[300px] bg-neon/30 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <header className="fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-neon/30 bg-neon/10 px-3 py-1 mb-4">
            <Zap className="h-3 w-3 text-neon fill-neon" />
            <span className="text-[10px] font-bold text-neon uppercase tracking-[0.2em]">Partner Program</span>
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight">
            Ganhe recorrência com a <span className="text-neon">evolução</span> dos seus alunos.
          </h1>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            O SHUB LIFE recompensa profissionais que ajudam alunos a evoluírem diariamente através de performance humana de elite.
          </p>
        </header>

        {/* Value Props */}
        <div className="mt-12 space-y-6">
          <BenefitCard 
            icon={TrendingUp}
            title="10% de Comissão Recorrente"
            desc="Receba mensalmente sobre cada assinatura ativa de seus alunos indicados."
          />
          <BenefitCard 
            icon={ShieldCheck}
            title="Vínculo Vitalício"
            desc="O aluno permanece vinculado ao seu código, mesmo que pare de treinar presencialmente."
          />
          <BenefitCard 
            icon={Wallet}
            title="Abatimento Automático"
            desc="Use seus ganhos para zerar sua própria mensalidade PRO de forma automática."
          />
        </div>

        {/* How it works */}
        <section className="mt-16 fade-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="font-display text-xl font-bold mb-8 text-center uppercase tracking-widest text-muted-foreground opacity-60">Como Funciona</h2>
          <div className="space-y-12">
            <Step num="01" title="Indique seus alunos" desc="Compartilhe seu link exclusivo ou código personalizado com seus alunos e seguidores." />
            <Step num="02" title="Eles assinam o Premium" desc="Quando um aluno se torna Premium, você começa a gerar saldo na sua carteira digital." />
            <Step num="03" title="Receba ou abata" desc="Receba mensalmente ou use o saldo para pagar seu próprio plano SHUB LIFE PRO." />
          </div>
        </section>

        {/* Call to Action */}
        <div className="mt-20 fade-up" style={{ animationDelay: "0.4s" }}>
          <div className="rounded-[32px] border border-neon/40 bg-surface p-8 text-center glow-neon-soft">
            <h3 className="font-display text-2xl font-bold mb-2">Pronto para começar?</h3>
            <p className="text-xs text-muted-foreground mb-8">Torne-se um parceiro SHUB LIFE e monetize sua influência no esporte.</p>
            
            <button 
              onClick={() => {
                toast.success("Inscrição enviada para análise!");
                navigate({ to: "/app/perfil" });
              }}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-neon py-4 text-sm font-bold text-neon-foreground glow-neon active:scale-95 transition"
            >
              Começar agora <ArrowRight className="h-4 w-4" />
            </button>
            <p className="mt-4 text-[10px] text-muted-foreground">Sujeito a análise de perfil profissional</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BenefitCard({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="flex gap-4 p-5 rounded-3xl border border-border bg-surface-elevated/50 backdrop-blur-sm fade-up">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-neon/10 text-neon border border-neon/20">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h4 className="font-bold text-sm mb-1">{title}</h4>
        <p className="text-[11px] text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function Step({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="relative pl-12">
      <div className="absolute left-0 top-0 font-display text-4xl font-bold text-neon/20">{num}</div>
      <h4 className="font-bold text-base mb-2">{title}</h4>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
