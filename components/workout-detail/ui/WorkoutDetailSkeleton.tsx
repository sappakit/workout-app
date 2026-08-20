import {
  CONTENT_PADDING_HORIZONTAL,
  CONTENT_PADDING_TOP,
  PageLayout,
} from "@/components/layout/PageLayout";
import { ScreenSection } from "@/components/layout/ScreenSection";
import { SectionHeaderSkeleton } from "@/components/loading/SectionHeaderSkeleton";
import { SkeletonPlaceholderV2 } from "@/components/loading/SkeletonPlaceholderV2";
import { TextSkeleton } from "@/components/loading/TextSkeleton";
import { View } from "react-native";

export function WorkoutDetailSkeleton() {
  return (
    <PageLayout
      scrollable={false}
      includeInsets={{ bottom: true }}
      header={{
        props: {
          variant: "title",
          title: "Workout",
          showBackButton: true,
        },
        scrollEffect: {
          overlay: true,
        },
      }}
    >
      <View className="gap-4">
        <SkeletonPlaceholderV2
          containerClassName="h-64"
          skeletonClassName="rounded-none rounded-b-2xl"
          containerStyle={{
            marginHorizontal: -CONTENT_PADDING_HORIZONTAL,
            marginTop: -CONTENT_PADDING_TOP,
          }}
        />

        <WorkoutTitleSkeleton />

        <WorkoutDescriptionSkeleton />

        <WorkoutExerciseListSkeleton />
      </View>
    </PageLayout>
  );
}

function WorkoutTitleSkeleton() {
  return (
    <View className="gap-2">
      <TextSkeleton type="small" className="w-32" />

      <TextSkeleton type="title" className="w-48" />
    </View>
  );
}

function WorkoutDescriptionSkeleton() {
  return (
    <ScreenSection>
      <SectionHeaderSkeleton titleWidthClassName="w-28" />

      <View className="gap-2">
        <TextSkeleton type="body" />

        <TextSkeleton type="body" className="w-3/4" />
      </View>
    </ScreenSection>
  );
}

function WorkoutExerciseListSkeleton() {
  return (
    <ScreenSection>
      <SectionHeaderSkeleton titleWidthClassName="w-32" />

      <View className="gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <WorkoutExerciseCardSkeleton key={index} />
        ))}
      </View>
    </ScreenSection>
  );
}

function WorkoutExerciseCardSkeleton() {
  return (
    <SkeletonPlaceholderV2
      containerClassName="aspect-[4.5] w-full"
      skeletonClassName="rounded-2xl"
    />
  );
}
