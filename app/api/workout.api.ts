export const workoutApi = {
  getAll: () => "/workout",
  getById: (id: string) => `/workout/${id}`,
  getSchedule: () => "/workout/schedule",
};
