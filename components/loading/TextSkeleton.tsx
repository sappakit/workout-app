import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { TextType } from "../themed-text";
import { SkeletonPlaceholder } from "./SkeletonPlaceholder";

const textSkeletonClassMap = {
  default: "h-6",
  extraSmall: "h-4",
  small: "h-5",
  defaultSemiBold: "h-6",
  title: "h-7",
  subtitle: "h-7",
} satisfies Record<TextType, string>;

export function TextSkeleton({
  type = "default",
  className,
}: {
  type?: TextType;
  className?: string;
}) {
  return (
    <SkeletonPlaceholder
      className={twMerge(
        clsx("w-full rounded-full", textSkeletonClassMap[type], className),
      )}
    />
  );
}
