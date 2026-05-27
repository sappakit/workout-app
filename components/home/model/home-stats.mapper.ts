import { WorkoutProgressOverview } from "@/types/workout/response/workout.types";

export type HomeVolumeTrendItem = {
  label: string;
  value: number;
};

export type HomeStatsModel = {
  totalVolumeText: string;
  workoutsCompletedText: string;
  totalDurationText: string;
  volumeTrend: HomeVolumeTrendItem[];
};

function formatNumber(value: number) {
  return Number.isInteger(value) ? value.toLocaleString() : value.toFixed(2);
}

function formatDurationMinutes(totalSeconds: number) {
  const totalMinutes = Math.floor(totalSeconds / 60);

  if (totalMinutes < 60) {
    return `${totalMinutes}m`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}

function formatTrendLabel(label: string) {
  return label.slice(0, 1);
}

export function mapProgressOverviewToHomeStats(
  overview: WorkoutProgressOverview,
): HomeStatsModel {
  return {
    totalVolumeText: `${formatNumber(overview.summary.totalVolumeKg)} kg`,
    workoutsCompletedText: `${overview.summary.workoutsCompleted}`,
    totalDurationText: formatDurationMinutes(
      overview.summary.totalDurationSeconds,
    ),
    volumeTrend: overview.volumeTrend.map((item) => ({
      label: formatTrendLabel(item.label),
      value: item.volumeKg,
    })),
  };
}
