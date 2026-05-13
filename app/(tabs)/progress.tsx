import { workoutApi } from "@/app/api/workout.api";
import { mapWorkoutSessionsToProgressHistoryItems } from "@/components/progress/model/progress-history.mapper";
import ProgressContent, {
  ProgressHistoryState,
  ProgressOverviewState,
  ProgressTab,
} from "@/components/progress/ProgressContent";
import { useGetQuery } from "@/lib/query/useGetQuery";
import { useInfiniteOptionsQuery } from "@/lib/query/useInfiniteOptionsQuery";
import { workoutQueryKeys } from "@/lib/workout/keys";
import {
  WorkoutProgressOverview,
  WorkoutSession,
} from "@/types/workout/response/workout.types";
import { useState } from "react";

const SESSION_HISTORY_LIMIT = 10;

export default function ProgressScreen() {
  const [activeTab, setActiveTab] = useState<ProgressTab>("overview");

  const {
    data: overviewData,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
  } = useGetQuery<WorkoutProgressOverview>(
    workoutQueryKeys.progressOverview,
    workoutApi.getProgressOverview(),
    {
      enabled: activeTab === "overview",
    },
  );

  const {
    data: sessionHistoryData,
    isLoading: isSessionHistoryLoading,
    isError: isSessionHistoryError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteOptionsQuery<WorkoutSession>({
    url: workoutApi.getSessionHistory(),
    queryKey: workoutQueryKeys.sessionHistory,
    limit: SESSION_HISTORY_LIMIT,
    enabled: activeTab === "history",
  });

  const historyItems = sessionHistoryData
    ? mapWorkoutSessionsToProgressHistoryItems(
        sessionHistoryData.pages.flatMap((page) => page.data),
      )
    : [];

  const overviewState: ProgressOverviewState = {
    data: overviewData,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
  };

  const historyState: ProgressHistoryState = {
    data: historyItems,
    isLoading: isSessionHistoryLoading,
    isError: isSessionHistoryError,
    isFetchingNextPage,
    hasNextPage,
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
