import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ArrowLeft, Loader2, UserPlus } from "lucide-react";
import { adminCreateUser, type NewUserRole } from "@/lib/admin/users.functions";
import { shubToast } from "@/components/shub/toast";

export const Route = createFileRoute("/admin/usuarios/novo")({
  component: NewUserPage,
});

function NewUserPage() {
  const navigate = useNavigate();
  const createUser = useServerFn(adminCreateUser);
  const [form, setForm] = useState({
    email: "",
    password: "",
    nickname: "",
    role: "student" as NewUserRole,
    trialDays: 0,
    skipFinancial: true,
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUser({
        data: {
          email: form.email,
          password: form.password,
          nickname: form.nickname,
          role: form.role,
          trialDays: form.skipFinancial ? form.trialDays : 0,
        },
      });
      shubToast.success("Usuário criado");
      navigate({ to: "/admin/usuarios" });
    } catch (err) {
      shubToast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Link to="/admin/usuarios" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Voltar para usuários
      </Link>

      <header>
        <h1 className="font-display text-3xl font-bold">Novo usuário</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Crie um acesso sem passar pelo fluxo financeiro. Opcionalmente libere um período gratuito.
        </p>
      </header>

      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-surface p-5">
        <Field label="E-mail">
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input"
          />
        </Field>

        <Field label="Senha temporária (6+ caracteres)">
          <input
            type="text"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input"
          />
        </Field>

        <Field label="Nickname">
          <input
            required
            value={form.nickname}
            onChange={(e) => setForm({ ...form, nickname: e.target.value })}
            className="input"
          />
        </Field>

        <Field label="Papel">
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as NewUserRole })}
            className="input"
          >
            <option value="student">Aluno</option>
            <option value="personal">Profissional</option>
            <option value="influencer">Influenciador</option>
            <option value="admin">Admin</option>
          </select>
        </Field>

        <div className="rounded-xl border border-border bg-surface-elevated/40 p-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.skipFinancial}
              onChange={(e) => setForm({ ...form, skipFinancial: e.target.checked })}
            />
            Liberar acesso sem passar pelo financeiro
          </label>
          {form.skipFinancial && (
            <div className="mt-3">
              <label className="text-xs uppercase tracking-wider text-muted-foreground">
                Período liberado (dias)
              </label>
              <input
                type="number"
                min={0}
                max={3650}
                value={form.trialDays}
                onChange={(e) => setForm({ ...form, trialDays: Number(e.target.value) })}
                className="input mt-1"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                0 = sem assinatura criada. Ex.: 30 = libera por 30 dias.
              </p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-neon px-4 py-3 text-sm font-bold text-neon-foreground glow-neon active:scale-95 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          Criar usuário
        </button>
      </form>

      <style>{`.input{width:100%;border-radius:0.75rem;border:1px solid hsl(var(--border));background:hsl(var(--surface-elevated));padding:0.6rem 0.85rem;font-size:0.875rem;outline:none}.input:focus{border-color:hsl(var(--neon))}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
