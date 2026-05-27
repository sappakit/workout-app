import HomeContent from "@/components/home/HomeContent";
import { mapProgressOverviewToHomeStats } from "@/components/home/model/home-stats.mapper";
import { mapWorkoutsToPreviewItems } from "@/components/home/model/workout-preview.mapper";
import { mapWorkoutSessionsToHistoryItems } from "@/components/progress/model/progress-history.mapper";
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

  const homeStats = progressOverviewData
    ? mapProgressOverviewToHomeStats(progressOverviewData)
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
  if (isError || !homeStats) return null;

  // if (isLoading) return <WorkoutSkeleton />;

  // if (isError || !data)
  //   return (
  //     <ErrorState
  //       title="Failed to Load Workout"
  //       message="We couldn't load today's workout."
  //       onRetry={refetch}
  //     />
  //   );

  return (
    <HomeContent
      homeStats={homeStats}
      workoutPreviewItems={workoutPreviewItems}
      historyItems={historyItems}
    />
  );
}
