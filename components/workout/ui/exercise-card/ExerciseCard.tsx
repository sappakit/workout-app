import Thumbnail from "@/components/custom-ui/Thumbnail";
import { ThemedText } from "@/components/themed-text";
import { EXERCISE_IMAGE } from "@/constants/images";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  Exercise,
  ExerciseTypeLabel,
} from "@/types/workout/response/exercise.types";
import clsx from "clsx";
import { LucideIcon } from "lucide-react-native";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { twMerge } from "tailwind-merge";
import { WorkoutMetaPill } from "../workout-card/WorkoutCard";

type ExerciseCardMetaItem = {
  icon?: LucideIcon;
  label: string;
};

type ExerciseCardItem = {
  title: string;
  subtitle?: string;
  imageUrl?: string | null;
  metaItems?: ExerciseCardMetaItem[];
};

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
  const { colors } = useAppTheme();

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={twMerge(
        clsx("flex-row gap-3 overflow-hidden rounded-3xl p-3", className),
      )}
      style={[
        {
          backgroundColor: colors.app.cardPrimary,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      <Thumbnail imageUri={imageUrl ?? EXERCISE_IMAGE} />

      <View className="flex-1 justify-between gap-3">
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

export function mapExerciseToExerciseCardItem(
  exercise: Exercise,
): ExerciseCardItem {
  const muscleMetaItems =
    exercise.muscles?.map((item) => ({
      label: item.muscle.name,
    })) ?? [];

  return {
    title: exercise.name,
    subtitle: ExerciseTypeLabel[exercise.exerciseType],
    imageUrl: exercise.imageUrl,
    metaItems:
      muscleMetaItems.length > 0 ? muscleMetaItems : [{ label: "General" }],
  };
}
