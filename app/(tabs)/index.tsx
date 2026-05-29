import HomeContent from "@/components/home/HomeContent";
import { mapWorkoutSessionsToHistoryItems } from "@/components/progress/model/progress-history.mapper";
import { mapWorkoutsToPreviewItems } from "@/components/workout/model/workout-preview.mapper";
import { mapProgressOverviewToWorkoutStats } from "@/components/workout/model/workout-stats.mapper";
import { useGetQuery } from "@/lib/query/useGetQuery";
import { useInfiniteOptionsQuery } from "@/lib/query/useInfiniteOptionsQuery";
import { workoutQueryKeys } from "@/lib/workout/keys";
import {
  WorkoutProgressOverview,
  WorkoutResponse,
  WorkoutSession,
} from "@/types/workout/response/workout.types";
import { workoutApi } from "../api/workout.api";

export default function HomeScreen() {
  const {
    data: progressOverviewData,
    isLoading: isProgressOverviewLoading,
    isError: isProgressOverviewError,
  } = useGetQuery<WorkoutProgressOverview>(
    workoutQueryKeys.progressOverview,
    workoutApi.getProgressOverview(),
  );

  const {
    data: workoutPreviewData,
    isLoading: isWorkoutPreviewLoading,
    isError: isWorkoutPreviewError,
  } = useInfiniteOptionsQuery<WorkoutResponse>({
    url: workoutApi.getAll(),
    queryKey: workoutQueryKeys.all,
    limit: 4,
  });

  const {
    data: sessionHistoryData,
    isLoading: isSessionHistoryLoading,
    isError: isSessionHistoryError,
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

  // TODO: add loading/error UI
  const isLoading =
    isProgressOverviewLoading ||
    isWorkoutPreviewLoading ||
    isSessionHistoryLoading;

  const isError =
    isProgressOverviewError || isWorkoutPreviewError || isSessionHistoryError;

  if (isLoading) return null;
  if (isError || !workoutStats) return null;

  return (
    <HomeContent
      workoutStats={workoutStats}
      workoutPreviewItems={workoutPreviewItems}
      historyItems={historyItems}
    />
  );
}
