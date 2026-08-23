export const exerciseQueryKeys = {
  all: ["exercise"] as const,
  detail: (id: number) => ["exercise", "detail", id] as const,
  categories: ["exercise", "categories"] as const,
};

export const muscleQueryKeys = {
  all: ["muscle"] as const,
};
