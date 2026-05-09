import { secondsToHMS } from "@/lib/workout/mappers";
import { WorkoutSession } from "@/types/workout/response/workout.types";
import { BicepsFlexed } from "lucide-react-native";
import { ProgressMetricCardItem } from "../ui/elements/ProgressMetricCard";

export function mapWorkoutSessionsToProgressHistoryItems(
  sessions: WorkoutSession[],
): ProgressMetricCardItem[] {
  return sessions.map((session) => {
    const volumeKg = getSessionVolumeKg(session);
    const completedSets = getCompletedSetCount(session);
    const totalSets = getTotalSetCount(session);

    return {
      id: session.id,
      title: session.workout?.name ?? "Workout",
      subtitle: session.workout?.workoutFocusType?.name,
      rightText: formatHistoryDate(session.endedAt ?? session.startedAt),
      icon: BicepsFlexed,
      list: [
        {
          label: "Duration",
          value: formatDurationShort(session.totalDuration ?? 0),
        },
        {
          label: "Volume",
          value: `${formatNumber(volumeKg)} kg`,
        },
        {
          label: "Sets",
          value: `${completedSets}/${totalSets}`,
        },
      ],
    };
  });
}

function getSessionVolumeKg(session: WorkoutSession) {
  return session.sessionExercises.reduce((exerciseTotal, exercise) => {
    const setVolume = exercise.sets.reduce((setTotal, set) => {
      if (!set.completedAt) return setTotal;

      const reps = set.reps ?? 0;
      const weight = set.weight ?? 0;

      return setTotal + reps * weight;
    }, 0);

    return exerciseTotal + setVolume;
  }, 0);
}

function getCompletedSetCount(session: WorkoutSession) {
  return session.sessionExercises.reduce((exerciseTotal, exercise) => {
    const completedSets = exercise.sets.filter((set) => set.completedAt).length;

    return exerciseTotal + completedSets;
  }, 0);
}

function getTotalSetCount(session: WorkoutSession) {
  return session.sessionExercises.reduce((exerciseTotal, exercise) => {
    return exerciseTotal + exercise.sets.length;
  }, 0);
}

export function formatNumber(value: number) {
  return Intl.NumberFormat("en-US").format(value);
}

export function formatDurationShort(totalSeconds: number | null | undefined) {
  const { hours, minutes } = secondsToHMS(totalSeconds ?? 0);

  if (!hours) return `${minutes ?? 0}m`;

  return `${hours}h ${minutes ?? 0}m`;
}

export function formatDate(
  value: string | Date,
  options: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat("en-US", options).format(new Date(value));
}

function formatHistoryDate(value?: string | null) {
  if (!value) return "-";

  return formatDate(value, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
