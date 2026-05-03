import FormNumberInput from "@/components/form/FormNumberInput";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { WorkoutSessionExerciseModel } from "@/types/workout/model/workout.types";
import { Check, Trash2 } from "lucide-react-native";
import {
  Pressable,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

export function WorkoutSetHeader() {
  return (
    <View className="flex-row items-center gap-4 py-2">
      <View className="w-16 items-center">
        <ThemedText type="default" variant="accent">
          SET
        </ThemedText>
      </View>

      <View className="flex-1 items-center">
        <ThemedText type="default" variant="accent">
          LOAD
        </ThemedText>
      </View>

      <View className="flex-1 items-center">
        <ThemedText type="default" variant="accent">
          REPS
        </ThemedText>
      </View>

      <View className="w-16 items-center">
        <ThemedText type="default" variant="accent">
          DONE
        </ThemedText>
      </View>
    </View>
  );
}

interface WorkoutSetRowProps {
  item: WorkoutSessionExerciseModel["sets"][number];
  onDelete: () => void;
  onToggleComplete: () => void;
  onChangeWeight: (value: number | null) => void;
  onChangeReps: (value: number | null) => void;
}

export function WorkoutSetRow({
  item,
  onDelete,
  onToggleComplete,
  onChangeWeight,
  onChangeReps,
}: WorkoutSetRowProps) {
  const { colors } = useAppTheme();

  const isCompleted = !!item.completedAt;

  return (
    <Swipeable
      friction={1.5}
      rightThreshold={30}
      overshootRight={false}
      renderRightActions={() => <DeleteSetAction onPress={onDelete} />}
    >
      <View
        className="flex-row items-center gap-4 py-2"
        style={{ backgroundColor: colors.app.cardPrimary }}
      >
        <View className="w-16 items-center">
          <ThemedText type="default" variant="primary">
            {item.setNumber}
          </ThemedText>
        </View>

        <View className="flex-1">
          <FormNumberInput
            allowDecimal
            value={item.weight}
            onChange={onChangeWeight}
            placeholder="-"
            showStepper={false}
            min={0}
          />
        </View>

        <View className="flex-1">
          <FormNumberInput
            value={item.reps}
            onChange={onChangeReps}
            placeholder="-"
            showStepper={false}
            min={0}
          />
        </View>

        <View className="w-16 items-center">
          <CheckButton checked={isCompleted} onPress={onToggleComplete} />
        </View>
      </View>
    </Swipeable>
  );
}

interface CheckButtonProps extends TouchableOpacityProps {
  checked: boolean;
}

function CheckButton({
  checked,
  style,
  disabled,
  onPress,
  ...props
}: CheckButtonProps) {
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
