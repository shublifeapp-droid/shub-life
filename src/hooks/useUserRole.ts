import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "./useCurrentUser";

export type AppRole = "student" | "personal" | "admin";

export function useUserRoles() {
  const { user, loading } = useCurrentUser();
  const q = useQuery({
    queryKey: ["user_roles", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<AppRole[]> => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id);
      if (error) throw error;
      return (data ?? []).map((r) => r.role as AppRole);
    },
  });
  return { roles: q.data ?? [], loading: loading || q.isLoading, user };
}

export function hasRole(roles: AppRole[], role: AppRole) {
  return roles.includes(role);
}
