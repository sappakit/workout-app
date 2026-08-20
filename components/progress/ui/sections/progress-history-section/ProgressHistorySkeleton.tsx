import { SkeletonPlaceholderV2 } from "@/components/loading/SkeletonPlaceholderV2";
import { TextSkeleton } from "@/components/loading/TextSkeleton";
import { View } from "react-native";

export function ProgressHistorySkeleton() {
  return (
    <View className="gap-3 p-4">
      <View className="gap-2">
        <TextSkeleton type="title" className="w-44" />

        <TextSkeleton type="small" className="w-64" />
      </View>

      {Array.from({ length: 4 }).map((_, index) => (
        <RecentWorkoutCardSkeleton key={index} />
      ))}
    </View>
  );
}

export function RecentWorkoutCardSkeleton() {
  return (
    <SkeletonPlaceholderV2
      containerClassName="aspect-[2.55] w-full"
      skeletonClassName="rounded-3xl"
    />
  );
}
