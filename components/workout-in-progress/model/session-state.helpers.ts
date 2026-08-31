import { createClientId } from "@/lib/id/utils";
import {
  WorkoutSessionExerciseModel,
  WorkoutSessionExerciseSetModel,
  WorkoutSessionModel,
} from "@/types/workout/model/workout.types";
import { Exercise } from "@/types/workout/response/exercise.types";

// Add set to exercise
export function addSessionSet(
  session: WorkoutSessionModel,
  exerciseClientId: string,
): WorkoutSessionModel {
  return {
    ...session,
    sessionExercises: session.sessionExercises.map((exercise) => {
      if (exercise.clientId !== exerciseClientId) {
        return exercise;
      }

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
      if (exercise.clientId !== exerciseClientId) {
        return exercise;
      }

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
        exercise: selectedExercise,
        restTime: selectedExercise.defaultRestTime ?? null,
        completedAt: null,
        sets:
          sessionExercise.sets.length > 0
            ? sessionExercise.sets.map((set) => ({
                ...set,
                completedAt: null,
              }))
            : [createEmptySessionSet(1)],
      };
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

function mapExerciseToSessionExerciseModel(
  exercise: Exercise,
  orderIndex: number,
): WorkoutSessionExerciseModel {
  return {
    id: null,
    clientId: createClientId("new-session-exercise"),
    orderIndex,
    restTime: exercise.defaultRestTime ?? null,
    completedAt: null,
    exercise,
    sets: [createEmptySessionSet(1)],
  };
}
