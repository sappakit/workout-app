export const workoutApi = {
  getAll: () => "/workout",
  getById: (id: string) => `/workout/${id}`,
  getSchedule: () => "/workout/schedule",
  getTypes: () => "/workout/types",
};

export const muscleApi = {
  getAll: () => "/workout/muscles",
};

export const exerciseApi = {
  getAll: () => "/workout/exercises",
};
