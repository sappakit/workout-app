import { SkeletonPlaceholderV2 } from "@/components/loading/SkeletonPlaceholderV2";
import { View } from "react-native";

export function ChooseWorkoutPickerSkeleton() {
  return (
    <View className="gap-3">
      {Array.from({
        length: 5,
      }).map((_, index) => (
        <WorkoutCardSkeleton key={index} />
      ))}
    </View>
  );
}

function WorkoutCardSkeleton() {
  return (
    <SkeletonPlaceholderV2
      containerClassName="aspect-[3.75] w-full"
      skeletonClassName="rounded-3xl"
    />
  );
}
