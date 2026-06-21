import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, FileText, Plus, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { EmptyState } from "@/components/shub/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/pro/contratos")({ component: ProContracts });

const CONTRACT_TEMPLATE = `CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE PERSONAL TRAINER

Pelo presente instrumento, as partes acordam:

1. OBJETO: Prestação de serviços de treinamento físico personalizado.
2. PRAZO: O contrato vigorará a partir da data de assinatura.
3. VALOR: Mensalidade conforme valor pactuado, com vencimento no mesmo dia de cada mês.
4. OBRIGAÇÕES DO PROFISSIONAL: Prescrever treinos, acompanhar evolução e ajustar planos.
5. OBRIGAÇÕES DO ALUNO: Cumprir o plano, comparecer aos horários combinados e efetuar pagamento em dia.
6. RESCISÃO: Qualquer das partes pode rescindir mediante aviso prévio de 30 dias.

Local e data: ____________________
Assinatura do Profissional: ____________________
Assinatura do Aluno: ____________________`;

function ProContracts() {
  const { user } = useCurrentUser();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [form, setForm] = useState({ student_id: "", title: "Contrato de Personal Trainer", content: CONTRACT_TEMPLATE, monthly_amount: "200", end_date: "" });

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
    queryKey: ["pro-contracts", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("personal_contracts").select("*").eq("personal_id", user!.id).order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Array<{ id: string; student_id: string; title: string; monthly_amount: number; status: string; start_date: string; end_date: string | null }>;
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      if (!form.student_id) throw new Error("Selecione um aluno");
      const { error } = await (supabase as any).from("personal_contracts").insert({
        personal_id: user!.id,
        student_id: form.student_id,
        title: form.title,
        content: form.content,
        monthly_amount: Number(form.monthly_amount) || 0,
        end_date: form.end_date || null,
        status: "active",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Contrato gerado");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["pro-contracts", user?.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const studentName = (id: string) => studentsQ.data?.find((s) => s.id === id)?.nickname ?? "Aluno";

  const copyContent = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    toast.success("Contrato copiado");
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Contratos</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gere contratos digitais com seus alunos.</p>
        </div>
        <Button onClick={() => setOpen((v) => !v)} className="gap-2"><Plus className="h-4 w-4" /> Novo</Button>
      </header>

      {open && (
        <div className="space-y-3 rounded-2xl border border-border bg-surface p-5">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label>Aluno</Label>
              <select value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm">
                <option value="">Selecione…</option>
                {studentsQ.data?.map((s) => <option key={s.id} value={s.id}>{s.nickname ?? s.id.slice(0, 6)}</option>)}
              </select>
            </div>
            <div>
              <Label>Mensalidade (R$)</Label>
              <Input type="number" value={form.monthly_amount} onChange={(e) => setForm({ ...form, monthly_amount: e.target.value })} />
            </div>
            <div>
              <Label>Título</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label>Encerramento (opcional)</Label>
              <Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Texto do contrato</Label>
            <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="min-h-[220px] font-mono text-xs" />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={() => create.mutate()} disabled={create.isPending}>
              {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Gerar contrato
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>
      ) : !data || data.length === 0 ? (
        <EmptyState icon={FileText} title="Nenhum contrato" description="Gere o primeiro contrato com um aluno." />
      ) : (
        <ul className="space-y-2">
          {data.map((c) => (
            <li key={c.id} className="rounded-2xl border border-border bg-surface px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{studentName(c.student_id)} · R$ {Number(c.monthly_amount).toFixed(2)}/mês · {c.status}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => copyContent((c as any).content ?? "", c.id)} className="gap-1">
                  {copied === c.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} Copiar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
