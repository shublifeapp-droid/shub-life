import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { shubToast } from "@/components/shub/toast";

export const Route = createFileRoute("/admin/notificacoes")({
  component: AdminNotifications,
});

function AdminNotifications() {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("system");

  const { data: recent } = useQuery({
    queryKey: ["admin-notifications-recent"],
    queryFn: async () => {
      const { data } = await supabase
        .from("notifications")
        .select("id, title, message, type, created_at")
        .order("created_at", { ascending: false })
        .limit(50);
      return data ?? [];
    },
  });

  const broadcast = useMutation({
    mutationFn: async () => {
      const { data: users, error: e1 } = await supabase.from("profiles").select("id");
      if (e1) throw e1;
      const rows = (users ?? []).map((u) => ({
        user_id: (u as { id: string }).id,
        title,
        message,
        type,
        is_read: false,
      }));
      if (rows.length === 0) return;
      const { error } = await supabase.from("notifications").insert(rows);
      if (error) throw error;
    },
    onSuccess: () => {
      shubToast.success("Notificação enviada");
      setTitle(""); setMessage("");
      qc.invalidateQueries({ queryKey: ["admin-notifications-recent"] });
    },
    onError: (e) => shubToast.error((e as Error).message),
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Notificações</h1>
        <p className="mt-1 text-sm text-muted-foreground">Envie um broadcast para todos os usuários.</p>
      </header>

      <section className="rounded-2xl border border-border bg-surface p-5 space-y-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-neon" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Mensagem" rows={4} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-neon" />
        <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-neon">
          <option value="system">Sistema</option>
          <option value="promo">Promoção</option>
          <option value="achievement">Conquista</option>
        </select>
        <button
          onClick={() => broadcast.mutate()}
          disabled={!title || !message || broadcast.isPending}
          className="inline-flex items-center gap-2 rounded-full bg-neon px-5 py-2.5 text-sm font-semibold text-neon-foreground glow-neon disabled:opacity-50"
        >
          {broadcast.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Enviar para todos
        </button>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Últimas enviadas</h2>
        <ul className="space-y-2">
          {(recent ?? []).map((n) => (
            <li key={(n as { id: string }).id} className="rounded-xl border border-border bg-surface px-4 py-3">
              <p className="font-semibold text-sm">{(n as { title: string }).title}</p>
              <p className="text-xs text-muted-foreground">{(n as { message: string }).message}</p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{new Date((n as { created_at: string }).created_at).toLocaleString("pt-BR")}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
