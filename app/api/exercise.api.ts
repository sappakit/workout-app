const BASE = "/workout";

export const exerciseApi = {
  getAll: () => `${BASE}/exercises`,
  getById: (id: string | number) => `${BASE}/exercises/${id}`,
};
