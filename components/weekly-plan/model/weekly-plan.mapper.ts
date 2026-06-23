import {
  WorkoutResponse,
  WorkoutWeeklyPlan,
  WorkoutWeeklyPlanDayType,
} from "@/types/workout/response/workout.types";

export type WeeklyPlanDay = {
  id: number | null;
  dayOfWeek: number;
  label: string;
  shortLabel: string;
  dayType: WorkoutWeeklyPlanDayType;
  workoutId: number | null;
  workout: WorkoutResponse | null;
};

export type UpdateWeeklyPlanPayload = {
  days: {
    dayOfWeek: number;
    dayType: WorkoutWeeklyPlanDayType;
    workoutId: number | null;
  }[];
};

export const WEEK_DAYS = [
  { dayOfWeek: 1, label: "Monday", shortLabel: "Mon" },
  { dayOfWeek: 2, label: "Tuesday", shortLabel: "Tue" },
  { dayOfWeek: 3, label: "Wednesday", shortLabel: "Wed" },
  { dayOfWeek: 4, label: "Thursday", shortLabel: "Thu" },
  { dayOfWeek: 5, label: "Friday", shortLabel: "Fri" },
  { dayOfWeek: 6, label: "Saturday", shortLabel: "Sat" },
  { dayOfWeek: 7, label: "Sunday", shortLabel: "Sun" },
];

export function mapWeeklyPlanResponseToState(
  data: WorkoutWeeklyPlan,
): WeeklyPlanDay[] {
  return WEEK_DAYS.map((day) => {
    const planDay = data.days.find((item) => item.dayOfWeek === day.dayOfWeek);

    return {
      ...day,
      id: planDay?.id ?? null,
      dayType: planDay?.dayType ?? WorkoutWeeklyPlanDayType.UNASSIGNED,
      workoutId: planDay?.workout?.id ?? null,
      workout: planDay?.workout ?? null,
    };
  });
}

export function mapWeeklyPlanStateToUpdatePayload(
  weeklyPlan: WeeklyPlanDay[],
): UpdateWeeklyPlanPayload {
  return {
    days: weeklyPlan.map((day) => ({
      dayOfWeek: day.dayOfWeek,
      dayType: day.dayType,
      workoutId:
        day.dayType === WorkoutWeeklyPlanDayType.WORKOUT ? day.workoutId : null,
    })),
  };
}

export function formatWorkoutDuration(duration: number | null) {
  if (!duration) return null;

  if (duration < 60) {
    return `${duration} sec`;
  }

  const totalMinutes = Math.floor(duration / 60);

  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
}

export function getTodayDayOfWeek() {
  const jsDay = new Date().getDay();

  return jsDay === 0 ? 7 : jsDay;
}
