import { PageParams } from "@/types/api.types";

export const workoutQueryKeys = {
  all: ["workout"] as const,
  schedule: ["workout", "schedule"] as const,
  current: ["workout", "current"] as const,
  progressOverview: ["workout", "progress", "overview"] as const,

  detail: (id: number) => ["workout", "detail", id] as const,
  sessionHistory: (params?: PageParams) =>
    ["workout", "sessions", "history", params] as const,
};
