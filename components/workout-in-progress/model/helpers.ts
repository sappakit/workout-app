import { getPausableElapsedSeconds } from "@/hooks/usePausableElapsedSeconds";
import { createClientId } from "@/lib/id/utils";
import { ExerciseFieldKey, getExerciseFields } from "@/lib/workout/config";
import {
  requireSessionExercise,
  requireSessionExercises,
  requireSessionExerciseSets,
} from "@/lib/workout/utils/response-guards.utils";
import {
  WorkoutSessionExerciseModel,
  WorkoutSessionExerciseSetModel,
  WorkoutSessionModel,
} from "@/types/workout/model/workout.types";
import { FinishWorkoutSessionPayload } from "@/types/workout/payload/finish-workout-session.types";
import { Exercise } from "@/types/workout/response/exercise.types";
import { WorkoutSession } from "@/types/workout/response/workout.types";

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

      const newSet = createEmptySessionSet(nextSetNumber);

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

// Delete exercise
export function deleteSessionExercise(
  session: WorkoutSessionModel,
  exerciseClientId: string,
): WorkoutSessionModel {
  return {
    ...session,
    sessionExercises: session.sessionExercises
      .filter((exercise) => exercise.clientId !== exerciseClientId)
      .map((exercise, index) => ({
        ...exercise,
        orderIndex: index + 1,
      })),
  };
}

// Add session exercises
export function addSessionExercise(
  session: WorkoutSessionModel,
  exercises: Exercise[],
): WorkoutSessionModel {
  const currentExercises = session.sessionExercises;

  const nextSessionExercises: WorkoutSessionExerciseModel[] = [
    ...currentExercises,
  ];

  let nextOrderIndex =
    currentExercises.length > 0
      ? Math.max(...currentExercises.map((item) => item.orderIndex)) + 1
      : 1;

  exercises.forEach((exercise) => {
    // Allow duplicate exercises as separate session exercise rows
    nextSessionExercises.push(
      mapExerciseToSessionExerciseModel(exercise, nextOrderIndex),
    );

    nextOrderIndex += 1;
  });

  return {
    ...session,
    sessionExercises: nextSessionExercises,
  };
}

// Replace one session exercise
export function replaceSessionExercise(
  session: WorkoutSessionModel,
  targetExerciseClientId: string,
  selectedExercise: Exercise,
): WorkoutSessionModel {
  return {
    ...session,
    sessionExercises: session.sessionExercises.map((sessionExercise) => {
      if (sessionExercise.clientId !== targetExerciseClientId) {
        return sessionExercise;
      }

      return {
        ...sessionExercise,

        // The replacement no longer corresponds to the original workout-plan row.
        workoutExerciseId: null,

        exercise: selectedExercise,
        restTime: selectedExercise.defaultRestTime ?? null,
        completedAt: null,
        sets:
          sessionExercise.sets.length > 0
            ? sessionExercise.sets.map((set) => ({
                ...set,

                // The set no longer corresponds to the original workout-plan set.
                workoutExerciseSetId: null,

                completedAt: null,
              }))
            : [createEmptySessionSet(1)],
      };
    }),
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

// Mappers
function createEmptySessionSet(setNumber = 1): WorkoutSessionExerciseSetModel {
  return {
    id: null,
    clientId: createClientId("new-session-set"),

    // A set created during the session has no source workout-plan set.
    workoutExerciseSetId: null,

    setNumber,
    reps: null,
    weight: null,
    distance: null,
    duration: null,
    performedAt: null,
    completedAt: null,
  };
}

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

        // TODO: Return and preserve this ID from the backend later.
        // Right now finishing the session may clear the existing workout_exercise_set_id
        workoutExerciseSetId: null,
      }));

      return {
        ...sessionExercise,
        clientId: `existing-session-exercise-${sessionExercise.id}`,

        // TODO: Return and preserve this ID from the backend later.
        // Right now finishing the session may clear the existing workout_exercise_id
        workoutExerciseId: null,

        exercise,
        sets: mappedSets.length > 0 ? mappedSets : [createEmptySessionSet(1)],
      };
    }),
  };
};

// Exercise -> Workout Session Exercise UI
function mapExerciseToSessionExerciseModel(
  exercise: Exercise,
  orderIndex: number,
): WorkoutSessionExerciseModel {
  const firstSet = createEmptySessionSet(1);

  return {
    id: null,
    clientId: createClientId("new-session-exercise"),

    // An exercise added during the session has no source workout-plan row.
    workoutExerciseId: null,

    orderIndex,
    restTime: exercise.defaultRestTime ?? null,
    completedAt: null,
    exercise,
    sets: [firstSet],
  };
}

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
      id: sessionExercise.id,

      // TODO: Existing planned exercises are currently mapped to null because
      // the backend response does not expose workoutExerciseId. The finish
      // endpoint may therefore clear workout_exercise_id. Preserve the ID once
      // the backend includes it in WorkoutSessionExerciseDto.
      workoutExerciseId: sessionExercise.workoutExerciseId,

      exerciseId: sessionExercise.exercise.id,
      orderIndex: sessionExercise.orderIndex,
      restTime: sessionExercise.restTime,
      completedAt: sessionExercise.completedAt,
      sets: sessionExercise.sets.map((set) => ({
        id: set.id,

        // TODO: Existing planned sets are currently mapped to null because the
        // backend response does not expose workoutExerciseSetId. The finish
        // endpoint may therefore clear workout_exercise_set_id. Preserve the
        // ID once the backend includes it in WorkoutSessionExerciseSetDto.
        workoutExerciseSetId: set.workoutExerciseSetId,

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

// Set input value helpers
// Commit inherited placeholder values into empty set fields
export function commitInheritedSetValues({
  set,
  sets,
  currentIndex,
  exercise,
}: {
  set: WorkoutSessionExerciseSetModel;
  sets: WorkoutSessionExerciseSetModel[];
  currentIndex: number;
  exercise: WorkoutSessionExerciseModel;
}): WorkoutSessionExerciseSetModel {
  const fields = Array.from(
    getExerciseFields(exercise.exercise.category?.code),
  );

  return fields.reduce<WorkoutSessionExerciseSetModel>((updatedSet, field) => {
    const currentValue = getWorkoutSessionSetValue(updatedSet, field);

    // If user already typed a value, do not overwrite it.
    if (currentValue != null) {
      return updatedSet;
    }

    const inheritedValue = getPreviousSetValue({
      sets,
      currentIndex,
      field,
    });

    // If there is no previous value, keep it empty.
    if (inheritedValue == null) {
      return updatedSet;
    }

    return updateWorkoutSessionSetValue(updatedSet, field, inheritedValue);
  }, set);
}

// Get nearest previous actual value for a set field
export function getPreviousSetValue({
  sets,
  currentIndex,
  field,
}: {
  sets: WorkoutSessionExerciseSetModel[];
  currentIndex: number;
  field: ExerciseFieldKey;
}): number | null {
  for (let index = currentIndex - 1; index >= 0; index--) {
    const previousSet = sets[index];

    if (!previousSet) {
      continue;
    }

    const previousValue = getWorkoutSessionSetValue(previousSet, field);

    if (previousValue != null) {
      return previousValue;
    }
  }

  return null;
}

// Get actual value from a session set field
export function getWorkoutSessionSetValue(
  set: WorkoutSessionExerciseSetModel,
  field: ExerciseFieldKey,
): number | null {
  return set[field] ?? null;
}

// Update actual value for a session set field
function updateWorkoutSessionSetValue(
  set: WorkoutSessionExerciseSetModel,
  field: ExerciseFieldKey,
  value: number | null,
): WorkoutSessionExerciseSetModel {
  return {
    ...set,
    [field]: value,
  };
}
