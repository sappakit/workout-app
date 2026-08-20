import {
  formatExerciseCount,
  mapWorkoutToWorkoutCardItem,
  type WorkoutCardItem,
} from "@/components/workout/ui/workout-card/WorkoutCard";
import {
  requireScheduleWorkout,
  requireWorkoutExercises,
  requireWorkoutExerciseSets,
} from "@/lib/workout/utils/response-guards.utils";
import type {
  WorkoutResponse,
  WorkoutSchedule,
} from "@/types/workout/response/workout.types";

export function mapScheduleToWorkoutHeroCardItem(
  schedule: WorkoutSchedule,
): WorkoutCardItem {
  const workout = requireScheduleWorkout(schedule);
  const workoutExercises = requireWorkoutExercises(workout);

  const cardItem = mapWorkoutToWorkoutCardItem(workout);
  const durationLabel = formatWorkoutDuration(workout.duration);
  const setCount = getWorkoutSetCount(workoutExercises);

  return {
    ...cardItem,
    metaItems: [
      {
        key: "exercise-count",
        icon: "workout",
        label: formatExerciseCount(workoutExercises.length),
      },
      {
        key: "set-count",
        icon: "sets",
        label: `${setCount} ${setCount === 1 ? "set" : "sets"}`,
      },
      ...(durationLabel
        ? [
            {
              key: "duration",
              icon: "duration" as const,
              label: durationLabel,
            },
          ]
        : []),
    ],
  };
}

function getWorkoutSetCount(
  workoutExercises: ReturnType<typeof requireWorkoutExercises>,
): number {
  return workoutExercises.reduce((total, workoutExercise) => {
    const sets = requireWorkoutExerciseSets(workoutExercise);

    return total + sets.length;
  }, 0);
}

export function formatWorkoutDuration(
  duration: WorkoutResponse["duration"],
): string | null {
  if (duration == null || duration <= 0) {
    return null;
  }

  if (duration < 60) {
    return `${duration} sec`;
  }

  const totalMinutes = Math.round(duration / 60);

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
