import { ExerciseType } from "@/types/workout/response/exercise.types";

export type ExerciseFieldKey = "weight" | "reps" | "distance" | "duration";

export const exerciseTypeFields: Record<ExerciseType, ExerciseFieldKey[]> = {
  [ExerciseType.STRENGTH]: ["weight", "reps"],
  [ExerciseType.CALISTHENICS]: ["weight", "reps"],
  [ExerciseType.CARDIO]: ["distance", "duration"],
};

export function getExerciseFields(type: ExerciseType): ExerciseFieldKey[] {
  return exerciseTypeFields[type] ?? [];
}

export type ExerciseFieldConfig = {
  label: string;
  placeholder: string;
  allowDecimal: boolean;
  min: number;
  max?: number;
};

export const exerciseFieldConfig: Record<
  ExerciseFieldKey,
  ExerciseFieldConfig
> = {
  weight: {
    label: "LOAD",
    placeholder: "-",
    allowDecimal: true,
    min: 0,
  },
  reps: {
    label: "REPS",
    placeholder: "-",
    allowDecimal: false,
    min: 0,
  },
  distance: {
    label: "DIST",
    placeholder: "-",
    allowDecimal: true,
    min: 0,
  },
  duration: {
    label: "TIME",
    placeholder: "-",
    allowDecimal: false,
    min: 0,
  },
};

export function getExerciseFieldConfig(field: ExerciseFieldKey) {
  return exerciseFieldConfig[field];
}
