import { MetaPill, MetaPillList } from "@/components/custom-ui/MetaPill";
import { ThemedText } from "@/components/custom-ui/themed-text";
import Thumbnail from "@/components/custom-ui/Thumbnail";
import { EXERCISE_IMAGE } from "@/constants/images";
import { cn } from "@/lib/utils";
import {
  requireExerciseMuscle,
  requireExerciseMuscles,
} from "@/lib/workout/utils/response-guards.utils";
import type { Exercise } from "@/types/workout/response/exercise.types";
import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, View } from "react-native";
import type { WorkoutCardItem } from "../workout-card/WorkoutCard";

const MAX_VISIBLE_META_ITEMS = 2;

type ExerciseCardItem = Omit<WorkoutCardItem, "id">;

interface ExerciseCardProps extends ExerciseCardItem {
  disabled?: boolean;
  onPress?: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export function ExerciseCard({
  title,
  subtitle,
  imageUrl,
  metaItems = [],
  disabled,
  onPress,
  className,
  style,
}: ExerciseCardProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={cn(
        "flex-row gap-3 overflow-hidden rounded-3xl bg-card p-3 active:opacity-80",
        disabled && "opacity-60",
        className,
      )}
      style={style}
    >
      <Thumbnail imageUri={imageUrl ?? EXERCISE_IMAGE} />

      <View className="min-w-0 flex-1 justify-between gap-3">
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

        <MetaPillList
          items={metaItems}
          maxVisibleItems={MAX_VISIBLE_META_ITEMS}
          renderItem={(item) => (
            <MetaPill icon={item.icon} label={item.label} className="min-w-0" />
          )}
        />
      </View>
    </Pressable>
  );
}

export function mapExerciseToExerciseCardItem(
  exercise: Exercise,
): ExerciseCardItem {
  const exerciseMuscles = requireExerciseMuscles(exercise);

  const muscleMetaItems = exerciseMuscles.map((item) => {
    const muscle = requireExerciseMuscle(item);

    return {
      key: muscle.id,
      label: muscle.name,
    };
  });

  const primaryMedia =
    exercise.media?.find((media) => media.isPrimary) ?? exercise.media?.[0];

  return {
    title: exercise.name,
    subtitle: exercise.category?.name ?? "Exercise",
    imageUrl: primaryMedia?.url ?? null,
    metaItems:
      muscleMetaItems.length > 0
        ? muscleMetaItems
        : [
            {
              key: "general",
              label: "General",
            },
          ],
  };
}
