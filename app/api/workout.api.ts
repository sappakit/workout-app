const BASE = "/workouts";

export const workoutApi = {
  getAll: () => BASE,
  getById: (id: string | number) => `${BASE}/${id}`,
  getSchedule: () => `${BASE}/schedule`,
  getTypes: () => `${BASE}/types`,
  getCurrent: () => `${BASE}/current`,
  getProgressOverview: () => `${BASE}/progress/overview`,
  getSessionHistory: () => `${BASE}/sessions/history`,

  // Create
  startSession: (workoutId: string | number) =>
    `${BASE}/${workoutId}/sessions/start`,
  cancelSession: (id: string | number) => `${BASE}/sessions/${id}/cancel`,

  // Update
  update: (id: string | number) => `${BASE}/${id}`,
  finishSession: (sessionId: number) => `${BASE}/sessions/${sessionId}/finish`,
};
