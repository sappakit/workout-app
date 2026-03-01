import { ExerciseType } from "@/types/workout/exercise.types";
import {
  WorkoutExerciseItem,
  WorkoutResponse,
} from "@/types/workout/workout.types";

export function calculateExerciseDuration({
  item,
  timeType = "minutes",
}: {
  item: WorkoutExerciseItem;
  timeType?: "seconds" | "minutes";
}): number {
  const { plannedDuration, plannedRestTime, plannedSets, exercise } = item;

  // If planned duration exists, use it
  if (plannedDuration && plannedDuration > 0) {
    return Math.round(plannedDuration / 60);
  }

  const sets = plannedSets ?? exercise.defaultSets ?? 0;
  const setTime = exercise.defaultDuration ?? 0;
  const restTime = plannedRestTime ?? exercise.defaultRestTime ?? 0;

  if (sets <= 0) return 0;

  const totalSeconds = sets * (setTime + restTime);
  return timeType === "minutes" ? Math.round(totalSeconds / 60) : totalSeconds;
}

export function calculateWorkoutDuration(workout: WorkoutResponse): number {
  // If workout has duration, use it
  if (workout.duration && workout.duration > 0) {
    return Math.round(workout.duration / 60);
  }

  const totalSeconds = workout.workoutExercises.reduce(
    (sum, item) =>
      sum + calculateExerciseDuration({ item, timeType: "seconds" }),
    0,
  );

  return Math.round(totalSeconds / 60);
}

export function calculateWorkoutCalories(workout: WorkoutResponse): number {
  let totalCalories = 0;

  workout.workoutExercises.forEach((item) => {
    const { plannedSets, plannedDuration, exercise } = item;

    const sets = plannedSets ?? exercise.defaultSets ?? 0;
    const baseCalories = exercise.defaultCaloriesBurned ?? 0;

    switch (exercise.exerciseType) {
      case ExerciseType.CARDIO: {
        // Calories per minute
        const durationSeconds =
          plannedDuration ?? exercise.defaultDuration ?? 0;

        const durationMinutes = durationSeconds / 60;

        totalCalories += durationMinutes * baseCalories;
        break;
      }

      // Calories per set
      case ExerciseType.WEIGHT:
      case ExerciseType.CALISTHENICS:
        totalCalories += sets * baseCalories;
        break;

      default:
        break;
    }
  });

  return Math.round(totalCalories);
}
