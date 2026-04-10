import {
  WorkoutSessionExerciseSetModel,
  WorkoutSessionModel,
} from "@/types/workout/model/workout.types";
import { WorkoutSession } from "@/types/workout/response/workout.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface WorkoutSessionStore {
  session: WorkoutSessionModel | null;
  hydrated: boolean;

  // Set/replace the entire session
  setSession: (session: WorkoutSessionModel | null) => void;

  // Initialize only when:
  // - there is no session yet, or
  // - current stored session is a different one
  initializeSession: (session: WorkoutSession) => void;

  // Update current session using previous state
  updateSession: (
    updater: (prevSession: WorkoutSessionModel) => WorkoutSessionModel,
  ) => void;

  // Clear current session
  clearSession: () => void;

  // Internal hydration flag
  setHydrated: (value: boolean) => void;

  // Update session set (add, remove, complete set, etc.)
  updateSessionSet: (
    exerciseId: number,
    clientId: string,
    updater: (
      set: WorkoutSessionExerciseSetModel,
    ) => WorkoutSessionExerciseSetModel,
  ) => void;
}

export const useWorkoutSessionStore = create<WorkoutSessionStore>()(
  persist(
    (set, get) => ({
      session: null,
      hydrated: false,

      setSession: (session) => set({ session }),

      initializeSession: (session) => {
        const current = get().session;

        if (current?.id === session.id) return;

        set({
          session: mapWorkoutSessiontoWorkoutSessionModel(session),
        });
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

      updateSessionSet: (exerciseId, clientId, updater) => {
        const current = get().session;
        if (!current) return;

        set({
          session: {
            ...current,
            sessionExercises: current.sessionExercises.map((exercise) => {
              if (exercise.id !== exerciseId) return exercise;

              return {
                ...exercise,
                sets: exercise.sets.map((set) =>
                  set.clientId === clientId ? updater(set) : set,
                ),
              };
            }),
          },
        });
      },
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

// API payload -> Workout Session UI
export const mapWorkoutSessiontoWorkoutSessionModel = (
  session: WorkoutSession,
): WorkoutSessionModel => ({
  ...session,
  sessionExercises: session.sessionExercises.map((exercise) => ({
    ...exercise,
    sets: exercise.sets.map((set) => ({
      ...set,
      clientId: `existing-${set.id}`,
    })),
  })),
});
