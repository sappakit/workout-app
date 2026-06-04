import { secondsToHMS } from "@/lib/workout/mappers";
import { WorkoutResponse } from "@/types/workout/response/workout.types";
import { useRouter } from "expo-router";
import { WorkoutPreviewCardItem } from "../ui/workout-preview-card/WorkoutPreviewCard";

function formatWorkoutDuration(seconds?: number | null) {
  if (!seconds || seconds <= 0) return null;

  const { hours, minutes } = secondsToHMS(seconds);

  const safeHours = hours ?? 0;
  const safeMinutes = minutes ?? 0;

  if (safeHours > 0 && safeMinutes > 0) {
    return `${safeHours} hr ${safeMinutes} min`;
  }

  if (safeHours > 0) {
    return `${safeHours} hr`;
  }

  return `${safeMinutes} min`;
}

function formatExerciseCount(count: number) {
  return `${count} ${count === 1 ? "exercise" : "exercises"}`;
}

export function mapWorkoutsToPreviewItems(
  workouts: WorkoutResponse[],
): WorkoutPreviewCardItem[] {
  return workouts.map((workout) => {
    const router = useRouter();

    const exerciseCount = workout.workoutExercises?.length ?? 0;
    const durationText = formatWorkoutDuration(workout.duration);

    const subtitle = [formatExerciseCount(exerciseCount), durationText]
      .filter(Boolean)
      .join(" | ");

    return {
      id: workout.id,
      title: workout.name,
      subtitle,
      imageUrl: workout.imageUrl,
      action: () => {
        router.push({
          pathname: "/(pages)/workout/[id]",
          params: { id: workout.id },
        });
      },
      favoriteAction: () => {
        console.log(`favorite workout: ${workout.id}`);
      },
    };
  });
}
