import { SkeletonPlaceholder } from "@/components/loading/SkeletonPlaceholder";
import { View } from "react-native";

export function ChooseWorkoutPickerSkeleton() {
  return (
    <View className="gap-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <WorkoutCardSkeleton key={index} />
      ))}
    </View>
  );
}

function WorkoutCardSkeleton() {
  return <SkeletonPlaceholder className="aspect-[3.75] w-full rounded-3xl" />;
}
