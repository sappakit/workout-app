import { DurationBottomSheetPicker } from "@/components/form/picker/duration-picker/DurationPickerSheet";
import {
  DropdownItem,
  MenuSectionLabel,
  OptionsMenu,
} from "@/components/options-menu/OptionsMenu";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { WorkoutSessionExerciseModel } from "@/types/workout/model/workout.types";
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
import { useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { getExerciseProgressText } from "../model/helpers";
import { WorkoutSetHeader, WorkoutSetRow } from "./WorkoutSetRow";

interface WorkoutExerciseSectionProps {
  exercise: WorkoutSessionExerciseModel;
  onAddSet: () => void;
  onDeleteExercise: () => void;
  onReplaceExercise: () => void;
  onDeleteSet: (setClientId: string) => void;
  onToggleSetCompleted: (setClientId: string) => void;
  onChangeSetValue: (
    setClientId: string,
    field: "weight" | "reps",
    value: number | null,
  ) => void;
  onChangeRestTime: (value: number) => void;
}

export function WorkoutExerciseSection({
  exercise,
  onAddSet,
  onDeleteExercise,
  onReplaceExercise,
  onDeleteSet,
  onToggleSetCompleted,
  onChangeSetValue,
  onChangeRestTime,
}: WorkoutExerciseSectionProps) {
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

        <View>
          <ThemedText type="default" variant="accent" className="text-base">
            {exercise.exercise.name}
          </ThemedText>

          <ThemedText type="default" variant="primary" className="text-xs">
            {getExerciseProgressText(exercise)}
          </ThemedText>
        </View>

        <View className="ml-auto flex-row items-center gap-3">
          <WorkoutExerciseSectionMenu
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
          {exercise.sets.length > 0 && (
            <View className="px-4 pb-4">
              <DurationBottomSheetPicker
                title="Select Rest Timer"
                value={exercise.plannedRestTime ?? 0}
                onChange={onChangeRestTime}
              />
            </View>
          )}

          <FlatList
            data={exercise.sets}
            keyExtractor={(item) => item.clientId}
            scrollEnabled={false}
            renderItem={({ item: setItem }) => (
              <WorkoutSetRow
                item={setItem}
                onDelete={() => onDeleteSet(setItem.clientId)}
                onToggleComplete={() => onToggleSetCompleted(setItem.clientId)}
                onChangeWeight={(value) =>
                  onChangeSetValue(setItem.clientId, "weight", value)
                }
                onChangeReps={(value) =>
                  onChangeSetValue(setItem.clientId, "reps", value)
                }
              />
            )}
            ListEmptyComponent={
              <View className="items-center gap-1 pb-4">
                <ThemedText type="default" variant="secondary">
                  No sets yet
                </ThemedText>

                <ThemedText
                  type="default"
                  variant="primary"
                  className="text-xs"
                >
                  Tap "Add Set" to start tracking
                </ThemedText>
              </View>
            }
            ListHeaderComponent={
              exercise.sets.length > 0 ? <WorkoutSetHeader /> : null
            }
            ListFooterComponent={<WorkoutSetFooter onPress={onAddSet} />}
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

function WorkoutSetFooter({ onPress }: { onPress: () => void }) {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      className="flex-row items-center justify-center gap-2 py-2"
      onPress={onPress}
    >
      <Plus size={16} color={colors.app.brand} />

      <ThemedText type="default" variant="brand">
        Add Set
      </ThemedText>
    </TouchableOpacity>
  );
}

type WorkoutExerciseSectionMenuProps = {
  onReplaceExercise: () => void;
  onDeleteExercise: () => void;
};

function WorkoutExerciseSectionMenu({
  onReplaceExercise,
  onDeleteExercise,
}: WorkoutExerciseSectionMenuProps) {
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
