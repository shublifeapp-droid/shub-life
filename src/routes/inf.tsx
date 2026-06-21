import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { LayoutDashboard, Users, DollarSign, Link2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DashShell, type DashNavItem } from "@/components/shub/DashShell";

export const Route = createFileRoute("/inf")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/login" });
    const { data: roleRows } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);
    const roles = (roleRows ?? []).map((r) => r.role);
    if (!roles.includes("influencer") && !roles.includes("admin")) {
      throw redirect({ to: "/app" });
    }
  },
  component: InfLayout,
});

const items: DashNavItem[] = [
  { to: "/inf", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { to: "/inf/indicacoes", label: "Indicações", icon: Users },
  { to: "/inf/financeiro", label: "Financeiro", icon: DollarSign },
  { to: "/inf/link", label: "Meu link", icon: Link2 },
];

function InfLayout() {
  return (
    <DashShell title="INFLUENCER" subtitle="Painel de indicações" items={items}>
      <Outlet />
    </DashShell>
  );
}
