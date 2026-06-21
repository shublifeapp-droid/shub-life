import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Subscribes to Postgres changes on `table` and invalidates `queryKey` on every event.
 * Optional `filter` (e.g. `student_id=eq.<uuid>`) scopes the subscription server-side.
 */
export function useRealtimeInvalidate(
  table: string,
  queryKey: readonly unknown[],
  filter?: string,
) {
  const qc = useQueryClient();
  useEffect(() => {
    const channel = supabase
      .channel(`rt-${table}-${filter ?? "all"}-${Math.random().toString(36).slice(2, 8)}`)
      .on(
        "postgres_changes" as never,
        { event: "*", schema: "public", table, ...(filter ? { filter } : {}) },
        () => qc.invalidateQueries({ queryKey }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter, qc, JSON.stringify(queryKey)]);
}
