import { PageLayout } from "@/components/layout/PageLayout";
import { ThemedText } from "@/components/themed-text";
import { requireWorkoutExercises } from "@/lib/workout/utils/response-guards.utils";
import { WorkoutResponse } from "@/types/workout/response/workout.types";
import { View } from "react-native";
import { ExerciseListMenu } from "../edit-plan/ui/ExerciseListMenu";
import { DisplayWorkoutExerciseSection } from "../edit-plan/ui/WorkoutExerciseSection/DisplayWorkoutExerciseSection";
import { ScreenSection } from "../layout/ScreenSection";
import { SectionHeader } from "../layout/SectionHeader";
import { DetailHeroImage } from "./ui/DetailHeroImage";

interface WorkoutDetailContentProps {
  data: WorkoutResponse;
}

export default function WorkoutDetailContent({
  data,
}: WorkoutDetailContentProps) {
  const exercises = requireWorkoutExercises(data);

  return (
    <PageLayout
      includeInsets={{ bottom: true }}
      header={{
        props: {
          variant: "title",
          title: data.name,
          showBackButton: true,
        },
        scrollEffect: { overlay: true },
      }}
    >
      <DetailHeroImage imageUrl={data.imageUrl} />

      <View className="gap-4">
        <View className="justify-center">
          <ThemedText type="default" variant="primary">
            {data.workoutFocusType?.name ?? "General Workout"}
          </ThemedText>

          <ThemedText type="title" variant="accent" className="text-2xl">
            {data.name}
          </ThemedText>
        </View>

        <ScreenSection>
          <SectionHeader title="Description" />

          <ThemedText type="default" variant="primary">
            {data.description ?? "No description yet."}
          </ThemedText>
        </ScreenSection>

        <ScreenSection>
          <SectionHeader title="Exercise List" action={<ExerciseListMenu />} />

          <View className="gap-3">
            {exercises.length > 0 ? (
              exercises.map((workoutExercise) => (
                <DisplayWorkoutExerciseSection
                  key={workoutExercise.id}
                  exercise={workoutExercise}
                />
              ))
            ) : (
              <ThemedText type="default" variant="primary">
                No exercises yet.
              </ThemedText>
            )}
          </View>
        </ScreenSection>
      </View>
    </PageLayout>
  );
}
