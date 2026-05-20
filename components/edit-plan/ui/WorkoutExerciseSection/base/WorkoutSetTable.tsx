import FormNumberInput from "@/components/form/FormNumberInput";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  ExerciseFieldKey,
  getExerciseFieldConfig,
  getExerciseFields,
} from "@/lib/workout/config";
import { ExerciseType } from "@/types/workout/response/exercise.types";
import { Check, Trash2 } from "lucide-react-native";
import { ReactElement } from "react";
import {
  Pressable,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

export type WorkoutSetColumn = {
  key: ExerciseFieldKey;
  label: string;
  placeholder: string;
  allowDecimal: boolean;
  min: number;
  max?: number;
};

export function getWorkoutSetColumns(
  exerciseType: ExerciseType,
): WorkoutSetColumn[] {
  return Array.from(getExerciseFields(exerciseType)).map((field) => {
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
};

export function WorkoutSetHeader({
  columns,
  trailingHeaderLabel,
}: WorkoutSetHeaderProps) {
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

      {trailingHeaderLabel ? (
        <View className="w-16 items-center">
          <ThemedText type="default" variant="accent">
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
  onDelete: () => void;
  renderInput: (
    column: WorkoutSetColumn,
    columnIndex: number,
  ) => ReactElement | null;
  renderTrailingCell?: () => ReactElement | null;
};

export function WorkoutSetRow({
  setNumber,
  columns,
  onDelete,
  renderInput,
  renderTrailingCell,
}: WorkoutSetRowProps) {
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

        {columns.map((column, columnIndex) => (
          <View key={column.key} className="flex-1">
            {renderInput(column, columnIndex)}
          </View>
        ))}

        {renderTrailingCell ? (
          <View className="w-16 items-center">{renderTrailingCell()}</View>
        ) : null}
      </View>
    </Swipeable>
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
};

export function WorkoutSetInput({
  value,
  onChange,
  error,
  placeholder = "-",
  allowDecimal = false,
  min = 0,
  max,
}: WorkoutSetInputProps) {
  return (
    <FormNumberInput
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
