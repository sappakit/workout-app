import FormNumberInput from "@/components/form/FormNumberInput";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  ExerciseFieldKey,
  getExerciseFieldConfig,
  getExerciseFields,
} from "@/lib/workout/config";
import { Check, ChevronsUpDown, Trash2 } from "lucide-react-native";
import { ReactElement } from "react";
import {
  Pressable,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

export type SetPerformanceMode = "previous" | "best";

export type WorkoutSetColumn = {
  key: ExerciseFieldKey;
  label: string;
  placeholder: string;
  allowDecimal: boolean;
  min: number;
  max?: number;
};

export function getWorkoutSetColumns(
  categoryCode: string | null | undefined,
): WorkoutSetColumn[] {
  return Array.from(getExerciseFields(categoryCode)).map((field) => {
    const config = getExerciseFieldConfig(field);

    return {
      key: field,
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
  const { colors } = useAppTheme();

  return (
    <View className="flex-row items-center gap-2 p-2">
      <View className="w-12 items-center">
        <ThemedText type="small" variant="accent">
          SET
        </ThemedText>
      </View>

      {performanceMode ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onTogglePerformanceMode}
          className="flex-1 flex-row items-center justify-center gap-1"
        >
          <ThemedText type="small" variant="accent">
            {performanceMode === "previous" ? "PREVIOUS" : "BEST"}
          </ThemedText>

          <ChevronsUpDown
            size={12}
            style={{ minWidth: 12 }}
            color={colors.app.textAccent}
          />
        </TouchableOpacity>
      ) : null}

      {columns.map((column) => (
        <View key={column.key} className="flex-1 items-center">
          <ThemedText type="small" variant="accent">
            {column.label}
          </ThemedText>
        </View>
      ))}

      {trailingHeaderLabel ? (
        <View className="w-12 items-center">
          <ThemedText type="small" variant="accent">
            {trailingHeaderLabel}
          </ThemedText>
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
  const { colors } = useAppTheme();

  return (
    <View
      className="flex-row items-center gap-2 p-2"
      style={{ backgroundColor: colors.app.cardPrimaryDark }}
    >
      <View className="w-12 items-center">
        <ThemedText type="default" variant="primary">
          {setNumber}
        </ThemedText>
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
  value,
  onChange,
  error,
  placeholder = "-",
  allowDecimal = false,
  min = 0,
  max,
  disabled = false,
}: WorkoutSetInputProps) {
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

type WorkoutSetValueTextProps = {
  value?: number | string | null;
};

export function WorkoutSetValueText({ value }: WorkoutSetValueTextProps) {
  return (
    <View className="h-12 items-center justify-center rounded-lg">
      <ThemedText type="default" variant="primary" numberOfLines={1}>
        {value ?? "-"}
      </ThemedText>
    </View>
  );
}

type WorkoutSetDoneCheckboxProps = TouchableOpacityProps & {
  checked: boolean;
};

export function WorkoutSetDoneCheckbox({
  checked,
  style,
  disabled,
  onPress,
  ...props
}: WorkoutSetDoneCheckboxProps) {
  const { colors } = useAppTheme();

  const baseStyle = {
    backgroundColor: checked ? colors.app.brand : colors.app.cardSecondary,
    borderColor: checked ? colors.app.brand : colors.app.borderPrimary,
  };

  return (
    <TouchableOpacity
      {...props}
      onPress={onPress}
      activeOpacity={0.8}
      className="h-6 w-6 items-center justify-center rounded-md border"
      style={[baseStyle, { opacity: disabled ? 0.6 : 1 }, style]}
      disabled={disabled}
    >
      {checked ? (
        <Check size={14} color={colors.app.textWhite} strokeWidth={3} />
      ) : null}
    </TouchableOpacity>
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

type WorkoutSetPerformanceTextProps = {
  value?: string | null;
};

export function WorkoutSetPerformanceText({
  value,
}: WorkoutSetPerformanceTextProps) {
  return (
    <ThemedText type="default" variant="primary">
      {value ?? "-"}
    </ThemedText>
  );
}
