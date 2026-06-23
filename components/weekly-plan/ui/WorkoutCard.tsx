import { ThemedText } from "@/components/themed-text";
import { FALLBACK_WORKOUT_IMAGE } from "@/constants/images";
import { useAppTheme } from "@/hooks/useAppTheme";
import { LucideIcon } from "lucide-react-native";
import { Image, Pressable, View } from "react-native";

export type WorkoutCardMetaItem = {
  icon: LucideIcon;
  label: string;
};

interface WorkoutCardProps {
  title: string;
  subtitle?: string;
  imageUrl?: string | null;
  metaItems?: WorkoutCardMetaItem[];
  disabled?: boolean;
  onPress?: () => void;
}

export function WorkoutCard({
  title,
  subtitle,
  imageUrl,
  metaItems = [],
  disabled,
  onPress,
}: WorkoutCardProps) {
  const { colors } = useAppTheme();

  const Container = onPress ? Pressable : View;

  return (
    <Container
      disabled={disabled}
      onPress={onPress}
      className="gap-4 overflow-hidden rounded-3xl"
      style={{
        backgroundColor: colors.app.cardPrimary,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <View className="flex-row">
        <View
          className="w-32 overflow-hidden"
          style={{
            backgroundColor: colors.app.cardSecondary,
          }}
        >
          <Image
            source={{ uri: imageUrl ?? FALLBACK_WORKOUT_IMAGE }}
            className="w-full flex-1"
            resizeMode="cover"
          />
        </View>

        <View className="min-w-0 flex-1 justify-between gap-3 p-3">
          <View>
            {subtitle ? (
              <ThemedText
                type="extraSmall"
                variant="primary"
                className="flex-1"
                numberOfLines={1}
              >
                {subtitle}
              </ThemedText>
            ) : null}

            <ThemedText type="subtitle" variant="accent" numberOfLines={1}>
              {title}
            </ThemedText>
          </View>

          {metaItems.length > 0 ? (
            <View className="flex-row flex-wrap gap-2">
              {metaItems.map((item) => (
                <WorkoutMetaPill
                  key={`${item.label}`}
                  icon={item.icon}
                  label={item.label}
                />
              ))}
            </View>
          ) : null}
        </View>
      </View>
    </Container>
  );
}

interface WorkoutMetaPillProps {
  icon: LucideIcon;
  label: string;
}

export function WorkoutMetaPill({ icon: Icon, label }: WorkoutMetaPillProps) {
  const { colors } = useAppTheme();

  return (
    <View
      className="flex-row items-center gap-1 rounded-full px-2 py-1"
      style={{
        backgroundColor: colors.app.cardSecondary,
      }}
    >
      <Icon size={12} color={colors.app.textPrimary} />

      <ThemedText type="extraSmall" variant="primary">
        {label}
      </ThemedText>
    </View>
  );
}
