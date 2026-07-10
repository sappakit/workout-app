import { WorkoutResponse } from "@/types/workout/response/workout.types";
import { mapWorkoutToWorkoutCardItem } from "../ui/workout-card/WorkoutCard";
import { WorkoutPreviewCardItem } from "../ui/workout-preview-card/WorkoutPreviewCard";

type MapWorkoutsToPreviewItemsOptions = {
  onOpenWorkout: (workoutId: number) => void;
  onFavoriteWorkout: (workoutId: number) => void;
};

export function mapWorkoutsToPreviewItems(
  workouts: WorkoutResponse[],
  options: MapWorkoutsToPreviewItemsOptions,
): WorkoutPreviewCardItem[] {
  return workouts.map((workout) => {
    const cardItem = mapWorkoutToWorkoutCardItem(workout);

    return {
      ...cardItem,
      action: () => options.onOpenWorkout(workout.id),
      favoriteAction: () => options.onFavoriteWorkout(workout.id),
    };
  });
}
