import HomeContent from "@/components/home/HomeContent";
import { HomeSkeleton } from "@/components/home/ui/HomeSkeleton";
import { mapWorkoutSessionsToHistoryItems } from "@/components/progress/model/progress-history.mapper";
import { EmptyState } from "@/components/state/EmptyState";
import { ErrorState } from "@/components/state/ErrorState";
import { mapWorkoutsToPreviewItems } from "@/components/workout/model/workout-preview.mapper";
import { mapProgressOverviewToWorkoutStats } from "@/components/workout/model/workout-stats.mapper";
import { useGetQuery } from "@/lib/query/useGetQuery";
import { useInfiniteOptionsQuery } from "@/lib/query/useInfiniteOptionsQuery";
import { useInvalidateQueries } from "@/lib/query/utils";
import { workoutQueryKeys } from "@/lib/workout/keys";
import {
  WorkoutProgressOverview,
  WorkoutResponse,
  WorkoutSession,
} from "@/types/workout/response/workout.types";
import { useState } from "react";
import { workoutApi } from "../api/workout.api";

export default function HomeScreen() {
  const invalidateQueries = useInvalidateQueries();

  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const [selectedMuscleIds, setSelectedMuscleIds] = useState<number[]>([]);

  const {
    data: progressOverviewData,
    isLoading: isProgressOverviewLoading,
    isError: isProgressOverviewError,
    refetch: refetchProgressOverview,
  } = useGetQuery<WorkoutProgressOverview>(
    workoutQueryKeys.progressOverview,
    workoutApi.getProgressOverview(),
  );

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
    },
  });

  const {
    data: sessionHistoryData,
    isLoading: isSessionHistoryLoading,
    isError: isSessionHistoryError,
    refetch: refetchSessionHistory,
  } = useInfiniteOptionsQuery<WorkoutSession>({
    url: workoutApi.getSessionHistory(),
    queryKey: workoutQueryKeys.sessionHistory,
    limit: 3,
  });

  const workoutStats = progressOverviewData
    ? mapProgressOverviewToWorkoutStats(progressOverviewData)
    : null;

  const sessionHistory =
    sessionHistoryData?.pages.flatMap((page) => page.data) ?? [];

  const historyItems = mapWorkoutSessionsToHistoryItems(sessionHistory);

  const workoutPreviews =
    workoutPreviewData?.pages.flatMap((page) => page.data) ?? [];

  const workoutPreviewItems = mapWorkoutsToPreviewItems(workoutPreviews);

  const handleRefresh = async () => {
    setIsPullRefreshing(true);

    try {
      await invalidateQueries([
        workoutQueryKeys.progressOverview,
        workoutQueryKeys.all,
        workoutQueryKeys.sessionHistory,
      ]);
    } finally {
      setIsPullRefreshing(false);
    }
  };

  const handleRetry = async () => {
    await Promise.all([
      refetchProgressOverview(),
      refetchWorkoutPreview(),
      refetchSessionHistory(),
    ]);
  };

  const isPageLoading = isProgressOverviewLoading || isSessionHistoryLoading;

  const isPageError = isProgressOverviewError || isSessionHistoryError;

  if (isPageLoading) return <HomeSkeleton />;

  if (isPageError) return <ErrorState onRetry={handleRetry} />;

  if (!workoutStats) return <EmptyState />;

  return (
    <HomeContent
      workoutStats={workoutStats}
      historyItems={historyItems}
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
}
