import { authApi } from "@/app/api/auth.api";
import { api, AuthStorage, setOnAuthExpired } from "@/lib/api";
import { SignInForm } from "@/schemas/auth.schema";
import { useWorkoutRestTimerStore } from "@/stores/workoutRestTimerStore";
import { useWorkoutSessionStore } from "@/stores/workoutSessionStore";
import { SignUpRequest, UserAuth } from "@/types/auth.types";
import { useRouter } from "expo-router";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: UserAuth;
};

type AuthContextType = {
  loading: boolean;
  user: UserAuth | null;
  isAuthenticated: boolean;
  signUp: (values: SignUpRequest) => Promise<void>;
  signIn: (values: SignInForm) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserAuth | null>(null);

  const router = useRouter();

  const clearLocalAuthState = useCallback(async () => {
    await AuthStorage.clearTokens();

    // Clear workout runtime state
    useWorkoutSessionStore.getState().clearSession();
    useWorkoutRestTimerStore.getState().clearRestTimer();

    // Clear persisted Zustand storage
    useWorkoutSessionStore.persist.clearStorage();
    useWorkoutRestTimerStore.persist.clearStorage();

    setUser(null);
  }, []);

  // Let the API layer clear AuthContext when refresh token expires
  useEffect(() => {
    setOnAuthExpired(async () => {
      await clearLocalAuthState();
      router.replace("/(auth)/sign-in");
    });

    return () => {
      setOnAuthExpired(null);
    };
  }, [clearLocalAuthState, router]);

  // Restore session on app start
  useEffect(() => {
    (async () => {
      try {
        const token = await AuthStorage.getAccessToken();

        // No token -> logged out
        if (!token) {
          setUser(null);
          return;
        }

        // Token exists -> get user from backend
        const { data } = await api.get<UserAuth>(authApi.me());
        setUser(data);
      } catch {
        await clearLocalAuthState();
      } finally {
        setLoading(false);
      }
    })();
  }, [clearLocalAuthState]);

  // Sign up
  async function signUp(values: SignUpRequest) {
    const { data } = await api.post<AuthResponse>(authApi.register(), values);
    const { accessToken, refreshToken, user } = data;

    await AuthStorage.setTokens(accessToken, refreshToken);
    setUser(user);
  }

  // Sign in
  async function signIn(values: SignInForm) {
    const { data } = await api.post<AuthResponse>(authApi.login(), values);
    const { accessToken, refreshToken, user } = data;

    await AuthStorage.setTokens(accessToken, refreshToken);
    setUser(user);
  }

  // Sign out
  async function signOut() {
    const refreshToken = await AuthStorage.getRefreshToken();

    if (refreshToken) {
      try {
        await api.post(authApi.logout(), { refreshToken });
      } catch (e) {
        console.log("Logout failed:", e);
      }
    }

    await clearLocalAuthState();

    router.replace("/(auth)/sign-in");
  }

  // Re-fetch user
  async function loadUser() {
    const { data } = await api.get<UserAuth>(authApi.me());
    setUser(data);
  }

  const value = useMemo(
    () => ({
      loading,
      user,
      isAuthenticated: !!user,
      signUp,
      signIn,
      signOut,
      loadUser,
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
