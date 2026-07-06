const BASE = "/auth";

export const authApi = {
  me: () => `${BASE}/me`,
  register: () => `${BASE}/register`,
  login: () => `${BASE}/login`,
  logout: () => `${BASE}/logout`,
  changeMyPassword: () => `${BASE}/change-password`,

  forgotPassword: () => `${BASE}/forgot-password`,
  resetPassword: () => `${BASE}/reset-password`,
  verifyResetPasswordToken: () => `${BASE}/reset-password/verify`,
};
