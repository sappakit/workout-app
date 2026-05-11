import { workoutApi } from "@/app/api/workout.api";
import { AppButton } from "@/components/custom-ui/AppButton";
import { PageLayout, PullToRefreshProps } from "@/components/layout/PageLayout";
import { api } from "@/lib/api";
import { useInvalidateQueries } from "@/lib/query/utils";
import { useAppToast } from "@/lib/toast/useAppToast";
import { workoutQueryKeys } from "@/lib/workout/keys";
import { WorkoutSchedule } from "@/types/workout/response/workout.types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Dumbbell, Plus, Search, Zap } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { ExpandableToggle } from "../custom-ui/ExpandableToggle";
import { SectionHeader } from "../layout/SectionHeader";
import { WorkoutPlanCard } from "./ui/WorkoutPlanCard";
import { ExerciseCardReadonly } from "./ui/exercise-card/ExerciseCardReadonly";

interface WorkoutContentProps {
  data: WorkoutSchedule;
  pullToRefresh?: PullToRefreshProps;
}

export function WorkoutContent({ data, pullToRefresh }: WorkoutContentProps) {
  const router = useRouter();
  const invalidateQueries = useInvalidateQueries();
  const toast = useAppToast();

  const [isExpanded, setIsExpanded] = useState(false);

  // Start plan workout
  const { mutate: startWorkout, isPending: isStarting } = useMutation({
    mutationFn: () => api.post(workoutApi.startSession(data.workout.id)),
    onSuccess: async () => {
      await invalidateQueries([workoutQueryKeys.current]);
    },
    onError: (_err: unknown) => {
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
    // TODO: route to create workout page
    // router.push("/(pages)/workout/create");
  };

  const handleEditPlan = () => {
    router.push({
      pathname: "/(pages)/workout/[id]/edit",
      params: { id: data.workout.id },
    });
  };

  return (
    <PageLayout
      headerProps={{
        variant: "title",
        title: "Workout",
      }}
      stickyFooter={{
        content: (
          <AppButton
            title="Start Today's Workout"
            variant="primary"
            icon={Dumbbell}
            className="flex-1"
            onPress={() => startWorkout()}
            loading={isStarting}
          />
        ),
      }}
      pullToRefresh={pullToRefresh}
    >
      <View className="gap-3">
        {/* Today's scheduled workout */}
        <SectionHeader
          title="Today's Plan"
          subtitle="Your scheduled workout for today"
        />

        <View>
          <WorkoutPlanCard
            data={data.workout}
            onEditPlan={handleEditPlan}
            onSwitchPlan={handleChooseWorkout}
          />

          {/* Exercise preview */}
          <View className="mt-2">
            <ExpandableToggle
              expandedLabel="Hide exercises"
              collapsedLabel="Show exercises"
              expanded={isExpanded}
              onToggleExpanded={() => setIsExpanded((prev) => !prev)}
            />

            {isExpanded && (
              <View>
                {data.workout.workoutExercises.map((item) => (
                  <ExerciseCardReadonly
                    key={item.id}
                    data={item}
                    className="mt-2"
                  />
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Other workout options */}
        <SectionHeader
          title="Other Options"
          subtitle="Choose a different way to train today"
        />

        <View className="gap-2">
          <View className="flex-row gap-2">
            <AppButton
              className="flex-1"
              title="New Plan"
              variant="option"
              icon={Plus}
              onPress={handleCreateWorkout}
            />

            <AppButton
              className="flex-1"
              title="Browse Plans"
              variant="option"
              icon={Search}
              onPress={handleChooseWorkout}
            />
          </View>

          <AppButton
            title="Start Empty Workout"
            variant="option"
            icon={Zap}
            onPress={handleStartEmptyWorkout}
          />
        </View>
      </View>
    </PageLayout>
  );
}
