import { requireWorkoutExercises } from "@/lib/workout/utils/response-guards.utils";
import { Exercise } from "@/types/workout/response/exercise.types";
import { WorkoutResponse } from "@/types/workout/response/workout.types";
import { hmsToSeconds } from "./duration.utils";

/* Duration */
type DurationOptions = {
  timeType?: "seconds" | "minutes";
};

// Supports both API shape and edit-plan form shape.
type ExerciseSetDurationInput = {
  duration?: number | null;
  durationMinutes?: number | null;
  durationSeconds?: number | null;
};

type ExerciseDurationInput = {
  restTime?: number | null;
  sets?: ExerciseSetDurationInput[];

  exercise?: {
    category?: {
      code: string;
    };

    defaultSets?: number | null;
    defaultDuration?: number | null;
    defaultRestTime?: number | null;
  };
};

function convertDuration(seconds: number, options?: DurationOptions) {
  return options?.timeType === "seconds" ? seconds : Math.round(seconds / 60);
}

function getSetDurationSeconds(set: ExerciseSetDurationInput): number | null {
  if (set.duration != null) {
    return set.duration;
  }

  return hmsToSeconds(0, set.durationMinutes, set.durationSeconds);
}

function getTotalSetDurationSeconds(item: ExerciseDurationInput): number {
  const sets = item.sets ?? [];

  return sets.reduce((total, set) => {
    const duration = getSetDurationSeconds(set);

    return total + (duration ?? 0);
  }, 0);
}

// Calculate the duration of a single exercise
function calculateExerciseDuration(
  item: ExerciseDurationInput,
  options?: DurationOptions,
): number {
  if (!item.exercise) {
    throw new Error(
      "Exercise relation was not included when calculating exercise duration.",
    );
  }

  const sets = item.sets ?? [];
  const setCount = sets.length || item.exercise.defaultSets || 0;

  const totalSetDuration = getTotalSetDurationSeconds(item);

  const defaultDuration = item.exercise.defaultDuration ?? 0;

  const exerciseCategoryCode = item.exercise.category?.code;

  // Cardio: use set duration total if available, otherwise exercise default duration
  if (exerciseCategoryCode === "cardio") {
    const totalSeconds =
      totalSetDuration > 0 ? totalSetDuration : defaultDuration;

    return convertDuration(totalSeconds, options);
  }

  if (setCount <= 0) {
    return 0;
  }

  const restTime = item.restTime ?? item.exercise.defaultRestTime ?? 0;

  // Strength/calisthenics:
  // If each set has duration, use total set duration.
  // Otherwise estimate with exercise.defaultDuration per set.
  const exerciseTime =
    totalSetDuration > 0 ? totalSetDuration : setCount * defaultDuration;

  const totalSeconds = exerciseTime + Math.max(setCount - 1, 0) * restTime;

  return convertDuration(totalSeconds, options);
}

// Calculate the total duration of a list of exercises
export function calculateWorkoutDurationFromExercises(
  exercises: ExerciseDurationInput[],
  options?: DurationOptions,
): number {
  const totalSeconds = exercises.reduce(
    (sum, item) =>
      sum +
      calculateExerciseDuration(item, {
        timeType: "seconds",
      }),
    0,
  );

  return convertDuration(totalSeconds, options);
}

// Calculate the duration of the entire workout program
export function calculateWorkoutDuration(workout: WorkoutResponse): number {
  if (workout.duration != null && workout.duration > 0) {
    return convertDuration(workout.duration, {
      timeType: "minutes",
    });
  }

  const workoutExercises = requireWorkoutExercises(workout);

  return calculateWorkoutDurationFromExercises(workoutExercises);
}

export function getExercisePrimaryImageUrl(exercise: Exercise): string | null {
  const media = exercise.media ?? [];

  const primaryImage = media.find(
    (item) => item.mediaType === "image" && item.isPrimary,
  );

  if (primaryImage) {
    return primaryImage.url;
  }

  const firstImage = media.find((item) => item.mediaType === "image");

  return firstImage?.url ?? null;
}
