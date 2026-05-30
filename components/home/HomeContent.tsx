import { HeroCard } from "@/components/home/ui/HeroCard";
import { PageLayout, PullToRefreshProps } from "@/components/layout/PageLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { AppButton } from "../custom-ui/AppButton";
import {
  RecentWorkoutCard,
  RecentWorkoutCardItem,
} from "../progress/ui/sections/progress-history-section/RecentWorkoutCard";
import { WorkoutStatsModel } from "../workout/model/workout-stats.mapper";
import { CategoryFilter } from "../workout/ui/CategoryFilter";
import { HomeStatsCards } from "../workout/ui/stats-cards/HomeStatsCards";
import {
  WorkoutPreviewCard,
  WorkoutPreviewCardItem,
} from "../workout/ui/WorkoutPreviewCard";

interface HomeContentProps {
  workoutStats: WorkoutStatsModel;
  workoutPreviewItems: WorkoutPreviewCardItem[];
  historyItems: RecentWorkoutCardItem[];
  pullToRefresh?: PullToRefreshProps;
}

export default function HomeContent({
  workoutStats,
  workoutPreviewItems,
  historyItems,
  pullToRefresh,
}: HomeContentProps) {
  const router = useRouter();

  const handleStartWorkout = () => {
    router.push("/(tabs)/workout");
  };

  const handleViewAllWorkouts = () => {
    router.push("/(tabs)/workout");
  };

  const handleViewAllHistory = () => {
    router.push("/(tabs)/progress");
  };

  return (
    <PageLayout headerProps={{ variant: "home" }} pullToRefresh={pullToRefresh}>
      <View className="gap-4">
        <HeroCard onStartWorkout={handleStartWorkout} />

        <HomeStatsCards data={workoutStats} />

        <View>
          <View className="mb-3">
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
          </View>

          <CategoryFilter />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingTop: 12 }}
          >
            {workoutPreviewItems.map((workout) => (
              <WorkoutPreviewCard key={workout.id} item={workout} />
            ))}
          </ScrollView>
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
