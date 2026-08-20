import { MetaPill } from "@/components/custom-ui/MetaPill";
import type { AppIconName } from "@/components/custom-ui/app-icon/app-icon.registry";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { WORKOUT_IMAGE } from "@/constants/images";
import { cn } from "@/lib/utils";
import { requireWorkoutExercises } from "@/lib/workout/utils/response-guards.utils";
import type { WorkoutResponse } from "@/types/workout/response/workout.types";
import {
  Image,
  Pressable,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";
import { formatWorkoutDuration } from "../../model/workout-content.mapper";

export type WorkoutCardMetaItem = {
  key: string | number;
  icon?: AppIconName;
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
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={cn(
        "flex-row overflow-hidden rounded-3xl bg-card active:opacity-80",
        disabled && "opacity-60",
        className,
      )}
      style={style}
    >
      <View className="w-32 overflow-hidden bg-secondary">
        <Image
          source={{
            uri: imageUrl ?? WORKOUT_IMAGE,
          }}
          className="w-full flex-1"
          resizeMode="cover"
        />
      </View>

      <View className="min-w-0 flex-1 justify-between gap-3 p-3">
        <View className="min-w-0">
          {subtitle ? (
            <ThemedText type="caption" tone="muted" numberOfLines={1}>
              {subtitle}
            </ThemedText>
          ) : null}

          <ThemedText type="bodyStrong" numberOfLines={1}>
            {title}
          </ThemedText>
        </View>

        {metaItems.length > 0 ? (
          <View className="flex-row flex-wrap gap-2">
            {metaItems.map((item) => (
              <MetaPill
                key={String(item.key)}
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
        key: "exercise-count",
        icon: "workout",
        label: formatExerciseCount(workoutExercises.length),
      },
      ...(durationLabel
        ? [
            {
              key: "duration",
              icon: "duration" as const,
              label: durationLabel,
            },
          ]
        : []),
    ],
  };
}
