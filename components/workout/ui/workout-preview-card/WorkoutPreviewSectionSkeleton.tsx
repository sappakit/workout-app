import { SkeletonPlaceholder } from "@/components/loading/SkeletonPlaceholder";
import { ScrollView, StyleProp, ViewStyle } from "react-native";

type WorkoutPreviewSectionSkeletonProps = {
  cardCount?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export function WorkoutPreviewSectionSkeleton({
  cardCount = 4,
  contentContainerStyle,
}: WorkoutPreviewSectionSkeletonProps) {
  return (
    <ScrollView
      horizontal
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[{ gap: 12 }, contentContainerStyle]}
    >
      {Array.from({ length: cardCount }).map((_, index) => (
        <WorkoutPreviewCardSkeleton key={index} />
      ))}
    </ScrollView>
  );
}

function WorkoutPreviewCardSkeleton() {
  return (
    <SkeletonPlaceholder
      containerClassName="aspect-[1.17] w-56"
      skeletonClassName="rounded-2xl"
    />
  );
}
