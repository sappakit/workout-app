import { secondsToHMS } from "@/lib/workout/duration.utils";
import {
  requireSessionExercises,
  requireSessionExerciseSets,
} from "@/lib/workout/utils/response-guards.utils";
import type { WorkoutSession } from "@/types/workout/response/workout.types";
import type { RecentWorkoutCardItem } from "../ui/sections/progress-history-section/RecentWorkoutCard";

type SessionStats = {
  volumeKg: number;
  completedSets: number;
  totalSets: number;
};

export function mapWorkoutSessionsToHistoryItems(
  sessions: WorkoutSession[],
): RecentWorkoutCardItem[] {
  return sessions.map((session) => {
    const { volumeKg, completedSets, totalSets } =
      calculateSessionStats(session);

    return {
      id: session.id,
      title: session.workout?.name ?? "Workout",
      subtitle: formatHistoryDate(session.endedAt ?? session.startedAt),
      imageUrl: session.workout?.imageUrl,
      action: () => {
        // TODO: add session workout page
        console.log(`session: ${session.id}`);
      },
      list: [
        {
          label: "Sets",
          value: `${completedSets}/${totalSets}`,
          icon: "sets",
        },
        {
          label: "Volume",
          value: `${formatNumber(volumeKg)} kg`,
          icon: "volume",
        },
        {
          label: "Duration",
          value: formatDurationShort(session.totalDuration ?? 0),
          icon: "timer",
        },
      ],
    };
  });
}

function calculateSessionStats(session: WorkoutSession): SessionStats {
  const sessionExercises = requireSessionExercises(session);

  return sessionExercises.reduce<SessionStats>(
    (stats, exercise) => {
      const sets = requireSessionExerciseSets(exercise);

      sets.forEach((set) => {
        stats.totalSets += 1;

        if (!set.completedAt) return;

        const reps = set.reps ?? 0;
        const weight = set.weight ?? 0;

        stats.completedSets += 1;
        stats.volumeKg += reps * weight;
      });

      return stats;
    },
    {
      volumeKg: 0,
      completedSets: 0,
      totalSets: 0,
    },
  );
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

export function formatHistoryDate(value?: string | null) {
  if (!value) return "-";

  return formatDate(value, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
