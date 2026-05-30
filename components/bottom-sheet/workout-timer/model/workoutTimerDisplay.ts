import { formatDuration } from "@/components/form/picker/duration-picker/utils";
import { WorkoutSessionModel } from "@/types/workout/model/workout.types";

export const SessionStatus = {
  TRAINING: "training",
  RESTING: "resting",
  PAUSED: "paused",
} as const;

export type SessionStatus = (typeof SessionStatus)[keyof typeof SessionStatus];

const SessionStatusLabel = {
  [SessionStatus.TRAINING]: "Training",
  [SessionStatus.RESTING]: "Resting",
  [SessionStatus.PAUSED]: "Paused",
} satisfies Record<SessionStatus, string>;

export type WorkoutTimerAction = {
  onPress: () => void;
  loading?: boolean;
};

export type WorkoutTimerPauseAction = {
  onPress: () => void;
  isPaused: boolean;
};

export type WorkoutTimerRestAction = {
  onSkip: () => void;
  onIncrease: (seconds?: number) => void;
  onDecrease: (seconds?: number) => void;
};

export type WorkoutTimerStats = {
  completedSets: number;
  totalSets: number;
  completedExercises: number;
  totalExercises: number;
  volume: number;
};

export function getWorkoutTimerStats(
  session: WorkoutSessionModel,
): WorkoutTimerStats {
  const sessionExercises = session.sessionExercises ?? [];

  const sets = sessionExercises.flatMap((exercise) => exercise.sets ?? []);
  const completedSetsList = sets.filter((set) => !!set.completedAt);
  const completedSets = completedSetsList.length;
  const totalSets = sets.length;

  const completedExercises = sessionExercises.filter(
    (exercise) => !!exercise.completedAt,
  ).length;

  const totalExercises = sessionExercises.length;

  const volume = completedSetsList.reduce((total, set) => {
    const reps = set.reps ?? 0;
    const weight = set.weight ?? 0;

    return total + reps * weight;
  }, 0);

  return {
    completedSets,
    totalSets,
    completedExercises,
    totalExercises,
    volume,
  };
}

export const INITIAL_TIMER_STATS: WorkoutTimerStats = {
  completedSets: 0,
  totalSets: 0,
  completedExercises: 0,
  totalExercises: 0,
  volume: 0,
};

export function getWorkoutTimerDisplay({
  isResting,
  isPaused,
  displaySeconds,
  stats,
}: {
  isResting: boolean;
  isPaused: boolean;
  displaySeconds: number;
  stats: WorkoutTimerStats;
}) {
  const metrics = getWorkoutTimerMetricDisplay(stats);

  let status: SessionStatus;
  if (isPaused) {
    status = SessionStatus.PAUSED;
  } else if (isResting) {
    status = SessionStatus.RESTING;
  } else {
    status = SessionStatus.TRAINING;
  }

  return {
    isResting,
    isPaused,
    timer: {
      label: isResting ? "Next set in" : "Session time",
      value: formatDuration(displaySeconds),
    },
    status: {
      label: "Status",
      value: status,
      labelValue: SessionStatusLabel[status],
    },
    ...metrics,
  };
}

export function getWorkoutTimerMetricDisplay(stats: WorkoutTimerStats) {
  return {
    sets: {
      label: "Sets",
      value: `${stats.completedSets} / ${stats.totalSets}`,
    },
    exercises: {
      label: "Exercises",
      value: `${stats.completedExercises} / ${stats.totalExercises}`,
    },
    volume: {
      label: "Volume",
      value: `${stats.volume.toLocaleString()} kg`,
    },
  };
}

export type WorkoutTimerDisplayProps = {
  display: ReturnType<typeof getWorkoutTimerDisplay>;
  restAction: WorkoutTimerRestAction;
  finishAction: WorkoutTimerAction;
  discardAction: WorkoutTimerAction;
  pauseAction: WorkoutTimerPauseAction;
};
