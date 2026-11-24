import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/data/api";
import { useEdition } from "@/context/EditionContext";

export const qk = {
  converts: (y: number) => ["converts", y] as const,
  counsellees: (y: number) => ["counsellees", y] as const,
  staff: ["staff"] as const,
  summary: (y: number) => ["summary", y] as const,
  compare: ["compare"] as const,
  batches: (y?: number) => ["batches", y ?? "all"] as const,
  notifSummary: (y?: number) => ["notif-summary", y ?? "all"] as const,
  templates: ["templates"] as const,
  activity: ["activity"] as const,
  exports: ["exports"] as const,
};

export const useConverts = () => {
  const { year } = useEdition();
  return useQuery({ queryKey: qk.converts(year), queryFn: () => api.converts.list(year) });
};
export const useCounsellees = () => {
  const { year } = useEdition();
  return useQuery({ queryKey: qk.counsellees(year), queryFn: () => api.counsellees.list(year) });
};
export const useStaff = () => useQuery({ queryKey: qk.staff, queryFn: () => api.staff.list() });
export const useSummary = (y?: number) => {
  const { year } = useEdition();
  const target = y ?? year;
  return useQuery({ queryKey: qk.summary(target), queryFn: () => api.analytics.summary(target) });
};
export const useCompare = (years: number[]) =>
  useQuery({ queryKey: [...qk.compare, ...years], queryFn: () => api.analytics.compare(years) });
export const useBatches = (y?: number) => useQuery({ queryKey: qk.batches(y), queryFn: () => api.notifications.batches(y) });
export const useNotifSummary = (y?: number) =>
  useQuery({ queryKey: qk.notifSummary(y), queryFn: () => api.notifications.summary(y) });
export const useTemplates = () => useQuery({ queryKey: qk.templates, queryFn: () => api.notifications.templates() });
export const useActivity = () => useQuery({ queryKey: qk.activity, queryFn: () => api.activity.list(40) });

/** Invalidate everything derived from records after a write. */
export function useInvalidate() {
  const qc = useQueryClient();
  return () =>
    Promise.all(
      ["converts", "counsellees", "staff", "summary", "compare", "batches", "notif-summary", "templates", "activity", "exports"].map((k) =>
        qc.invalidateQueries({ queryKey: [k] }),
      ),
    );
}

export function useWrite<TArgs, TResult>(fn: (args: TArgs) => Promise<TResult>) {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: fn, onSuccess: () => invalidate() });
}
