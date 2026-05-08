import { PageLayout } from "@/components/layout/PageLayout";
import { WorkoutProgressOverview } from "@/types/workout/response/workout.types";
import React from "react";
import { View } from "react-native";
import { ProgressMetricCardItem } from "./ui/elements/ProgressMetricCard";
import { ProgressTabs } from "./ui/elements/ProgressTabs";
import { ProgressHistorySection } from "./ui/sections/ProgressHistorySection";
import { ProgressOverviewSection } from "./ui/sections/progress-overview-section/ProgressOverviewSection";

export type ProgressTab = "overview" | "history";

export type ProgressOverviewState = {
  data?: WorkoutProgressOverview;
  isLoading: boolean;
  isError: boolean;
};

export type ProgressHistoryState = {
  data: ProgressMetricCardItem[];
  isLoading: boolean;
  isError: boolean;
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
  return (
    <PageLayout
      headerProps={{
        variant: "title",
        title: "Progress",
      }}
    >
      <View className="gap-3">
        <ProgressTabs activeTab={activeTab} onChangeTab={onChangeTab} />

        {activeTab === "overview" ? (
          <ProgressOverviewContent state={overviewState} />
        ) : (
          <ProgressHistoryContent state={historyState} />
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

  return <ProgressHistorySection data={state.data} />;
}
