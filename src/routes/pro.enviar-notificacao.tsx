import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { shubToast } from "@/components/shub/toast";

export const Route = createFileRoute("/pro/enviar-notificacao")({
  component: SendNotification,
});

function SendNotification() {
  const { user } = useCurrentUser();
  const [target, setTarget] = useState<"all" | string>("all");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const { data: students, isLoading } = useQuery({
    queryKey: ["pro-students-min", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: rels } = await supabase
        .from("personal_students")
        .select("student_id")
        .eq("personal_id", user!.id)
        .eq("status", "active");
      const ids = (rels ?? []).map((r) => (r as { student_id: string }).student_id);
      if (ids.length === 0) return [];
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, nickname")
        .in("id", ids);
      return (profs ?? []) as Array<{ id: string; nickname: string | null }>;
    },
  });

  const send = useMutation({
    mutationFn: async () => {
      if (!title.trim() || !message.trim()) throw new Error("Preencha título e mensagem");
      const ids = target === "all" ? (students ?? []).map((s) => s.id) : [target];
      if (ids.length === 0) throw new Error("Nenhum aluno destinatário");
      const rows = ids.map((uid) => ({
        user_id: uid,
        title: title.trim(),
        message: message.trim(),
        type: "personal_message",
        is_read: false,
      }));
      const { error } = await supabase.from("notifications").insert(rows);
      if (error) throw error;
      return ids.length;
    },
    onSuccess: (n) => {
      shubToast.success(`Notificação enviada para ${n} aluno(s)`);
      setTitle("");
      setMessage("");
    },
    onError: (e: Error) => shubToast.error("Erro ao enviar", e.message),
  });

  return (
    <div className="max-w-2xl space-y-5">
      <header>
        <h1 className="font-display text-3xl font-bold">Enviar notificação</h1>
        <p className="mt-1 text-sm text-muted-foreground">Envie um aviso para um aluno ou para todos.</p>
      </header>

      <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground">Destinatário</label>
          {isLoading ? (
            <Loader2 className="mt-2 h-4 w-4 animate-spin" />
          ) : (
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="all">Todos os alunos ({students?.length ?? 0})</option>
              {(students ?? []).map((s) => (
                <option key={s.id} value={s.id}>{s.nickname ?? "Aluno"}</option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground">Título</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
            placeholder="Ex.: Lembrete de treino"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground">Mensagem</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
            rows={4}
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
            placeholder="Escreva a mensagem..."
          />
        </div>

        <button
          onClick={() => send.mutate()}
          disabled={send.isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-neon px-5 py-2.5 text-sm font-semibold text-neon-foreground disabled:opacity-50"
        >
          {send.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Enviar
        </button>
      </div>
    </div>
  );
}
