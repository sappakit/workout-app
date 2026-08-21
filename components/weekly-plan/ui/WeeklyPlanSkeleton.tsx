import { PageLayout } from "@/components/layout/PageLayout";
import { SectionHeaderSkeleton } from "@/components/loading/SectionHeaderSkeleton";
import { SkeletonPlaceholder } from "@/components/loading/SkeletonPlaceholder";
import { TextSkeleton } from "@/components/loading/TextSkeleton";
import { ScrollView, View } from "react-native";

export function WeeklyPlanSkeleton() {
  return (
    <PageLayout
      scrollable={false}
      header={{
        props: {
          variant: "title",
          title: "Weekly Plan",
          showBackButton: true,
        },
      }}
    >
      <View className="gap-4">
        <WeeklyPlanSummarySkeleton />

        <WeeklyPlanDaySelectorSkeleton />

        <SelectedWeeklyPlanDaySkeleton />
      </View>
    </PageLayout>
  );
}

function WeeklyPlanSummarySkeleton() {
  return (
    <View className="gap-4 rounded-3xl bg-card p-4">
      <View className="flex-row items-center gap-3">
        <SkeletonPlaceholder
          containerClassName="h-12 w-12"
          skeletonClassName="rounded-2xl"
        />

        <View className="flex-1">
          <TextSkeleton type="title" className="w-52" />

          <TextSkeleton type="small" className="w-64" />
        </View>
      </View>

      <View className="flex-row gap-3">
        <SummaryStatSkeleton />

        <SummaryStatSkeleton />

        <SummaryStatSkeleton />
      </View>
    </View>
  );
}

function SummaryStatSkeleton() {
  return (
    <View className="flex-1 gap-1 rounded-2xl bg-secondary p-3">
      <TextSkeleton type="caption" className="w-16" />

      <TextSkeleton type="title" className="w-8" />
    </View>
  );
}

function WeeklyPlanDaySelectorSkeleton() {
  return (
    <View className="gap-3">
      <SectionHeaderSkeleton titleWidthClassName="w-28" />

      <ScrollView
        horizontal
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3"
      >
        {Array.from({ length: 7 }).map((_, index) => (
          <DayPillSkeleton key={index} />
        ))}
      </ScrollView>
    </View>
  );
}

function DayPillSkeleton() {
  return (
    <SkeletonPlaceholder
      containerClassName="h-24 w-20"
      skeletonClassName="rounded-3xl"
    />
  );
}

function SelectedWeeklyPlanDaySkeleton() {
  return (
    <SkeletonPlaceholder
      containerClassName="h-48 w-full"
      skeletonClassName="rounded-3xl"
    />
  );
}
