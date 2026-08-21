import type { AppIconName } from "@/components/custom-ui/app-icon/app-icon.registry";
import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { useAppColors } from "@/hooks/useAppColors";
import type { ReactNode } from "react";
import { Pressable, View } from "react-native";

type ProfileMenuItemProps = {
  label: string;
  icon: AppIconName;
  onPress?: () => void;
  destructive?: boolean;
};

export function ProfileMenuItem({
  label,
  icon,
  onPress,
  destructive = false,
}: ProfileMenuItemProps) {
  const colors = useAppColors();

  const contentColor = destructive ? colors.destructive : colors.foreground;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="h-14 flex-row items-center px-4 active:bg-accent"
    >
      <View className="mr-3">
        <AppIcon name={icon} variant="outline" size="md" color={contentColor} />
      </View>

      <View className="flex-1 flex-row items-center justify-between">
        <ThemedText type="body" style={{ color: contentColor }}>
          {label}
        </ThemedText>

        {!destructive ? (
          <AppIcon
            name="chevron-right"
            size="sm"
            color={colors.mutedForeground}
          />
        ) : null}
      </View>
    </Pressable>
  );
}

type ProfileSectionProps = {
  title?: string;
  children: ReactNode;
};

export function ProfileSection({ title, children }: ProfileSectionProps) {
  return (
    <View className="gap-2">
      {title ? (
        <ThemedText type="label" tone="muted">
          {title}
        </ThemedText>
      ) : null}

      <View className="overflow-hidden rounded-2xl bg-card">{children}</View>
    </View>
  );
}
