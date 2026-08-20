import { AppButton } from "@/components/custom-ui/app-button";
import type { AppIconName } from "@/components/custom-ui/app-icon/app-icon.registry";
import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { useAppColors } from "@/hooks/useAppTheme";
import type { ReactNode } from "react";
import { Pressable, ScrollView, View } from "react-native";

type FilterOverviewPageProps = {
  title: string;
  subtitle: string;
  bottomInset: number;
  children: ReactNode;
  headerIcon?: AppIconName;
  resetText?: string;
  applyText?: string;
  onReset: () => void;
  onApply: () => void;
};

export function FilterOverviewPage({
  title,
  subtitle,
  bottomInset,
  children,
  headerIcon = "filter",
  resetText = "Reset",
  applyText = "Apply filters",
  onReset,
  onApply,
}: FilterOverviewPageProps) {
  const colors = useAppColors();

  return (
    <View
      className="flex-1 gap-4 px-4"
      style={{
        paddingBottom: bottomInset + 20,
      }}
    >
      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
          <AppIcon
            name={headerIcon}
            variant="outline"
            size="md"
            color={colors.foreground}
          />
        </View>

        <View className="flex-1">
          <ThemedText type="heading">{title}</ThemedText>

          <ThemedText type="small" tone="muted" numberOfLines={1}>
            {subtitle}
          </ThemedText>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 12,
        }}
      >
        {children}
      </ScrollView>

      <View className="mt-auto flex-row gap-3">
        <AppButton
          title={resetText}
          variant="outline"
          className="flex-1"
          icon={{
            name: "refresh",
            size: "sm",
          }}
          onPress={onReset}
        />

        <AppButton
          title={applyText}
          variant="primary"
          className="flex-1"
          icon={{
            name: "filter",
            size: "sm",
          }}
          onPress={onApply}
        />
      </View>
    </View>
  );
}

type FilterNavigationItemProps = {
  icon: AppIconName;
  title: string;
  description: string;
  onPress: () => void;
};

export function FilterNavigationItem({
  icon,
  title,
  description,
  onPress,
}: FilterNavigationItemProps) {
  const colors = useAppColors();

  return (
    <Pressable
      onPress={onPress}
      className="rounded-2xl bg-secondary p-4 active:opacity-80"
    >
      <View className="flex-row items-center gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-xl bg-card">
          <AppIcon
            name={icon}
            variant="outline"
            size="md"
            color={colors.foreground}
          />
        </View>

        <View className="flex-1">
          <ThemedText type="bodyStrong">{title}</ThemedText>

          <ThemedText type="caption" tone="muted" numberOfLines={1}>
            {description}
          </ThemedText>
        </View>

        <AppIcon
          name="chevron-right"
          size="sm"
          color={colors.mutedForeground}
        />
      </View>
    </Pressable>
  );
}
