import { workoutApi } from "@/app/api/workout.api";
import { AppButton } from "@/components/custom-ui/AppButton";
import { PageLayout, PullToRefreshProps } from "@/components/layout/PageLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { api } from "@/lib/api";
import { useInvalidateQueries } from "@/lib/query/utils";
import { useAppToast } from "@/lib/toast/useAppToast";
import { workoutQueryKeys } from "@/lib/workout/keys";
import {
  WorkoutCurrentMode,
  WorkoutSchedule,
  WorkoutScheduleStatus,
} from "@/types/workout/response/workout.types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { mapScheduleToWorkoutHeroCardItem } from "./model/workout-content.mapper";
import { RestDaySection } from "./ui/sections/RestDaySection";
import { TodayPlanSection } from "./ui/sections/TodayPlanSection";
import { UnassignedPlanSection } from "./ui/sections/UnassignedPlanSection";
import {
  WorkoutPreviewCardItem,
  WorkoutPreviewSection,
} from "./ui/workout-preview-card/WorkoutPreviewCard";
import { WorkoutQuickActions } from "./ui/WorkoutQuickActions";

export type TodayPlanDisplayState =
  | "not_started"
  | "completed_scheduled_plan"
  | "completed_other_workout";

type WorkoutContentMode = Exclude<
  WorkoutCurrentMode,
  WorkoutCurrentMode.IN_PROGRESS
>;

interface WorkoutContentProps {
  mode: WorkoutContentMode;
  data: WorkoutSchedule | null;
  hasCompletedWorkoutToday?: boolean;
  workoutPreviewItems: WorkoutPreviewCardItem[];
  selectedMuscleIds: number[];
  onChangeMuscleIds: (muscleIds: number[]) => void;
  pullToRefresh?: PullToRefreshProps;
}

export default function WorkoutContent({
  mode,
  data,
  hasCompletedWorkoutToday = false,
  workoutPreviewItems,
  selectedMuscleIds,
  onChangeMuscleIds,
  pullToRefresh,
}: WorkoutContentProps) {
  const router = useRouter();
  const invalidateQueries = useInvalidateQueries();
  const toast = useAppToast();

  const workoutHeroItem = data ? mapScheduleToWorkoutHeroCardItem(data) : null;

  const todayPlanState = data
    ? getTodayPlanDisplayState(data.status, hasCompletedWorkoutToday)
    : "not_started";

  const isScheduledDay = mode === WorkoutCurrentMode.SCHEDULED;
  const isRestDay = mode === WorkoutCurrentMode.REST_DAY;
  const isUnassignedDay = mode === WorkoutCurrentMode.UNASSIGNED;

  // Start plan workout
  const { mutate: startWorkout, isPending: isStarting } = useMutation({
    mutationFn: () => {
      if (!data) {
        throw new Error("No scheduled workout found.");
      }

      return api.post(workoutApi.startSession(data.workout.id));
    },
    onSuccess: async () => {
      await invalidateQueries([workoutQueryKeys.current]);
    },
    onError: () => {
      toast.error({
        title: "Failed to start workout",
        message: "Please try again.",
      });
    },
  });

  // Start empty workout
  const { mutate: startEmptyWorkout, isPending: isStartingEmpty } = useMutation(
    {
      mutationFn: () => api.post(workoutApi.startEmptySession()),
      onSuccess: async () => {
        await invalidateQueries([workoutQueryKeys.current]);
      },
      onError: () => {
        toast.error({
          title: "Failed to start empty workout",
          message: "Please try again.",
        });
      },
    },
  );

  const handleChooseWorkout = () => {
    if (!data) {
      router.push("/(modal)/workout/choose-workout");
      return;
    }

    router.push({
      pathname: "/(modal)/workout/choose-workout",
      params: {
        scheduleId: data.id,
        workoutId: data.workout.id,
      },
    });
  };

  const handleCreateWorkout = () => {
    router.push("/(pages)/workout/create");
  };

  const handleEditPlan = () => {
    if (!data) return;

    router.push({
      pathname: "/(pages)/workout/[id]/edit",
      params: { id: data.workout.id },
    });
  };

  const handleOpenWorkoutDetail = () => {
    if (!data) return;

    router.push({
      pathname: "/(pages)/workout/[id]",
      params: { id: data.workout.id },
    });
  };

  return (
    <PageLayout
      headerProps={{ variant: "title", title: "Workout" }}
      pullToRefresh={pullToRefresh}
    >
      <View className="gap-4">
        {/* {isScheduledDay && data && workoutHeroItem ? (
          <TodayPlanSection
            state={todayPlanState}
            workoutHeroItem={workoutHeroItem}
            isStarting={isStarting}
            onStartTodayPlan={startWorkout}
            onEditPlan={handleEditPlan}
            onSwitchPlan={handleChooseWorkout}
            onOpenWorkoutDetail={handleOpenWorkoutDetail}
          />
        ) : isRestDay ? (
          <RestDaySection />
        ) : isUnassignedDay ? (
          <UnassignedPlanSection />
        ) : null} */}

        {isScheduledDay && data && workoutHeroItem ? (
          <TodayPlanSection
            state={todayPlanState}
            workoutHeroItem={workoutHeroItem}
            isStarting={isStarting}
            onStartTodayPlan={startWorkout}
            onEditPlan={handleEditPlan}
            onSwitchPlan={handleChooseWorkout}
            onOpenWorkoutDetail={handleOpenWorkoutDetail}
          />
        ) : null}

        {isRestDay ? <RestDaySection /> : null}

        {isUnassignedDay ? <UnassignedPlanSection /> : null}

        <View className="gap-3">
          <SectionHeader
            title="Your plan"
            action={
              <AppButton
                title="View All"
                variant="ghost"
                onPress={handleChooseWorkout}
              />
            }
          />

          <WorkoutPreviewSection
            items={workoutPreviewItems}
            selectedMuscleIds={selectedMuscleIds}
            onChangeMuscleIds={onChangeMuscleIds}
          />

          <WorkoutQuickActions
            onBrowsePlans={handleChooseWorkout}
            onCreatePlan={handleCreateWorkout}
            onStartEmptyWorkoutAction={{
              onPress: startEmptyWorkout,
              loading: isStartingEmpty,
            }}
          />
        </View>
      </View>
    </PageLayout>
  );
}

function getTodayPlanDisplayState(
  scheduleStatus: WorkoutScheduleStatus,
  hasCompletedWorkoutToday: boolean,
): TodayPlanDisplayState {
  if (scheduleStatus === WorkoutScheduleStatus.COMPLETED) {
    return "completed_scheduled_plan";
  }

  if (
    scheduleStatus === WorkoutScheduleStatus.PLANNED &&
    hasCompletedWorkoutToday
  ) {
    return "completed_other_workout";
  }

  return "not_started";
}
