import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Shield, User as UserIcon, Dumbbell } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { shubToast } from "@/components/shub/toast";

export const Route = createFileRoute("/admin/usuarios")({
  component: AdminUsers,
});

interface ProfileRow {
  id: string;
  nickname: string | null;
  shub_score: number | null;
  created_at: string;
}
interface RoleRow {
  user_id: string;
  role: "student" | "personal" | "admin";
}

function AdminUsers() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const [profiles, roles] = await Promise.all([
        supabase.from("profiles").select("id, nickname, shub_score, created_at").order("created_at", { ascending: false }).limit(500),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      if (profiles.error) throw profiles.error;
      if (roles.error) throw roles.error;
      const map = new Map<string, RoleRow["role"][]>();
      (roles.data as RoleRow[]).forEach((r) => {
        const cur = map.get(r.user_id) ?? [];
        cur.push(r.role);
        map.set(r.user_id, cur);
      });
      return (profiles.data as ProfileRow[]).map((p) => ({ ...p, roles: map.get(p.id) ?? [] }));
    },
  });

  const toggleRole = useMutation({
    mutationFn: async ({ userId, role, has }: { userId: string; role: RoleRow["role"]; has: boolean }) => {
      if (has) {
        const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      shubToast.success("Permissões atualizadas");
    },
    onError: (e) => shubToast.error((e as Error).message),
  });

  const filtered = (data ?? []).filter((u) =>
    !search || (u.nickname ?? "").toLowerCase().includes(search.toLowerCase()) || u.id.includes(search),
  );

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-3xl font-bold">Usuários</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gerencie papéis e permissões.</p>
      </header>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por nickname ou ID"
        className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-neon"
      />

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead className="bg-surface-elevated/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Usuário</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Papéis</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <p className="font-medium">{u.nickname ?? "Sem nickname"}</p>
                    <p className="text-[10px] text-muted-foreground">{u.id.slice(0, 8)}…</p>
                  </td>
                  <td className="px-4 py-3 font-display">{u.shub_score ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {(["student", "personal", "admin"] as const).map((role) => {
                        const has = u.roles.includes(role);
                        const Icon = role === "admin" ? Shield : role === "personal" ? Dumbbell : UserIcon;
                        return (
                          <button
                            key={role}
                            onClick={() => toggleRole.mutate({ userId: u.id, role, has })}
                            disabled={toggleRole.isPending}
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition ${
                              has
                                ? "border-neon bg-neon/10 text-neon"
                                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                            }`}
                          >
                            <Icon className="h-3 w-3" /> {role}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-sm text-muted-foreground">Nenhum usuário encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
