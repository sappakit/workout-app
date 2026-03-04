import { WorkoutSchedule } from "@/types/workout/workout.types";
import { useRouter } from "expo-router";
import { Dumbbell, SquarePen } from "lucide-react-native";
import { AppButton } from "../custom-ui/AppButton";
import { PageLayout } from "../layout/PageLayout";
import { ExerciseCard } from "./ExerciseCard";
import { WorkoutPlanCard } from "./WorkoutPlanCard";

interface WorkoutContentProps {
  data: WorkoutSchedule;
}

export function WorkoutContent({ data }: WorkoutContentProps) {
  const router = useRouter();

  const footer = (
    <>
      <AppButton
        title="Start Workout"
        variant="primary"
        icon={Dumbbell}
        className="flex-1"
        textClassName="font-medium"
        // onPress={handleSubmit(onSubmit)}
        // loading={loading}
      />

      <AppButton
        title="Edit Plan"
        variant="secondary"
        icon={SquarePen}
        className="w-36"
        onPress={() =>
          router.push({
            pathname: "/edit-plan/[id]",
            params: { id: data.workout.id },
          })
        }
      />
    </>
  );

  return (
    <PageLayout stickyFooter={footer}>
      {/* TODO: for working in progress */}
      {/* <View className="flex-row gap-2">
          <AppButton
            title="Complete set"
            variant="primary"
            icon={Check}
            className="flex-1"
            textClassName="font-medium"
          />
          <AppButton variant="tertiary" icon={Pause} className="h-12 w-12" />
          <AppButton
            title="Cancel workout"
            variant="secondary"
            icon={X}
            className="flex-1"
          />
        </View> */}

      {/* Workout plan card */}
      <WorkoutPlanCard data={data.workout} />

      {/* Exercise card */}
      {data.workout.workoutExercises.map((item, index) => (
        <ExerciseCard
          key={item.id}
          data={item}
          className={`${index > 0 && "mt-4"}`}
        />
      ))}
    </PageLayout>
  );
}
