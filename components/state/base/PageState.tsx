import { AppButton } from "@/components/custom-ui/AppButton";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { House, LucideIcon, RefreshCw } from "lucide-react-native";
import { View } from "react-native";

type PageStateProps = {
  title: string;
  message?: string;
  icon?: LucideIcon;

  actionLabel?: string;
  actionIcon?: LucideIcon;
  onAction?: () => void;

  showHomeButton?: boolean;
  homeLabel?: string;
  homeIcon?: LucideIcon;
  onPressHome?: () => void;
};

export function PageState({
  title,
  message,
  icon: Icon = RefreshCw,

  actionLabel,
  actionIcon: ActionIcon = RefreshCw,
  onAction,

  showHomeButton = true,
  homeLabel = "Home",
  homeIcon: HomeIcon = House,
  onPressHome,
}: PageStateProps) {
  const { colors } = useAppTheme();

  const hasHomeButton = showHomeButton && onPressHome;
  const hasActionButton = actionLabel && onAction;

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

      {hasHomeButton || hasActionButton ? (
        <View className="w-full flex-row gap-3">
          {hasHomeButton ? (
            <AppButton
              title={homeLabel}
              onPress={onPressHome}
              icon={HomeIcon}
              variant="secondary"
              className="flex-1"
            />
          ) : null}

          {hasActionButton ? (
            <AppButton
              title={actionLabel}
              onPress={onAction}
              icon={ActionIcon}
              variant="primary"
              className="flex-1"
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
