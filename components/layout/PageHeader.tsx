import { useAppTheme } from "@/hooks/useAppTheme";
import { View } from "react-native";
import { ThemeToggle } from "../custom-ui/ThemeToggle";
import { UserIcon } from "../custom-ui/UserIcon";
import { ThemedText } from "../themed-text";

export default function PageHeader() {
  const { colors } = useAppTheme();

  return (
    <View
      className="z-50 flex-row items-center justify-between p-4"
      style={{
        backgroundColor: colors.app.pageHeaderBackground,
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
      }}
    >
      <View className="flex-row">
        <UserIcon />

        <View className="ml-4">
          {/* Title line */}
          <ThemedText type="default" variant="accent">
            Welcome back,{" "}
            <ThemedText type="defaultSemiBold" variant="accent">
              Tae
            </ThemedText>
          </ThemedText>

          {/* Subtitle line */}
          <ThemedText className="text-xs" variant="primary">
            Ready to work out?
          </ThemedText>
        </View>
      </View>

      <ThemeToggle />
    </View>
  );
}
