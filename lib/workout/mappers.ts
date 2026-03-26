import { EditPlanForm } from "@/schemas/edit-plan.schema";
import {
  UpdateWorkoutExercisePayload,
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

// min/max reps -> repsRange string
export function formatRepsRange({
  minReps,
  maxReps,
}: RepsRange): string | null {
  if (minReps == null || maxReps == null) return null;
  return `${minReps}-${maxReps}`;
}

export function secondsToHMS(totalSeconds: number | null | undefined) {
  if (totalSeconds == null) {
    return { hours: null, minutes: null, seconds: null };
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
}

export function hmsToSeconds(
  hours: number | null | undefined,
  minutes: number | null | undefined,
  seconds: number | null | undefined,
) {
  if (hours == null || minutes == null || seconds == null) return null;

  return hours * 3600 + minutes * 60 + seconds;
}

export function toNumberOrNull(value: unknown): number | null {
  if (value == null || value === "") return null;

  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

// API payload -> Form
export function mapWorkoutExerciseToFormItem(
  item: WorkoutResponse["workoutExercises"][number],
): EditPlanForm["workoutExercises"][number] {
  const { minReps, maxReps } = parseRepsRange(item.plannedRepsRange);
  const rest = secondsToHMS(item.plannedRestTime);
  const duration = secondsToHMS(item.plannedDuration);

  return {
    id: item.id,
    clientId: `existing-${item.id}`,
    orderIndex: item.orderIndex,
    plannedSets: item.plannedSets,

    // plannedRepsRange
    plannedRepsMin: minReps,
    plannedRepsMax: maxReps,

    plannedWeight: item.plannedWeight,

    // plannedRestTime
    plannedRestMinutes: rest.minutes,
    plannedRestSeconds: rest.seconds,

    // plannedDuration
    plannedDurationMinutes: duration.minutes,
    plannedDurationSeconds: duration.seconds,

    plannedDistance: item.plannedDistance,

    exercise: item.exercise,
  };
}

export function mapWorkoutResponseToEditPlanForm(
  data: WorkoutResponse,
): EditPlanForm {
  const duration = secondsToHMS(data.duration);

  return {
    name: data.name,
    workoutFocusTypeId: data.workoutFocusType.id,
    targetMuscles: data.muscles.map((item) => item.muscle.id),

    // plannedDuration
    durationHours: duration.hours ?? 0,
    durationMinutes: duration.minutes ?? 0,
    durationSeconds: duration.seconds ?? 0,

    autoFillMuscles: false,
    autoFillDuration: false,

    workoutExercises: data.workoutExercises.map(mapWorkoutExerciseToFormItem),
  };
}

// Form -> API payload
export function mapWorkoutExerciseFormToPayload(
  item: EditPlanForm["workoutExercises"][number],
): UpdateWorkoutExercisePayload {
  return {
    id: item.id,
    orderIndex: item.orderIndex,
    plannedSets: item.plannedSets,

    plannedRepsRange: formatRepsRange({
      minReps: item.plannedRepsMin,
      maxReps: item.plannedRepsMax,
    }),

    plannedWeight: item.plannedWeight,

    // plannedRestTime
    plannedRestTime: hmsToSeconds(
      0,
      item.plannedRestMinutes,
      item.plannedRestSeconds,
    ),

    // plannedDuration
    plannedDuration: hmsToSeconds(
      0,
      item.plannedDurationMinutes,
      item.plannedDurationSeconds,
    ),

    plannedDistance: item.plannedDistance,
    exerciseId: item.exercise.id,
  };
}

export function mapEditPlanFormToUpdateWorkoutPayload(
  values: EditPlanForm,
): UpdateWorkoutPayload {
  return {
    name: values.name.trim(),
    workoutFocusTypeId: values.workoutFocusTypeId,
    targetMuscles: values.targetMuscles,
    duration:
      hmsToSeconds(
        values.durationHours,
        values.durationMinutes,
        values.durationSeconds,
      ) ?? 0,
    workoutExercises: values.workoutExercises.map(
      mapWorkoutExerciseFormToPayload,
    ),
  };
}

// Form -> WorkoutExerciseItem (for ExerciseCardBase ui)
export function mapEditPlanExerciseToWorkoutExerciseItem(
  item: EditPlanForm["workoutExercises"][number],
): WorkoutExerciseItem {
  return {
    ...item,
    plannedRepsRange: formatRepsRange({
      minReps: item.plannedRepsMin,
      maxReps: item.plannedRepsMax,
    }),
    plannedRestTime: hmsToSeconds(
      0,
      item.plannedRestMinutes,
      item.plannedRestSeconds,
    ),
    plannedDuration: hmsToSeconds(
      0,
      item.plannedDurationMinutes,
      item.plannedDurationSeconds,
    ),
  };
}

// Exercise (from Add Exercise picker) -> CreateWorkoutExerciseFormItem (for Edit plan ui)
export function mapExerciseToCreateWorkoutExerciseFormItem(
  exercise: Exercise,
  orderIndex: number,
): EditPlanForm["workoutExercises"][number] {
  const reps = parseRepsRange(exercise.defaultRepsRange ?? null);
  const rest = secondsToHMS(exercise.defaultRestTime);
  const duration = secondsToHMS(exercise.defaultDuration);

  return {
    id: null, // new workoutExercise item
    clientId: createClientId("new"),
    orderIndex,
    plannedSets: exercise.defaultSets ?? null,

    plannedRepsMin: reps.minReps,
    plannedRepsMax: reps.maxReps,

    plannedWeight: null,

    plannedRestMinutes: rest.minutes,
    plannedRestSeconds: rest.seconds,

    plannedDurationMinutes: duration.minutes,
    plannedDurationSeconds: duration.seconds,

    plannedDistance: null,
    exercise,
  };
}
