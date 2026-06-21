import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Plus, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { shubToast } from "@/components/shub/toast";
import { generateInfluencerCode } from "@/lib/shub/referral";

export const Route = createFileRoute("/admin/influenciadores")({
  component: AdminInfluencers,
});

interface Profile { id: string; nickname: string | null }
interface Influencer {
  id: string;
  user_id: string;
  code: string;
  display_name: string | null;
  commission_rate: number;
  status: string;
  total_earned: number;
  current_balance: number;
}

function AdminInfluencers() {
  const qc = useQueryClient();
  const [selectedUser, setSelectedUser] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [rate, setRate] = useState(0.20);

  const profiles = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("id, nickname").order("nickname");
      return (data ?? []) as Profile[];
    },
  });

  const list = useQuery({
    queryKey: ["admin-influencers"],
    queryFn: async () => {
      const { data } = await supabase
        .from("influencers")
        .select("*")
        .order("created_at", { ascending: false });
      return (data ?? []) as Influencer[];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      if (!selectedUser) throw new Error("Selecione um usuário");
      const seed = displayName || selectedUser;
      const code = generateInfluencerCode(seed);
      const { error: insErr } = await supabase.from("influencers").insert({
        user_id: selectedUser,
        display_name: displayName || null,
        code,
        commission_rate: rate,
      });
      if (insErr) throw insErr;
      const { error: roleErr } = await supabase
        .from("user_roles")
        .insert({ user_id: selectedUser, role: "influencer" });
      if (roleErr && !roleErr.message.includes("duplicate")) throw roleErr;
    },
    onSuccess: () => {
      shubToast.success("Influenciador criado");
      setSelectedUser(""); setDisplayName(""); setRate(0.20);
      qc.invalidateQueries({ queryKey: ["admin-influencers"] });
    },
    onError: (e) => shubToast.error((e as Error).message),
  });

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Influenciadores</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gere links personalizados com comissão recorrente.</p>
      </header>

      <section className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="font-display text-lg font-semibold">Novo influenciador</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Usuário</span>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-neon"
            >
              <option value="">Selecione…</option>
              {(profiles.data ?? []).map((p) => (
                <option key={p.id} value={p.id}>{p.nickname || p.id.slice(0, 8)}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Nome público</span>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Ex: @fulano"
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-neon"
            />
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Comissão (0-1)</span>
            <input
              type="number" step="0.01" min={0} max={1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-neon"
            />
          </label>
        </div>
        <button
          onClick={() => create.mutate()}
          disabled={create.isPending}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-neon px-5 py-2.5 text-sm font-semibold text-neon-foreground glow-neon disabled:opacity-50"
        >
          {create.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Criar
        </button>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Ativos</h2>
        {list.isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <table className="w-full text-sm">
              <thead className="bg-surface-elevated/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Comissão</th>
                  <th className="px-4 py-3">Total ganho</th>
                  <th className="px-4 py-3">Link</th>
                </tr>
              </thead>
              <tbody>
                {(list.data ?? []).map((i) => {
                  const link = `${origin}/r/${i.code}`;
                  return (
                    <tr key={i.id} className="border-t border-border">
                      <td className="px-4 py-3">{i.display_name || i.user_id.slice(0, 8)}</td>
                      <td className="px-4 py-3 font-mono text-xs">{i.code}</td>
                      <td className="px-4 py-3">{(Number(i.commission_rate) * 100).toFixed(0)}%</td>
                      <td className="px-4 py-3">R$ {Number(i.total_earned).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => { navigator.clipboard.writeText(link); shubToast.success("Copiado"); }}
                          className="inline-flex items-center gap-1 rounded-full border border-neon/40 px-3 py-1 text-xs text-neon"
                        >
                          <Copy className="h-3 w-3" /> Copiar
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {(list.data ?? []).length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">Nenhum influenciador cadastrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
