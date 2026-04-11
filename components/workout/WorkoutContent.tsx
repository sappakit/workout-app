import { workoutApi } from "@/app/api/workout.api";
import { api } from "@/lib/api";
import { useInvalidateQueries } from "@/lib/query/utils";
import { useAppToast } from "@/lib/toast/useAppToast";
import { workoutMutationKeys, workoutQueryKeys } from "@/lib/workout/keys";
import { WorkoutSchedule } from "@/types/workout/response/workout.types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Dumbbell, SquarePen } from "lucide-react-native";
import { AppButton } from "../custom-ui/AppButton";
import { PageLayout, PullToRefreshProps } from "../layout/PageLayout";
import { WorkoutPlanCard } from "./WorkoutPlanCard";
import { ExerciseCardReadonly } from "./exercise-card/ExerciseCardReadonly";

interface WorkoutContentProps {
  data: WorkoutSchedule;
  pullToRefresh?: PullToRefreshProps;
}

export function WorkoutContent({ data, pullToRefresh }: WorkoutContentProps) {
  const router = useRouter();
  const invalidateQueries = useInvalidateQueries();
  const toast = useAppToast();

  const { mutate: startWorkout, isPending } = useMutation({
    mutationKey: workoutMutationKeys.startSession,
    mutationFn: () => api.post(workoutApi.startSession()),
    onSuccess: async () => {
      // refresh current state
      await invalidateQueries([workoutQueryKeys.current]);
    },
    onError: (_err: unknown) => {
      toast.error({
        title: "Failed to start workout",
        message: "Please try again.",
      });
    },
  });

  const footer = (
    <>
      <AppButton
        title="Start Workout"
        variant="primary"
        icon={Dumbbell}
        className="flex-1"
        textClassName="font-medium"
        onPress={() => startWorkout()}
        loading={isPending}
      />

      <AppButton
        title="Edit Plan"
        variant="secondary"
        icon={SquarePen}
        className="w-36"
        onPress={() =>
          router.push({
            pathname: "/(pages)/workout/[id]/edit",
            params: { id: data.workout.id },
          })
        }
      />
    </>
  );

  return (
    <PageLayout
      headerProps={{
        variant: "title",
        title: "Workout",
      }}
      stickyFooter={{ content: footer }}
      pullToRefresh={pullToRefresh}
    >
      {/* Workout plan card */}
      <WorkoutPlanCard data={data.workout} />

      {/* Exercise card */}
      {data.workout.workoutExercises.map((item) => (
        <ExerciseCardReadonly key={item.id} data={item} className="mt-2" />
      ))}
    </PageLayout>
  );
}
