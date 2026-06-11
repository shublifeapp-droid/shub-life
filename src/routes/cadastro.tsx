import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/cadastro")({
  component: Cadastro,
});

function Cadastro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            nickname: name.split(" ")[0],
          },
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        // If profile was created, we can update it (handled by trigger/initial insert usually)
        toast.success("Conta criada! Verifique seu e-mail.");
        navigate({ to: "/login" });
      }
    } catch (error) {
      toast.error("Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background px-6 pb-10 pt-14">
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "var(--gradient-radial-neon)" }} />

      <div className="relative z-10">
        <Link to="/onboarding" className="text-xs text-muted-foreground">← Voltar</Link>

        <div className="mt-8 fade-up">
          <h1 className="font-display text-3xl font-bold leading-tight">Crie sua conta</h1>
          <p className="mt-2 text-sm text-muted-foreground">Comece sua jornada SHUB LIFE.</p>
        </div>

        <form className="mt-10 space-y-4" onSubmit={handleSignup}>
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
