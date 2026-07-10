import { PageLayout, PullToRefreshProps } from "@/components/layout/PageLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { WorkoutTodayOverview } from "@/types/workout/response/workout.types";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { AppButton } from "../custom-ui/AppButton";
import {
  RecentWorkoutCard,
  RecentWorkoutCardItem,
} from "../progress/ui/sections/progress-history-section/RecentWorkoutCard";
import { WorkoutStatsModel } from "../workout/model/workout-stats.mapper";
import { HomeStatsCards } from "../workout/ui/stats-cards/HomeStatsCards";
import {
  WorkoutPreviewSection,
  WorkoutPreviewSectionProps,
} from "../workout/ui/workout-preview-card/WorkoutPreviewCard";
import { TodayWorkoutCard } from "./ui/TodayWorkoutCard";

interface HomeContentProps {
  todayOverview?: WorkoutTodayOverview;
  workoutStats: WorkoutStatsModel;
  historyItems: RecentWorkoutCardItem[];
  workoutPreviewSection: WorkoutPreviewSectionProps;
  pullToRefresh?: PullToRefreshProps;
}

export default function HomeContent({
  todayOverview,
  workoutStats,
  historyItems,
  workoutPreviewSection,
  pullToRefresh,
}: HomeContentProps) {
  const router = useRouter();

  const handleViewAllWorkouts = () => {
    router.push("/(tabs)/workout");
  };

  const handleViewAllHistory = () => {
    router.push("/(tabs)/progress");
  };

  return (
    <PageLayout
      header={{
        props: { variant: "home" },
      }}
      pullToRefresh={pullToRefresh}
    >
      <View className="gap-4">
        <TodayWorkoutCard todayOverview={todayOverview} />

        <HomeStatsCards data={workoutStats} />

        <View className="gap-3">
          <SectionHeader
            title="Popular now"
            action={
              <AppButton
                title="View all"
                variant="ghost"
                onPress={handleViewAllWorkouts}
              />
            }
          />

          <WorkoutPreviewSection {...workoutPreviewSection} />
        </View>

        <View>
          <SectionHeader
            title="Recent workout"
            action={
              <AppButton
                title="View all"
                variant="ghost"
                onPress={handleViewAllHistory}
              />
            }
          />

          <View className="mt-3 gap-4">
            {historyItems.map((item) => (
              <RecentWorkoutCard key={item.id} item={item} />
            ))}
          </View>
        </View>
      </View>
    </PageLayout>
  );
}
