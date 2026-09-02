import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import FormNumberInput from "@/components/form/FormNumberInput";
import { DurationBottomSheetPicker } from "@/components/form/picker/duration-picker/DurationPickerSheet";
import { useAppColors } from "@/hooks/useAppColors";
import {
  type ExerciseFieldKey,
  type ExerciseInputType,
  getExerciseFieldConfig,
  getExerciseFields,
} from "@/lib/workout/config";
import type { ExerciseTrackingTypeCode } from "@/types/workout/response/exercise.types";
import type { ReactElement } from "react";
import { Pressable, View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

export type SetPerformanceMode = "previous" | "best";

export type WorkoutSetColumn = {
  key: ExerciseFieldKey;
  inputType: ExerciseInputType;
  label: string;
  placeholder: string;
  allowDecimal?: boolean;
  min?: number;
  max?: number;
};

export function getWorkoutSetColumns(
  trackingTypeCode: ExerciseTrackingTypeCode | null | undefined,
): WorkoutSetColumn[] {
  return getExerciseFields(trackingTypeCode).map((field) => {
    const config = getExerciseFieldConfig(field);

    return {
      key: field,
      inputType: config.inputType,
      label: config.label,
      placeholder: config.placeholder,
      allowDecimal: config.allowDecimal,
      min: config.min,
      max: config.max,
    };
  });
}

type WorkoutSetHeaderProps = {
  columns: WorkoutSetColumn[];
  trailingHeaderLabel?: string;
  performanceMode?: SetPerformanceMode;
  onTogglePerformanceMode?: () => void;
};

export function WorkoutSetHeader({
  columns,
  trailingHeaderLabel,
  performanceMode,
  onTogglePerformanceMode,
}: WorkoutSetHeaderProps) {
  const colors = useAppColors();

  return (
    <View className="flex-row items-center gap-2 p-2">
      <View className="w-12 items-center">
        <ThemedText type="label">SET</ThemedText>
      </View>

      {performanceMode ? (
        <Pressable
          onPress={onTogglePerformanceMode}
          className="flex-1 flex-row items-center justify-center gap-1"
        >
          <ThemedText type="label">
            {performanceMode === "previous" ? "PREVIOUS" : "BEST"}
          </ThemedText>

          <AppIcon name="switch-vertical" size="xs" color={colors.foreground} />
        </Pressable>
      ) : null}

      {columns.map((column) => (
        <View key={column.key} className="flex-1 items-center">
          <ThemedText type="label">{column.label}</ThemedText>
        </View>
      ))}

      {trailingHeaderLabel ? (
        <View className="w-12 items-center">
          <ThemedText type="label">{trailingHeaderLabel}</ThemedText>
        </View>
      ) : null}
    </View>
  );
}

type WorkoutSetRowProps = {
  setNumber: number;
  columns: WorkoutSetColumn[];
  onDelete?: () => void;
  renderInput: (
    column: WorkoutSetColumn,
    columnIndex: number,
  ) => ReactElement | null;
  renderTrailingCell?: () => ReactElement | null;
  renderPerformanceCell?: () => ReactElement | null;
};

export function WorkoutSetRow({
  setNumber,
  columns,
  onDelete,
  renderInput,
  renderTrailingCell,
  renderPerformanceCell,
}: WorkoutSetRowProps) {
  const rowContent = (
    <WorkoutSetRowContent
      setNumber={setNumber}
      columns={columns}
      renderInput={renderInput}
      renderTrailingCell={renderTrailingCell}
      renderPerformanceCell={renderPerformanceCell}
    />
  );

  if (!onDelete) {
    return rowContent;
  }

  return (
    <Swipeable
      friction={1.5}
      rightThreshold={30}
      overshootRight={false}
      renderRightActions={() => <DeleteSetAction onPress={onDelete} />}
    >
      {rowContent}
    </Swipeable>
  );
}

type WorkoutSetRowContentProps = {
  setNumber: number;
  columns: WorkoutSetColumn[];
  renderInput: (
    column: WorkoutSetColumn,
    columnIndex: number,
  ) => ReactElement | null;
  renderTrailingCell?: () => ReactElement | null;
  renderPerformanceCell?: () => ReactElement | null;
};

function WorkoutSetRowContent({
  setNumber,
  columns,
  renderInput,
  renderTrailingCell,
  renderPerformanceCell,
}: WorkoutSetRowContentProps) {
  return (
    <View className="flex-row items-center gap-2 bg-card p-2">
      <View className="w-12 items-center">
        <ThemedText type="body">{setNumber}</ThemedText>
      </View>

      {renderPerformanceCell ? (
        <View className="flex-1 items-center">{renderPerformanceCell()}</View>
      ) : null}

      {columns.map((column, columnIndex) => (
        <View key={column.key} className="flex-1">
          {renderInput(column, columnIndex)}
        </View>
      ))}

      {renderTrailingCell ? (
        <View className="w-12 items-center">{renderTrailingCell()}</View>
      ) : null}
    </View>
  );
}

type WorkoutSetInputProps = {
  inputType: ExerciseInputType;
  value?: number | null;
  onChange: (value: number | null) => void;
  error?: boolean;
  placeholder?: string;
  allowDecimal?: boolean;
  min?: number;
  max?: number;
  disabled?: boolean;
};

export function WorkoutSetInput({
  inputType,
  value,
  onChange,
  error,
  placeholder = "-",
  allowDecimal = false,
  min = 0,
  max,
  disabled = false,
}: WorkoutSetInputProps) {
  switch (inputType) {
    case "number-input":
      return (
        <WorkoutSetNumberInput
          value={value}
          onChange={onChange}
          error={error}
          placeholder={placeholder}
          allowDecimal={allowDecimal}
          min={min}
          max={max}
          disabled={disabled}
        />
      );

    case "duration-picker":
      return (
        <WorkoutSetDurationInput
          value={value}
          onChange={onChange}
          error={error}
          disabled={disabled}
        />
      );
  }
}

type WorkoutSetNumberInputProps = {
  value?: number | null;
  onChange: (value: number | null) => void;
  error?: boolean;
  placeholder?: string;
  allowDecimal?: boolean;
  min?: number;
  max?: number;
  disabled?: boolean;
};

function WorkoutSetNumberInput({
  value,
  onChange,
  error,
  placeholder = "-",
  allowDecimal = false,
  min = 0,
  max,
  disabled = false,
}: WorkoutSetNumberInputProps) {
  return (
    <FormNumberInput
      inputMode="gesture"
      disabled={disabled}
      allowDecimal={allowDecimal}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      showStepper={false}
      min={min}
      max={max}
      error={error}
    />
  );
}

type WorkoutSetDurationInputProps = {
  value?: number | null;
  onChange: (value: number | null) => void;
  error?: boolean;
  disabled?: boolean;
};

function WorkoutSetDurationInput({
  value,
  onChange,
  error,
  disabled = false,
}: WorkoutSetDurationInputProps) {
  return (
    <DurationBottomSheetPicker
      title="Select Duration"
      value={value ?? 0}
      onChange={onChange}
      disabled={disabled}
      triggerVariant="field"
      error={error}
      textAlign="center"
    />
  );
}

type WorkoutSetValueTextProps = {
  value?: number | string | null;
};

export function WorkoutSetValueText({ value }: WorkoutSetValueTextProps) {
  return (
    <View className="h-10 items-center justify-center rounded-lg">
      <ThemedText type="body" numberOfLines={1}>
        {value ?? "-"}
      </ThemedText>
    </View>
  );
}

function DeleteSetAction({ onPress }: { onPress: () => void }) {
  const colors = useAppColors();

  return (
    <Pressable
      onPress={onPress}
      className="items-center justify-center bg-destructive px-6"
    >
      <AppIcon name="delete" size="sm" color={colors.destructiveForeground} />
    </Pressable>
  );
}

type WorkoutSetPerformanceTextProps = {
  value?: string | null;
};

export function WorkoutSetPerformanceText({
  value,
}: WorkoutSetPerformanceTextProps) {
  return <ThemedText type="body">{value ?? "-"}</ThemedText>;
}
