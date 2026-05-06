import { PageLayout } from "@/components/layout/PageLayout";
import React, { useState } from "react";
import { View } from "react-native";
import { ProgressTabs } from "./ui/elements/ProgressTabs";
import { ProgressHistorySection } from "./ui/sections/ProgressHistorySection";
import { ProgressOverviewSection } from "./ui/sections/ProgressOverviewSection";

export type ProgressPageData = {
  weeklySummary: {
    workoutsCompleted: number;
    totalVolumeKg: number;
    completedSets: number;
    totalDurationSeconds: number;
  };
  weeklyVolume: {
    label: string;
    volumeKg: number;
  }[];
  personalRecords: {
    exerciseName: string;
    bestWeightKg: number;
    bestSetVolumeKg: number;
    bestSetLabel: string;
  }[];
  recentWorkouts: {
    id: number;
    workoutName: string;
    completedAt: string;
    durationSeconds: number;
    volumeKg: number;
    completedSets: number;
    totalSets: number;
  }[];
};

export type ProgressTab = "overview" | "history";

interface ProgressContentProps {
  data: ProgressPageData;
}

export default function ProgressContent({ data }: ProgressContentProps) {
  const [activeTab, setActiveTab] = useState<ProgressTab>("overview");

  return (
    <PageLayout
      headerProps={{
        variant: "title",
        title: "Progress",
      }}
    >
      <View className="gap-3">
        <ProgressTabs activeTab={activeTab} onChangeTab={setActiveTab} />

        {activeTab === "overview" ? (
          <ProgressOverviewSection
            weeklySummary={data.weeklySummary}
            weeklyVolume={data.weeklyVolume}
            personalRecords={data.personalRecords}
          />
        ) : (
          <ProgressHistorySection recentWorkouts={data.recentWorkouts} />
        )}
      </View>
    </PageLayout>
  );
}
