import { mapWorkoutSessiontoWorkoutSessionModel } from "@/components/workout-in-progress/model/helpers";
import {
  WorkoutSessionExerciseModel,
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

  // Internal hydration flag
  setHydrated: (value: boolean) => void;

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

  // Update session exercise
  updateSessionExercise: (
    exerciseClientId: string,
    updater: (
      exercise: WorkoutSessionExerciseModel,
    ) => WorkoutSessionExerciseModel,
  ) => void;

  // Update session set (add, remove, complete set, etc.)
  updateSessionSet: (
    exerciseClientId: string,
    setClientId: string,
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

      setHydrated: (value) => set({ hydrated: value }),

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

      updateSessionExercise: (exerciseClientId, updater) => {
        const current = get().session;
        if (!current) return;

        set({
          session: {
            ...current,
            sessionExercises: current.sessionExercises.map((exercise) =>
              exercise.clientId === exerciseClientId
                ? updater(exercise)
                : exercise,
            ),
          },
        });
      },

      updateSessionSet: (exerciseClientId, setClientId, updater) => {
        const current = get().session;
        if (!current) return;

        set({
          session: {
            ...current,
            sessionExercises: current.sessionExercises.map((exercise) => {
              if (exercise.clientId !== exerciseClientId) return exercise;

              return {
                ...exercise,
                sets: exercise.sets.map((set) =>
                  set.clientId === setClientId ? updater(set) : set,
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
