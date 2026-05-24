import { DurationBottomSheetPicker } from "@/components/form/picker/duration-picker/DurationPickerSheet";
import {
  DropdownItem,
  MenuSectionLabel,
  OptionsMenu,
} from "@/components/options-menu/OptionsMenu";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  BicepsFlexed,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  PanelTopOpen,
  Plus,
  Repeat,
  Trash2,
} from "lucide-react-native";
import { ReactElement, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

type BaseSetItem = {
  clientId: string;
};

type BaseWorkoutExerciseSectionProps<TSet extends BaseSetItem> = {
  exerciseName: string;
  subtitle: string;
  sets: TSet[];

  restTime?: number | null;
  restTimerTitle?: string;
  onChangeRestTime?: (seconds: number) => void;

  onAddSet: () => void;
  onDeleteExercise: () => void;
  onReplaceExercise?: () => void;

  addSetLabel?: string;
  emptyTitle?: string;
  emptyDescription?: string;

  renderSetHeader?: () => ReactElement | null;
  renderSetRow: (item: TSet, index: number) => ReactElement | null;
};

export function BaseWorkoutExerciseSection<TSet extends BaseSetItem>({
  exerciseName,
  subtitle,
  sets,
  restTime = 0,
  restTimerTitle = "Select Rest Timer",
  onChangeRestTime,
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
  const [expanded, setExpanded] = useState(true);

  const ExpansionIcon = expanded ? ChevronUp : ChevronDown;

  return (
    <View
      className="rounded-2xl border"
      style={{
        backgroundColor: colors.app.cardPrimary,
        borderColor: colors.app.borderPrimary,
      }}
    >
      <View className="flex-row items-center gap-3 p-4">
        <View
          className="h-14 w-14 items-center justify-center rounded-full"
          style={{
            backgroundColor: colors.app.brand + "20",
          }}
        >
          <BicepsFlexed size={28} color={colors.app.brand} />
        </View>

        <View className="flex-1">
          <ThemedText type="default" variant="accent" className="text-base">
            {exerciseName}
          </ThemedText>

          <ThemedText type="default" variant="primary" className="text-xs">
            {subtitle}
          </ThemedText>
        </View>

        <View className="ml-auto flex-row items-center gap-3">
          <BaseWorkoutExerciseSectionMenu
            onReplaceExercise={onReplaceExercise}
            onDeleteExercise={onDeleteExercise}
          />

          <TouchableOpacity onPress={() => setExpanded((prev) => !prev)}>
            <ExpansionIcon size={24} color={colors.app.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {expanded && (
        <View>
          {sets.length > 0 && onChangeRestTime && (
            <View className="px-4 pb-4">
              <DurationBottomSheetPicker
                title={restTimerTitle}
                value={restTime ?? 0}
                onChange={onChangeRestTime}
              />
            </View>
          )}

          <FlatList
            data={sets}
            keyExtractor={(item) => item.clientId}
            scrollEnabled={false}
            renderItem={({ item, index }) => renderSetRow(item, index)}
            ListEmptyComponent={
              <View className="items-center gap-1 pb-4">
                <ThemedText type="default" variant="secondary">
                  {emptyTitle}
                </ThemedText>

                <ThemedText
                  type="default"
                  variant="primary"
                  className="text-xs"
                >
                  {emptyDescription}
                </ThemedText>
              </View>
            }
            ListHeaderComponent={
              sets.length > 0 && renderSetHeader ? renderSetHeader() : null
            }
            ListFooterComponent={
              <WorkoutSetFooter label={addSetLabel} onPress={onAddSet} />
            }
            ListFooterComponentStyle={{
              borderTopWidth: 1,
              borderColor: colors.app.borderPrimary,
            }}
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
  onReplaceExercise?: () => void;
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
      <MenuSectionLabel label="View" />

      <DropdownItem
        isToggleItem
        label="Show full details"
        icon={PanelTopOpen}
      />

      <MenuSectionLabel label="Actions" />

      {onReplaceExercise && (
        <DropdownItem
          label="Replace exercise"
          icon={Repeat}
          onSelect={onReplaceExercise}
        />
      )}

      <DropdownItem
        label="Remove exercise"
        color={colors.app.error}
        icon={Trash2}
        onSelect={onDeleteExercise}
      />
    </OptionsMenu>
  );
}
