import { SecureStorage } from "../storage/secureStorage";

const ACCESS = "accessToken";
const REFRESH = "refreshToken";

// Storage
export const AuthStorage = {
  async getAccessToken() {
    return SecureStorage.getItem(ACCESS);
  },

  async getRefreshToken() {
    return SecureStorage.getItem(REFRESH);
  },

  async setTokens(access: string, refresh: string) {
    await SecureStorage.setItem(ACCESS, access);
    await SecureStorage.setItem(REFRESH, refresh);
  },

  async clearTokens() {
    await SecureStorage.deleteItem(ACCESS);
    await SecureStorage.deleteItem(REFRESH);
  },
};
