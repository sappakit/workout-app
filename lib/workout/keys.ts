export const workoutQueryKeys = {
  all: ["workout"] as const,
  schedule: ["workout", "schedule"] as const,
  current: ["workout", "current"] as const,

  detail: (id: number) => ["workout", "detail", id] as const,
};

export const workoutMutationKeys = {
  startSession: ["workout", "sessions", "start"] as const,
  cancelSession: ["workout", "sessions", "cancel"] as const,

  update: (id: number) => ["workout", "update", id] as const,
};
