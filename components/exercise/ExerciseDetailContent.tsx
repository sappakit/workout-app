import { ThemedText } from "@/components/custom-ui/themed-text";
import { PageLayout } from "@/components/layout/PageLayout";
import { ScreenSection } from "@/components/layout/ScreenSection";
import { SectionHeader } from "@/components/layout/SectionHeader";
import type { Exercise } from "@/types/workout/response/exercise.types";
import { View } from "react-native";
import { DetailHeroImage } from "../workout-detail/ui/DetailHeroImage";

interface ExerciseDetailContentProps {
  data: Exercise;
}

export default function ExerciseDetailContent({
  data,
}: ExerciseDetailContentProps) {
  const primaryMedia =
    data.media?.find((media) => media.isPrimary) ?? data.media?.[0];

  const imageUrl = primaryMedia?.url ?? null;

  const muscleNames =
    data.muscles
      ?.map((item) => item.muscle?.name)
      .filter((name): name is string => Boolean(name)) ?? [];

  const exerciseTypeLabel = data.category?.name ?? "Exercise";

  const instructions = data.howToPerform ?? [];

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
        <DetailHeroImage imageUrl={imageUrl} />

        <View className="justify-center">
          <ThemedText type="small" tone="muted">
            {exerciseTypeLabel}
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
          <SectionHeader title="Muscles" />

          <ThemedText type="body" tone="muted">
            {muscleNames.length > 0
              ? muscleNames.join(", ")
              : data.muscles
                ? "No muscles yet."
                : "Muscle information was not included."}
          </ThemedText>
        </ScreenSection>

        <ScreenSection>
          <SectionHeader title="How to perform" />

          {instructions.length > 0 ? (
            <View className="gap-2">
              {instructions.map((instruction, index) => (
                <View
                  key={`${index}-${instruction}`}
                  className="flex-row items-start gap-2"
                >
                  <ThemedText type="body" tone="muted">
                    {index + 1}.
                  </ThemedText>

                  <ThemedText type="body" tone="muted" className="flex-1">
                    {instruction}
                  </ThemedText>
                </View>
              ))}
            </View>
          ) : (
            <ThemedText type="body" tone="muted">
              No instructions yet.
            </ThemedText>
          )}
        </ScreenSection>
      </View>
    </PageLayout>
  );
}
