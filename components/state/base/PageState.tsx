import { AppButton } from "@/components/custom-ui/AppButton";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { LucideIcon, RefreshCw } from "lucide-react-native";
import { View } from "react-native";

export type PageStateAction = {
  label: string;
  icon?: LucideIcon;
  onPress: () => void;
  hidden?: boolean;
};

export type PageStateActionOverride = Partial<PageStateAction> & {
  onPress?: () => void;
};

type PageStateProps = {
  title: string;
  message?: string;
  icon?: LucideIcon;
  primaryAction?: PageStateAction;
  secondaryAction?: PageStateAction;
};

export function PageState({
  title,
  message,
  icon: Icon = RefreshCw,
  primaryAction,
  secondaryAction,
}: PageStateProps) {
  const { colors } = useAppTheme();

  const hasPrimaryAction = primaryAction && !primaryAction.hidden;
  const hasSecondaryAction = secondaryAction && !secondaryAction.hidden;

  return (
    <View className="flex-1 items-center justify-center gap-8 px-12">
      <View
        className="h-28 w-28 items-center justify-center rounded-3xl"
        style={{
          backgroundColor: colors.app.cardPrimary,
        }}
      >
        <Icon size={56} color={colors.app.textAccent} />
      </View>

      <View className="gap-2">
        <ThemedText
          type="title"
          variant="accent"
          className="text-center text-2xl"
        >
          {title}
        </ThemedText>

        {message ? (
          <ThemedText type="default" variant="primary" className="text-center">
            {message}
          </ThemedText>
        ) : null}
      </View>

      {hasPrimaryAction || hasSecondaryAction ? (
        <View className="w-full flex-row gap-3">
          {hasSecondaryAction ? (
            <AppButton
              title={secondaryAction.label}
              onPress={secondaryAction.onPress}
              icon={secondaryAction.icon}
              variant="secondary"
              className="flex-1"
            />
          ) : null}

          {hasPrimaryAction ? (
            <AppButton
              title={primaryAction.label}
              onPress={primaryAction.onPress}
              icon={primaryAction.icon}
              variant="primary"
              className="flex-1"
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
