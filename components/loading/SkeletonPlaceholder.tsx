import { cn } from "@/lib/utils";
import type { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";
import { Skeleton } from "../ui/skeleton";

export type SkeletonPlaceholderProps = {
  /**
   * Controls the outer container layout.
   *
   * Use this for width, height, aspect ratio, flex, and other sizing/layout classes.
   *
   * @example
   * "w-full h-44"
   * @example
   * "aspect-[2.5] w-full"
   * @example
   * "aspect-[1.17] w-56"
   */
  containerClassName?: string;

  /**
   * Controls inline styles for the outer container.
   *
   * Useful for dynamic sizing or values that cannot be expressed
   * cleanly with static NativeWind classes.
   *
   * @example
   * { height: 56 * itemCount }
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * Controls the visual appearance of the skeleton.
   *
   * Use this for border radius, background color, opacity, and other visual styles.
   *
   * @example
   * "rounded-3xl"
   */
  skeletonClassName?: string;

  /**
   * Controls inline styles for the skeleton itself.
   *
   * Use this when the visible skeleton needs a dynamic visual style.
   *
   * @example
   * { opacity: 0.8 }
   */
  skeletonStyle?: StyleProp<ViewStyle>;
};

/**
 * Skeleton placeholder with a dedicated layout container.
 *
 * Put sizing/layout classes and styles on
 * `containerClassName` / `containerStyle`.
 *
 * Put visual skeleton classes and styles on
 * `skeletonClassName` / `skeletonStyle`.
 */
export function SkeletonPlaceholder({
  containerClassName,
  containerStyle,
  skeletonClassName,
  skeletonStyle,
}: SkeletonPlaceholderProps) {
  return (
    <View className={containerClassName} style={containerStyle}>
      <Skeleton
        className={cn("h-full w-full", skeletonClassName)}
        style={skeletonStyle}
      />
    </View>
  );
}
