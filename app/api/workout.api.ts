const BASE = "/workout";

export const workoutApi = {
  getAll: () => BASE,
  getById: (id: string | number) => `${BASE}/${id}`,
  getSchedule: () => `${BASE}/schedule`,
  getTypes: () => `${BASE}/types`,
  update: (id: string | number) => `${BASE}/${id}`,
};
