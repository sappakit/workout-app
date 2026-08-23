import { AppLogo } from "@/components/image/AppLogo";
import { useAppColors } from "@/hooks/useAppColors";
import { ActivityIndicator, View } from "react-native";

export function AppLoadingScreen() {
  const colors = useAppColors();

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <AppLogo />

      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
