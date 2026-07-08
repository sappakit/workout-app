import axios, {
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import { devLogger } from "../logger/devLogger";
import { AuthStorage } from "../storage/authStorage";

type ApiErrorResponse = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type AuthExpiredCallback = () => void | Promise<void>;

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  paramsSerializer: {
    indexes: null,
  },
});

// Response interceptor auth callback
let onAuthExpired: AuthExpiredCallback | null = null;

export function setOnAuthExpired(callback: AuthExpiredCallback | null) {
  onAuthExpired = callback;
}

// Shared refresh promise so multiple 401 requests wait for the same refresh request
let refreshPromise: Promise<string> | null = null;

function setAuthorizationHeader(config: RetryableRequestConfig, token: string) {
  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }

  config.headers.Authorization = `Bearer ${token}`;
}

// Refresh access token
async function refreshAccessToken() {
  const refreshToken = await AuthStorage.getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  const { data } = await axios.post(
    `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`,
    { refreshToken },
    { timeout: 10000 },
  );

  const { accessToken, refreshToken: newRefreshToken } = data;
  await AuthStorage.setTokens(accessToken, newRefreshToken);

  return accessToken;
}

const AUTH_REFRESH_SKIP_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
];

function shouldSkipAuthRefresh(url?: string) {
  return AUTH_REFRESH_SKIP_PATHS.some((path) => url?.includes(path));
}

// Request interceptor
api.interceptors.request.use(async (config) => {
  const token = await AuthStorage.getAccessToken();

  if (token) {
    setAuthorizationHeader(config as RetryableRequestConfig, token);
  }

  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;
    const url = originalRequest?.url;

    // Debug logging
    devLogger.error("API request failed", error, {
      url,
      method: originalRequest?.method,
      status,
      data: error.response?.data,
    });

    // Handle 401 (Refresh)
    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !shouldSkipAuthRefresh(url)
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }

        const newAccessToken = await refreshPromise;

        setAuthorizationHeader(originalRequest, newAccessToken);

        return api(originalRequest);
      } catch (refreshError) {
        devLogger.error("Failed to refresh access token", refreshError, {
          url,
          method: originalRequest.method,
          status,
        });

        await AuthStorage.clearTokens();

        // Notify AuthProvider so in-memory auth state does not stay logged in
        await onAuthExpired?.();

        return Promise.reject(refreshError);
      }
    }

    // Other errors
    const message =
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message ??
      "Request failed";

    error.message = Array.isArray(message) ? message.join("\n") : message;

    return Promise.reject(error);
  },
);

// Barrel export
export { AuthStorage };
