import HomeContent from "@/components/home/HomeContent";
import { mapWorkoutSessionsToHistoryItems } from "@/components/progress/model/progress-history.mapper";
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

  const [selectedMuscleIds, setSelectedMuscleIds] = useState<number[]>([]);

  const {
    data: progressOverviewData,
    isLoading: isProgressOverviewLoading,
    isError: isProgressOverviewError,
    isFetching: isProgressOverviewFetching,
  } = useGetQuery<WorkoutProgressOverview>(
    workoutQueryKeys.progressOverview,
    workoutApi.getProgressOverview(),
  );

  const {
    data: workoutPreviewData,
    isLoading: isWorkoutPreviewLoading,
    isError: isWorkoutPreviewError,
    isFetching: isWorkoutPreviewFetching,
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
    isFetching: isSessionHistoryFetching,
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
    await invalidateQueries([
      workoutQueryKeys.progressOverview,
      workoutQueryKeys.all,
      workoutQueryKeys.sessionHistory,
    ]);
  };

  // TODO: add loading/error UI
  const isLoading =
    isProgressOverviewLoading ||
    isWorkoutPreviewLoading ||
    isSessionHistoryLoading;

  const isError =
    isProgressOverviewError || isWorkoutPreviewError || isSessionHistoryError;

  const isRefreshing =
    isProgressOverviewFetching ||
    isWorkoutPreviewFetching ||
    isSessionHistoryFetching;

  if (isLoading) return null;
  if (isError || !workoutStats) return null;

  return (
    <HomeContent
      workoutStats={workoutStats}
      workoutPreviewItems={workoutPreviewItems}
      historyItems={historyItems}
      selectedMuscleIds={selectedMuscleIds}
      onChangeMuscleIds={setSelectedMuscleIds}
      pullToRefresh={{
        refreshing: isRefreshing,
        onRefresh: handleRefresh,
      }}
    />
  );
}
