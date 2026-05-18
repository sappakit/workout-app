import FormNumberInput from "@/components/form/FormNumberInput";
import { DurationBottomSheetPicker } from "@/components/form/picker/duration-picker/DurationPickerSheet";
import {
  DropdownItem,
  MenuSectionLabel,
  OptionsMenu,
} from "@/components/options-menu/OptionsMenu";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ExerciseFieldKey, getExerciseFields } from "@/lib/workout/config";
import { createEmptyWorkoutExerciseFormSet } from "@/lib/workout/mappers";
import { EditPlanForm } from "@/schemas/edit-plan.schema";
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
import { useMemo, useState } from "react";
import { Controller, UseFormReturn, useWatch } from "react-hook-form";
import { FlatList, Pressable, TouchableOpacity, View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

type SetColumn = {
  key: ExerciseFieldKey;
  label: string;
};

const SET_COLUMN_LABELS: Record<ExerciseFieldKey, string> = {
  weight: "LOAD",
  reps: "REPS",
  duration: "TIME",
  distance: "DIST",
};

type EditPlanWorkoutExerciseSectionProps = {
  form: UseFormReturn<EditPlanForm>;
  index: number;
  onDeleteExercise: () => void;
  onReplaceExercise?: () => void;
};

export function EditPlanWorkoutExerciseSection({
  form,
  index,
  onDeleteExercise,
  onReplaceExercise,
}: EditPlanWorkoutExerciseSectionProps) {
  const { colors } = useAppTheme();
  const { control, getValues, setValue } = form;

  const [expanded, setExpanded] = useState(true);

  const exercise = useWatch({
    control,
    name: `workoutExercises.${index}`,
  });

  const ExpansionIcon = expanded ? ChevronUp : ChevronDown;

  const columns = useMemo<SetColumn[]>(() => {
    if (!exercise) return [];

    const fields = getExerciseFields(exercise.exercise.exerciseType);

    return Array.from(fields).map((field) => ({
      key: field,
      label: SET_COLUMN_LABELS[field],
    }));
  }, [exercise]);

  if (!exercise) return null;

  const restTime = exercise.restTime ?? 0;

  // Functions
  const handleChangeRestTime = (seconds: number) => {
    setValue(`workoutExercises.${index}.restTime`, seconds, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleAddSet = () => {
    const currentSets = getValues(`workoutExercises.${index}.sets`) ?? [];
    const nextSetNumber =
      currentSets.length > 0
        ? Math.max(...currentSets.map((set) => set.setNumber)) + 1
        : 1;

    setValue(
      `workoutExercises.${index}.sets`,
      [...currentSets, createEmptyWorkoutExerciseFormSet(nextSetNumber)],
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  const handleDeleteSet = (targetClientId: string) => {
    const currentSets = getValues(`workoutExercises.${index}.sets`) ?? [];

    const nextSets = currentSets
      .filter((set) => set.clientId !== targetClientId)
      .map((set, setIndex) => ({
        ...set,
        setNumber: setIndex + 1,
      }));

    setValue(`workoutExercises.${index}.sets`, nextSets, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

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
            {exercise.exercise.name}
          </ThemedText>

          <ThemedText type="default" variant="primary" className="text-xs">
            {exercise.sets.length} {exercise.sets.length === 1 ? "set" : "sets"}
          </ThemedText>
        </View>

        <View className="ml-auto flex-row items-center gap-3">
          <EditPlanExerciseSectionMenu
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
                value={restTime}
                onChange={handleChangeRestTime}
              />
            </View>
          )}

          <FlatList
            data={exercise.sets}
            keyExtractor={(item) => item.clientId}
            scrollEnabled={false}
            renderItem={({ item: setItem, index: setIndex }) => (
              <EditPlanWorkoutSetRow
                control={control}
                exerciseIndex={index}
                setIndex={setIndex}
                setNumber={setItem.setNumber}
                columns={columns}
                onDelete={() => handleDeleteSet(setItem.clientId)}
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
                  Tap "Add Set" to start planning
                </ThemedText>
              </View>
            }
            ListHeaderComponent={
              exercise.sets.length > 0 ? (
                <EditPlanWorkoutSetHeader columns={columns} />
              ) : null
            }
            ListFooterComponent={<WorkoutSetFooter onPress={handleAddSet} />}
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

function EditPlanWorkoutSetHeader({ columns }: { columns: SetColumn[] }) {
  return (
    <View className="flex-row items-center gap-4 p-2">
      <View className="w-16 items-center">
        <ThemedText type="default" variant="accent">
          SET
        </ThemedText>
      </View>

      {columns.map((column) => (
        <View key={column.key} className="flex-1 items-center">
          <ThemedText type="default" variant="accent">
            {column.label}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

type EditPlanWorkoutSetRowProps = {
  control: UseFormReturn<EditPlanForm>["control"];
  exerciseIndex: number;
  setIndex: number;
  setNumber: number;
  columns: SetColumn[];
  onDelete: () => void;
};

function EditPlanWorkoutSetRow({
  control,
  exerciseIndex,
  setIndex,
  setNumber,
  columns,
  onDelete,
}: EditPlanWorkoutSetRowProps) {
  const { colors } = useAppTheme();

  return (
    <Swipeable
      friction={1.5}
      rightThreshold={30}
      overshootRight={false}
      renderRightActions={() => <DeleteSetAction onPress={onDelete} />}
    >
      <View
        className="flex-row items-center gap-4 p-2"
        style={{ backgroundColor: colors.app.cardPrimary }}
      >
        <View className="w-16 items-center">
          <ThemedText type="default" variant="primary">
            {setNumber}
          </ThemedText>
        </View>

        {columns.map((column) => (
          <View key={column.key} className="flex-1">
            <EditPlanWorkoutSetInput
              control={control}
              field={column.key}
              exerciseIndex={exerciseIndex}
              setIndex={setIndex}
            />
          </View>
        ))}
      </View>
    </Swipeable>
  );
}

type EditPlanWorkoutSetInputProps = {
  control: UseFormReturn<EditPlanForm>["control"];
  field: ExerciseFieldKey;
  exerciseIndex: number;
  setIndex: number;
};

function EditPlanWorkoutSetInput({
  control,
  field,
  exerciseIndex,
  setIndex,
}: EditPlanWorkoutSetInputProps) {
  switch (field) {
    case "weight":
      return (
        <Controller
          control={control}
          name={`workoutExercises.${exerciseIndex}.sets.${setIndex}.weight`}
          render={({ field, fieldState }) => (
            <FormNumberInput
              allowDecimal
              value={field.value}
              onChange={field.onChange}
              placeholder="-"
              showStepper={false}
              min={0}
              error={!!fieldState.error}
            />
          )}
        />
      );

    case "reps":
      return (
        <Controller
          control={control}
          name={`workoutExercises.${exerciseIndex}.sets.${setIndex}.reps`}
          render={({ field, fieldState }) => (
            <FormNumberInput
              value={field.value}
              onChange={field.onChange}
              placeholder="-"
              showStepper={false}
              min={0}
              error={!!fieldState.error}
            />
          )}
        />
      );

    case "distance":
      return (
        <Controller
          control={control}
          name={`workoutExercises.${exerciseIndex}.sets.${setIndex}.distance`}
          render={({ field, fieldState }) => (
            <FormNumberInput
              allowDecimal
              value={field.value}
              onChange={field.onChange}
              placeholder="-"
              showStepper={false}
              min={0}
              error={!!fieldState.error}
            />
          )}
        />
      );

    case "duration":
      return (
        <Controller
          control={control}
          name={`workoutExercises.${exerciseIndex}.sets.${setIndex}.durationMinutes`}
          render={({ field, fieldState }) => (
            <FormNumberInput
              value={field.value}
              onChange={field.onChange}
              placeholder="min"
              showStepper={false}
              min={0}
              error={!!fieldState.error}
            />
          )}
        />
      );

    default:
      return null;
  }
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

type EditPlanExerciseSectionMenuProps = {
  onReplaceExercise?: () => void;
  onDeleteExercise: () => void;
};

function EditPlanExerciseSectionMenu({
  onReplaceExercise,
  onDeleteExercise,
}: EditPlanExerciseSectionMenuProps) {
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

function DeleteSetAction({ onPress }: { onPress: () => void }) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      className="items-center justify-center px-6"
      style={{
        backgroundColor: colors.app.error,
      }}
    >
      <Trash2 size={16} color={colors.app.textWhite} strokeWidth={3} />
    </Pressable>
  );
}
