import { useAuth } from "@/context/AuthContext";
import { workoutApi } from "@/lib/api/workout.api";
import { useGetQuery } from "@/lib/query/useGetQuery";
import { workoutQueryKeys } from "@/lib/workout/keys";
import { useWorkoutRestTimerStore } from "@/stores/workoutRestTimerStore";
import { useWorkoutSessionStore } from "@/stores/workoutSessionStore";
import {
  WorkoutCurrent,
  WorkoutCurrentMode,
} from "@/types/workout/response/workout.types";
import { useEffect } from "react";

export function WorkoutSessionSync() {
  const { user } = useAuth();

  const hydrated = useWorkoutSessionStore((state) => state.hydrated);
  const storedSession = useWorkoutSessionStore((state) => state.session);
  const initializeSession = useWorkoutSessionStore(
    (state) => state.initializeSession,
  );
  const setPerformanceByExerciseId = useWorkoutSessionStore(
    (state) => state.setPerformanceByExerciseId,
  );
  const clearSession = useWorkoutSessionStore((state) => state.clearSession);

  const clearRestTimer = useWorkoutRestTimerStore(
    (state) => state.clearRestTimer,
  );

  const { data, isSuccess } = useGetQuery<WorkoutCurrent>(
    workoutQueryKeys.current,
    workoutApi.getCurrent(),
    {
      enabled: hydrated && !!user,
    },
  );

  useEffect(() => {
    if (!hydrated || !isSuccess || !data) return;

    if (data.mode === WorkoutCurrentMode.IN_PROGRESS && data.session) {
      // Initialize from backend only when there is no local session yet
      if (!storedSession) {
        initializeSession(data.session);
        setPerformanceByExerciseId(data.performanceByExerciseId);

        return;
      }

      // Replace local session only when backend points to a different active session
      if (storedSession.id !== data.session.id) {
        initializeSession(data.session);
        setPerformanceByExerciseId(data.performanceByExerciseId);

        return;
      }

      // Keep the same local session if already exists
      return;
    }

    // Clear local session if no active workout
    if (storedSession) {
      clearSession();
      clearRestTimer();
    }
  }, [
    hydrated,
    isSuccess,
    data,
    storedSession,
    initializeSession,
    setPerformanceByExerciseId,
    clearSession,
    clearRestTimer,
  ]);

  return null;
}
