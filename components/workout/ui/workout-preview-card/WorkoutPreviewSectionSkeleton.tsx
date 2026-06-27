import { SectionHeaderSkeleton } from "@/components/home/ui/HomeSkeleton";
import { SkeletonPlaceholder } from "@/components/loading/SkeletonPlaceholder";
import { ScrollView, View } from "react-native";
import { CategoryFilterSkeleton } from "./muscle-category-filter/CategoryFilterSkeleton";

type WorkoutPreviewSectionSkeletonProps = {
  titleWidthClassName?: string;
  showHeader?: boolean;
  showCategories?: boolean;
  cardCount?: number;
};

export function WorkoutPreviewSectionSkeleton({
  titleWidthClassName = "w-32",
  showHeader = true,
  showCategories = true,
  cardCount = 4,
}: WorkoutPreviewSectionSkeletonProps) {
  return (
    <View className="gap-3">
      {showHeader ? (
        <SectionHeaderSkeleton titleWidthClassName={titleWidthClassName} />
      ) : null}

      {showCategories ? <CategoryFilterSkeleton /> : null}

      <ScrollView
        horizontal
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3"
      >
        {Array.from({ length: cardCount }).map((_, index) => (
          <WorkoutPreviewCardSkeleton key={index} />
        ))}
      </ScrollView>
    </View>
  );
}

function WorkoutPreviewCardSkeleton() {
  return <SkeletonPlaceholder className="aspect-[1.15] w-56 rounded-2xl" />;
}
