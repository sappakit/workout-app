export const exerciseQueryKeys = {
  all: ["exercise"] as const,
  detail: (id: number) => ["exercise", "detail", id] as const,
};
