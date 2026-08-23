import { ThemedText } from "@/components/custom-ui/themed-text";
import { PageLayout } from "@/components/layout/PageLayout";
import { ScreenSection } from "@/components/layout/ScreenSection";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { ContentFeedback } from "@/components/state/ContentFeedback";
import { requireWorkoutExercises } from "@/lib/workout/utils/response-guards.utils";
import type { WorkoutResponse } from "@/types/workout/response/workout.types";
import { View } from "react-native";
import { ExerciseListMenu } from "../edit-plan/ui/ExerciseListMenu";
import { DisplayWorkoutExerciseSection } from "../edit-plan/ui/WorkoutExerciseSection/DisplayWorkoutExerciseSection";
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
        scrollEffect: {
          overlay: true,
        },
      }}
    >
      <View className="gap-4">
        <DetailHeroImage imageUrl={data.imageUrl} />

        <View className="gap-2">
          <ThemedText type="small" tone="muted">
            {data.workoutFocusType?.name ?? "General Workout"}
          </ThemedText>

          <ThemedText type="title">{data.name}</ThemedText>
        </View>

        <ScreenSection>
          <SectionHeader title="Description" />

          <ThemedText type="body" tone="muted">
            {data.description ?? "No description yet."}
          </ThemedText>
        </ScreenSection>

        <ScreenSection>
          <SectionHeader title="Exercise List" action={<ExerciseListMenu />} />

          {exercises.length > 0 ? (
            <View className="gap-3">
              {exercises.map((workoutExercise) => (
                <DisplayWorkoutExerciseSection
                  key={workoutExercise.id}
                  exercise={workoutExercise}
                />
              ))}
            </View>
          ) : (
            <ContentFeedback
              icon="exercise"
              title="No exercises yet"
              subtitle="This workout doesn't have any exercises yet."
            />
          )}
        </ScreenSection>
      </View>
    </PageLayout>
  );
}
