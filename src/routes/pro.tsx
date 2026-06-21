import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { LayoutDashboard, Users, Dumbbell, DollarSign, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DashShell, type DashNavItem } from "@/components/shub/DashShell";

export const Route = createFileRoute("/pro")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/login" });
    const { data: roleRows } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);
    const roles = (roleRows ?? []).map((r) => r.role);
    if (!roles.includes("personal") && !roles.includes("admin")) throw redirect({ to: "/app" });
  },
  component: ProLayout,
});

const items: DashNavItem[] = [
  { to: "/pro", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { to: "/pro/alunos", label: "Alunos", icon: Users },
  { to: "/pro/treinos", label: "Treinos", icon: Dumbbell },
  { to: "/pro/financeiro", label: "Financeiro", icon: DollarSign },
  { to: "/pro/notificacoes", label: "Notificações", icon: Bell },
];

function ProLayout() {
  return (
    <DashShell title="PRO" subtitle="Painel do profissional" items={items}>
      <Outlet />
    </DashShell>
  );
}
