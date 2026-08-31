export type ExerciseFieldKey = "weight" | "reps" | "distance" | "duration";

export const exerciseCategoryFields: Record<string, ExerciseFieldKey[]> = {
  strength: ["weight", "reps"],
  calisthenics: ["weight", "reps"],
  cardio: ["distance", "duration"],
};

export function getExerciseFields(
  categoryCode: string | null | undefined,
): ExerciseFieldKey[] {
  if (!categoryCode) return [];

  return exerciseCategoryFields[categoryCode] ?? [];
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

export function getExerciseFieldConfig(
  field: ExerciseFieldKey,
): ExerciseFieldConfig {
  return exerciseFieldConfig[field];
}
