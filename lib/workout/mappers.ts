import { EditPlanForm } from "@/schemas/edit-plan.schema";
import {
  UpdateWorkoutExercisePayload,
  UpdateWorkoutExerciseSetPayload,
  UpdateWorkoutPayload,
} from "@/types/workout/payload/edit-plan.types";
import { Exercise } from "@/types/workout/response/exercise.types";
import {
  WorkoutExerciseItem,
  WorkoutResponse,
} from "@/types/workout/response/workout.types";
import { createClientId } from "../id/utils";

export type RepsRange = {
  minReps: number | null;
  maxReps: number | null;
};

// repsRange string -> min/max reps
export function parseRepsRange(repsRange: string | null): RepsRange {
  const [minRepsRaw, maxRepsRaw] = repsRange ? repsRange.split("-") : [];

  return {
    minReps: toNumberOrNull(minRepsRaw),
    maxReps: toNumberOrNull(maxRepsRaw),
  };
}

// seconds -> { hours, minutes, seconds }
export function secondsToHMS(totalSeconds: number | null | undefined) {
  if (totalSeconds == null) {
    return { hours: null, minutes: null, seconds: null };
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
}

// (hours, minutes, seconds) -> seconds
export function hmsToSeconds(
  hours: number | null | undefined,
  minutes: number | null | undefined,
  seconds: number | null | undefined,
) {
  if (hours == null || minutes == null || seconds == null) return null;

  return hours * 3600 + minutes * 60 + seconds;
}

// unknown value -> number or null
export function toNumberOrNull(value: unknown): number | null {
  if (value == null || value === "") return null;

  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

// API workout exercise set -> Form set
export function mapWorkoutExerciseSetToFormSet(
  set: WorkoutExerciseItem["sets"][number],
): EditPlanForm["workoutExercises"][number]["sets"][number] {
  const duration = secondsToHMS(set.duration);

  return {
    id: set.id,
    clientId: `existing-workout-exercise-set-${set.id}`,
    setNumber: set.setNumber,
    reps: set.reps,
    weight: set.weight,
    distance: set.distance,
    durationMinutes: duration.minutes,
    durationSeconds: duration.seconds,
  };
}

// API workout exercise -> Form item
export function mapWorkoutExerciseToFormItem(
  item: WorkoutResponse["workoutExercises"][number],
): EditPlanForm["workoutExercises"][number] {
  return {
    id: item.id,
    clientId: `existing-workout-exercise-${item.id}`,
    orderIndex: item.orderIndex,
    restTime: item.restTime,
    exercise: item.exercise,
    sets:
      item.sets.length > 0
        ? item.sets.map(mapWorkoutExerciseSetToFormSet)
        : [createEmptyWorkoutExerciseFormSet(1)],
  };
}

// API workout response -> Edit plan form
export function mapWorkoutResponseToEditPlanForm(
  data: WorkoutResponse,
): EditPlanForm {
  return {
    name: data.name,
    workoutFocusTypeId: data.workoutFocusType?.id ?? null,
    targetMuscles: data.muscles.map((item) => item.muscle.id),
    duration: data.duration ?? 0,
    autoFillMuscles: false,
    autoFillDuration: false,

    workoutExercises: data.workoutExercises.map(mapWorkoutExerciseToFormItem),
  };
}

// Form set -> API payload set
export function mapWorkoutExerciseFormSetToPayload(
  set: EditPlanForm["workoutExercises"][number]["sets"][number],
): UpdateWorkoutExerciseSetPayload {
  return {
    id: set.id,
    setNumber: set.setNumber,
    reps: set.reps,
    weight: set.weight,
    distance: set.distance,
    duration: hmsToSeconds(0, set.durationMinutes, set.durationSeconds),
  };
}

// Form workout exercise -> API payload workout exercise
export function mapWorkoutExerciseFormToPayload(
  item: EditPlanForm["workoutExercises"][number],
): UpdateWorkoutExercisePayload {
  return {
    id: item.id,
    orderIndex: item.orderIndex,
    restTime: item.restTime,
    exerciseId: item.exercise.id,
    sets: item.sets.map(mapWorkoutExerciseFormSetToPayload),
  };
}

// Edit plan form -> API update workout payload
export function mapEditPlanFormToUpdateWorkoutPayload(
  values: EditPlanForm,
): UpdateWorkoutPayload {
  return {
    name: values.name.trim(),
    workoutFocusTypeId: values.workoutFocusTypeId,
    targetMuscles: values.targetMuscles,
    duration: values.duration,
    workoutExercises: values.workoutExercises.map(
      mapWorkoutExerciseFormToPayload,
    ),
  };
}

// Form set -> WorkoutExerciseSet response-like item
export function mapEditPlanSetToWorkoutExerciseSet(
  set: EditPlanForm["workoutExercises"][number]["sets"][number],
): WorkoutExerciseItem["sets"][number] {
  return {
    id: set.id,
    setNumber: set.setNumber,
    reps: set.reps,
    weight: set.weight,
    distance: set.distance,
    duration: hmsToSeconds(0, set.durationMinutes, set.durationSeconds),
  };
}

// Form workout exercise -> WorkoutExerciseItem response-like item
export function mapEditPlanExerciseToWorkoutExerciseItem(
  item: EditPlanForm["workoutExercises"][number],
): WorkoutExerciseItem {
  return {
    id: item.id,
    orderIndex: item.orderIndex,
    restTime: item.restTime,
    exercise: normalizeExercise(item.exercise),
    sets: item.sets.map(mapEditPlanSetToWorkoutExerciseSet),
  };
}

// Form exercise shape -> normalized Exercise response shape
function normalizeExercise(
  exercise: EditPlanForm["workoutExercises"][number]["exercise"],
): Exercise {
  return {
    ...exercise,
    description: exercise.description ?? null,
    imageUrl: exercise.imageUrl ?? null,

    defaultCaloriesBurned: exercise.defaultCaloriesBurned ?? null,
    defaultDuration: exercise.defaultDuration ?? null,
    defaultRestTime: exercise.defaultRestTime ?? null,
    defaultRepsRange: exercise.defaultRepsRange ?? null,
    defaultSets: exercise.defaultSets ?? null,

    demoLink: exercise.demoLink ?? null,
    howToPerform: exercise.howToPerform ?? null,

    muscles: exercise.muscles ?? null,
    equipmentLinks: exercise.equipmentLinks ?? null,
  };
}

// Create empty workout exercise form set
export function createEmptyWorkoutExerciseFormSet(
  setNumber = 1,
): EditPlanForm["workoutExercises"][number]["sets"][number] {
  return {
    id: null,
    clientId: createClientId("new-workout-exercise-set"),
    setNumber,
    reps: null,
    weight: null,
    distance: null,
    durationMinutes: null,
    durationSeconds: null,
  };
}

// Exercise from picker -> new workout exercise form item
export function mapExerciseToCreateWorkoutExerciseFormItem(
  exercise: Exercise,
  orderIndex: number,
): EditPlanForm["workoutExercises"][number] {
  return {
    id: null,
    clientId: createClientId("new-workout-exercise"),
    orderIndex,
    restTime: null,
    exercise,
    sets: [createEmptyWorkoutExerciseFormSet(1)],
  };
}
