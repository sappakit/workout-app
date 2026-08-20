import { PageLayout } from "@/components/layout/PageLayout";
import { EmptyState } from "@/components/state/EmptyState";
import { ErrorState } from "@/components/state/ErrorState";
import type { WorkoutProgressOverview } from "@/types/workout/response/workout.types";
import { ScrollView, View } from "react-native";
import { type ProgressTab, ProgressTabs } from "./ui/elements/ProgressTabs";
import { ProgressHistorySection } from "./ui/sections/progress-history-section/ProgressHistorySection";
import { ProgressHistorySkeleton } from "./ui/sections/progress-history-section/ProgressHistorySkeleton";
import type { RecentWorkoutCardItem } from "./ui/sections/progress-history-section/RecentWorkoutCard";
import { ProgressOverviewSection } from "./ui/sections/progress-overview-section/ProgressOverviewSection";
import { ProgressOverviewSkeleton } from "./ui/sections/progress-overview-section/ProgressOverviewSkeleton";
import { ProgressPager } from "./ui/sections/progress-pager/ProgressPager";

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
  return (
    <PageLayout
      scrollable={false}
      disableContentPadding
      header={{
        props: {
          variant: "title",
          title: "Progress",
        },
        bottom: (
          <ProgressTabs activeTab={activeTab} onChangeTab={onChangeTab} />
        ),
      }}
    >
      <ProgressPager
        activeTab={activeTab}
        onChangeTab={onChangeTab}
        overviewContent={
          <ScrollView
            scrollEnabled={!overviewState.isLoading}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <ProgressOverviewContent state={overviewState} />
          </ScrollView>
        }
        historyContent={
          <View className="flex-1">
            <ProgressHistoryContent state={historyState} />
          </View>
        }
      />
    </PageLayout>
  );
}

function ProgressOverviewContent({ state }: { state: ProgressOverviewState }) {
  if (state.isLoading) {
    return <ProgressOverviewSkeleton />;
  }

  if (state.isError) {
    return (
      <ErrorState
        primaryAction={{
          onPress: state.onRetry,
        }}
        secondaryAction={{ hidden: true }}
      />
    );
  }

  if (!state.data) {
    return (
      <EmptyState
        icon="progress"
        title="No progress yet"
        message="Complete a workout to start seeing your weekly progress."
        secondaryAction={{ hidden: true }}
      />
    );
  }

  return <ProgressOverviewSection data={state.data} />;
}

function ProgressHistoryContent({ state }: { state: ProgressHistoryState }) {
  if (state.isLoading) {
    return <ProgressHistorySkeleton />;
  }

  if (state.isError) {
    return (
      <ErrorState
        primaryAction={{
          onPress: state.onRetry,
        }}
        secondaryAction={{ hidden: true }}
      />
    );
  }

  if (state.data.length === 0) {
    return (
      <EmptyState
        icon="history"
        title="No workout history"
        message="Complete a workout to start building your workout history."
        secondaryAction={{ hidden: true }}
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
