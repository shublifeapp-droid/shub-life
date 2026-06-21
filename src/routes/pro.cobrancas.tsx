import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Receipt, Plus, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { EmptyState } from "@/components/shub/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/pro/cobrancas")({ component: ProBilling });

function ProBilling() {
  const { user } = useCurrentUser();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ student_id: "", amount: "", due_date: "", recurrence: "monthly", notes: "" });

  const studentsQ = useQuery({
    queryKey: ["pro-students-list", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: rels } = await supabase.from("personal_students").select("student_id").eq("personal_id", user!.id);
      const ids = (rels ?? []).map((r) => (r as { student_id: string }).student_id);
      if (!ids.length) return [];
      const { data: profs } = await supabase.from("profiles").select("id, nickname").in("id", ids);
      return (profs ?? []) as Array<{ id: string; nickname: string | null }>;
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["pro-reminders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("billing_reminders").select("*").eq("personal_id", user!.id).order("due_date", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Array<{ id: string; student_id: string; amount: number; due_date: string; status: string; recurrence: string; notes: string | null }>;
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      if (!form.student_id || !form.amount || !form.due_date) throw new Error("Preencha aluno, valor e vencimento");
      const { error } = await (supabase as any).from("billing_reminders").insert({
        personal_id: user!.id,
        student_id: form.student_id,
        amount: Number(form.amount),
        due_date: form.due_date,
        recurrence: form.recurrence,
        notes: form.notes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Lembrete de cobrança criado");
      setOpen(false);
      setForm({ student_id: "", amount: "", due_date: "", recurrence: "monthly", notes: "" });
      qc.invalidateQueries({ queryKey: ["pro-reminders", user?.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const markPaid = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("billing_reminders").update({ status: "paid", paid_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Marcado como pago"); qc.invalidateQueries({ queryKey: ["pro-reminders", user?.id] }); },
  });

  const studentName = (id: string) => studentsQ.data?.find((s) => s.id === id)?.nickname ?? "Aluno";

  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Cobranças</h1>
          <p className="mt-1 text-sm text-muted-foreground">Lembretes de mensalidade dos seus alunos.</p>
        </div>
        <Button onClick={() => setOpen((v) => !v)} className="gap-2"><Plus className="h-4 w-4" /> Nova cobrança</Button>
      </header>

      {open && (
        <div className="grid gap-3 rounded-2xl border border-border bg-surface p-5 md:grid-cols-2">
          <div>
            <Label>Aluno</Label>
            <select value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm">
              <option value="">Selecione…</option>
              {studentsQ.data?.map((s) => <option key={s.id} value={s.id}>{s.nickname ?? s.id.slice(0, 6)}</option>)}
            </select>
          </div>
          <div>
            <Label>Valor (R$)</Label>
            <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          </div>
          <div>
            <Label>Vencimento</Label>
            <Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
          </div>
          <div>
            <Label>Recorrência</Label>
            <select value={form.recurrence} onChange={(e) => setForm({ ...form, recurrence: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm">
              <option value="monthly">Mensal</option>
              <option value="once">Única</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <Label>Observações</Label>
            <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="md:col-span-2 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={() => create.mutate()} disabled={create.isPending}>
              {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Criar lembrete
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>
      ) : !data || data.length === 0 ? (
        <EmptyState icon={Receipt} title="Sem cobranças" description="Crie lembretes para nunca esquecer uma mensalidade." />
      ) : (
        <ul className="space-y-2">
          {data.map((r) => {
            const overdue = r.status === "pending" && new Date(r.due_date) < new Date();
            return (
              <li key={r.id} className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3">
                <div>
                  <p className="font-medium">{studentName(r.student_id)} — R$ {Number(r.amount).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">
                    Vence em {new Date(r.due_date).toLocaleDateString("pt-BR")} · {r.recurrence === "monthly" ? "mensal" : "única"} ·{" "}
                    <span className={overdue ? "text-destructive" : ""}>{overdue ? "atrasado" : r.status}</span>
                  </p>
                </div>
                {r.status !== "paid" && (
                  <Button size="sm" variant="outline" onClick={() => markPaid.mutate(r.id)} className="gap-1">
                    <Check className="h-3 w-3" /> Pago
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
