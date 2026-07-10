import { AppButton } from "@/components/custom-ui/AppButton";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  ChevronRight,
  ListFilter,
  LucideIcon,
  SlidersHorizontal,
  Undo2,
} from "lucide-react-native";
import { ReactNode } from "react";
import { Pressable, ScrollView, View } from "react-native";

type FilterOverviewPageProps = {
  title: string;
  subtitle: string;
  bottomInset: number;
  children: ReactNode;
  headerIcon?: LucideIcon;
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
  headerIcon: HeaderIcon = SlidersHorizontal,
  resetText = "Reset",
  applyText = "Apply filters",
  onReset,
  onApply,
}: FilterOverviewPageProps) {
  const { colors } = useAppTheme();

  return (
    <View
      className="flex-1 gap-4 px-4"
      style={{ paddingBottom: bottomInset + 20 }}
    >
      <View className="flex-row items-center gap-3">
        <View
          className="h-12 w-12 items-center justify-center rounded-2xl"
          style={{ backgroundColor: colors.app.cardSecondary }}
        >
          <HeaderIcon size={20} color={colors.app.textAccent} />
        </View>

        <View className="flex-1">
          <ThemedText type="subtitle" variant="accent">
            {title}
          </ThemedText>

          <ThemedText type="small" variant="primary" numberOfLines={1}>
            {subtitle}
          </ThemedText>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
      >
        {children}
      </ScrollView>

      <View className="mt-auto flex-row gap-3">
        <AppButton
          title={resetText}
          icon={Undo2}
          variant="outline"
          className="flex-1"
          onPress={onReset}
        />

        <AppButton
          title={applyText}
          icon={ListFilter}
          variant="primary"
          className="flex-1"
          onPress={onApply}
        />
      </View>
    </View>
  );
}

type FilterNavigationItemProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  onPress: () => void;
};

export function FilterNavigationItem({
  icon: Icon,
  title,
  description,
  onPress,
}: FilterNavigationItemProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      className="rounded-2xl p-4"
      style={{ backgroundColor: colors.app.cardSecondary }}
    >
      <View className="flex-row items-center gap-3">
        <View
          className="h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: colors.app.cardPrimary }}
        >
          <Icon size={18} color={colors.app.textAccent} />
        </View>

        <View className="flex-1">
          <ThemedText type="defaultSemiBold" variant="accent">
            {title}
          </ThemedText>

          <ThemedText type="extraSmall" variant="primary" numberOfLines={1}>
            {description}
          </ThemedText>
        </View>

        <ChevronRight size={18} color={colors.app.textPrimary} />
      </View>
    </Pressable>
  );
}
