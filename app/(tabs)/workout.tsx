import { EmptyState } from "@/components/state/EmptyState";
import { ErrorState } from "@/components/state/ErrorState";
import { WorkoutInProgressContent } from "@/components/workout-in-progress/WorkoutInProgressContent";
import { mapWorkoutsToPreviewItems } from "@/components/workout/model/workout-preview.mapper";
import { WorkoutSkeleton } from "@/components/workout/ui/WorkoutSkeleton";
import WorkoutContent from "@/components/workout/WorkoutContent";
import { workoutApi } from "@/lib/api/workout.api";
import { useGetQuery } from "@/lib/query/useGetQuery";
import { useInfiniteOptionsQuery } from "@/lib/query/useInfiniteOptionsQuery";
import { useInvalidateQueries } from "@/lib/query/utils";
import { workoutQueryKeys } from "@/lib/workout/keys";
import {
  WorkoutCurrentMode,
  type WorkoutCurrent,
  type WorkoutResponse,
} from "@/types/workout/response/workout.types";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function WorkoutScreen() {
  const router = useRouter();
  const invalidateQueries = useInvalidateQueries();

  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const [selectedMuscleIds, setSelectedMuscleIds] = useState<number[]>([]);

  const {
    data: currentWorkoutData,
    isLoading: isCurrentWorkoutLoading,
    isError: isCurrentWorkoutError,
    refetch: refetchCurrentWorkout,
  } = useGetQuery<WorkoutCurrent>(
    workoutQueryKeys.current,
    workoutApi.getCurrent(),
    {
      staleTime: 0,
    },
  );

  const shouldFetchWorkoutPreviews =
    !!currentWorkoutData &&
    currentWorkoutData.mode !== WorkoutCurrentMode.IN_PROGRESS;

  const {
    data: workoutPreviewData,
    isLoading: isWorkoutPreviewLoading,
    isError: isWorkoutPreviewError,
    refetch: refetchWorkoutPreview,
  } = useInfiniteOptionsQuery<WorkoutResponse>({
    url: workoutApi.getAll(),
    queryKey: workoutQueryKeys.all,
    limit: 4,
    params: {
      muscleIds: selectedMuscleIds.length > 0 ? selectedMuscleIds : undefined,
      createdByMe: true,
    },
    enabled: shouldFetchWorkoutPreviews,
  });

  const handleRefresh = async () => {
    setIsPullRefreshing(true);

    try {
      await invalidateQueries([workoutQueryKeys.current, workoutQueryKeys.all]);
    } finally {
      setIsPullRefreshing(false);
    }
  };

  const handleRetry = async () => {
    await Promise.all([refetchCurrentWorkout(), refetchWorkoutPreview()]);
  };

  const workoutPreviews =
    workoutPreviewData?.pages.flatMap((page) => page.data) ?? [];

  const workoutPreviewItems = mapWorkoutsToPreviewItems(workoutPreviews, {
    onOpenWorkout: (workoutId) => {
      router.push({
        pathname: "/(pages)/workout/[id]",
        params: {
          id: workoutId,
        },
      });
    },
    onFavoriteWorkout: (workoutId) => {
      console.log(`favorite workout: ${workoutId}`);
    },
  });

  if (isCurrentWorkoutLoading) {
    return <WorkoutSkeleton />;
  }

  if (isCurrentWorkoutError) {
    return (
      <ErrorState
        primaryAction={{
          onPress: handleRetry,
        }}
        secondaryAction={{ hidden: true }}
      />
    );
  }

  if (!currentWorkoutData) {
    return (
      <EmptyState
        icon="workout"
        title="Workout unavailable"
        message="Your workout information isn't available right now."
        secondaryAction={{ hidden: true }}
      />
    );
  }

  switch (currentWorkoutData.mode) {
    case WorkoutCurrentMode.IN_PROGRESS:
      return currentWorkoutData.session ? (
        <WorkoutInProgressContent />
      ) : (
        <EmptyState
          icon="workout"
          title="Workout session unavailable"
          message="We couldn't find your active workout session."
        />
      );

    case WorkoutCurrentMode.SCHEDULED:
    case WorkoutCurrentMode.REST_DAY:
    case WorkoutCurrentMode.UNASSIGNED:
      return (
        <WorkoutContent
          mode={currentWorkoutData.mode}
          data={currentWorkoutData.schedule}
          hasCompletedWorkoutToday={currentWorkoutData.hasCompletedWorkoutToday}
          workoutPreviewSection={{
            items: workoutPreviewItems,
            selectedMuscleIds,
            onChangeMuscleIds: setSelectedMuscleIds,
            isLoading: isWorkoutPreviewLoading,
            isError: isWorkoutPreviewError,
            onRetry: refetchWorkoutPreview,
          }}
          pullToRefresh={{
            refreshing: isPullRefreshing,
            onRefresh: handleRefresh,
          }}
        />
      );

    default:
      return (
        <EmptyState
          icon="workout"
          title="Workout unavailable"
          message="Your workout information isn't available right now."
        />
      );
  }
}
