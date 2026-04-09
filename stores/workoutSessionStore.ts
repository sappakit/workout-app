import { WorkoutSession } from "@/types/workout/response/workout.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface WorkoutSessionStore {
  session: WorkoutSession | null;
  hydrated: boolean;

  // Set/replace the entire session
  setSession: (session: WorkoutSession | null) => void;

  // Initialize only when:
  // - there is no session yet, or
  // - current stored session is a different one
  initializeSession: (session: WorkoutSession) => void;

  // Update current session using previous state
  updateSession: (
    updater: (prevSession: WorkoutSession) => WorkoutSession,
  ) => void;

  // Clear current session
  clearSession: () => void;

  // Internal hydration flag
  setHydrated: (value: boolean) => void;
}

export const useWorkoutSessionStore = create<WorkoutSessionStore>()(
  persist(
    (set, get) => ({
      session: null,
      hydrated: false,

      setSession: (session) => set({ session }),

      initializeSession: (session) => {
        const current = get().session;

        // Keep current stored session if it is already the same active session
        if (current?.id === session.id) return;

        set({ session });
      },

      updateSession: (updater) => {
        const current = get().session;
        if (!current) return;

        set({
          session: updater(current),
        });
      },

      clearSession: () => set({ session: null }),

      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: "workout-session-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        session: state.session,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
