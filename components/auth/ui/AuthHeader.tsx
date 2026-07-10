import { AppLogo } from "@/components/image/AppLogo";
import { ThemedText } from "@/components/themed-text";
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
        <ThemedText type="title" variant="accent">
          {title}
        </ThemedText>

        <ThemedText type="small" variant="primary" className="text-center">
          {subtitle}
        </ThemedText>
      </View>
    </View>
  );
}
