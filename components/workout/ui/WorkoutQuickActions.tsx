import { AppButton } from "@/components/custom-ui/app-button";
import { View } from "react-native";

type ButtonAction = {
  onPress: () => void;
  loading?: boolean;
};

interface WorkoutQuickActionsProps {
  onBrowsePlans: () => void;
  onCreatePlan: () => void;
  onStartEmptyWorkoutAction: ButtonAction;
}

export function WorkoutQuickActions({
  onBrowsePlans,
  onCreatePlan,
  onStartEmptyWorkoutAction,
}: WorkoutQuickActionsProps) {
  return (
    <View className="gap-3">
      <View className="flex-row gap-3">
        <AppButton
          title="Browse plans"
          variant="secondary"
          className="flex-1"
          icon={{
            name: "search",
            size: "sm",
          }}
          onPress={onBrowsePlans}
        />

        <AppButton
          title="New plan"
          variant="secondary"
          className="flex-1"
          icon={{
            name: "add",
            size: "sm",
          }}
          onPress={onCreatePlan}
        />
      </View>

      <AppButton
        title="Start Empty Workout"
        variant="contrast"
        icon={{
          name: "quick-start",
          size: "sm",
        }}
        onPress={onStartEmptyWorkoutAction.onPress}
        loading={onStartEmptyWorkoutAction.loading}
      />
    </View>
  );
}
