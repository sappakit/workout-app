import {
  CONTENT_PADDING_HORIZONTAL,
  PageLayout,
} from "@/components/layout/PageLayout";
import { SectionHeaderSkeleton } from "@/components/loading/SectionHeaderSkeleton";
import { SkeletonPlaceholder } from "@/components/loading/SkeletonPlaceholder";
import { TextSkeleton } from "@/components/loading/TextSkeleton";
import { WorkoutPreviewSectionSkeleton } from "@/components/workout/ui/workout-preview-card/WorkoutPreviewSectionSkeleton";
import { View } from "react-native";
import { CategoryFilterSkeleton } from "./workout-preview-card/muscle-category-filter/CategoryFilterSkeleton";

export function WorkoutSkeleton() {
  return (
    <PageLayout
      header={{
        props: { variant: "title", title: "Workout" },
      }}
    >
      <View className="gap-4">
        <TodayPlanSkeleton />

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

        <WorkoutActionsSkeleton />
      </View>
    </PageLayout>
  );
}

function TodayPlanSkeleton() {
  return (
    <View className="gap-3">
      <View className="gap-1">
        <TextSkeleton type="heading" className="w-32" />

        <TextSkeleton type="small" className="w-80" />
      </View>

      <SkeletonPlaceholder
        containerClassName="h-56 w-full"
        skeletonClassName="rounded-3xl"
      />

      <SkeletonPlaceholder
        containerClassName="h-10 w-full"
        skeletonClassName="rounded-xl"
      />
    </View>
  );
}

function WorkoutActionsSkeleton() {
  return (
    <View className="gap-3">
      <View className="flex-row gap-3">
        <SkeletonPlaceholder
          containerClassName="h-10 flex-1"
          skeletonClassName="rounded-xl"
        />

        <SkeletonPlaceholder
          containerClassName="h-10 flex-1"
          skeletonClassName="rounded-xl"
        />
      </View>

      <SkeletonPlaceholder
        containerClassName="h-10 w-full"
        skeletonClassName="rounded-xl"
      />
    </View>
  );
}
