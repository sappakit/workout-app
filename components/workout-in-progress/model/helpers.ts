import { createClientId } from "@/lib/id/utils";
import {
  WorkoutSessionExerciseModel,
  WorkoutSessionExerciseSetModel,
  WorkoutSessionModel,
} from "@/types/workout/model/workout.types";

// State update helpers
// Add set to exercise
export function addSessionSet(
  session: WorkoutSessionModel,
  exerciseClientId: string,
): WorkoutSessionModel {
  return {
    ...session,
    sessionExercises: session.sessionExercises.map((exercise) => {
      if (exercise.clientId !== exerciseClientId) return exercise;

      const lastSet = exercise.sets[exercise.sets.length - 1];
      const nextSetNumber = lastSet ? lastSet.setNumber + 1 : 1;

      const newSet: WorkoutSessionExerciseSetModel = {
        id: null,
        clientId: createClientId("new"),
        setNumber: nextSetNumber,
        reps: null,
        weight: null,
        distance: null,
        duration: null,
        performedAt: null,
        completedAt: null,
      };

      return syncSessionExerciseCompletion({
        ...exercise,
        sets: [...exercise.sets, newSet],
      });
    }),
  };
}

// Delete set from exercise
export function deleteSessionSet(
  session: WorkoutSessionModel,
  exerciseClientId: string,
  setClientId: string,
): WorkoutSessionModel {
  return {
    ...session,
    sessionExercises: session.sessionExercises.map((exercise) => {
      if (exercise.clientId !== exerciseClientId) return exercise;

      const filteredSets = exercise.sets
        .filter((set) => set.clientId !== setClientId)
        .map((set, index) => ({
          ...set,
          setNumber: index + 1,
        }));

      return syncSessionExerciseCompletion({
        ...exercise,
        sets: filteredSets,
      });
    }),
  };
}

// Sync exercise completedAt when sets change
export function syncSessionExerciseCompletion(
  exercise: WorkoutSessionExerciseModel,
): WorkoutSessionExerciseModel {
  const allSetsCompleted =
    exercise.sets.length > 0 && exercise.sets.every((set) => !!set.completedAt);

  return {
    ...exercise,
    completedAt: allSetsCompleted
      ? (exercise.completedAt ?? new Date().toISOString())
      : null,
  };
}

// UI helpers
// Get progress label for exercise
export function getExerciseProgressText(exercise: WorkoutSessionExerciseModel) {
  const completedCount = exercise.sets.filter(
    (set) => !!set.completedAt,
  ).length;

  const totalCount = exercise.sets.length;

  if (totalCount === 0) return "No sets yet";

  if (completedCount === totalCount) {
    return `Completed • ${completedCount}/${totalCount} sets`;
  }

  return `In progress • ${completedCount}/${totalCount} sets`;
}
