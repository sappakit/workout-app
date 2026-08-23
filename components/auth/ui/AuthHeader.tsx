import { ThemedText } from "@/components/custom-ui/themed-text";
import { AppLogo } from "@/components/image/AppLogo";
import { View } from "react-native";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View>
      <View className="py-2">
        <AppLogo />
      </View>

      <View className="items-center gap-2">
        <ThemedText type="title" className="text-center">
          {title}
        </ThemedText>

        <ThemedText type="small" tone="muted" className="text-center">
          {subtitle}
        </ThemedText>
      </View>
    </View>
  );
}
