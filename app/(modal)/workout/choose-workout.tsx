import type { SortDirection } from "@/components/bottom-sheet/filter/filter-page/FilterSortPage";
import type { WorkoutFilterValues } from "@/components/bottom-sheet/filter/workout-filter/WorkoutFilterSheetContent";
import { PageLayout } from "@/components/layout/PageLayout";
import { WorkoutPickerScreen } from "@/components/picker/workout-picker/WorkoutPickerScreen";
import { ErrorState } from "@/components/state/ErrorState";
import { api } from "@/lib/api/client";
import { workoutApi } from "@/lib/api/workout.api";
import { useInvalidateQueries } from "@/lib/query/utils";
import { useAppToast } from "@/lib/toast/useAppToast";
import { workoutQueryKeys } from "@/lib/workout/keys";
import type { WorkoutResponse } from "@/types/workout/response/workout.types";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";

export type WorkoutSortKey = "created_at" | "name" | "duration";

export const DEFAULT_SORT_BY: WorkoutSortKey = "created_at";

export const DEFAULT_SORT_DIRECTION: SortDirection = "DESC";

export const DEFAULT_WORKOUT_FILTERS: WorkoutFilterValues = {
  focusTypeIds: [],
  muscleIds: [],
  sortBy: DEFAULT_SORT_BY,
  sortDirection: DEFAULT_SORT_DIRECTION,
};

export default function ChooseWorkoutPage() {
  const router = useRouter();

  const toast = useAppToast();

  const invalidateQueries = useInvalidateQueries();

  const params = useLocalSearchParams<{
    scheduleId?: string;
    workoutId?: string;
  }>();

  const scheduleId = params.scheduleId ? Number(params.scheduleId) : null;

  const currentWorkoutId = params.workoutId ? Number(params.workoutId) : null;

  const { mutateAsync: updateScheduleWorkout } = useMutation({
    mutationFn: async (workoutId: number) => {
      if (!scheduleId) {
        throw new Error("Missing schedule id");
      }

      return api.patch(workoutApi.updateScheduleWorkout(scheduleId), {
        workoutId,
      });
    },

    onSuccess: async () => {
      await invalidateQueries([workoutQueryKeys.current]);

      toast.success({
        title: "Workout updated",
        message: "Today's workout has been changed.",
      });

      router.back();
    },

    onError: () => {
      toast.error({
        title: "Failed to update workout",
        message: "Please try again.",
      });
    },
  });

  const handleClose = () => {
    router.back();
  };

  const handleDone = async (selectedWorkout: WorkoutResponse) => {
    await updateScheduleWorkout(selectedWorkout.id);
  };

  if (!scheduleId) {
    return (
      <PageLayout scrollable={false} includeInsets>
        <ErrorState
          icon="workout"
          title="Workout schedule not found"
          message="We couldn't find the workout schedule you were trying to update."
          primaryAction={{
            hidden: true,
          }}
        />
      </PageLayout>
    );
  }

  return (
    <WorkoutPickerScreen
      description="Select one workout to use for today's plan."
      initialSelectedWorkoutId={currentWorkoutId}
      requireDifferentSelection
      defaultFilters={DEFAULT_WORKOUT_FILTERS}
      onClose={handleClose}
      onDone={handleDone}
    />
  );
}
