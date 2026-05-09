import Thumbnail from "@/components/custom-ui/Thumbnail";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  DifficultyLabel,
  Exercise,
  ExerciseTypeLabel,
} from "@/types/workout/response/exercise.types";
import clsx from "clsx";
import { LucideIcon } from "lucide-react-native";
import { ReactNode } from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { twMerge } from "tailwind-merge";
import { DifficultyBadge } from "./DifficultyBadge";
import { ExerciseStat } from "./ExerciseStat";

export type ExerciseCardStatItem = {
  key: string;
  label: string;
  icon: LucideIcon;
};

interface ExerciseCardBaseProps {
  exercise: Exercise;
  className?: string;
  style?: StyleProp<ViewStyle>;
  expanded?: boolean;
  isEditMode?: boolean;
  editContent?: ReactNode;
  expandedContent?: ReactNode;
  footerContent?: ReactNode;
  bottomRightContent?: ReactNode;
  stats?: ExerciseCardStatItem[];
  showDifficultyBadge?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}

export default function ExerciseCardBase({
  exercise,
  className,
  style,
  expanded,
  isEditMode = false,
  editContent,
  expandedContent,
  footerContent,
  bottomRightContent,
  stats = [],
  showDifficultyBadge,
  onPress,
  disabled = false,
}: ExerciseCardBaseProps) {
  const { colors } = useAppTheme();

  const showEditContent = isEditMode && editContent;
  const showExpandedContent = expanded && expandedContent;

  const content = (
    <>
      {showDifficultyBadge && (
        <View className="absolute right-0 top-0 z-10 flex-row gap-2 px-4">
          <DifficultyBadge label={DifficultyLabel[exercise.difficultyLevel]} />
        </View>
      )}

      <View className="flex-row gap-3 p-2">
        <Thumbnail imageUri={exercise.imageUrl} />

        <View className="flex-1 justify-between">
          <View className="items-start">
            <ThemedText type="default" variant="accent" className="text-xs">
              {ExerciseTypeLabel[exercise.exerciseType]}
            </ThemedText>

            <ThemedText
              type="default"
              variant="brand"
              className="text-lg font-semibold"
              numberOfLines={1}
            >
              {exercise.name}
            </ThemedText>

            {stats.length > 0 && (
              <View className="flex-row gap-2">
                {stats.map((item) => (
                  <ExerciseStat
                    key={item.key}
                    label={item.label}
                    icon={item.icon}
                  />
                ))}
              </View>
            )}
          </View>

          {footerContent}
        </View>

        <View className="absolute bottom-0 right-0 z-10 flex-row gap-2 p-2">
          {bottomRightContent}
        </View>
      </View>

      {showEditContent ? (
        <View style={{ padding: 8, paddingTop: 0 }}>{editContent}</View>
      ) : (
        showExpandedContent && (
          <View style={{ padding: 8, paddingTop: 0 }}>{expandedContent}</View>
        )
      )}
    </>
  );

  const sharedClassName = twMerge(
    clsx("overflow-hidden rounded-3xl border", className),
  );

  const sharedStyle = [
    {
      backgroundColor: colors.app.cardPrimary,
      borderColor: colors.app.borderPrimary,
    },
    style,
  ];

  if (onPress && !disabled) {
    return (
      <Pressable
        onPress={onPress}
        className={sharedClassName}
        style={sharedStyle}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View className={sharedClassName} style={sharedStyle}>
      {content}
    </View>
  );
}
