import { ThemedText } from "@/components/themed-text";
import { WORKOUT_IMAGE } from "@/constants/images";
import { hexWithOpacity } from "@/constants/theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { requireWorkoutExercises } from "@/lib/workout/utils/response-guards.utils";
import { WorkoutResponse } from "@/types/workout/response/workout.types";
import clsx from "clsx";
import { Clock, Dumbbell, LucideIcon } from "lucide-react-native";
import { Image, Pressable, StyleProp, View, ViewStyle } from "react-native";
import { twMerge } from "tailwind-merge";
import { formatWorkoutDuration } from "../../model/workout-content.mapper";

type WorkoutCardMetaItem = {
  icon: LucideIcon;
  label: string;
};

export type WorkoutCardItem = {
  id: number | string;
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
          source={{ uri: imageUrl ?? WORKOUT_IMAGE }}
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
                key={item.label}
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
  icon?: LucideIcon;
  label: string;
  variant?: "primary" | "overlay";
}

export function WorkoutMetaPill({
  icon: Icon,
  label,
  variant = "primary",
}: WorkoutMetaPillProps) {
  const { colors } = useAppTheme();

  const isOverlay = variant === "overlay";

  return (
    <View
      className="flex-row items-center gap-1 rounded-full px-2 py-1"
      style={{
        backgroundColor: isOverlay
          ? hexWithOpacity(colors.app.white, 15)
          : colors.app.cardSecondary,
      }}
    >
      {Icon ? (
        <Icon
          size={12}
          color={isOverlay ? colors.app.textWhite : colors.app.textPrimary}
        />
      ) : null}

      <ThemedText type="extraSmall" variant={isOverlay ? "white" : "primary"}>
        {label}
      </ThemedText>
    </View>
  );
}

export function formatExerciseCount(count: number) {
  return `${count} ${count === 1 ? "exercise" : "exercises"}`;
}

export function mapWorkoutToWorkoutCardItem(
  workout: WorkoutResponse,
): WorkoutCardItem {
  const workoutExercises = requireWorkoutExercises(workout);
  const durationLabel = formatWorkoutDuration(workout.duration);

  return {
    id: workout.id,
    title: workout.name,
    subtitle: workout.workoutFocusType?.name,
    imageUrl: workout.imageUrl,
    metaItems: [
      {
        icon: Dumbbell,
        label: formatExerciseCount(workoutExercises.length),
      },
      ...(durationLabel
        ? [
            {
              icon: Clock,
              label: durationLabel,
            },
          ]
        : []),
    ],
  };
}
