import { AppButton } from "@/components/custom-ui/AppButton";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { TodayPlanDisplayState } from "@/components/workout/WorkoutContent";
import { Dumbbell, RotateCcw } from "lucide-react-native";
import { View } from "react-native";
import { WorkoutHeroCard, WorkoutHeroCardItem } from "../WorkoutHeroCard";

interface TodayPlanSectionProps {
  state: TodayPlanDisplayState;
  workoutHeroItem: WorkoutHeroCardItem;
  isStarting: boolean;
  onStartTodayPlan: () => void;
  onEditPlan: () => void;
  onSwitchPlan: () => void;
  onOpenWorkoutDetail: () => void;
}

export function TodayPlanSection({
  state,
  workoutHeroItem,
  isStarting,
  onStartTodayPlan,
  onEditPlan,
  onSwitchPlan,
  onOpenWorkoutDetail,
}: TodayPlanSectionProps) {
  const isScheduledPlanCompleted = state === "completed_scheduled_plan";
  const isOtherWorkoutCompletedToday = state === "completed_other_workout";

  const sectionTitle = isScheduledPlanCompleted
    ? "Today's Plan Completed"
    : isOtherWorkoutCompletedToday
      ? "You Trained Today"
      : "Today's Plan";

  const sectionSubtitle = isScheduledPlanCompleted
    ? "Nice work. You finished today's plan. Repeat it, or choose another workout if you want more."
    : isOtherWorkoutCompletedToday
      ? "Great work. Your scheduled plan is still available if you want more."
      : "Ready to train? Start scheduled, pick another, or build your own.";

  const statusIcon = isScheduledPlanCompleted ? "completed" : "scheduled";

  return (
    <View className="gap-3">
      <SectionHeader title={sectionTitle} subtitle={sectionSubtitle} />

      <WorkoutHeroCard
        item={workoutHeroItem}
        statusIcon={statusIcon}
        onEditPlan={onEditPlan}
        onSwitchPlan={onSwitchPlan}
        onPress={onOpenWorkoutDetail}
      />

      {isScheduledPlanCompleted ? (
        <AppButton
          title="Repeat Today's Workout"
          icon={RotateCcw}
          variant="primary"
          onPress={onStartTodayPlan}
          loading={isStarting}
        />
      ) : (
        <AppButton
          title="Start Today's Plan"
          icon={Dumbbell}
          variant="primary"
          onPress={onStartTodayPlan}
          loading={isStarting}
        />
      )}
    </View>
  );
}
