import { useAppColors } from "@/hooks/useAppTheme";
import { useColorScheme } from "nativewind";
import { Text, View } from "react-native";

export function ThemeDebug() {
  const colors = useAppColors();
  const { colorScheme } = useColorScheme();

  return (
    <View className="gap-3 border border-red-500 p-4">
      <Text className="text-foreground">NativeWind scheme: {colorScheme}</Text>

      <View className="h-16 justify-center bg-background px-3">
        <Text className="text-foreground">bg-background</Text>
      </View>

      <View className="h-16 justify-center bg-card px-3">
        <Text className="text-card-foreground">bg-card</Text>
      </View>

      <View className="h-16 justify-center bg-secondary px-3">
        <Text className="text-secondary-foreground">bg-secondary</Text>
      </View>

      <View className="h-16 justify-center bg-primary px-3">
        <Text className="text-primary-foreground">bg-primary</Text>
      </View>

      <View
        className="h-16 justify-center px-3"
        style={{ backgroundColor: colors.background }}
      >
        <Text style={{ color: colors.foreground }}>
          Runtime background: {colors.background}
        </Text>
      </View>

      <View
        className="h-16 justify-center px-3"
        style={{ backgroundColor: colors.card }}
      >
        <Text style={{ color: colors.cardForeground }}>
          Runtime card: {colors.card}
        </Text>
      </View>
    </View>
  );
}
