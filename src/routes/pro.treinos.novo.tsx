import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/pro/treinos/novo")({ component: NewWorkout });

type Exercise = { name: string; sets: number; reps: string; rest_seconds: number; notes?: string };

function NewWorkout() {
  const { user } = useCurrentUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    student_id: "",
    title: "",
    description: "",
    category: "musculacao",
    difficulty: "intermediario",
    duration_minutes: 60,
  });
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: "", sets: 3, reps: "10-12", rest_seconds: 60, notes: "" },
  ]);

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

  const updateEx = (i: number, patch: Partial<Exercise>) =>
    setExercises((arr) => arr.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));

  const create = useMutation({
    mutationFn: async () => {
      if (!form.student_id) throw new Error("Selecione um aluno");
      if (!form.title) throw new Error("Informe o título");
      const valid = exercises.filter((e) => e.name.trim());
      if (!valid.length) throw new Error("Adicione ao menos um exercício");
      const { error } = await supabase.from("workouts").insert({
        personal_id: user!.id,
        student_id: form.student_id,
        title: form.title,
        description: form.description || null,
        category: form.category,
        difficulty: form.difficulty,
        duration_minutes: form.duration_minutes,
        exercises: valid as unknown as never,
        is_active: true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Treino personalizado criado");
      navigate({ to: "/pro/treinos" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Novo treino personalizado</h1>
        <p className="mt-1 text-sm text-muted-foreground">Prescreva um treino sob medida para o aluno.</p>
      </header>

      <section className="grid gap-3 rounded-2xl border border-border bg-surface p-5 md:grid-cols-2">
        <div>
          <Label>Aluno</Label>
          <select value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm">
            <option value="">Selecione…</option>
            {studentsQ.data?.map((s) => <option key={s.id} value={s.id}>{s.nickname ?? s.id.slice(0, 6)}</option>)}
          </select>
        </div>
        <div>
          <Label>Título</Label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Treino A — Peito e Tríceps" />
        </div>
        <div>
          <Label>Categoria</Label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm">
            <option value="musculacao">Musculação</option>
            <option value="funcional">Funcional</option>
            <option value="cardio">Cardio</option>
            <option value="mobilidade">Mobilidade</option>
          </select>
        </div>
        <div>
          <Label>Dificuldade</Label>
          <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm">
            <option value="iniciante">Iniciante</option>
            <option value="intermediario">Intermediário</option>
            <option value="avancado">Avançado</option>
          </select>
        </div>
        <div>
          <Label>Duração (min)</Label>
          <Input type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: Number(e.target.value) })} />
        </div>
        <div className="md:col-span-2">
          <Label>Descrição</Label>
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Exercícios</h2>
          <Button size="sm" variant="outline" onClick={() => setExercises((a) => [...a, { name: "", sets: 3, reps: "10-12", rest_seconds: 60, notes: "" }])} className="gap-1">
            <Plus className="h-3 w-3" /> Adicionar
          </Button>
        </div>
        {exercises.map((ex, i) => (
          <div key={i} className="grid gap-2 rounded-2xl border border-border bg-surface p-4 md:grid-cols-12">
            <div className="md:col-span-4">
              <Label className="text-xs">Exercício</Label>
              <Input value={ex.name} onChange={(e) => updateEx(i, { name: e.target.value })} placeholder="Supino reto" />
            </div>
            <div className="md:col-span-1">
              <Label className="text-xs">Séries</Label>
              <Input type="number" value={ex.sets} onChange={(e) => updateEx(i, { sets: Number(e.target.value) })} />
            </div>
            <div className="md:col-span-2">
              <Label className="text-xs">Reps</Label>
              <Input value={ex.reps} onChange={(e) => updateEx(i, { reps: e.target.value })} placeholder="10-12" />
            </div>
            <div className="md:col-span-2">
              <Label className="text-xs">Descanso (s)</Label>
              <Input type="number" value={ex.rest_seconds} onChange={(e) => updateEx(i, { rest_seconds: Number(e.target.value) })} />
            </div>
            <div className="md:col-span-2">
              <Label className="text-xs">Observação</Label>
              <Input value={ex.notes ?? ""} onChange={(e) => updateEx(i, { notes: e.target.value })} />
            </div>
            <div className="md:col-span-1 flex items-end">
              <Button size="icon" variant="ghost" onClick={() => setExercises((a) => a.filter((_, idx) => idx !== i))}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </section>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate({ to: "/pro/treinos" })}>Cancelar</Button>
        <Button onClick={() => create.mutate()} disabled={create.isPending}>
          {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Salvar treino
        </Button>
      </div>
    </div>
  );
}
