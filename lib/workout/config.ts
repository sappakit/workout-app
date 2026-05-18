import { ExerciseType } from "@/types/workout/response/exercise.types";

export type ExerciseFieldKey = "reps" | "weight" | "duration" | "distance";

export const exerciseTypeFields: Record<ExerciseType, ExerciseFieldKey[]> = {
  [ExerciseType.STRENGTH]: ["weight", "reps"],
  [ExerciseType.CALISTHENICS]: ["weight", "reps"],
  [ExerciseType.CARDIO]: ["duration", "distance"],
};

export function getExerciseFields(type: ExerciseType) {
  return new Set(exerciseTypeFields[type]);
}
