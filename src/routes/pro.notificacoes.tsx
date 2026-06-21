import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { EmptyState } from "@/components/shub/EmptyState";

export const Route = createFileRoute("/pro/notificacoes")({
  component: ProNotifications,
});

function ProNotifications() {
  const { user } = useCurrentUser();
  const { data, isLoading } = useQuery({
    queryKey: ["pro-notifications", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("partner_notifications")
        .select("*")
        .eq("partner_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(100);
      return data ?? [];
    },
  });

  if (isLoading) return <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-3xl font-bold">Notificações</h1>
        <p className="mt-1 text-sm text-muted-foreground">Atualizações sobre seus alunos e comissões.</p>
      </header>

      {!data || data.length === 0 ? (
        <EmptyState icon={Bell} title="Sem notificações" description="Você está em dia." />
      ) : (
        <ul className="space-y-2">
          {data.map((n) => {
            const row = n as { id: string; title: string; message: string; created_at: string };
            return (
              <li key={row.id} className="rounded-2xl border border-border bg-surface px-4 py-3">
                <p className="font-semibold text-sm">{row.title}</p>
                <p className="text-xs text-muted-foreground">{row.message}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{new Date(row.created_at).toLocaleString("pt-BR")}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
