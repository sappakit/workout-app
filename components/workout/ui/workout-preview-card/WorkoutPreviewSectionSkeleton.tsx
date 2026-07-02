import { SectionHeaderSkeleton } from "@/components/home/ui/HomeSkeleton";
import { CONTENT_PADDING_HORIZONTAL } from "@/components/layout/PageLayout";
import { SkeletonPlaceholder } from "@/components/loading/SkeletonPlaceholder";
import { ScrollView, View } from "react-native";
import { CategoryFilterSkeleton } from "./muscle-category-filter/CategoryFilterSkeleton";

type WorkoutPreviewSectionSkeletonProps = {
  titleWidthClassName?: string;
  showHeader?: boolean;
  showCategories?: boolean;
  cardCount?: number;
  withHorizontalPadding?: boolean;
};

export function WorkoutPreviewSectionSkeleton({
  titleWidthClassName = "w-32",
  showHeader = true,
  showCategories = true,
  cardCount = 4,
  withHorizontalPadding = false,
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
        contentContainerStyle={{
          gap: 12,
          paddingHorizontal: withHorizontalPadding
            ? CONTENT_PADDING_HORIZONTAL
            : undefined,
        }}
      >
        {Array.from({ length: cardCount }).map((_, index) => (
          <WorkoutPreviewCardSkeleton key={index} />
        ))}
      </ScrollView>
    </View>
  );
}

function WorkoutPreviewCardSkeleton() {
  return <SkeletonPlaceholder className="aspect-[1.17] w-56 rounded-2xl" />;
}
