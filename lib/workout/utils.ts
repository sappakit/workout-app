import {
  Exercise,
  ExerciseType,
} from "@/types/workout/response/exercise.types";
import {
  WorkoutExerciseItem,
  WorkoutResponse,
} from "@/types/workout/response/workout.types";
import { Clock, Dumbbell, LucideIcon } from "lucide-react-native";
import { exerciseTypeFieldConfig, getVisibleFields } from "./config";
import {
  formatRepsRange,
  hmsToSeconds,
  parseRepsRange,
  secondsToHMS,
} from "./mappers";

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

// UI
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

export function buildWorkoutExerciseDisplayModel(
  data: WorkoutExerciseItem,
): WorkoutExerciseDisplayModel {
  const typeConfig = exerciseTypeFieldConfig[data.exercise.exerciseType];
  const visibleFields = getVisibleFields(typeConfig);

  // Sets
  const sets = data.plannedSets ?? data.exercise.defaultSets ?? 0;

  // Reps range
  const fallbackReps = parseRepsRange(data.exercise.defaultRepsRange ?? null);
  const parsedPlannedReps = parseRepsRange(data.plannedRepsRange ?? null);

  const repsMin = parsedPlannedReps.minReps ?? fallbackReps.minReps;
  const repsMax = parsedPlannedReps.maxReps ?? fallbackReps.maxReps;
  const reps = formatRepsRange({ minReps: repsMin, maxReps: repsMax });

  // Rest time
  const totalRestSeconds =
    data.plannedRestTime ?? data.exercise.defaultRestTime ?? 0;
  const rest = secondsToHMS(totalRestSeconds);

  // Duration
  const duration = calculateExerciseDuration(data);

  // Equipment
  const equipment = (data.exercise.equipmentLinks ?? []).map(
    (link) => link.equipment.name,
  );

  const infoData: ExerciseCardInfoItem[] = [
    ...(visibleFields.has("plannedSets")
      ? [{ key: "sets", label: "Total Sets", value: `${sets}` }]
      : []),

    ...(visibleFields.has("plannedRepsRange")
      ? [{ key: "reps", label: "Reps per Set", value: reps ?? "-" }]
      : []),

    ...(visibleFields.has("plannedWeight")
      ? [
          {
            key: "weight",
            label: "Load",
            value:
              data.plannedWeight != null ? `${data.plannedWeight} kg` : "-",
          },
        ]
      : []),

    ...(visibleFields.has("plannedDistance")
      ? [
          {
            key: "distance",
            label: "Target Distance",
            value:
              data.plannedDistance != null ? `${data.plannedDistance}` : "-",
          },
        ]
      : []),

    ...(visibleFields.has("plannedRestTime")
      ? [
          {
            key: "rest",
            label: "Rest Between Sets",
            value: `${rest.minutes} min ${rest.seconds} sec`,
          },
        ]
      : []),

    {
      key: "time",
      label: "Estimated Duration",
      value: `${duration} min`,
    },
  ];

  const stats: ExerciseCardStatItem[] = [
    ...(visibleFields.has("plannedSets")
      ? [
          {
            key: "sets",
            label: `${sets} ${sets !== 1 ? "Sets" : "Set"}`,
            icon: Dumbbell,
          },
        ]
      : []),
    {
      key: "duration",
      label: `${duration} min`,
      icon: Clock,
    },
  ];

  return {
    stats,
    infoData,
    equipment,
  };
}

export function buildExercisePreviewDisplayModel(
  exercise: Exercise,
): ExercisePreviewDisplayModel {
  const typeConfig = exerciseTypeFieldConfig[exercise.exerciseType];
  const visibleFields = getVisibleFields(typeConfig);

  const defaultSets = exercise.defaultSets ?? 0;
  const defaultReps = exercise.defaultRepsRange ?? "-";
  const defaultRest = secondsToHMS(exercise.defaultRestTime ?? 0);
  const defaultDurationMinutes = Math.ceil(
    (exercise.defaultDuration ?? 0) / 60,
  );

  const equipment = (exercise.equipmentLinks ?? []).map(
    (link) => link.equipment.name,
  );

  const infoData: ExerciseCardInfoItem[] = [
    ...(visibleFields.has("plannedSets")
      ? [{ key: "sets", label: "Default Sets", value: `${defaultSets}` }]
      : []),

    ...(visibleFields.has("plannedRepsRange")
      ? [{ key: "reps", label: "Default Reps", value: defaultReps }]
      : []),

    ...(visibleFields.has("plannedRestTime")
      ? [
          {
            key: "rest",
            label: "Default Rest",
            value: `${defaultRest.minutes} min ${defaultRest.seconds} sec`,
          },
        ]
      : []),

    ...(visibleFields.has("plannedDuration")
      ? [
          {
            key: "duration",
            label: "Default Duration",
            value: `${defaultDurationMinutes} min`,
          },
        ]
      : []),
  ];

  const stats: ExerciseCardStatItem[] = [
    ...(visibleFields.has("plannedSets")
      ? [
          {
            key: "sets",
            label: `${defaultSets} ${defaultSets !== 1 ? "Sets" : "Set"}`,
            icon: Dumbbell,
          },
        ]
      : []),
    ...(visibleFields.has("plannedDuration")
      ? [
          {
            key: "duration",
            label: `${defaultDurationMinutes} min`,
            icon: Clock,
          },
        ]
      : []),
  ];

  return {
    stats,
    infoData,
    equipment,
  };
}
