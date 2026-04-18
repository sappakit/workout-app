export const workoutQueryKeys = {
  all: ["workout"] as const,
  schedule: ["workout", "schedule"] as const,
  current: ["workout", "current"] as const,

  detail: (id: number) => ["workout", "detail", id] as const,
};

export const workoutMutationKeys = {
  startSession: ["workout", "sessions", "start"] as const,

  // TODO: add id
  cancelSession: ["workout", "sessions", "cancel"] as const,
  finishSession: ["workout", "sessions", "finish"] as const,

  update: (id: number) => ["workout", "update", id] as const,
};
