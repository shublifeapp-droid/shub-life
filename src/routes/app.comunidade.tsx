import { createFileRoute } from "@tanstack/react-router";
import { Heart, MessageCircle, Trophy } from "lucide-react";

export const Route = createFileRoute("/app/comunidade")({
  component: Comunidade,
});

const posts = [
  { user: "Marina S.", initials: "MS", time: "agora", text: "Bati meu PR no agachamento: 110kg 🔥 SHUB SCORE 91!", likes: 42, comments: 8 },
  { user: "Caio R.", initials: "CR", time: "12 min", text: "30 dias seguidos de treino concluídos. Disciplina vence motivação.", likes: 128, comments: 24 },
  { user: "Júlia M.", initials: "JM", time: "1h", text: "Recuperação 95% hoje. O sono mudou tudo na minha performance.", likes: 67, comments: 12 },
];

function Comunidade() {
  return (
    <div className="px-5 pt-12">
      <h1 className="font-display text-2xl font-bold">Comunidade</h1>
      <p className="text-sm text-muted-foreground">Pessoas evoluindo junto com você.</p>

      <div className="mt-6 flex items-center gap-3 overflow-x-auto pb-2 [scrollbar-width:none]">
        {["Top da semana", "Treino", "Mente", "Nutrição", "Hábitos"].map((c, i) => (
          <button key={c} className={`flex-shrink-0 rounded-full border px-4 py-2 text-xs font-medium ${i === 0 ? "border-neon bg-neon text-neon-foreground" : "border-border bg-surface text-muted-foreground"}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-3xl border border-neon/30 bg-surface p-5">
        <div className="flex items-center gap-3">
          <Trophy className="h-5 w-5 text-neon" />
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Ranking</p>
            <p className="font-display font-bold">Você está em #142 esta semana</p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {posts.map((p) => (
          <div key={p.user} className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full border border-neon/40 bg-surface-elevated text-xs font-bold">{p.initials}</div>
              <div>
                <p className="text-sm font-semibold">{p.user}</p>
                <p className="text-[10px] text-muted-foreground">{p.time}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed">{p.text}</p>
            <div className="mt-3 flex gap-5 text-xs text-muted-foreground">
              <button className="flex items-center gap-1.5 hover:text-neon"><Heart className="h-4 w-4" /> {p.likes}</button>
              <button className="flex items-center gap-1.5 hover:text-neon"><MessageCircle className="h-4 w-4" /> {p.comments}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
