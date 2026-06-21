import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export const Route = createFileRoute("/inf/indicacoes")({
  component: InfReferrals,
});

function InfReferrals() {
  const { user } = useCurrentUser();
  const { data, isLoading } = useQuery({
    queryKey: ["inf-referrals", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const inf = await supabase
        .from("influencers")
        .select("id")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (!inf.data) return [];
      const { data } = await supabase
        .from("influencer_referrals")
        .select("id, status, created_at, referred_user_id")
        .eq("influencer_id", (inf.data as { id: string }).id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  if (isLoading) return <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Indicações</h1>
        <p className="mt-1 text-sm text-muted-foreground">Pessoas que entraram pelo seu link.</p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-surface-elevated/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3">Usuário</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Entrada</th></tr>
          </thead>
          <tbody>
            {(data ?? []).map((r) => {
              const row = r as { id: string; status: string; created_at: string; referred_user_id: string };
              return (
                <tr key={row.id} className="border-t border-border">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{row.referred_user_id.slice(0, 8)}…</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${row.status === "active" ? "bg-neon/10 text-neon" : row.status === "canceled" ? "bg-red-500/10 text-red-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(row.created_at).toLocaleDateString("pt-BR")}</td>
                </tr>
              );
            })}
            {(data ?? []).length === 0 && (
              <tr><td colSpan={3} className="px-4 py-10 text-center text-muted-foreground">Nenhuma indicação ainda. Divulgue seu link!</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
