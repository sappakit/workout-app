import { ExerciseType } from "@/types/workout/response/exercise.types";
import {
  WorkoutExerciseItem,
  WorkoutResponse,
} from "@/types/workout/response/workout.types";
import { Clock, Dumbbell, LucideIcon } from "lucide-react-native";
import { ExerciseFieldKey, getExerciseFields } from "./config";
import { hmsToSeconds, secondsToHMS } from "./mappers";

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
  sets?: ExerciseSetDurationInput[] | null;

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

function getSetDurationSeconds(set: ExerciseSetDurationInput): number | null {
  if (set.duration != null) return set.duration;

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
export function calculateExerciseDuration(
  item: ExerciseDurationInput,
  options?: DurationOptions,
): number {
  const sets = item.sets ?? [];
  const setCount = sets.length || item.exercise.defaultSets || 0;

  const totalSetDuration = getTotalSetDurationSeconds(item);
  const defaultDuration = item.exercise.defaultDuration ?? 0;

  // Cardio: use set duration total if available, otherwise exercise default duration
  if (item.exercise.exerciseType === ExerciseType.CARDIO) {
    const totalSeconds =
      totalSetDuration > 0 ? totalSetDuration : defaultDuration;

    return convertDuration(totalSeconds, options);
  }

  if (setCount <= 0) return 0;

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
// Calculate total calories used for the workout program
export function calculateWorkoutCalories(workout: WorkoutResponse): number {
  let totalCalories = 0;

  workout.workoutExercises.forEach((item) => {
    const setCount = item.sets.length || item.exercise.defaultSets || 0;
    const baseCalories = item.exercise.defaultCaloriesBurned ?? 0;

    switch (item.exercise.exerciseType) {
      case ExerciseType.CARDIO: {
        // Calories per minute
        const durationSeconds =
          getTotalSetDurationSeconds(item) ||
          item.exercise.defaultDuration ||
          0;

        const durationMinutes = durationSeconds / 60;

        totalCalories += durationMinutes * baseCalories;
        break;
      }

      // Calories per set
      case ExerciseType.STRENGTH:
      case ExerciseType.CALISTHENICS:
        totalCalories += setCount * baseCalories;
        break;

      default:
        break;
    }
  });

  return Math.round(totalCalories);
}

/* UI */
export type ExerciseCardInfoItem = {
  key: string;
  label: string;
  value: string;
};

export type ExerciseCardStatItem = {
  key: string;
  label: string;
  icon: LucideIcon;
};

export interface WorkoutExerciseDisplayModel {
  stats: ExerciseCardStatItem[];
  infoData: ExerciseCardInfoItem[];
  equipment: string[];
}

export interface ExercisePreviewDisplayModel {
  stats: ExerciseCardStatItem[];
  infoData: ExerciseCardInfoItem[];
  equipment: string[];
}

function formatUniqueNumbers(
  values: Array<number | null | undefined>,
  suffix = "",
): string {
  const uniqueValues = [...new Set(values.filter((value) => value != null))];

  if (uniqueValues.length === 0) return "-";

  if (uniqueValues.length === 1) {
    return `${uniqueValues[0]}${suffix}`;
  }

  return uniqueValues.map((value) => `${value}${suffix}`).join(", ");
}

function formatDurationValue(seconds: number | null | undefined): string {
  if (seconds == null) return "-";

  const duration = secondsToHMS(seconds);

  if (duration.hours && duration.hours > 0) {
    return `${duration.hours} hr ${duration.minutes} min`;
  }

  return `${duration.minutes} min ${duration.seconds} sec`;
}

export function buildWorkoutExerciseDisplayModel(
  data: WorkoutExerciseItem,
): WorkoutExerciseDisplayModel {
  const fields = getExerciseFields(data.exercise.exerciseType);

  const hasField = (field: ExerciseFieldKey) => fields.includes(field);

  // Sets
  const sets = data.sets.length;

  // Set values
  const reps = formatUniqueNumbers(
    data.sets.map((set) => set.reps),
    " reps",
  );

  const weight = formatUniqueNumbers(
    data.sets.map((set) => set.weight),
    " kg",
  );

  const distance = formatUniqueNumbers(data.sets.map((set) => set.distance));

  const durationValues = data.sets
    .map((set) => set.duration)
    .filter((value): value is number => value != null);

  const durationText =
    durationValues.length === 0
      ? "-"
      : durationValues.length === 1
        ? formatDurationValue(durationValues[0])
        : durationValues.map(formatDurationValue).join(", ");

  // Rest time
  const rest = secondsToHMS(data.restTime ?? 0);

  // Estimated duration
  const estimatedDuration = calculateExerciseDuration(data);

  // Equipment
  const equipment = (data.exercise.equipmentLinks ?? []).map(
    (link) => link.equipment.name,
  );

  const infoData: ExerciseCardInfoItem[] = [
    {
      key: "sets",
      label: "Total Sets",
      value: `${sets}`,
    },

    ...(hasField("reps")
      ? [
          {
            key: "reps",
            label: "Reps per Set",
            value: reps,
          },
        ]
      : []),

    ...(hasField("weight")
      ? [
          {
            key: "weight",
            label: "Load",
            value: weight,
          },
        ]
      : []),

    ...(hasField("distance")
      ? [
          {
            key: "distance",
            label: "Target Distance",
            value: distance,
          },
        ]
      : []),

    ...(hasField("duration")
      ? [
          {
            key: "duration",
            label: "Target Duration",
            value: durationText,
          },
        ]
      : []),

    {
      key: "rest",
      label: "Rest Between Sets",
      value: `${rest.minutes} min ${rest.seconds} sec`,
    },

    {
      key: "time",
      label: "Estimated Duration",
      value: `${estimatedDuration} min`,
    },
  ];

  const stats: ExerciseCardStatItem[] = [
    {
      key: "sets",
      label: `${sets} ${sets !== 1 ? "Sets" : "Set"}`,
      icon: Dumbbell,
    },
    {
      key: "duration",
      label: `${estimatedDuration} min`,
      icon: Clock,
    },
  ];

  return {
    stats,
    infoData,
    equipment,
  };
}
