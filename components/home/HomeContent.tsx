import { HomeStatsModel } from "@/components/home/model/home-stats.mapper";
import { CategoryFilter } from "@/components/home/ui/CategoryFilter";
import { HeroCard } from "@/components/home/ui/HeroCard";
import {
  RecentWorkoutCard,
  RecentWorkoutCardItem,
} from "@/components/home/ui/RecentWorkoutCard";
import { HomeStatsCards } from "@/components/home/ui/StatCard";
import {
  WorkoutPreviewCard,
  WorkoutPreviewCardItem,
} from "@/components/home/ui/WorkoutPreviewCard";
import { PageLayout } from "@/components/layout/PageLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { AppButton } from "../custom-ui/AppButton";

interface HomeContentProps {
  homeStats: HomeStatsModel;
  workoutPreviewItems: WorkoutPreviewCardItem[];
  historyItems: RecentWorkoutCardItem[];
}

export default function HomeContent({
  homeStats,
  workoutPreviewItems,
  historyItems,
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
    <PageLayout
      headerProps={{ variant: "home" }}
      // pullToRefresh={{ refreshing: isFetching, onRefresh: handleRefresh }}
    >
      <View className="gap-4">
        <HeroCard onStartWorkout={handleStartWorkout} />

        <HomeStatsCards data={homeStats} />

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
