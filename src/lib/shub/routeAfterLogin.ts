import { supabase } from "@/integrations/supabase/client";

export type AppRole = "student" | "personal" | "admin" | "influencer";

/** Returns the best landing route for the current authenticated user. */
export async function routeAfterLogin(): Promise<"/admin" | "/pro" | "/inf" | "/app"> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return "/app";
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
  const roles = (data ?? []).map((r) => r.role as AppRole);
  if (roles.includes("admin")) return "/admin";
  if (roles.includes("personal")) return "/pro";
  if (roles.includes("influencer")) return "/inf";
  return "/app";
}
