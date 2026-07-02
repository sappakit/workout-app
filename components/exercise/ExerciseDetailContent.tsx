import { PageLayout } from "@/components/layout/PageLayout";
import { ScreenSection } from "@/components/layout/ScreenSection";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { ThemedText } from "@/components/themed-text";
import {
  Exercise,
  ExerciseTypeLabel,
} from "@/types/workout/response/exercise.types";
import { View } from "react-native";
import { DetailHeroImage } from "../workout-detail/ui/DetailHeroImage";

interface ExerciseDetailContentProps {
  data: Exercise;
}

export default function ExerciseDetailContent({
  data,
}: ExerciseDetailContentProps) {
  const muscleNames =
    data.muscles?.map((item) => item.muscle.name).filter(Boolean) ?? [];

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
            {ExerciseTypeLabel[data.exerciseType]}
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
          <SectionHeader title="Muscles" />

          <ThemedText type="default" variant="primary">
            {muscleNames.length > 0
              ? muscleNames.join(", ")
              : "No muscles yet."}
          </ThemedText>
        </ScreenSection>

        <ScreenSection>
          <SectionHeader title="How to perform" />

          <ThemedText type="default" variant="primary">
            {data.howToPerform ?? "No instructions yet."}
          </ThemedText>
        </ScreenSection>
      </View>
    </PageLayout>
  );
}
