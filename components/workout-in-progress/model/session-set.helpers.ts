import { createClientId } from "@/lib/id/utils";
import { ExerciseFieldKey, getExerciseFields } from "@/lib/workout/config";
import {
  WorkoutSessionExerciseModel,
  WorkoutSessionExerciseSetModel,
} from "@/types/workout/model/workout.types";

// Create empty session set
export function createEmptySessionSet(
  setNumber = 1,
): WorkoutSessionExerciseSetModel {
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

// Get progress label for exercise
export function getExerciseProgressText(exercise: WorkoutSessionExerciseModel) {
  const completedCount = exercise.sets.filter(
    (set) => !!set.completedAt,
  ).length;

  const totalCount = exercise.sets.length;

  if (totalCount === 0) {
    return "No sets yet";
  }

  if (completedCount === totalCount) {
    return `Completed • ${completedCount}/${totalCount} sets`;
  }

  return `In progress • ${completedCount}/${totalCount} sets`;
}

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
  const trackingTypeCode = exercise.exercise.trackingType?.code;

  const fields = getExerciseFields(trackingTypeCode);

  return fields.reduce<WorkoutSessionExerciseSetModel>((updatedSet, field) => {
    const currentValue = getWorkoutSessionSetValue(updatedSet, field);

    if (currentValue != null) {
      return updatedSet;
    }

    const inheritedValue = getPreviousSetValue({
      sets,
      currentIndex,
      field,
    });

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
export function updateWorkoutSessionSetValue(
  set: WorkoutSessionExerciseSetModel,
  field: ExerciseFieldKey,
  value: number | null,
): WorkoutSessionExerciseSetModel {
  return {
    ...set,
    [field]: value,
  };
}
