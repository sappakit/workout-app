import { WorkoutHeroCardItem } from "@/components/workout/ui/WorkoutHeroCard";
import { WorkoutSchedule } from "@/types/workout/response/workout.types";

export function mapScheduleToWorkoutHeroCardItem(
  schedule: WorkoutSchedule,
): WorkoutHeroCardItem {
  const workout = schedule.workout;

  return {
    id: workout.id,
    title: workout.name,
    exerciseCount: workout.workoutExercises.length,
    setCount: getWorkoutSetCount(workout.workoutExercises),
    durationLabel: formatWorkoutDuration(workout.duration),
    imageUrl: workout.imageUrl,
  };
}

function getWorkoutSetCount(
  workoutExercises: WorkoutSchedule["workout"]["workoutExercises"],
) {
  return workoutExercises.reduce((total, workoutExercise) => {
    return total + workoutExercise.sets.length;
  }, 0);
}

function formatWorkoutDuration(duration: number | null) {
  if (!duration) return "No duration";

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
