export const workoutQueryKeys = {
  all: ["workout"] as const,
  schedule: ["workout", "schedule"] as const,
  current: ["workout", "current"] as const,

  detail: (id: number) => ["workout", "detail", id] as const,
};
