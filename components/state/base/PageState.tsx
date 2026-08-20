import { AppButton } from "@/components/custom-ui/app-button";
import { AppIconName } from "@/components/custom-ui/app-icon/app-icon.registry";
import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { useAppColors } from "@/hooks/useAppTheme";
import { View } from "react-native";

export type PageStateAction = {
  label: string;
  icon?: AppIconName;
  onPress: () => void;
  hidden?: boolean;
};

export type PageStateActionOverride = Partial<PageStateAction> & {
  onPress?: () => void;
};

type PageStateProps = {
  title: string;
  message?: string;
  icon?: AppIconName;
  primaryAction?: PageStateAction;
  secondaryAction?: PageStateAction;
};

export function PageState({
  title,
  message,
  icon = "refresh",
  primaryAction,
  secondaryAction,
}: PageStateProps) {
  const colors = useAppColors();

  const hasPrimaryAction = primaryAction && !primaryAction.hidden;
  const hasSecondaryAction = secondaryAction && !secondaryAction.hidden;

  const hasSingleAction =
    (hasPrimaryAction && !hasSecondaryAction) ||
    (!hasPrimaryAction && hasSecondaryAction);

  return (
    <View className="flex-1 items-center justify-center gap-6 bg-background px-6">
      <View className="h-28 w-28 items-center justify-center rounded-3xl bg-card">
        <AppIcon name={icon} size="2xl" color={colors.secondaryForeground} />
      </View>

      <View className="gap-2">
        <ThemedText type="title" className="text-center">
          {title}
        </ThemedText>

        {message ? (
          <ThemedText type="body" tone="muted" className="text-center">
            {message}
          </ThemedText>
        ) : null}
      </View>

      {hasPrimaryAction || hasSecondaryAction ? (
        <View
          className={
            hasSingleAction ? "w-full items-center" : "w-full flex-row gap-3"
          }
        >
          {hasSecondaryAction ? (
            <AppButton
              title={secondaryAction.label}
              variant="secondary"
              className={hasSingleAction ? "w-2/3" : "flex-1"}
              icon={
                secondaryAction.icon
                  ? {
                      name: secondaryAction.icon,
                      size: "sm",
                    }
                  : undefined
              }
              onPress={secondaryAction.onPress}
            />
          ) : null}

          {hasPrimaryAction ? (
            <AppButton
              title={primaryAction.label}
              variant="primary"
              className={hasSingleAction ? "w-2/3" : "flex-1"}
              icon={
                primaryAction.icon
                  ? {
                      name: primaryAction.icon,
                      size: "sm",
                    }
                  : undefined
              }
              onPress={primaryAction.onPress}
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
