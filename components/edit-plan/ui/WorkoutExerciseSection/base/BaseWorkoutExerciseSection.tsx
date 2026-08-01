import { DurationBottomSheetPicker } from "@/components/form/picker/duration-picker/DurationPickerSheet";
import {
  DropdownItem,
  MenuSectionLabel,
  OptionsMenu,
} from "@/components/options-menu/OptionsMenu";
import { ThemedText } from "@/components/themed-text";
import { EXERCISE_IMAGE } from "@/constants/images";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useExerciseCardExpandedState } from "@/hooks/useExerciseCardExpandedState";
import { useRouter } from "expo-router";
import {
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Plus,
  Repeat,
  Trash2,
} from "lucide-react-native";
import { ReactElement } from "react";
import { FlatList, Image, TouchableOpacity, View } from "react-native";

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
  const { colors } = useAppTheme();
  const router = useRouter();

  const { expanded, toggleExpanded } = useExerciseCardExpandedState();

  const isEditable = mode === "editable";
  const canShowMenu = isEditable && onReplaceExercise && onDeleteExercise;
  const canShowAddSetFooter = isEditable && onAddSet;
  const hasError = !!errorMessage;

  const ExpansionIcon = expanded ? ChevronUp : ChevronDown;

  return (
    <View
      className="overflow-hidden rounded-2xl border"
      style={{
        backgroundColor: colors.app.cardPrimary,
        borderColor: hasError ? colors.app.error : "transparent",
      }}
    >
      <View className="flex-row items-center justify-between p-4">
        <TouchableOpacity
          activeOpacity={0.8}
          className="flex-1 flex-row items-center gap-3"
          onPress={() => {
            router.push({
              pathname: "/(pages)/exercise/[id]",
              params: { id: exerciseId },
            });
          }}
        >
          <ExerciseImageAvatar imageUrl={imageUrl} />

          <View className="flex-1">
            <ThemedText type="default" variant="accent" className="text-base">
              {exerciseName}
            </ThemedText>

            <ThemedText type="default" variant="primary" className="text-xs">
              {subtitle}
            </ThemedText>
          </View>
        </TouchableOpacity>

        <View className="flex-row items-center gap-3">
          {canShowMenu && (
            <BaseWorkoutExerciseSectionMenu
              onReplaceExercise={onReplaceExercise}
              onDeleteExercise={onDeleteExercise}
            />
          )}

          <TouchableOpacity onPress={toggleExpanded}>
            <ExpansionIcon size={24} color={colors.app.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {expanded && (
        <View style={{ backgroundColor: colors.app.cardPrimaryDark }}>
          <View className="p-4">
            <DurationBottomSheetPicker
              title={restTimerTitle}
              value={restTime ?? 0}
              onChange={onChangeRestTime}
              disabled={!isEditable || !onChangeRestTime}
              style={{ opacity: 1 }}
            />
          </View>

          <FlatList
            data={sets}
            keyExtractor={(item) => item.clientId}
            scrollEnabled={false}
            renderItem={({ item, index }) => renderSetRow(item, index)}
            ListEmptyComponent={
              <View className="items-center gap-1 p-4">
                <ThemedText type="default" variant="accent">
                  {emptyTitle}
                </ThemedText>

                <ThemedText type="extraSmall" variant="primary">
                  {emptyDescription}
                </ThemedText>

                {hasError && (
                  <ThemedText type="extraSmall" variant="error">
                    {errorMessage}
                  </ThemedText>
                )}
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
      )}
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
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      className="flex-row items-center justify-center gap-2 py-2"
      onPress={onPress}
    >
      <Plus size={16} color={colors.app.brand} />

      <ThemedText type="default" variant="brand">
        {label}
      </ThemedText>
    </TouchableOpacity>
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
  const { colors } = useAppTheme();

  return (
    <OptionsMenu
      menuTrigger={() => (
        <MoreVertical size={18} color={colors.app.textPrimary} />
      )}
    >
      <MenuSectionLabel label="Actions" />

      <DropdownItem
        label="Replace exercise"
        icon={Repeat}
        onSelect={onReplaceExercise}
      />

      <DropdownItem
        label="Remove exercise"
        color={colors.app.error}
        icon={Trash2}
        onSelect={onDeleteExercise}
      />
    </OptionsMenu>
  );
}

type ExerciseImageAvatarProps = {
  imageUrl?: string | null;
};

function ExerciseImageAvatar({ imageUrl }: ExerciseImageAvatarProps) {
  const { colors } = useAppTheme();

  return (
    <View
      className="h-14 w-14 items-center justify-center overflow-hidden rounded-full"
      style={{ backgroundColor: colors.app.cardSecondary }}
    >
      <Image
        source={{ uri: imageUrl ?? EXERCISE_IMAGE }}
        className="h-full w-full"
        resizeMode="cover"
      />
    </View>
  );
}
