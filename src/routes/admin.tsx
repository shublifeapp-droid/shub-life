import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { LayoutDashboard, Users, Trophy, DollarSign, Bell, Settings, ScrollText, Megaphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DashShell, type DashNavItem } from "@/components/shub/DashShell";

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/login" });
    const { data: roleRows } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);
    const roles = (roleRows ?? []).map((r) => r.role);
    if (!roles.includes("admin")) throw redirect({ to: "/app" });
  },
  component: AdminLayout,
});

const items: DashNavItem[] = [
  { to: "/admin", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { to: "/admin/usuarios", label: "Usuários", icon: Users },
  { to: "/admin/conteudo", label: "Conteúdo", icon: Trophy },
  { to: "/admin/influenciadores", label: "Influenciadores", icon: Megaphone },
  { to: "/admin/financeiro", label: "Financeiro", icon: DollarSign },
  { to: "/admin/notificacoes", label: "Notificações", icon: Bell },
  { to: "/admin/auditoria", label: "Auditoria", icon: ScrollText },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

function AdminLayout() {
  return (
    <DashShell title="ADMIN MASTER" subtitle="Painel de controle" items={items}>
      <Outlet />
    </DashShell>
  );
}
