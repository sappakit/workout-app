import {
  CONTENT_PADDING_HORIZONTAL,
  CONTENT_PADDING_TOP,
  PageLayout,
} from "@/components/layout/PageLayout";
import { ScreenSection } from "@/components/layout/ScreenSection";
import { SectionHeaderSkeleton } from "@/components/loading/SectionHeaderSkeleton";
import { SkeletonPlaceholder } from "@/components/loading/SkeletonPlaceholder";
import { TextSkeleton } from "@/components/loading/TextSkeleton";
import { View } from "react-native";

export function ExerciseDetailSkeleton() {
  return (
    <PageLayout
      scrollable={false}
      includeInsets={{ bottom: true }}
      header={{
        props: {
          variant: "title",
          title: "Exercise",
          showBackButton: true,
        },
        scrollEffect: {
          overlay: true,
        },
      }}
    >
      <View className="gap-4">
        <SkeletonPlaceholder
          containerClassName="h-64"
          skeletonClassName="rounded-none rounded-b-2xl"
          containerStyle={{
            marginHorizontal: -CONTENT_PADDING_HORIZONTAL,
            marginTop: -CONTENT_PADDING_TOP,
          }}
        />

        <ExerciseTitleSkeleton />

        <ExerciseDescriptionSkeleton />

        <ExerciseMusclesSkeleton />

        <ExerciseInstructionsSkeleton />
      </View>
    </PageLayout>
  );
}

function ExerciseTitleSkeleton() {
  return (
    <View className="gap-2">
      <TextSkeleton type="small" className="w-24" />

      <TextSkeleton type="title" className="w-56" />
    </View>
  );
}

function ExerciseDescriptionSkeleton() {
  return (
    <ScreenSection>
      <SectionHeaderSkeleton titleWidthClassName="w-28" />

      <View className="gap-2">
        <TextSkeleton type="body" />

        <TextSkeleton type="body" />

        <TextSkeleton type="body" className="w-3/4" />
      </View>
    </ScreenSection>
  );
}

function ExerciseMusclesSkeleton() {
  return (
    <ScreenSection>
      <SectionHeaderSkeleton titleWidthClassName="w-20" />

      <TextSkeleton type="body" className="w-48" />
    </ScreenSection>
  );
}

function ExerciseInstructionsSkeleton() {
  return (
    <ScreenSection>
      <SectionHeaderSkeleton titleWidthClassName="w-36" />

      <View className="gap-2">
        <InstructionSkeleton />

        <InstructionSkeleton />

        <InstructionSkeleton />
      </View>
    </ScreenSection>
  );
}

function InstructionSkeleton() {
  return (
    <View className="flex-row items-start gap-2">
      <TextSkeleton type="body" className="w-4" />

      <View className="flex-1 gap-2">
        <TextSkeleton type="body" />

        <TextSkeleton type="body" className="w-4/5" />
      </View>
    </View>
  );
}
