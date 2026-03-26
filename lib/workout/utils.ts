import { ExerciseType } from "@/types/workout/response/exercise.types";
import { WorkoutResponse } from "@/types/workout/response/workout.types";
import { hmsToSeconds } from "./mappers";

/* Duration */
type DurationOptions = {
  timeType?: "seconds" | "minutes";
};

// Exercise shape for calculations (API [seconds]/form [minutes/seconds])
type ExerciseDurationInput = {
  plannedSets: number | null;

  plannedRestTime?: number | null;
  plannedRestMinutes?: number | null;
  plannedRestSeconds?: number | null;

  plannedDuration?: number | null;
  plannedDurationMinutes?: number | null;
  plannedDurationSeconds?: number | null;

  exercise: {
    exerciseType: ExerciseType;

    defaultSets?: number | null;
    defaultDuration?: number | null;
    defaultRestTime?: number | null;
  };
};

function convertDuration(seconds: number, options?: DurationOptions) {
  return options?.timeType === "seconds" ? seconds : Math.round(seconds / 60);
}

function getPlannedRestTimeSeconds(item: ExerciseDurationInput): number | null {
  if (item.plannedRestTime != null) return item.plannedRestTime;

  return hmsToSeconds(0, item.plannedRestMinutes, item.plannedRestSeconds);
}

function getPlannedDurationSeconds(item: ExerciseDurationInput): number | null {
  if (item.plannedDuration != null) return item.plannedDuration;

  return hmsToSeconds(
    0,
    item.plannedDurationMinutes,
    item.plannedDurationSeconds,
  );
}

// Calculate the duration of a single exercise
export function calculateExerciseDuration(
  item: ExerciseDurationInput,
  options?: DurationOptions,
): number {
  const plannedDuration = getPlannedDurationSeconds(item);
  const plannedRestTime = getPlannedRestTimeSeconds(item);

  const defaultDuration = item.exercise.defaultDuration ?? 0;

  // Explicit planned duration always takes priority
  if (plannedDuration != null && plannedDuration > 0) {
    return convertDuration(plannedDuration, options);
  }

  // Cardio: use duration directly
  if (item.exercise.exerciseType === ExerciseType.CARDIO) {
    return convertDuration(defaultDuration, options);
  }

  const sets = item.plannedSets ?? item.exercise.defaultSets ?? 0;
  const setTime = defaultDuration;
  const restTime = plannedRestTime ?? item.exercise.defaultRestTime ?? 0;

  if (sets <= 0) return 0;

  const totalSeconds = sets * setTime + Math.max(sets - 1, 0) * restTime;

  return convertDuration(totalSeconds, options);
}

// Calculate the total duration of a list of exercises
export function calculateWorkoutDurationFromExercises(
  exercises: ExerciseDurationInput[],
  options?: DurationOptions,
): number {
  const totalSeconds = exercises.reduce(
    (sum, item) =>
      sum + calculateExerciseDuration(item, { timeType: "seconds" }),
    0,
  );

  return convertDuration(totalSeconds, options);
}

// Calculate the duration of the entire workout program
export function calculateWorkoutDuration(workout: WorkoutResponse): number {
  if (workout.duration != null && workout.duration > 0) {
    return convertDuration(workout.duration, { timeType: "minutes" });
  }

  return calculateWorkoutDurationFromExercises(workout.workoutExercises);
}

/* Calories */
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
