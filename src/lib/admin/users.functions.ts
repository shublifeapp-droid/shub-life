import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type NewUserRole = "student" | "personal" | "admin" | "influencer";

export interface CreateUserInput {
  email: string;
  password: string;
  nickname: string;
  role: NewUserRole;
  trialDays: number; // 0 = no free access
  planType?: "free" | "premium" | "starter" | "pro" | "premium_personal";
}

function validate(input: unknown): CreateUserInput {
  const i = input as Partial<CreateUserInput>;
  if (!i.email || !/^\S+@\S+\.\S+$/.test(i.email)) throw new Error("E-mail inválido");
  if (!i.password || i.password.length < 6) throw new Error("Senha precisa ter 6+ caracteres");
  if (!i.nickname) throw new Error("Nickname obrigatório");
  if (!i.role) throw new Error("Papel obrigatório");
  const trialDays = Number(i.trialDays ?? 0);
  if (!Number.isFinite(trialDays) || trialDays < 0 || trialDays > 3650)
    throw new Error("Trial em dias inválido");
  return {
    email: i.email.trim().toLowerCase(),
    password: i.password,
    nickname: i.nickname.trim(),
    role: i.role,
    trialDays,
    planType: i.planType,
  };
}

export const adminCreateUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(validate)
  .handler(async ({ data, context }) => {
    const { data: isAdmin, error: roleErr } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleErr) throw new Error(roleErr.message);
    if (!isAdmin) throw new Error("Apenas admins podem criar usuários");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        nickname: data.nickname,
        desired_role: data.role === "personal" ? "personal" : "student",
      },
    });
    if (createErr || !created.user) throw new Error(createErr?.message ?? "Falha ao criar usuário");

    const userId = created.user.id;

    // Ensure role row matches the chosen role (handle_new_user trigger sets a default).
    if (data.role === "admin" || data.role === "influencer") {
      await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: userId, role: data.role })
        // ignore conflict
        .select();
    }

    // Free trial subscription (skips financial flow).
    if (data.trialDays > 0) {
      const plan =
        data.planType ??
        (data.role === "personal" ? "pro" : data.role === "student" ? "premium" : "free");
      const expires = new Date(Date.now() + data.trialDays * 86400_000).toISOString();
      const { error: subErr } = await supabaseAdmin.from("subscriptions").insert({
        user_id: userId,
        plan_type: plan,
        status: "active",
        price: 0,
        billing_cycle: "monthly",
        expires_at: expires,
      });
      if (subErr) throw new Error(`Usuário criado, mas falhou liberar trial: ${subErr.message}`);
    }

    return { userId, email: data.email };
  });
