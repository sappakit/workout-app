import { SkeletonPlaceholderV2 } from "@/components/loading/SkeletonPlaceholderV2";
import { cn } from "@/lib/utils";
import { ScrollView, type StyleProp, type ViewStyle } from "react-native";

type CategoryFilterSkeletonProps = {
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export function CategoryFilterSkeleton({
  contentContainerStyle,
}: CategoryFilterSkeletonProps) {
  return (
    <ScrollView
      horizontal
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2"
      contentContainerStyle={contentContainerStyle}
    >
      <CategoryPillSkeleton widthClassName="w-14" />
      <CategoryPillSkeleton widthClassName="w-24" />
      <CategoryPillSkeleton widthClassName="w-28" />
      <CategoryPillSkeleton widthClassName="w-16" />
      <CategoryPillSkeleton widthClassName="w-28" />
      <CategoryPillSkeleton widthClassName="w-14" />
    </ScrollView>
  );
}

function CategoryPillSkeleton({
  widthClassName = "w-16",
}: {
  widthClassName?: string;
}) {
  return (
    <SkeletonPlaceholderV2
      containerClassName={cn("h-8", widthClassName)}
      skeletonClassName="rounded-full"
    />
  );
}
