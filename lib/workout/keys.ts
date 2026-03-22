export const workoutQueryKeys = {
  all: ["workout"] as const,
  schedule: ["workout", "schedule"] as const,
  detail: (id: number) => ["workout", "detail", id] as const,
};

export const workoutMutationKeys = {
  update: (id: number) => ["workout", "update", id] as const,
};
