import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRealtimeInvalidate } from "@/hooks/useRealtimeInvalidate";

export function NotificationsBell() {
  const { user } = useCurrentUser();
  useRealtimeInvalidate(
    "notifications",
    ["notifications-unread", user?.id],
    user ? `user_id=eq.${user.id}` : undefined,
  );
  const { data: count = 0 } = useQuery({
    queryKey: ["notifications-unread", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .eq("is_read", false);
      if (error) throw error;
      return count ?? 0;
    },
  });

  return (
    <Link
      to="/app/notificacoes"
      aria-label={`Notificações${count > 0 ? `, ${count} não lidas` : ""}`}
      className="relative grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:text-foreground"
    >
      <Bell className="h-5 w-5" strokeWidth={1.8} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-neon px-1 text-[9px] font-bold text-neon-foreground">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
