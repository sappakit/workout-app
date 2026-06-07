export const workoutQueryKeys = {
  all: ["workout"] as const,
  schedule: ["workout", "schedule"] as const,
  current: ["workout", "current"] as const,
  type: ["workout", "type"] as const,
  progressOverview: ["workout", "progress", "overview"] as const,
  sessionHistory: ["workout", "sessions", "history"] as const,

  detail: (id: number) => ["workout", "detail", id] as const,
};
