import { api, AuthStorage } from "@/lib/api";
import { SignInForm } from "@/schemas/auth.schema";
import { SignUpRequest, User } from "@/types/auth.types";
import { useRouter } from "expo-router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

type AuthContextType = {
  loading: boolean;
  user: User | null;
  isAuthenticated: boolean;
  signUp: (values: SignUpRequest) => Promise<void>;
  signIn: (values: SignInForm) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

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
        const { data } = await api.get("/auth/me");
        setUser(data as User);
      } catch {
        setUser(null);
        await AuthStorage.clearTokens();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Sign up
  async function signUp(values: SignUpRequest) {
    const { data } = await api.post("/auth/register", values);
    const { accessToken, refreshToken, user } = data as AuthResponse;

    await AuthStorage.setTokens(accessToken, refreshToken);
    setUser(user);
  }

  // Sign in
  async function signIn(values: SignInForm) {
    const { data } = await api.post("/auth/login", values);
    const { accessToken, refreshToken, user } = data as AuthResponse;

    await AuthStorage.setTokens(accessToken, refreshToken);
    setUser(user);
  }

  // Sign out
  async function signOut() {
    const refreshToken = await AuthStorage.getRefreshToken();

    if (refreshToken) {
      try {
        await api.post("/auth/logout", { refreshToken });
      } catch (e) {
        console.log("Logout failed:", e);
      }
    }

    await AuthStorage.clearTokens();
    setUser(null);
    router.replace("/(auth)/sign-in");
  }

  // Re-fetch user
  async function loadUser() {
    const { data } = await api.get("/auth/me");
    setUser(data as User);
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
