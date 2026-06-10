import { SkeletonPlaceholder } from "@/components/loading/SkeletonPlaceholder";
import { TextSkeleton } from "@/components/loading/TextSkeleton";
import { View } from "react-native";

export function ProgressOverviewSkeleton() {
  return (
    <View className="gap-3">
      {/* Weekly Summary header */}
      <View className="gap-2">
        <TextSkeleton type="title" className="w-40" />
        <TextSkeleton type="small" className="w-28" />
      </View>

      {/* Summary cards */}
      <View className="gap-3">
        <View className="flex-row gap-3">
          <SkeletonPlaceholder className="h-20 flex-1 rounded-2xl" />
          <SkeletonPlaceholder className="h-20 flex-1 rounded-2xl" />
        </View>

        <View className="flex-row gap-3">
          <SkeletonPlaceholder className="h-20 flex-1 rounded-2xl" />
          <SkeletonPlaceholder className="h-20 flex-1 rounded-2xl" />
        </View>
      </View>

      {/* Volume trend chart */}
      <SkeletonPlaceholder className="h-48 w-full rounded-2xl" />

      {/* Best performances header */}
      <View className="gap-2">
        <TextSkeleton type="title" className="w-44" />
        <TextSkeleton type="small" className="w-64" />
      </View>

      {/* Best performance cards */}
      <View className="gap-3">
        <SkeletonPlaceholder className="h-60 w-full rounded-3xl" />
        <SkeletonPlaceholder className="h-60 w-full rounded-3xl" />
        <SkeletonPlaceholder className="h-60 w-full rounded-3xl" />
      </View>
    </View>
  );
}
