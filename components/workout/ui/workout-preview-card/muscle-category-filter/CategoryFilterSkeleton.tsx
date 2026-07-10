import { SkeletonPlaceholder } from "@/components/loading/SkeletonPlaceholder";
import clsx from "clsx";
import { ScrollView } from "react-native";
import { twMerge } from "tailwind-merge";

export function CategoryFilterSkeleton() {
  return (
    <ScrollView
      horizontal
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2"
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
    <SkeletonPlaceholder
      className={twMerge(clsx("h-8 rounded-full", widthClassName))}
    />
  );
}
