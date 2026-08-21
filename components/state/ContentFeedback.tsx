import { AppButton } from "@/components/custom-ui/app-button";
import type { AppIconName } from "@/components/custom-ui/app-icon/app-icon.registry";
import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { useAppColors } from "@/hooks/useAppColors";
import { cn } from "@/lib/utils";
import type { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";

type ContentFeedbackAction = {
  title: string;
  icon?: AppIconName;
  onPress: () => void;
};

type ContentFeedbackProps = {
  icon: AppIconName;
  title: string;
  subtitle: string;
  action?: ContentFeedbackAction;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export function ContentFeedback({
  icon,
  title,
  subtitle,
  action,
  className,
  style,
}: ContentFeedbackProps) {
  const colors = useAppColors();

  return (
    <View
      className={cn(
        "items-center justify-center gap-3 rounded-2xl bg-card px-4 py-6",
        className,
      )}
      style={style}
    >
      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
        <AppIcon name={icon} size="md" color={colors.secondaryForeground} />
      </View>

      <View className="items-center gap-1">
        <ThemedText type="bodyStrong">{title}</ThemedText>

        <ThemedText type="small" tone="muted" className="text-center">
          {subtitle}
        </ThemedText>
      </View>

      {action ? (
        <AppButton
          title={action.title}
          variant="outline"
          size="sm"
          className="min-w-28 rounded-full"
          icon={
            action.icon
              ? {
                  name: action.icon,
                  size: "sm",
                }
              : undefined
          }
          onPress={action.onPress}
        />
      ) : null}
    </View>
  );
}
