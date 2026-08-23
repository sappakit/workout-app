import { AppButton } from "@/components/custom-ui/app-button";
import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { FormErrorMessage } from "@/components/form/FormField";
import { DurationBottomSheetPicker } from "@/components/form/picker/duration-picker/DurationPickerSheet";
import {
  DropdownItem,
  MenuSectionLabel,
  OptionsMenu,
} from "@/components/options-menu/OptionsMenu";
import { EXERCISE_IMAGE } from "@/constants/images";
import { useAppColors } from "@/hooks/useAppColors";
import { useExerciseCardExpandedState } from "@/hooks/useExerciseCardExpandedState";
import { cn } from "@/lib/utils";
import { useRouter } from "expo-router";
import type { ReactElement } from "react";
import { FlatList, Image, Pressable, View } from "react-native";

type BaseSetItem = {
  clientId: string;
};

type BaseWorkoutExerciseSectionMode = "editable" | "readonly";

type BaseWorkoutExerciseSectionProps<TSet extends BaseSetItem> = {
  mode?: BaseWorkoutExerciseSectionMode;

  exerciseId: number;
  exerciseName: string;
  subtitle: string;
  imageUrl?: string | null;
  sets: TSet[];

  restTime?: number | null;
  restTimerTitle?: string;
  onChangeRestTime?: (seconds: number) => void;

  errorMessage?: string;

  onAddSet?: () => void;
  onDeleteExercise?: () => void;
  onReplaceExercise?: () => void;

  addSetLabel?: string;
  emptyTitle?: string;
  emptyDescription?: string;

  renderSetHeader?: () => ReactElement | null;
  renderSetRow: (item: TSet, index: number) => ReactElement | null;
};

export function BaseWorkoutExerciseSection<TSet extends BaseSetItem>({
  mode = "editable",
  exerciseId,
  exerciseName,
  subtitle,
  imageUrl,
  sets,
  restTime = 0,
  restTimerTitle = "Select Rest Timer",
  onChangeRestTime,
  errorMessage,
  onAddSet,
  onDeleteExercise,
  onReplaceExercise,
  addSetLabel = "Add Set",
  emptyTitle = "No sets yet",
  emptyDescription = "Tap Add Set to start",
  renderSetHeader,
  renderSetRow,
}: BaseWorkoutExerciseSectionProps<TSet>) {
  const router = useRouter();

  const { expanded, toggleExpanded } = useExerciseCardExpandedState();

  const isEditable = mode === "editable";

  const canShowMenu = isEditable && !!onReplaceExercise && !!onDeleteExercise;

  const canShowAddSetFooter = isEditable && !!onAddSet;

  const hasError = !!errorMessage;

  return (
    <View
      className={cn(
        "overflow-hidden rounded-2xl border bg-card",
        hasError ? "border-destructive" : "border-transparent",
      )}
    >
      <View className="flex-row items-center justify-between p-4">
        <Pressable
          className="flex-1 flex-row items-center gap-3"
          onPress={() => {
            router.push({
              pathname: "/(pages)/exercise/[id]",
              params: {
                id: exerciseId,
              },
            });
          }}
        >
          <ExerciseImageAvatar imageUrl={imageUrl} />

          <View className="flex-1">
            <ThemedText type="bodyStrong" numberOfLines={1}>
              {exerciseName}
            </ThemedText>

            <ThemedText type="caption" tone="muted" numberOfLines={1}>
              {subtitle}
            </ThemedText>
          </View>
        </Pressable>

        <View className="flex-row items-center gap-2">
          {canShowMenu ? (
            <BaseWorkoutExerciseSectionMenu
              onReplaceExercise={onReplaceExercise}
              onDeleteExercise={onDeleteExercise}
            />
          ) : null}

          <AppButton
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            icon={{
              name: expanded ? "chevron-up" : "chevron-down",
              size: "md",
            }}
            onPress={toggleExpanded}
          />
        </View>
      </View>

      {expanded ? (
        <View>
          <View className="p-4">
            <DurationBottomSheetPicker
              title={restTimerTitle}
              value={restTime ?? 0}
              onChange={onChangeRestTime}
              disabled={!isEditable || !onChangeRestTime}
              style={{
                opacity: 1,
              }}
            />
          </View>

          <FlatList
            data={sets}
            keyExtractor={(item) => item.clientId}
            scrollEnabled={false}
            renderItem={({ item, index }) => renderSetRow(item, index)}
            ListEmptyComponent={
              <View className="items-center gap-1 p-4">
                <ThemedText type="bodyStrong">{emptyTitle}</ThemedText>

                <ThemedText type="caption" tone="muted" className="text-center">
                  {emptyDescription}
                </ThemedText>

                <FormErrorMessage
                  message={errorMessage}
                  className="text-center"
                />
              </View>
            }
            ListHeaderComponent={
              sets.length > 0 && renderSetHeader ? renderSetHeader() : null
            }
            ListFooterComponent={
              canShowAddSetFooter ? (
                <WorkoutSetFooter label={addSetLabel} onPress={onAddSet} />
              ) : null
            }
          />
        </View>
      ) : null}
    </View>
  );
}

function WorkoutSetFooter({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <View className="px-2 pb-2">
      <AppButton
        title={label}
        variant="ghost"
        size="sm"
        icon={{
          name: "add",
          size: "sm",
        }}
        onPress={onPress}
      />
    </View>
  );
}

type BaseWorkoutExerciseSectionMenuProps = {
  onReplaceExercise: () => void;
  onDeleteExercise: () => void;
};

function BaseWorkoutExerciseSectionMenu({
  onReplaceExercise,
  onDeleteExercise,
}: BaseWorkoutExerciseSectionMenuProps) {
  const colors = useAppColors();

  return (
    <OptionsMenu
      menuTrigger={() => (
        <View className="h-9 w-9 items-center justify-center rounded-full">
          <AppIcon name="more" size="md" color={colors.mutedForeground} />
        </View>
      )}
    >
      <MenuSectionLabel label="Actions" />

      <DropdownItem
        label="Replace exercise"
        icon="switch"
        onSelect={onReplaceExercise}
      />

      <DropdownItem
        label="Remove exercise"
        icon="delete"
        color={colors.destructive}
        onSelect={onDeleteExercise}
      />
    </OptionsMenu>
  );
}

type ExerciseImageAvatarProps = {
  imageUrl?: string | null;
};

function ExerciseImageAvatar({ imageUrl }: ExerciseImageAvatarProps) {
  return (
    <View className="h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-secondary">
      <Image
        source={{
          uri: imageUrl ?? EXERCISE_IMAGE,
        }}
        className="h-full w-full"
        resizeMode="cover"
      />
    </View>
  );
}
