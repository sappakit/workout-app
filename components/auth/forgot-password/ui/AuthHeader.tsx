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
      <AppLogo size={200} />

      <View className="-mt-6 items-center gap-2">
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
