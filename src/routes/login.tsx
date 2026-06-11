import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Bem-vindo de volta!");
        navigate({ to: "/app" });
      }
    } catch (error) {
      toast.error("Erro ao realizar login");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin + "/app",
      });

      if (result.error) {
        toast.error(result.error.message);
      }
    } catch (error) {
      toast.error("Erro ao conectar");
    }
  };

  return (
    <div className="relative min-h-screen bg-background px-6 pb-10 pt-14">
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "var(--gradient-radial-neon)" }} />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl border border-neon/40 bg-surface-elevated">
            <span className="font-display font-bold text-neon">S</span>
          </div>
          <span className="font-display text-sm font-semibold tracking-widest">SHUB LIFE</span>
        </div>

        <div className="mt-10 fade-up">
          <h1 className="font-display text-3xl font-bold leading-tight">Bem-vindo de volta</h1>
          <p className="mt-2 text-sm text-muted-foreground">Continue sua evolução de onde parou.</p>
        </div>

        <form className="mt-10 space-y-4" onSubmit={handleLogin}>
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex justify-end">
            <button type="button" className="text-xs text-neon">Esqueci minha senha</button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-neon py-4 text-sm font-semibold text-neon-foreground glow-neon active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
          </button>
        </form>

        <div className="my-8 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          ou continuar com
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <SocialBtn label="Apple" onClick={() => handleOAuth("apple")} />
          <SocialBtn label="Google" onClick={() => handleOAuth("google")} />
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Novo aqui?{" "}
          <Link to="/cadastro" className="font-semibold text-neon">Criar conta</Link>
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

function SocialBtn({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-border bg-surface py-3 text-sm font-medium transition active:scale-95 hover:border-neon/40"
    >
      {label}
    </button>
  );
}
