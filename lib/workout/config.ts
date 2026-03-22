import { EditPlanForm } from "@/schemas/edit-plan.schema";
import { ExerciseType } from "@/types/workout/response/exercise.types";
import { FieldPath } from "react-hook-form";

export type ExerciseFieldKey =
  | "plannedSets"
  | "plannedRepsRange"
  | "plannedRestTime"
  | "plannedDuration"
  | "plannedDistance"
  | "plannedWeight";

export interface ExerciseTypeFieldConfig {
  visibleFields: ExerciseFieldKey[];
  requiredFields: ExerciseFieldKey[];
}

export const exerciseTypeFieldConfig: Record<
  ExerciseType,
  ExerciseTypeFieldConfig
> = {
  [ExerciseType.STRENGTH]: {
    visibleFields: [
      "plannedSets",
      "plannedRepsRange",
      "plannedWeight",
      "plannedRestTime",
    ],
    requiredFields: ["plannedSets", "plannedRepsRange", "plannedRestTime"],
  },

  [ExerciseType.CARDIO]: {
    visibleFields: ["plannedDuration", "plannedDistance"],
    requiredFields: ["plannedDuration"],
  },

  [ExerciseType.CALISTHENICS]: {
    visibleFields: [
      "plannedSets",
      "plannedRepsRange",
      "plannedWeight",
      "plannedRestTime",
    ],
    requiredFields: ["plannedSets", "plannedRepsRange", "plannedRestTime"],
  },
};

export function getVisibleFields(typeConfig: ExerciseTypeFieldConfig) {
  return new Set(typeConfig.visibleFields);
}

export const getExerciseFieldNames = (
  index: number,
  typeConfig: ExerciseTypeFieldConfig,
): FieldPath<EditPlanForm>[] => {
  const visibleFields = getVisibleFields(typeConfig);
  const names: FieldPath<EditPlanForm>[] = [];

  if (visibleFields.has("plannedSets")) {
    names.push(`workoutExercises.${index}.plannedSets`);
  }

  if (visibleFields.has("plannedRepsRange")) {
    names.push(
      `workoutExercises.${index}.plannedRepsMin`,
      `workoutExercises.${index}.plannedRepsMax`,
    );
  }

  if (visibleFields.has("plannedWeight")) {
    names.push(`workoutExercises.${index}.plannedWeight`);
  }

  if (visibleFields.has("plannedRestTime")) {
    names.push(
      `workoutExercises.${index}.plannedRestMinutes`,
      `workoutExercises.${index}.plannedRestSeconds`,
    );
  }

  if (visibleFields.has("plannedDuration")) {
    names.push(
      `workoutExercises.${index}.plannedDurationMinutes`,
      `workoutExercises.${index}.plannedDurationSeconds`,
    );
  }

  if (visibleFields.has("plannedDistance")) {
    names.push(`workoutExercises.${index}.plannedDistance`);
  }

  return names;
};
