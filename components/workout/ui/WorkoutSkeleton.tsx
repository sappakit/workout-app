import { PageLayout } from "@/components/layout/PageLayout";
import { SkeletonPlaceholder } from "@/components/loading/SkeletonPlaceholder";
import { TextSkeleton } from "@/components/loading/TextSkeleton";
import { WorkoutPreviewSectionSkeleton } from "@/components/workout/ui/workout-preview-card/WorkoutPreviewSectionSkeleton";
import { View } from "react-native";

export function WorkoutSkeleton() {
  return (
    <PageLayout headerProps={{ variant: "title", title: "Workout" }}>
      <View className="gap-4">
        <TodayPlanSkeleton />

        <WorkoutPreviewSectionSkeleton titleWidthClassName="w-24" />

        <WorkoutActionsSkeleton />
      </View>
    </PageLayout>
  );
}

function TodayPlanSkeleton() {
  return (
    <View className="gap-3">
      <View className="gap-1">
        <TextSkeleton type="subtitle" className="w-32" />
        <TextSkeleton type="small" className="w-72" />
      </View>

      <SkeletonPlaceholder className="h-56 w-full rounded-3xl" />

      <SkeletonPlaceholder className="h-12 w-full rounded-xl" />
    </View>
  );
}

function WorkoutActionsSkeleton() {
  return (
    <View className="gap-3">
      <View className="flex-row gap-3">
        <SkeletonPlaceholder className="h-12 flex-1 rounded-xl" />
        <SkeletonPlaceholder className="h-12 flex-1 rounded-xl" />
      </View>

      <SkeletonPlaceholder className="h-12 w-full rounded-xl" />
    </View>
  );
}
