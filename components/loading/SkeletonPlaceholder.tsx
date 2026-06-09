import { useAppTheme } from "@/hooks/useAppTheme";
import clsx from "clsx";
import { useEffect } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { twMerge } from "tailwind-merge";

type SkeletonPlaceholderProps = {
  className?: string;
  style?: StyleProp<ViewStyle>;
  duration?: number;
  minOpacity?: number;
  maxOpacity?: number;
};

export function SkeletonPlaceholder({
  className,
  style,
  duration = 900,
  minOpacity = 0.35,
  maxOpacity = 1,
}: SkeletonPlaceholderProps) {
  const { colors } = useAppTheme();
  const highlightOpacity = useSharedValue(minOpacity);

  useEffect(() => {
    highlightOpacity.value = withRepeat(
      withSequence(
        withTiming(maxOpacity, {
          duration,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(minOpacity, {
          duration,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      false,
    );
  }, [duration, minOpacity, maxOpacity, highlightOpacity]);

  const highlightStyle = useAnimatedStyle(() => {
    return {
      opacity: highlightOpacity.value,
    };
  });

  return (
    <View
      pointerEvents="none"
      className={twMerge(clsx("overflow-hidden", className))}
      style={[{ backgroundColor: colors.app.skeletonBase }, style]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: colors.app.skeletonHighlight },
          highlightStyle,
        ]}
      />
    </View>
  );
}
