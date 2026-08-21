import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { useAppColors } from "@/hooks/useAppColors";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/stores/themeStore";
import { Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export function ThemeToggle({ className }: { className?: string }) {
  const colors = useAppColors();

  const colorScheme = useThemeStore((state) => state.colorScheme);
  const setMode = useThemeStore((state) => state.setMode);

  const rotation = useSharedValue(0);

  const isDark = colorScheme === "dark";

  const toggleTheme = () => {
    rotation.value = withTiming(isDark ? 180 : 0, {
      duration: 300,
    });

    setMode(isDark ? "light" : "dark");
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${rotation.value}deg`,
      },
    ],
  }));

  return (
    <Pressable
      onPress={toggleTheme}
      className={cn("active:opacity-80", className)}
    >
      <Animated.View
        className="items-center justify-center rounded-full p-2"
        style={animatedStyle}
      >
        <AppIcon
          name={isDark ? "moon" : "sun"}
          size="lg"
          color={colors.foreground}
        />
      </Animated.View>
    </Pressable>
  );
}
