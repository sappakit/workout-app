import { workoutApi } from "@/app/api/workout.api";
import { mapWorkoutSessionsToHistoryItems } from "@/components/progress/model/progress-history.mapper";
import ProgressContent, {
  ProgressHistoryState,
  ProgressOverviewState,
} from "@/components/progress/ProgressContent";
import { ProgressTab } from "@/components/progress/ui/elements/ProgressTabs";
import { useGetQuery } from "@/lib/query/useGetQuery";
import { useInfiniteOptionsQuery } from "@/lib/query/useInfiniteOptionsQuery";
import { workoutQueryKeys } from "@/lib/workout/keys";
import {
  WorkoutProgressOverview,
  WorkoutSession,
} from "@/types/workout/response/workout.types";
import { useState } from "react";

export default function ProgressScreen() {
  const [activeTab, setActiveTab] = useState<ProgressTab>("overview");

  const {
    data: overviewData,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
    refetch: refetchOverview,
  } = useGetQuery<WorkoutProgressOverview>(
    workoutQueryKeys.progressOverview,
    workoutApi.getProgressOverview(),
  );

  const {
    data: sessionHistoryData,
    isLoading: isSessionHistoryLoading,
    isError: isSessionHistoryError,
    refetch: refetchSessionHistory,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteOptionsQuery<WorkoutSession>({
    url: workoutApi.getSessionHistory(),
    queryKey: workoutQueryKeys.sessionHistory,
    limit: 10,
  });

  const sessionHistory =
    sessionHistoryData?.pages.flatMap((page) => page.data) ?? [];

  const historyItems = mapWorkoutSessionsToHistoryItems(sessionHistory);

  const overviewState: ProgressOverviewState = {
    data: overviewData,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
    onRetry: refetchOverview,
  };

  const historyState: ProgressHistoryState = {
    data: historyItems,
    isLoading: isSessionHistoryLoading,
    isError: isSessionHistoryError,
    isFetchingNextPage,
    hasNextPage,
    onRetry: refetchSessionHistory,
    onLoadMore: () => {
      if (!hasNextPage || isFetchingNextPage) return;
      fetchNextPage();
    },
  };

  return (
    <ProgressContent
      activeTab={activeTab}
      onChangeTab={setActiveTab}
      overviewState={overviewState}
      historyState={historyState}
    />
  );
}
