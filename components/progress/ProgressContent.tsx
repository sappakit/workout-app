import { PageLayout } from "@/components/layout/PageLayout";
import { WorkoutProgressOverview } from "@/types/workout/response/workout.types";
import clsx from "clsx";
import React from "react";
import { View } from "react-native";
import { twMerge } from "tailwind-merge";
import { ProgressTabs } from "./ui/elements/ProgressTabs";
import { ProgressHistorySection } from "./ui/sections/progress-history-section/ProgressHistorySection";
import { RecentWorkoutCardItem } from "./ui/sections/progress-history-section/RecentWorkoutCard";
import { ProgressOverviewSection } from "./ui/sections/progress-overview-section/ProgressOverviewSection";

export type ProgressTab = "overview" | "history";

export type ProgressOverviewState = {
  data?: WorkoutProgressOverview;
  isLoading: boolean;
  isError: boolean;
};

export type ProgressHistoryState = {
  data: RecentWorkoutCardItem[];
  isLoading: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
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
      containerStyle={
        isHistoryTab ? { paddingBottom: 0, paddingTop: 0 } : undefined
      }
    >
      <View className={twMerge(clsx("gap-3", isHistoryTab && "flex-1"))}>
        {activeTab === "overview" ? (
          <ProgressOverviewContent state={overviewState} />
        ) : (
          <View className="flex-1">
            <ProgressHistoryContent state={historyState} />
          </View>
        )}
      </View>
    </PageLayout>
  );
}

function ProgressOverviewContent({ state }: { state: ProgressOverviewState }) {
  if (state.isLoading) return null;
  if (state.isError || !state.data) return null;

  return <ProgressOverviewSection data={state.data} />;
}

function ProgressHistoryContent({ state }: { state: ProgressHistoryState }) {
  if (state.isLoading) return null;
  if (state.isError) return null;

  return (
    <ProgressHistorySection
      data={state.data}
      isFetchingNextPage={state.isFetchingNextPage}
      onLoadMore={state.onLoadMore}
    />
  );
}
