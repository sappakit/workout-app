import { SkeletonPlaceholderV2 } from "@/components/loading/SkeletonPlaceholderV2";
import { TextSkeleton } from "@/components/loading/TextSkeleton";
import { View } from "react-native";

export function ProgressOverviewSkeleton() {
  return (
    <View className="gap-3 p-4">
      {/* Weekly Summary header */}
      <View className="gap-2">
        <TextSkeleton type="title" className="w-48" />
        <TextSkeleton type="small" className="w-28" />
      </View>

      {/* Summary cards */}
      <View className="gap-3">
        <View className="flex-row gap-3">
          <SkeletonPlaceholderV2
            containerClassName="aspect-[2.5] flex-1"
            skeletonClassName="rounded-2xl"
          />

          <SkeletonPlaceholderV2
            containerClassName="aspect-[2.5] flex-1"
            skeletonClassName="rounded-2xl"
          />
        </View>

        <View className="flex-row gap-3">
          <SkeletonPlaceholderV2
            containerClassName="aspect-[2.5] flex-1"
            skeletonClassName="rounded-2xl"
          />

          <SkeletonPlaceholderV2
            containerClassName="aspect-[2.5] flex-1"
            skeletonClassName="rounded-2xl"
          />
        </View>
      </View>

      {/* Volume trend chart */}
      <SkeletonPlaceholderV2
        containerClassName="aspect-[1.9] w-full"
        skeletonClassName="rounded-2xl"
      />

      {/* Best performances header */}
      <View className="gap-2">
        <TextSkeleton type="title" className="w-44" />
        <TextSkeleton type="small" className="w-64" />
      </View>

      {/* Best performance cards */}
      <View className="gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonPlaceholderV2
            key={index}
            containerClassName="aspect-[2.05] w-full"
            skeletonClassName="rounded-3xl"
          />
        ))}
      </View>
    </View>
  );
}
