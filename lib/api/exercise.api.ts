const BASE = "/exercises";

export const exerciseApi = {
  getAll: () => BASE,
  getById: (id: string | number) => `${BASE}/${id}`,
  getExercisesPerformance: () => `${BASE}/performance`,
};
