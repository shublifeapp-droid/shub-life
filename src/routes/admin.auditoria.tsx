import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/auditoria")({
  component: AdminAudit,
});

function AdminAudit() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-audit"],
    queryFn: async () => {
      const { data } = await supabase
        .from("audit_logs")
        .select("id, action, entity, entity_id, user_id, created_at, metadata")
        .order("created_at", { ascending: false })
        .limit(200);
      return data ?? [];
    },
  });

  if (isLoading) return <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-3xl font-bold">Auditoria</h1>
        <p className="mt-1 text-sm text-muted-foreground">Eventos críticos do sistema.</p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-surface-elevated/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3">Ação</th><th className="px-4 py-3">Entidade</th><th className="px-4 py-3">Usuário</th><th className="px-4 py-3">Quando</th></tr>
          </thead>
          <tbody>
            {(data ?? []).map((r) => {
              const row = r as { id: string; action: string; entity: string; user_id: string | null; created_at: string };
              return (
                <tr key={row.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{row.action}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.entity}</td>
                  <td className="px-4 py-3 font-mono text-[11px]">{row.user_id?.slice(0, 8) ?? "—"}…</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(row.created_at).toLocaleString("pt-BR")}</td>
                </tr>
              );
            })}
            {(!data || data.length === 0) && (<tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">Sem eventos.</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
