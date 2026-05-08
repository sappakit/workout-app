import { WorkoutProgressOverviewType } from "@/types/workout/response/workout.types";
import { formatDate } from "./progress-history.mapper";

export function getProgressOverviewTitle(type: WorkoutProgressOverviewType) {
  switch (type) {
    case WorkoutProgressOverviewType.WEEKLY:
      return "Weekly Summary";

    case WorkoutProgressOverviewType.YEARLY:
      return "Yearly Summary";

    case WorkoutProgressOverviewType.ALL_TIME:
      return "All-Time Summary";

    default:
      return "Progress Summary";
  }
}

export function getProgressOverviewDateLabel({
  type,
  startDate,
  endDate,
}: {
  type: WorkoutProgressOverviewType;
  startDate: string | null;
  endDate: string | null;
}) {
  if (type === WorkoutProgressOverviewType.ALL_TIME) {
    if (!startDate) return "All workout history";

    return `Since ${formatDate(startDate, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  }

  if (!startDate || !endDate) return "";

  return formatDateRange(startDate, endDate);
}

function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();

  const startMonth = formatDate(start, { month: "short" });
  const endMonth = formatDate(end, { month: "short" });

  const startDay = formatDate(start, { day: "numeric" });
  const endDay = formatDate(end, { day: "numeric" });

  const startYear = formatDate(start, { year: "numeric" });
  const endYear = formatDate(end, { year: "numeric" });

  // May 4 - 10, 2026
  if (sameMonth) {
    return `${startMonth} ${startDay} - ${endDay}, ${startYear}`;
  }

  // May 28 - Jun 3, 2026
  if (sameYear) {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`;
  }

  // Dec 29, 2025 - Jan 4, 2026
  return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`;
}
