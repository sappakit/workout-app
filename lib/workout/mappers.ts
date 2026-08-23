import { EditPlanForm } from "@/schemas/edit-plan.schema";
import {
  WorkoutExerciseItemModel,
  WorkoutExerciseSetModel,
} from "@/types/workout/model/workout-plan.types";
import {
  UpdateWorkoutExercisePayload,
  UpdateWorkoutExerciseSetPayload,
  UpdateWorkoutPayload,
} from "@/types/workout/payload/edit-plan.types";
import { Exercise } from "@/types/workout/response/exercise.types";
import {
  WorkoutExerciseItem,
  WorkoutExerciseSet,
  WorkoutResponse,
} from "@/types/workout/response/workout.types";
import { createClientId } from "../id/utils";
import { hmsToSeconds, secondsToHMS } from "./duration.utils";
import {
  requireWorkoutExercise,
  requireWorkoutExercises,
  requireWorkoutExerciseSets,
  requireWorkoutMuscle,
  requireWorkoutMuscles,
} from "./utils/response-guards.utils";

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

// unknown value -> number or null
export function toNumberOrNull(value: unknown): number | null {
  if (value == null || value === "") {
    return null;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : null;
}

// API workout exercise set -> Form set
export function mapWorkoutExerciseSetToFormSet(
  set: WorkoutExerciseSet,
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
  item: WorkoutExerciseItem,
): EditPlanForm["workoutExercises"][number] {
  const exercise = requireWorkoutExercise(item);
  const sets = requireWorkoutExerciseSets(item);

  return {
    id: item.id,
    clientId: `existing-workout-exercise-${item.id}`,
    orderIndex: item.orderIndex,
    restTime: item.restTime,
    exercise,
    sets:
      sets.length > 0
        ? sets.map(mapWorkoutExerciseSetToFormSet)
        : [createEmptyWorkoutExerciseFormSet(1)],
  };
}

// API workout response -> Edit plan form
export function mapWorkoutResponseToEditPlanForm(
  data: WorkoutResponse,
): EditPlanForm {
  const workoutExercises = requireWorkoutExercises(data);
  const workoutMuscles = requireWorkoutMuscles(data);

  return {
    name: data.name,
    workoutFocusTypeId: data.workoutFocusType?.id ?? null,
    targetMuscles: workoutMuscles.map((workoutMuscle) => {
      const muscle = requireWorkoutMuscle(workoutMuscle);

      return muscle.id;
    }),
    duration: data.duration ?? 0,
    autoFillMuscles: false,
    autoFillDuration: false,

    workoutExercises: workoutExercises.map(mapWorkoutExerciseToFormItem),
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

// Form set -> Workout exercise set model
export function mapEditPlanSetToWorkoutExerciseSet(
  set: EditPlanForm["workoutExercises"][number]["sets"][number],
): WorkoutExerciseSetModel {
  return {
    id: set.id,
    clientId: set.clientId,
    setNumber: set.setNumber,
    reps: set.reps,
    weight: set.weight,
    distance: set.distance,
    duration: hmsToSeconds(0, set.durationMinutes, set.durationSeconds),
  };
}

// Form workout exercise -> Workout exercise item model
export function mapEditPlanExerciseToWorkoutExerciseItem(
  item: EditPlanForm["workoutExercises"][number],
): WorkoutExerciseItemModel {
  return {
    id: item.id,
    clientId: item.clientId,
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
    difficultyLevel: exercise.difficultyLevel ?? null,

    defaultCaloriesBurned: exercise.defaultCaloriesBurned ?? null,
    defaultDuration: exercise.defaultDuration ?? null,
    defaultRestTime: exercise.defaultRestTime ?? null,
    defaultRepsRange: exercise.defaultRepsRange ?? null,
    defaultSets: exercise.defaultSets ?? null,

    demoLink: exercise.demoLink ?? null,
    howToPerform: exercise.howToPerform ?? null,

    sourceExternalId: exercise.sourceExternalId ?? null,
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
