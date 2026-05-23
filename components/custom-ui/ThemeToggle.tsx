import { useAppTheme } from "@/hooks/useAppTheme";
import { useThemeStore } from "@/stores/themeStore";
import { Moon, Sun } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export function ThemeToggle({ className }: { className?: string }) {
  const { colors } = useAppTheme();

  const colorScheme = useThemeStore((s) => s.colorScheme);
  const setMode = useThemeStore((s) => s.setMode);

  const rotation = useSharedValue(0);
  const isDark = colorScheme === "dark";
  const Icon = isDark ? Moon : Sun;

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
    <TouchableOpacity
      onPress={toggleTheme}
      activeOpacity={0.8}
      className={className}
    >
      <Animated.View
        className="items-center justify-center rounded-full p-2"
        style={animatedStyle}
      >
        <Icon size={24} color={colors.app.borderPrimary} />
      </Animated.View>
    </TouchableOpacity>
  );
}
