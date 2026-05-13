import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ChevronRight } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

type ProfileMenuItemProps = {
  label: string;
  icon: React.ComponentType<{
    size?: number;
    color?: string;
    strokeWidth?: number;
  }>;
  onPress?: () => void;
  destructive?: boolean;
};

export function ProfileMenuItem({
  label,
  icon: Icon,
  onPress,
  destructive = false,
}: ProfileMenuItemProps) {
  const { colors } = useAppTheme();

  const textColor = destructive ? colors.app.error : colors.app.textAccent;
  const iconColor = destructive ? colors.app.error : colors.app.textPrimary;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="flex-row items-center px-4 py-4"
    >
      <View className="mr-3">
        <Icon size={20} color={iconColor} />
      </View>

      <View className="flex-1 flex-row items-center justify-between">
        <ThemedText
          type="default"
          variant="primary"
          style={{
            color: textColor,
          }}
        >
          {label}
        </ThemedText>

        {!destructive ? (
          <ChevronRight size={20} color={colors.app.borderSecondary} />
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

type ProfileSectionProps = {
  title?: string;
  children: React.ReactNode;
};

export function ProfileSection({ title, children }: ProfileSectionProps) {
  const { colors } = useAppTheme();

  return (
    <View>
      {title ? (
        <ThemedText
          type="default"
          variant="secondary"
          className="mb-3 text-sm"
          style={{
            color: colors.app.textPrimary,
          }}
        >
          {title}
        </ThemedText>
      ) : null}

      <View
        className="overflow-hidden rounded-2xl border"
        style={{
          backgroundColor: colors.app.cardPrimary,
          borderColor: colors.app.borderPrimary,
        }}
      >
        {children}
      </View>
    </View>
  );
}
