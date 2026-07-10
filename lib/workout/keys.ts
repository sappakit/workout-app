export const workoutQueryKeys = {
  all: ["workout"] as const,
  current: ["workout", "current"] as const,
  type: ["workout", "type"] as const,
  progressOverview: ["workout", "progress", "overview"] as const,
  sessionHistory: ["workout", "sessions", "history"] as const,
  todayOverview: ["workout", "todayOverview"] as const,
  weeklyPlan: ["workout", "weekly-plan"] as const,

  detail: (id: number) => ["workout", "detail", id] as const,
};
