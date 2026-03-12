import { ExerciseType } from "@/types/workout/response/exercise.types";

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
      "plannedRestTime",
      "plannedWeight",
    ],
    requiredFields: ["plannedSets", "plannedRepsRange", "plannedRestTime"],
  },

  [ExerciseType.CARDIO]: {
    visibleFields: ["plannedDuration", "plannedDistance"],
    requiredFields: ["plannedDuration"],
  },

  [ExerciseType.CALISTHENICS]: {
    visibleFields: ["plannedSets", "plannedRepsRange", "plannedRestTime"],
    requiredFields: ["plannedSets", "plannedRepsRange", "plannedRestTime"],
  },
};
