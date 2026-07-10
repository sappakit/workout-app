import {
  formatExerciseCount,
  mapWorkoutToWorkoutCardItem,
  WorkoutCardItem,
} from "@/components/workout/ui/workout-card/WorkoutCard";
import { WorkoutSchedule } from "@/types/workout/response/workout.types";
import { Clock, Dumbbell, Layers } from "lucide-react-native";

export function mapScheduleToWorkoutHeroCardItem(
  schedule: WorkoutSchedule,
): WorkoutCardItem {
  const workout = schedule.workout;
  const cardItem = mapWorkoutToWorkoutCardItem(workout);
  const durationLabel = formatWorkoutDuration(workout.duration);

  return {
    ...cardItem,
    metaItems: [
      {
        icon: Dumbbell,
        label: formatExerciseCount(workout.workoutExercises.length),
      },
      {
        icon: Layers,
        label: `${getWorkoutSetCount(workout.workoutExercises)} sets`,
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
  workoutExercises: WorkoutSchedule["workout"]["workoutExercises"],
) {
  return workoutExercises.reduce((total, workoutExercise) => {
    return total + workoutExercise.sets.length;
  }, 0);
}

export function formatWorkoutDuration(duration: number | null) {
  if (!duration) return null;

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
