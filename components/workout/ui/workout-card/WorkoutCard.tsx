import { ThemedText } from "@/components/themed-text";
import { FALLBACK_WORKOUT_IMAGE } from "@/constants/images";
import { useAppTheme } from "@/hooks/useAppTheme";
import { WorkoutResponse } from "@/types/workout/response/workout.types";
import clsx from "clsx";
import { Clock, Dumbbell, LucideIcon } from "lucide-react-native";
import { Image, Pressable, StyleProp, View, ViewStyle } from "react-native";
import { twMerge } from "tailwind-merge";

type WorkoutCardMetaItem = {
  icon: LucideIcon;
  label: string;
};

type WorkoutCardItem = {
  title: string;
  subtitle?: string;
  imageUrl?: string | null;
  metaItems?: WorkoutCardMetaItem[];
};

interface WorkoutCardProps extends WorkoutCardItem {
  disabled?: boolean;
  onPress?: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export function WorkoutCard({
  title,
  subtitle,
  imageUrl,
  metaItems = [],
  disabled,
  onPress,
  className,
  style,
}: WorkoutCardProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={twMerge(
        clsx("flex-row overflow-hidden rounded-3xl", className),
      )}
      style={[
        {
          backgroundColor: colors.app.cardPrimary,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
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

      <View className="flex-1 justify-between gap-3 p-3">
        <View>
          {subtitle ? (
            <ThemedText type="extraSmall" variant="primary" numberOfLines={1}>
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
    </Pressable>
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

export function mapWorkoutToWorkoutCardItem(
  workout: WorkoutResponse,
): WorkoutCardItem {
  return {
    title: workout.name,
    subtitle: workout.workoutFocusType?.name,
    imageUrl: workout.imageUrl,
    metaItems: [
      {
        icon: Dumbbell,
        label: `${workout.workoutExercises.length} exercises`,
      },
      {
        icon: Clock,
        label: formatWorkoutDuration(workout.duration),
      },
    ],
  };
}

function formatWorkoutDuration(duration: number | null) {
  if (!duration) return "No duration";

  if (duration < 60) {
    return `${duration} sec`;
  }

  const totalMinutes = Math.floor(duration / 60);

  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
}
