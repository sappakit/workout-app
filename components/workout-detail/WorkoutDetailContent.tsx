import { PageLayout } from "@/components/layout/PageLayout";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { WorkoutResponse } from "@/types/workout/response/workout.types";
import { View } from "react-native";
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
  const { colors } = useAppTheme();

  console.log(data);

  const exercises = data.workoutExercises;

  return (
    <PageLayout
      disableContentPadding
      headerProps={{
        variant: "title",
        title: `${data.name}`,
        showBackButton: true,
      }}
    >
      <DetailHeroImage imageUrl={data.imageUrl} />

      {/* <View className="px-4 pt-4">
        <View
          className="overflow-hidden rounded-2xl"
          style={{ backgroundColor: colors.app.cardPrimary }}
        >
          <View className="relative items-center justify-center p-4">
            <ThemedText type="small" variant="primary">
              {workoutTypeName}
            </ThemedText>

            <ThemedText type="title" variant="accent">
              {data.name}
            </ThemedText>
          </View>
        </View>
      </View> */}

      <View className="gap-4 p-4">
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
          <SectionHeader title="Exercise lists" />

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
