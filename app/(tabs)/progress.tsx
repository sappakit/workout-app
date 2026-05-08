import { workoutApi } from "@/app/api/workout.api";
import { mapWorkoutSessionsToProgressHistoryItems } from "@/components/progress/model/progress-history.mapper";
import ProgressContent, {
  ProgressHistoryState,
  ProgressOverviewState,
  ProgressTab,
} from "@/components/progress/ProgressContent";
import { useGetQuery } from "@/lib/query/useGetQuery";
import { workoutQueryKeys } from "@/lib/workout/keys";
import { PaginatedResponse } from "@/types/api.types";
import {
  WorkoutProgressOverview,
  WorkoutSession,
} from "@/types/workout/response/workout.types";
import { useState } from "react";

const SESSION_HISTORY_PARAMS = {
  page: 1,
  limit: 10,
};

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
  } = useGetQuery<PaginatedResponse<WorkoutSession>>(
    workoutQueryKeys.sessionHistory(SESSION_HISTORY_PARAMS),
    workoutApi.getSessionHistory(),
    {
      params: SESSION_HISTORY_PARAMS,
      enabled: activeTab === "history",
    },
  );

  const historyItems = sessionHistoryData
    ? mapWorkoutSessionsToProgressHistoryItems(sessionHistoryData.data)
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
