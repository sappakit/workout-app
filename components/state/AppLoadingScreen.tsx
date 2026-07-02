import { AppLogo } from "@/components/image/AppLogo";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ActivityIndicator, View } from "react-native";

export function AppLoadingScreen() {
  const { colors } = useAppTheme();

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{
        backgroundColor: colors.app.background,
      }}
    >
      <AppLogo size={200} />

      <ActivityIndicator
        size="large"
        color={colors.app.brand}
        className="-mt-8"
      />
    </View>
  );
}
