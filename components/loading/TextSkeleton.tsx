import type { ThemedTextType } from "@/components/custom-ui/themed-text";
import { cn } from "@/lib/utils";
import { SkeletonPlaceholder } from "./SkeletonPlaceholder";

const textSkeletonClassMap = {
  display: "h-9",
  title: "h-8",
  heading: "h-6",
  body: "h-6",
  bodyStrong: "h-6",
  label: "h-5",
  small: "h-5",
  caption: "h-4",
} satisfies Record<ThemedTextType, string>;

type TextSkeletonProps = {
  type?: ThemedTextType;
  className?: string;
};

export function TextSkeleton({ type = "body", className }: TextSkeletonProps) {
  return (
    <SkeletonPlaceholder
      containerClassName={cn("w-full", textSkeletonClassMap[type], className)}
      skeletonClassName="rounded-full"
    />
  );
}
