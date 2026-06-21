import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell, Trophy, Flame, MessageCircle, Sparkles, Loader2 } from "lucide-react";
import type { ComponentType } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { EmptyState } from "@/components/shub/EmptyState";

export const Route = createFileRoute("/app/notificacoes")({
  component: NotificacoesPage,
});

interface NotificationRow {
  id: string;
  type: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  achievement: Trophy,
  streak: Flame,
  comment: MessageCircle,
  news: Sparkles,
  reminder: Bell,
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "agora";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return d === 1 ? "ontem" : `${d}d`;
}

function NotificacoesPage() {
  const { user } = useCurrentUser();
  const { data, isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async (): Promise<NotificationRow[]> => {
      const { data, error } = await supabase
        .from("notifications")
        .select("id, type, title, message, created_at, is_read")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  return (
    <div className="px-5 pt-12 pb-10">
      <header className="fade-up">
        <p className="text-[10px] uppercase tracking-[0.3em] text-neon">NOTIFICAÇÕES</p>
        <h1 className="mt-1 font-display text-3xl font-bold">Sua central</h1>
      </header>

      {isLoading ? (
        <div className="mt-10 flex justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : !data || data.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={Bell}
            title="Sem notificações por aqui"
            description="Quando você conquistar medalhas, fechar streaks ou receber interações, tudo aparece aqui."
          />
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {data.map((it) => {
            const Icon = ICONS[it.type] ?? Bell;
            const isNew = !it.is_read;
            return (
              <div
                key={it.id}
                className={`card-premium flex items-start gap-3 p-4 fade-up ${isNew ? "ring-neon" : ""}`}
              >
                <div
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${
                    isNew ? "bg-neon text-neon-foreground" : "bg-neon/10 text-neon"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{it.title}</p>
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {timeAgo(it.created_at)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{it.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
