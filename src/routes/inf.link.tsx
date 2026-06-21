import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { shubToast } from "@/components/shub/toast";

export const Route = createFileRoute("/inf/link")({
  component: InfLink,
});

function InfLink() {
  const { user } = useCurrentUser();
  const { data, isLoading } = useQuery({
    queryKey: ["inf-link", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("influencers")
        .select("code, commission_rate")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data as { code: string; commission_rate: number } | null;
    },
  });

  if (isLoading) return <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>;
  if (!data) return <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted-foreground">Perfil de influenciador não encontrado.</div>;

  const link = `${window.location.origin}/r/${data.code}`;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}`;

  return (
    <div className="space-y-6 max-w-2xl">
      <header>
        <h1 className="font-display text-3xl font-bold">Meu link</h1>
        <p className="mt-1 text-sm text-muted-foreground">Compartilhe e ganhe {(Number(data.commission_rate) * 100).toFixed(0)}% recorrente por indicação ativa.</p>
      </header>

      <div className="rounded-2xl border border-neon/40 bg-neon/5 p-5">
        <p className="text-[10px] uppercase tracking-wider text-neon">Código</p>
        <p className="mt-1 font-display text-2xl font-bold">{data.code}</p>
        <p className="mt-4 text-[10px] uppercase tracking-wider text-neon">Link</p>
        <p className="mt-1 break-all text-sm">{link}</p>
        <button
          onClick={() => { navigator.clipboard.writeText(link); shubToast.success("Link copiado"); }}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-neon px-4 py-2 text-xs font-semibold text-neon-foreground glow-neon"
        >
          <Copy className="h-3.5 w-3.5" /> Copiar
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">QR Code</p>
        <img src={qr} alt="QR Code do link de indicação" className="mt-3 h-64 w-64 rounded-xl bg-white p-3" />
      </div>
    </div>
  );
}
