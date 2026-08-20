import {
  CONTENT_PADDING_HORIZONTAL,
  PageLayout,
} from "@/components/layout/PageLayout";
import { SectionHeaderSkeleton } from "@/components/loading/SectionHeaderSkeleton";
import { SkeletonPlaceholderV2 } from "@/components/loading/SkeletonPlaceholderV2";
import { RecentWorkoutCardSkeleton } from "@/components/progress/ui/sections/progress-history-section/ProgressHistorySkeleton";
import { CategoryFilterSkeleton } from "@/components/workout/ui/workout-preview-card/muscle-category-filter/CategoryFilterSkeleton";
import { WorkoutPreviewSectionSkeleton } from "@/components/workout/ui/workout-preview-card/WorkoutPreviewSectionSkeleton";
import { View } from "react-native";

export function HomeSkeleton() {
  return (
    <PageLayout
      header={{
        props: { variant: "home" },
      }}
      scrollable={false}
    >
      <View className="flex-1 gap-4">
        <HeroCardSkeleton />

        <HomeStatsSkeleton />

        <View className="gap-3">
          <SectionHeaderSkeleton titleWidthClassName="w-40" showAction />

          <View
            className="gap-3"
            style={{ marginHorizontal: -CONTENT_PADDING_HORIZONTAL }}
          >
            <CategoryFilterSkeleton
              contentContainerStyle={{
                paddingHorizontal: CONTENT_PADDING_HORIZONTAL,
              }}
            />

            <WorkoutPreviewSectionSkeleton
              contentContainerStyle={{
                paddingHorizontal: CONTENT_PADDING_HORIZONTAL,
              }}
            />
          </View>
        </View>

        <RecentWorkoutSkeleton />
      </View>
    </PageLayout>
  );
}

export function HeroCardSkeleton() {
  return (
    <SkeletonPlaceholderV2
      containerClassName="h-44 w-full"
      skeletonClassName="rounded-3xl"
    />
  );
}

function HomeStatsSkeleton() {
  return (
    <View className="aspect-[2.4] flex-row gap-3">
      <SkeletonPlaceholderV2
        containerClassName="w-[55%]"
        skeletonClassName="rounded-2xl"
      />

      <View className="flex-1 gap-3">
        <SkeletonPlaceholderV2
          containerClassName="flex-1"
          skeletonClassName="rounded-2xl"
        />

        <SkeletonPlaceholderV2
          containerClassName="flex-1"
          skeletonClassName="rounded-2xl"
        />
      </View>
    </View>
  );
}

function RecentWorkoutSkeleton() {
  return (
    <View className="gap-3">
      <SectionHeaderSkeleton titleWidthClassName="w-48" showAction />

      {Array.from({ length: 3 }).map((_, index) => (
        <RecentWorkoutCardSkeleton key={index} />
      ))}
    </View>
  );
}
