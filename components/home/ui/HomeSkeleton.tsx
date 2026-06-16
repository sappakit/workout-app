import { PageLayout } from "@/components/layout/PageLayout";
import { SkeletonPlaceholder } from "@/components/loading/SkeletonPlaceholder";
import { TextSkeleton } from "@/components/loading/TextSkeleton";
import { WorkoutPreviewSectionSkeleton } from "@/components/workout/ui/workout-preview-card/WorkoutPreviewSectionSkeleton";
import { View } from "react-native";

export function HomeSkeleton() {
  return (
    <PageLayout headerProps={{ variant: "home" }} scrollable={false}>
      <View className="gap-4">
        <HeroCardSkeleton />

        <HomeStatsSkeleton />

        <WorkoutPreviewSectionSkeleton titleWidthClassName="w-28" />

        <RecentWorkoutSkeleton />
      </View>
    </PageLayout>
  );
}

export function HeroCardSkeleton() {
  return <SkeletonPlaceholder className="h-44 rounded-3xl" />;
}

function HomeStatsSkeleton() {
  return (
    <View className="flex-row gap-3">
      <SkeletonPlaceholder className="aspect-[1.25] w-1/2 rounded-2xl" />

      <View className="flex-1 gap-3">
        <SkeletonPlaceholder className="flex-1 rounded-2xl" />

        <SkeletonPlaceholder className="flex-1 rounded-2xl" />
      </View>
    </View>
  );
}

export function SectionHeaderSkeleton({
  titleWidthClassName = "w-32",
}: {
  titleWidthClassName?: string;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <TextSkeleton type="subtitle" className={titleWidthClassName} />
      <TextSkeleton type="small" className="w-14" />
    </View>
  );
}

function RecentWorkoutSkeleton() {
  return (
    <View className="gap-3">
      <SectionHeaderSkeleton titleWidthClassName="w-36" />

      <SkeletonPlaceholder className="aspect-[2.5] w-full rounded-3xl" />
      <SkeletonPlaceholder className="aspect-[2.5] w-full rounded-3xl" />
      <SkeletonPlaceholder className="aspect-[2.5] w-full rounded-3xl" />
    </View>
  );
}
