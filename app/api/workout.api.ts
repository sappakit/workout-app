const BASE = "/workouts";

export const workoutApi = {
  getAll: () => BASE,
  getById: (id: string | number) => `${BASE}/${id}`,
  getSchedule: () => `${BASE}/schedule`,
  getTypes: () => `${BASE}/types`,
  getCurrent: () => `${BASE}/current`,

  // Create
  startSession: () => `${BASE}/sessions/start`,
  cancelSession: () => `${BASE}/sessions/cancel`,

  // Update
  update: (id: string | number) => `${BASE}/${id}`,
};
