import axios from "axios";
import { AuthStorage } from "./authStorage";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(async (config) => {
  const token = await AuthStorage.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function notifySubscribers(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

async function refreshAccessToken() {
  const refreshToken = await AuthStorage.getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  const { data } = await axios.post(
    `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`,
    { refreshToken },
  );

  const { accessToken, refreshToken: newRefreshToken } = data;
  await AuthStorage.setTokens(accessToken, newRefreshToken);

  return accessToken;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    // Debug logging
    if (__DEV__) {
      console.log("API ERROR:", {
        url: originalRequest?.url,
        method: originalRequest?.method,
        status,
        data: error?.response?.data,
      });
    }

    // Handle 401 (Refresh)
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If refresh already running -> wait
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();

        notifySubscribers(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        await AuthStorage.clearTokens();

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Other errors
    const message =
      error?.response?.data?.message ??
      error?.response?.data?.error ??
      error?.message ??
      "Request failed";

    return Promise.reject(
      new Error(Array.isArray(message) ? message.join("\n") : message),
    );
  },
);

// Barrel export
export { AuthStorage };
