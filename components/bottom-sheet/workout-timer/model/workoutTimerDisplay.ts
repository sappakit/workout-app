import { formatDuration } from "@/components/form/picker/duration-picker/utils";

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

export function getWorkoutTimerDisplay({
  isResting,
  isPaused,
  displaySeconds,
}: {
  isResting: boolean;
  isPaused: boolean;
  displaySeconds: number;
}) {
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
    sets: {
      label: "Sets",
      value: "2 / 12",
    },
    exercises: {
      label: "Exercises",
      value: "1 / 4",
    },
    volume: {
      label: "Volume",
      value: "20 kg",
    },
    status: {
      label: "Status",
      value: status,
      labelValue: SessionStatusLabel[status],
    },
  };
}

type WorkoutTimerDisplay = ReturnType<typeof getWorkoutTimerDisplay>;

export type WorkoutTimerDisplayProps = {
  display: WorkoutTimerDisplay;
  restAction: WorkoutTimerRestAction;
  finishAction: WorkoutTimerAction;
  discardAction: WorkoutTimerAction;
  pauseAction: WorkoutTimerPauseAction;
};
