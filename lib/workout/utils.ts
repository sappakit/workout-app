import { ExerciseType } from "@/types/workout/response/exercise.types";
import {
  WorkoutExerciseItem,
  WorkoutResponse,
} from "@/types/workout/response/workout.types";

type DurationOptions = {
  // Default: minutes
  timeType?: "seconds" | "minutes";
};

// Calcurate total calories used for the workout program
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
      case ExerciseType.STRENGTH:
      case ExerciseType.CALISTHENICS:
        totalCalories += sets * baseCalories;
        break;

      default:
        break;
    }
  });

  return Math.round(totalCalories);
}

// Duration
// Calculate the duration of a single exercise
export function calculateExerciseDuration(
  item: WorkoutExerciseItem,
  options?: DurationOptions,
): number {
  const { plannedDuration, plannedRestTime, plannedSets, exercise } = item;

  // If planned duration exists, use it
  if (plannedDuration && plannedDuration > 0) {
    return options?.timeType === "seconds"
      ? plannedDuration
      : Math.round(plannedDuration / 60);
  }

  const sets = plannedSets ?? exercise.defaultSets ?? 0;
  const setTime = exercise.defaultDuration ?? 0;
  const restTime = plannedRestTime ?? exercise.defaultRestTime ?? 0;

  if (sets <= 0) return 0;

  const totalSeconds = sets * (setTime + restTime);
  return options?.timeType === "seconds"
    ? totalSeconds
    : Math.round(totalSeconds / 60);
}

// Calculate the total duration of a list of exercises
export function calculateWorkoutDurationFromExercises(
  exercises: WorkoutExerciseItem[],
  options?: DurationOptions,
): number {
  const totalSeconds = exercises.reduce(
    (sum, item) =>
      sum + calculateExerciseDuration(item, { timeType: "seconds" }),
    0,
  );

  return options?.timeType === "seconds"
    ? totalSeconds
    : Math.round(totalSeconds / 60);
}

// Calculate the duration of the entire workout program
export function calculateWorkoutDuration(workout: WorkoutResponse): number {
  // If workout has duration, use it
  if (workout.duration && workout.duration > 0) {
    return Math.round(workout.duration / 60);
  }

  return calculateWorkoutDurationFromExercises(workout.workoutExercises);
}
