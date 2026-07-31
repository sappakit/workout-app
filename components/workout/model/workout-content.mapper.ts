import {
  formatExerciseCount,
  mapWorkoutToWorkoutCardItem,
  WorkoutCardItem,
} from "@/components/workout/ui/workout-card/WorkoutCard";
import {
  requireScheduleWorkout,
  requireWorkoutExercises,
  requireWorkoutExerciseSets,
} from "@/lib/workout/utils/response-guards.utils";
import {
  WorkoutResponse,
  WorkoutSchedule,
} from "@/types/workout/response/workout.types";
import { Clock, Dumbbell, Layers } from "lucide-react-native";

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
        icon: Dumbbell,
        label: formatExerciseCount(workoutExercises.length),
      },
      {
        icon: Layers,
        label: `${setCount} ${setCount === 1 ? "set" : "sets"}`,
      },
      ...(durationLabel
        ? [
            {
              icon: Clock,
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
