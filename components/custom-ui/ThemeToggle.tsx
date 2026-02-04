import { useAppTheme } from "@/hooks/useAppTheme";
import { useThemeStore } from "@/stores/themeStore";
import { Moon, Sun } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export function ThemeToggle() {
  const { colors } = useAppTheme();

  const colorScheme = useThemeStore((s) => s.colorScheme);
  const setMode = useThemeStore((s) => s.setMode);

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
    <TouchableOpacity onPress={toggleTheme} activeOpacity={0.8}>
      <Animated.View
        className="items-center justify-center rounded-full p-2"
        style={animatedStyle}
      >
        {isDark ? (
          <Moon size={24} color={colors.app.textPrimary} />
        ) : (
          <Sun size={24} color={colors.app.textPrimary} />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}
