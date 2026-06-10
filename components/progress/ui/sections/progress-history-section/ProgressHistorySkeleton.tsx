import { SkeletonPlaceholder } from "@/components/loading/SkeletonPlaceholder";
import { TextSkeleton } from "@/components/loading/TextSkeleton";
import { View } from "react-native";

export function ProgressHistorySkeleton() {
  return (
    <View className="gap-3 px-4 pt-3">
      <View className="gap-2">
        <TextSkeleton type="title" className="w-44" />
        <TextSkeleton type="small" className="w-64" />
      </View>

      <SkeletonPlaceholder className="h-40 w-full rounded-3xl" />
      <SkeletonPlaceholder className="h-40 w-full rounded-3xl" />
      <SkeletonPlaceholder className="h-40 w-full rounded-3xl" />
    </View>
  );
}
