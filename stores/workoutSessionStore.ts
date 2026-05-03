import { getPausableElapsedSeconds } from "@/hooks/usePausableElapsedSeconds";
import {
  WorkoutSessionExerciseModel,
  WorkoutSessionExerciseSetModel,
  WorkoutSessionModel,
} from "@/types/workout/model/workout.types";
import { FinishWorkoutSessionPayload } from "@/types/workout/payload/finish-workout-session.types";
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

// API payload -> Workout Session UI
export const mapWorkoutSessiontoWorkoutSessionModel = (
  session: WorkoutSession,
): WorkoutSessionModel => ({
  ...session,
  sessionExercises: session.sessionExercises.map((exercise) => ({
    ...exercise,
    clientId: `existing-${exercise.id}`,
    sets: exercise.sets.map((set) => ({
      ...set,
      clientId: `existing-${set.id}`,
    })),
  })),
});

// Workout Session UI -> API payload
export const mapWorkoutSessionModelToFinishPayload = (
  session: WorkoutSessionModel,
): FinishWorkoutSessionPayload => {
  const endedAt = new Date();

  // If currently paused, calculate how long this pause has lasted
  const currentPausedSeconds = session.pausedAt
    ? Math.floor(
        (endedAt.getTime() - new Date(session.pausedAt).getTime()) / 1000,
      )
    : 0;

  // Combine past pauses + current pause
  const totalPausedDuration =
    session.totalPausedDuration + currentPausedSeconds;

  // Calculate total active workout time (excluding all pauses)
  const totalDuration = getPausableElapsedSeconds({
    startedAt: session.startedAt,
    pausedAt: null,
    now: endedAt.getTime(),
    totalPausedDuration,
  });

  return {
    endedAt: endedAt.toISOString(),
    totalDuration,
    totalPausedDuration,
    caloriesBurned: session.caloriesBurned,
    sessionExercises: session.sessionExercises.map((sessionExercise) => ({
      id: sessionExercise.id ?? null,
      exerciseId: sessionExercise.exercise.id,
      orderIndex: sessionExercise.orderIndex,
      plannedRestTime: sessionExercise.plannedRestTime,
      completedAt: sessionExercise.completedAt,
      sets: sessionExercise.sets.map((set) => ({
        id: set.id,
        setNumber: set.setNumber,
        reps: set.reps,
        weight: set.weight,
        distance: set.distance,
        duration: set.duration,
        performedAt: set.performedAt,
        completedAt: set.completedAt,
      })),
    })),
  };
};
