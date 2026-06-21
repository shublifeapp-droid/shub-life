import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, User, Dumbbell } from "lucide-react";
import { Logo } from "@/components/shub/Logo";
import { routeAfterLogin } from "@/lib/shub/routeAfterLogin";
import { readRefCode, clearRefCode } from "@/lib/shub/referral";

export const Route = createFileRoute("/cadastro")({
  component: Cadastro,
});

type Role = "student" | "personal";

function Cadastro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("student");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/app`,
          data: {
            full_name: name,
            nickname: name.split(" ")[0],
            desired_role: role,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      // Link referral if the user landed here via /r/:code
      const ref = readRefCode();
      if (ref && data.user) {
        const { data: inf } = await supabase
          .from("influencers")
          .select("id")
          .eq("code", ref.toUpperCase())
          .maybeSingle();
        if (inf) {
          await supabase.from("influencer_referrals").insert({
            influencer_id: (inf as { id: string }).id,
            referred_user_id: data.user.id,
            status: "pending",
          });
        }
        clearRefCode();
      }

      if (data.session) {
        toast.success("Conta criada!");
        const dest = await routeAfterLogin();
        navigate({ to: dest });
      } else {
        toast.success("Conta criada! Verifique seu e-mail.");
        navigate({ to: "/login" });
      }
    } catch {
      toast.error("Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background px-6 pb-10 pt-14">
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "var(--gradient-radial-neon)" }} />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <Link to="/onboarding" className="text-xs text-muted-foreground">← Voltar</Link>
          <Logo className="h-8 w-auto" />
        </div>

        <div className="mt-8 fade-up">
          <h1 className="font-display text-3xl font-bold leading-tight">Crie sua conta</h1>
          <p className="mt-2 text-sm text-muted-foreground">Comece sua jornada SHUB LIFE.</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl border border-border bg-surface p-1">
          <RoleTab active={role === "student"} onClick={() => setRole("student")} icon={User} label="Sou Aluno" />
          <RoleTab active={role === "personal"} onClick={() => setRole("personal")} icon={Dumbbell} label="Sou Profissional" />
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSignup}>
          <Field
            label="Nome completo"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Field
            label="E-mail"
            type="email"
            placeholder="voce@shub.life"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Field
            label="Senha"
            type="password"
            placeholder="Crie uma senha forte"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label className="flex items-start gap-3 pt-2 text-xs text-muted-foreground">
            <input type="checkbox" className="mt-0.5 accent-[var(--neon)]" required defaultChecked />
            <span>Aceito os termos de uso e a política de privacidade da SHUB LIFE.</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-neon py-4 text-sm font-semibold text-neon-foreground glow-neon active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar conta"}
          </button>
        </form>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Já tem conta?{" "}
          <Link to="/login" className="font-semibold text-neon">Entrar</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        {...props}
        className="w-full rounded-2xl border border-border bg-surface px-4 py-4 text-sm outline-none transition focus:border-neon focus:ring-2 focus:ring-neon/30"
      />
    </label>
  );
}

function RoleTab({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: React.ElementType; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition ${
        active ? "bg-neon text-neon-foreground glow-neon" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
