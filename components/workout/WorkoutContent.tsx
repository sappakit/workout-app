import { workoutApi } from "@/app/api/workout.api";
import { AppButton } from "@/components/custom-ui/AppButton";
import { CategoryFilter } from "@/components/home/ui/CategoryFilter";
import {
  WorkoutPreviewCard,
  WorkoutPreviewCardItem,
} from "@/components/home/ui/WorkoutPreviewCard";
import { PageLayout, PullToRefreshProps } from "@/components/layout/PageLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { api } from "@/lib/api";
import { useInvalidateQueries } from "@/lib/query/utils";
import { useAppToast } from "@/lib/toast/useAppToast";
import { workoutQueryKeys } from "@/lib/workout/keys";
import { WorkoutSchedule } from "@/types/workout/response/workout.types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Dumbbell } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { mapScheduleToWorkoutHeroCardItem } from "./model/workout-content.mapper";
import { WorkoutHeroCard } from "./ui/WorkoutHeroCard";
import { WorkoutQuickActions } from "./ui/WorkoutQuickActions";

interface WorkoutContentProps {
  data: WorkoutSchedule;
  workoutPreviewItems: WorkoutPreviewCardItem[];
  pullToRefresh?: PullToRefreshProps;
}

export default function WorkoutContent({
  data,
  workoutPreviewItems,
  pullToRefresh,
}: WorkoutContentProps) {
  const router = useRouter();
  const invalidateQueries = useInvalidateQueries();
  const toast = useAppToast();

  const workoutHeroItem = mapScheduleToWorkoutHeroCardItem(data);

  // Start plan workout
  const { mutate: startWorkout, isPending: isStarting } = useMutation({
    mutationFn: () => api.post(workoutApi.startSession(data.workout.id)),
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

  const handleStartTodayPlan = () => {
    startWorkout();
  };

  const handleStartEmptyWorkout = () => {
    startEmptyWorkout();
  };

  const handleChooseWorkout = () => {
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
    router.push({
      pathname: "/(pages)/workout/[id]/edit",
      params: { id: data.workout.id },
    });
  };

  return (
    <PageLayout
      headerProps={{ variant: "title", title: "Workout" }}
      pullToRefresh={pullToRefresh}
    >
      <View className="gap-5 pb-6">
        <SectionHeader
          title="Today's Plan"
          subtitle="Ready to train? Start scheduled, pick another, or build your own."
        />

        <WorkoutHeroCard
          item={workoutHeroItem}
          onEditPlan={handleEditPlan}
          onSwitchPlan={handleChooseWorkout}
        />

        <AppButton
          title="Start Today's Plan"
          icon={Dumbbell}
          variant="primary"
          onPress={handleStartTodayPlan}
          loading={isStarting}
        />

        <View>
          <View className="mb-3">
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
          </View>

          <CategoryFilter />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 12,
              paddingTop: 12,
              paddingRight: 16,
            }}
          >
            {workoutPreviewItems.map((workout) => (
              <WorkoutPreviewCard key={workout.id} item={workout} />
            ))}
          </ScrollView>
        </View>

        <WorkoutQuickActions
          onBrowsePlans={handleChooseWorkout}
          onCreatePlan={handleCreateWorkout}
          onStartEmptyWorkoutAction={{
            onPress: handleStartEmptyWorkout,
            loading: isStartingEmpty,
          }}
        />
      </View>
    </PageLayout>
  );
}
