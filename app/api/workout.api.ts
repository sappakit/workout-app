const BASE = "/workouts";

export const workoutApi = {
  getAll: () => BASE,
  getById: (id: string | number) => `${BASE}/${id}`,
  getSchedule: () => `${BASE}/schedule`,
  getTypes: () => `${BASE}/types`,
  getCurrent: () => `${BASE}/current`,

  // Post
  startSession: () => `${BASE}/sessions/start`,

  // Patch
  update: (id: string | number) => `${BASE}/${id}`,
};
