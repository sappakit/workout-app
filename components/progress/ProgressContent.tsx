import { PageLayout } from "@/components/layout/PageLayout";
import { EmptyState } from "@/components/state/EmptyState";
import { ErrorState } from "@/components/state/ErrorState";
import { WorkoutProgressOverview } from "@/types/workout/response/workout.types";
import React from "react";
import { View } from "react-native";
import { ProgressTabs } from "./ui/elements/ProgressTabs";
import { ProgressHistorySection } from "./ui/sections/progress-history-section/ProgressHistorySection";
import { ProgressHistorySkeleton } from "./ui/sections/progress-history-section/ProgressHistorySkeleton";
import { RecentWorkoutCardItem } from "./ui/sections/progress-history-section/RecentWorkoutCard";
import { ProgressOverviewSection } from "./ui/sections/progress-overview-section/ProgressOverviewSection";
import { ProgressOverviewSkeleton } from "./ui/sections/progress-overview-section/ProgressOverviewSkeleton";

export type ProgressTab = "overview" | "history";

export type ProgressOverviewState = {
  data?: WorkoutProgressOverview;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
};

export type ProgressHistoryState = {
  data: RecentWorkoutCardItem[];
  isLoading: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onRetry: () => void;
  onLoadMore: () => void;
};

interface ProgressContentProps {
  activeTab: ProgressTab;
  onChangeTab: (tab: ProgressTab) => void;
  overviewState: ProgressOverviewState;
  historyState: ProgressHistoryState;
}

export default function ProgressContent({
  activeTab,
  onChangeTab,
  overviewState,
  historyState,
}: ProgressContentProps) {
  const isHistoryTab = activeTab === "history";

  return (
    <PageLayout
      scrollable={!isHistoryTab}
      disableContentPadding={isHistoryTab}
      headerProps={{
        variant: "title",
        title: "Progress",
      }}
      headerBottom={
        <ProgressTabs activeTab={activeTab} onChangeTab={onChangeTab} />
      }
    >
      {activeTab === "overview" ? (
        <ProgressOverviewContent state={overviewState} />
      ) : (
        <View className="flex-1">
          <ProgressHistoryContent state={historyState} />
        </View>
      )}
    </PageLayout>
  );
}

function ProgressOverviewContent({ state }: { state: ProgressOverviewState }) {
  if (state.isLoading) return <ProgressOverviewSkeleton />;

  if (state.isError) {
    return <ErrorState onRetry={state.onRetry} />;
  }

  if (!state.data) {
    return (
      <EmptyState
        title="No progress yet"
        message="Complete a workout to start seeing your weekly progress."
      />
    );
  }

  return <ProgressOverviewSection data={state.data} />;
}

function ProgressHistoryContent({ state }: { state: ProgressHistoryState }) {
  if (state.isLoading) return <ProgressHistorySkeleton />;

  if (state.isError) {
    return <ErrorState onRetry={state.onRetry} />;
  }

  if (state.data.length === 0) {
    return (
      <EmptyState
        title="No workout history"
        message="Your completed workouts will appear here."
      />
    );
  }

  return (
    <ProgressHistorySection
      data={state.data}
      isFetchingNextPage={state.isFetchingNextPage}
      onLoadMore={state.onLoadMore}
    />
  );
}
