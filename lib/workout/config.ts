import { ExerciseTrackingTypeCode } from "@/types/workout/response/exercise.types";

export type ExerciseFieldKey = "weight" | "reps" | "distance" | "duration";

export type ExerciseInputType = "number-input" | "duration-picker";

export const exerciseTrackingTypeFields: Record<
  ExerciseTrackingTypeCode,
  ExerciseFieldKey[]
> = {
  weight_reps: ["weight", "reps"],
  reps: ["reps"],
  duration: ["duration"],
  distance_duration: ["distance", "duration"],
  weighted_bodyweight: ["weight", "reps"],
  assisted_bodyweight: ["weight", "reps"],
  weight_distance: ["weight", "distance"],
  weight_duration: ["weight", "duration"],
};

export function getExerciseFields(
  trackingTypeCode: ExerciseTrackingTypeCode | null | undefined,
): ExerciseFieldKey[] {
  if (!trackingTypeCode) {
    throw new Error("Exercise tracking type is required.");
  }

  const fields = exerciseTrackingTypeFields[trackingTypeCode];

  if (!fields) {
    throw new Error(
      `Unsupported exercise tracking type: "${trackingTypeCode}".`,
    );
  }

  return fields;
}

export type ExerciseFieldConfig = {
  inputType: ExerciseInputType;
  label: string;
  placeholder: string;
  allowDecimal?: boolean;
  min?: number;
  max?: number;
};

export const exerciseFieldConfig: Record<
  ExerciseFieldKey,
  ExerciseFieldConfig
> = {
  weight: {
    inputType: "number-input",
    label: "LOAD",
    placeholder: "-",
    allowDecimal: true,
    min: 0,
  },

  reps: {
    inputType: "number-input",
    label: "REPS",
    placeholder: "-",
    allowDecimal: false,
    min: 0,
  },

  distance: {
    inputType: "number-input",
    label: "DIST",
    placeholder: "-",
    allowDecimal: true,
    min: 0,
  },

  duration: {
    inputType: "duration-picker",
    label: "TIME",
    placeholder: "-",
    min: 0,
  },
};

export function getExerciseFieldConfig(
  field: ExerciseFieldKey,
): ExerciseFieldConfig {
  return exerciseFieldConfig[field];
}
