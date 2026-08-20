import type { AppTextType } from "@/components/custom-ui/themed-text";
import { cn } from "@/lib/utils";
import { SkeletonPlaceholderV2 } from "./SkeletonPlaceholderV2";

const textSkeletonClassMap = {
  display: "h-9",
  title: "h-8",
  heading: "h-6",
  body: "h-6",
  bodyStrong: "h-6",
  label: "h-5",
  small: "h-5",
  caption: "h-4",
} satisfies Record<AppTextType, string>;

type TextSkeletonProps = {
  type?: AppTextType;
  className?: string;
};

export function TextSkeleton({ type = "body", className }: TextSkeletonProps) {
  return (
    <SkeletonPlaceholderV2
      containerClassName={cn("w-full", textSkeletonClassMap[type], className)}
      skeletonClassName="rounded-full"
    />
  );
}
