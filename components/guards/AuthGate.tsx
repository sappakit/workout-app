import { useAuth } from "@/context/AuthContext";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const segmentList = segments as string[];
    const inAuthGroup = segmentList.includes("(auth)");
    const inPublicGroup = segmentList.includes("(public)");

    if (!user && !inAuthGroup && !inPublicGroup) {
      router.replace("/(auth)/sign-in");
      return;
    }

    if (user && inAuthGroup) {
      router.replace("/(tabs)");
      return;
    }
  }, [user, loading, segments]);

  // TODO: show a splash/loading screen while restoring session
  if (loading) return null;

  return children;
}
