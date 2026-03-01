import { WorkoutSchedule } from "@/types/workout/workout.types";
import { Dumbbell, SquarePen } from "lucide-react-native";
import { View } from "react-native";
import { AppButton } from "../custom-ui/AppButton";
import { PageLayout } from "../layout/PageLayout";
import { WorkoutCard } from "./WorkoutCardExpandable";
import { WorkoutPlanCard } from "./WorkoutPlanCard";

interface WorkoutContentProps {
  data: WorkoutSchedule;
}

export function WorkoutContent({ data }: WorkoutContentProps) {
  return (
    <>
      <PageLayout bottomInset={64}>
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

        <WorkoutPlanCard data={data.workout} />

        <View className="mt-4">
          {data.workout.workoutExercises.map((item, index) => (
            <WorkoutCard
              key={item.id}
              data={item}
              className={`${index > 0 && "mt-4"}`}
            />
          ))}
        </View>
      </PageLayout>

      {/* Sticky buttons */}
      <View className="absolute bottom-0 left-0 right-0 flex-row gap-2 px-4 py-2">
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
          // onPress={handleSubmit(onSubmit)}
          // loading={loading}
        />
      </View>
    </>
  );
}
