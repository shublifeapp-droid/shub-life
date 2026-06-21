import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface State {
  user: User | null;
  loading: boolean;
}

/**
 * Lightweight current-user hook for client components.
 * For server-side reads, prefer requireSupabaseAuth in a server function.
 */
export function useCurrentUser(): State {
  const [state, setState] = useState<State>({ user: null, loading: true });

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setState({ user: data.user ?? null, loading: false });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setState({ user: session?.user ?? null, loading: false });
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}
