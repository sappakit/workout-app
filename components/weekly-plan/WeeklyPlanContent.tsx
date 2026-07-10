import { AppButton } from "@/components/custom-ui/AppButton";
import { PageLayout } from "@/components/layout/PageLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { useWeeklyPlanWorkoutPickerStore } from "@/components/weekly-plan/weeklyPlanWorkoutSelectionStore";
import { api } from "@/lib/api/client";
import { workoutApi } from "@/lib/api/workout.api";
import { useInvalidateQueries } from "@/lib/query/utils";
import { useAppToast } from "@/lib/toast/useAppToast";
import { workoutQueryKeys } from "@/lib/workout/keys";
import {
  WorkoutWeeklyPlan,
  WorkoutWeeklyPlanDayType,
} from "@/types/workout/response/workout.types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Save } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Alert, View } from "react-native";
import {
  getTodayDayOfWeek,
  mapWeeklyPlanResponseToState,
  mapWeeklyPlanStateToUpdatePayload,
  UpdateWeeklyPlanPayload,
} from "./model/weekly-plan.mapper";
import { SelectedWeeklyPlanDayCard } from "./ui/SelectedWeeklyPlanDayCard";
import { WeeklyPlanDaySelector } from "./ui/WeeklyPlanDaySelector";
import { WeeklyPlanSummary } from "./ui/WeeklyPlanSummary";

interface WeeklyPlanContentProps {
  data: WorkoutWeeklyPlan;
}

export default function WeeklyPlanContent({ data }: WeeklyPlanContentProps) {
  const router = useRouter();
  const toast = useAppToast();
  const invalidateQueries = useInvalidateQueries();

  const pickerResult = useWeeklyPlanWorkoutPickerStore((state) => state.result);
  const clearPickerResult = useWeeklyPlanWorkoutPickerStore(
    (state) => state.clearResult,
  );

  const initialWeeklyPlan = useMemo(
    () => mapWeeklyPlanResponseToState(data),
    [data],
  );

  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(getTodayDayOfWeek);
  const [weeklyPlan, setWeeklyPlan] = useState(() => initialWeeklyPlan);

  useEffect(() => {
    if (!pickerResult) return;

    setWeeklyPlan((currentPlan) =>
      currentPlan.map((day) =>
        day.dayOfWeek === pickerResult.dayOfWeek
          ? {
              ...day,
              dayType: WorkoutWeeklyPlanDayType.WORKOUT,
              workoutId: pickerResult.workout.id,
              workout: pickerResult.workout,
            }
          : day,
      ),
    );

    setSelectedDayOfWeek(pickerResult.dayOfWeek);

    clearPickerResult();
  }, [pickerResult, clearPickerResult]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: UpdateWeeklyPlanPayload) => {
      return api.patch(workoutApi.updateWeeklyPlan(), payload);
    },
    onSuccess: async () => {
      await invalidateQueries([
        workoutQueryKeys.weeklyPlan,
        workoutQueryKeys.current,
      ]);

      toast.success({
        title: "Weekly plan updated",
        message: "Future workout plans will use this routine.",
      });

      router.back();
    },
    onError: () => {
      toast.error({
        title: "Update failed",
        message: "Unable to save your weekly plan.",
      });
    },
  });

  const selectedDay = weeklyPlan.find(
    (day) => day.dayOfWeek === selectedDayOfWeek,
  );

  const assignedWorkoutCount = weeklyPlan.filter(
    (day) => day.dayType === WorkoutWeeklyPlanDayType.WORKOUT,
  ).length;

  const restDayCount = weeklyPlan.filter(
    (day) => day.dayType === WorkoutWeeklyPlanDayType.REST,
  ).length;

  const unassignedDayCount = weeklyPlan.filter(
    (day) => day.dayType === WorkoutWeeklyPlanDayType.UNASSIGNED,
  ).length;

  const handleChooseWorkout = () => {
    if (!selectedDay || isPending) return;

    router.push({
      pathname: "/(modal)/weekly-plan/choose-weekly-plan-workout",
      params: {
        dayOfWeek: String(selectedDay.dayOfWeek),
        workoutId: selectedDay.workoutId
          ? String(selectedDay.workoutId)
          : undefined,
      },
    });
  };

  const handleSetRestDay = () => {
    if (isPending) return;

    setWeeklyPlan((currentPlan) =>
      currentPlan.map((day) =>
        day.dayOfWeek === selectedDayOfWeek
          ? {
              ...day,
              dayType: WorkoutWeeklyPlanDayType.REST,
              workoutId: null,
              workout: null,
            }
          : day,
      ),
    );
  };

  const handleClearDay = () => {
    if (isPending) return;

    setWeeklyPlan((currentPlan) =>
      currentPlan.map((day) =>
        day.dayOfWeek === selectedDayOfWeek
          ? {
              ...day,
              dayType: WorkoutWeeklyPlanDayType.UNASSIGNED,
              workoutId: null,
              workout: null,
            }
          : day,
      ),
    );
  };

  const handleSave = () => {
    const payload = mapWeeklyPlanStateToUpdatePayload(weeklyPlan);

    mutate(payload);
  };

  const handleCancel = () => {
    if (isPending) return;

    const resetAndBack = () => {
      router.back();
    };

    const initialPayload = mapWeeklyPlanStateToUpdatePayload(initialWeeklyPlan);
    const currentPayload = mapWeeklyPlanStateToUpdatePayload(weeklyPlan);

    const isDirty =
      JSON.stringify(initialPayload.days) !==
      JSON.stringify(currentPayload.days);

    if (!isDirty) {
      resetAndBack();
      return;
    }

    Alert.alert(
      "Discard changes?",
      "You have unsaved changes. If you go back, your edits will be lost.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Discard",
          style: "destructive",
          onPress: resetAndBack,
        },
      ],
    );
  };

  return (
    <PageLayout
      header={{
        props: {
          variant: "title",
          title: "Weekly Plan",
          showBackButton: true,
          onBackPress: handleCancel,
        },
      }}
      stickyFooter={
        <AppButton
          title="Save weekly plan"
          variant="primary"
          icon={Save}
          className="flex-1"
          loading={isPending}
          disabled={isPending}
          onPress={handleSave}
        />
      }
    >
      <View className="gap-4">
        <WeeklyPlanSummary
          assignedWorkoutCount={assignedWorkoutCount}
          restDayCount={restDayCount}
          unassignedDayCount={unassignedDayCount}
        />

        <View className="gap-3">
          <SectionHeader
            title="Choose day"
            subtitle="Assign a workout or mark the day as rest"
          />

          <WeeklyPlanDaySelector
            weeklyPlan={weeklyPlan}
            selectedDayOfWeek={selectedDayOfWeek}
            onSelectDay={setSelectedDayOfWeek}
          />
        </View>

        {selectedDay ? (
          <SelectedWeeklyPlanDayCard
            day={selectedDay}
            disabled={isPending}
            onChooseWorkout={handleChooseWorkout}
            onSetRestDay={handleSetRestDay}
            onClearDay={handleClearDay}
          />
        ) : null}
      </View>
    </PageLayout>
  );
}
