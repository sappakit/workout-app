import { AppButton } from "@/components/custom-ui/AppButton";
import { Plus, Search, Zap } from "lucide-react-native";
import React from "react";
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
          icon={Search}
          variant="secondary"
          onPress={onBrowsePlans}
          className="flex-1"
        />

        <AppButton
          title="New plan"
          icon={Plus}
          variant="secondary"
          onPress={onCreatePlan}
          className="flex-1"
        />
      </View>

      <AppButton
        title="Start Empty Workout"
        icon={Zap}
        variant="tertiary"
        onPress={onStartEmptyWorkoutAction.onPress}
        loading={onStartEmptyWorkoutAction.loading}
      />
    </View>
  );
}
