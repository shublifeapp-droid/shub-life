import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { shubToast } from "@/components/shub/toast";

export const Route = createFileRoute("/admin/configuracoes")({
  component: AdminSettings,
});

interface Settings {
  id: string;
  commission_percentage: number;
  student_premium_price: number;
  personal_pro_price: number;
  personal_premium_price: number;
}

function AdminSettings() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["app-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("app_settings").select("*").limit(1).maybeSingle();
      return data as Settings | null;
    },
  });

  const [form, setForm] = useState<Partial<Settings>>({});
  useEffect(() => { if (data) setForm(data); }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      if (!data) throw new Error("Configurações não inicializadas");
      const { error } = await supabase
        .from("app_settings")
        .update({
          commission_percentage: Number(form.commission_percentage),
          student_premium_price: Number(form.student_premium_price),
          personal_pro_price: Number(form.personal_pro_price),
          personal_premium_price: Number(form.personal_premium_price),
        })
        .eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: () => { shubToast.success("Salvo"); qc.invalidateQueries({ queryKey: ["app-settings"] }); },
    onError: (e) => shubToast.error((e as Error).message),
  });

  if (!data) return <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-xl">
      <header>
        <h1 className="font-display text-3xl font-bold">Configurações</h1>
        <p className="mt-1 text-sm text-muted-foreground">Preços e regras de negócio.</p>
      </header>

      <div className="space-y-3 rounded-2xl border border-border bg-surface p-5">
        <Field label="Comissão (%)" value={form.commission_percentage} onChange={(v) => setForm({ ...form, commission_percentage: v })} />
        <Field label="Preço Premium Aluno (R$)" value={form.student_premium_price} onChange={(v) => setForm({ ...form, student_premium_price: v })} />
        <Field label="Preço Pro Personal (R$)" value={form.personal_pro_price} onChange={(v) => setForm({ ...form, personal_pro_price: v })} />
        <Field label="Preço Premium Personal (R$)" value={form.personal_premium_price} onChange={(v) => setForm({ ...form, personal_premium_price: v })} />
        <button
          onClick={() => save.mutate()}
          disabled={save.isPending}
          className="inline-flex items-center gap-2 rounded-full bg-neon px-5 py-2.5 text-sm font-semibold text-neon-foreground glow-neon disabled:opacity-50"
        >
          {save.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Salvar
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: number | undefined; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type="number"
        step="0.01"
        value={value ?? ""}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-neon"
      />
    </label>
  );
}
