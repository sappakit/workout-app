import { getPausableElapsedSeconds } from "@/hooks/usePausableElapsedSeconds";
import { createClientId } from "@/lib/id/utils";
import {
  requireSessionExercise,
  requireSessionExercises,
  requireSessionExerciseSets,
} from "@/lib/workout/utils/response-guards.utils";
import {
  WorkoutSessionExerciseSetModel,
  WorkoutSessionModel,
} from "@/types/workout/model/workout.types";
import { FinishWorkoutSessionPayload } from "@/types/workout/payload/finish-workout-session.types";
import { WorkoutSession } from "@/types/workout/response/workout.types";

// API payload -> Workout Session UI
export const mapWorkoutSessionToWorkoutSessionModel = (
  session: WorkoutSession,
): WorkoutSessionModel => {
  const sessionExercises = requireSessionExercises(session);

  return {
    ...session,
    sessionExercises: sessionExercises.map((sessionExercise) => {
      const exercise = requireSessionExercise(sessionExercise);
      const sets = requireSessionExerciseSets(sessionExercise);

      const mappedSets: WorkoutSessionExerciseSetModel[] = sets.map((set) => ({
        ...set,
        clientId: `existing-session-set-${set.id}`,
      }));

      return {
        ...sessionExercise,
        clientId: `existing-session-exercise-${sessionExercise.id}`,
        exercise,
        sets: mappedSets.length > 0 ? mappedSets : [createEmptySessionSet(1)],
      };
    }),
  };
};

// Workout Session UI -> API payload
export const mapWorkoutSessionModelToFinishPayload = (
  session: WorkoutSessionModel,
): FinishWorkoutSessionPayload => {
  const endedAt = new Date();

  const currentPausedSeconds = session.pausedAt
    ? Math.floor(
        (endedAt.getTime() - new Date(session.pausedAt).getTime()) / 1000,
      )
    : 0;

  const totalPausedDuration =
    session.totalPausedDuration + currentPausedSeconds;

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
      id: sessionExercise.id,
      exerciseId: sessionExercise.exercise.id,
      orderIndex: sessionExercise.orderIndex,
      restTime: sessionExercise.restTime,
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

function createEmptySessionSet(setNumber = 1): WorkoutSessionExerciseSetModel {
  return {
    id: null,
    clientId: createClientId("new-session-set"),
    setNumber,
    reps: null,
    weight: null,
    distance: null,
    duration: null,
    performedAt: null,
    completedAt: null,
  };
}
