import { PageLayout } from "@/components/layout/PageLayout";
import { WorkoutPickerScreen } from "@/components/picker/workout-picker/WorkoutPickerScreen";
import { ErrorState } from "@/components/state/ErrorState";
import { useWeeklyPlanWorkoutPickerStore } from "@/components/weekly-plan/weeklyPlanWorkoutSelectionStore";
import type { WorkoutResponse } from "@/types/workout/response/workout.types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { DEFAULT_WORKOUT_FILTERS } from "../workout/choose-workout";

export default function ChooseWeeklyPlanWorkoutPage() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    dayOfWeek?: string;
    workoutId?: string;
  }>();

  const dayOfWeek = params.dayOfWeek ? Number(params.dayOfWeek) : null;

  const currentWorkoutId = params.workoutId ? Number(params.workoutId) : null;

  const setPickerResult = useWeeklyPlanWorkoutPickerStore(
    (state) => state.setResult,
  );

  const handleClose = () => {
    router.back();
  };

  const handleDone = (selectedWorkout: WorkoutResponse) => {
    if (!dayOfWeek) {
      return;
    }

    setPickerResult({
      dayOfWeek,
      workout: selectedWorkout,
    });

    router.back();
  };

  if (!dayOfWeek) {
    return (
      <PageLayout scrollable={false} includeInsets>
        <ErrorState
          icon="calendar"
          title="Weekly plan day not found"
          message="We couldn't find the weekly plan day you were trying to update."
          primaryAction={{
            hidden: true,
          }}
        />
      </PageLayout>
    );
  }

  return (
    <WorkoutPickerScreen
      description="Select one workout for this weekly plan day."
      initialSelectedWorkoutId={currentWorkoutId}
      defaultFilters={DEFAULT_WORKOUT_FILTERS}
      onClose={handleClose}
      onDone={handleDone}
    />
  );
}
