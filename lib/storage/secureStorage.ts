import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Allow web storage only on dev mode
const isWeb = Platform.OS === "web";
const allowWebStorage = isWeb && __DEV__;

export const SecureStorage = {
  async getItem(key: string) {
    if (allowWebStorage) return localStorage.getItem(key);
    if (isWeb) return null;

    return SecureStore.getItemAsync(key);
  },

  async setItem(key: string, value: string) {
    if (allowWebStorage) {
      localStorage.setItem(key, value);
      return;
    }
    if (isWeb) return;

    await SecureStore.setItemAsync(key, value);
  },

  async deleteItem(key: string) {
    if (allowWebStorage) {
      localStorage.removeItem(key);
      return;
    }
    if (isWeb) return;

    await SecureStore.deleteItemAsync(key);
  },
};
