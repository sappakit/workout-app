import { PageLayout } from "@/components/layout/PageLayout";
import { SectionHeaderSkeleton } from "@/components/loading/SectionHeaderSkeleton";
import { SkeletonPlaceholderV2 } from "@/components/loading/SkeletonPlaceholderV2";
import { View } from "react-native";

export function EditPlanSkeleton() {
  const footer = (
    <>
      <SkeletonPlaceholderV2
        containerClassName="h-12 flex-1"
        skeletonClassName="rounded-xl"
      />

      <SkeletonPlaceholderV2
        containerClassName="h-12 w-12"
        skeletonClassName="rounded-xl"
      />
    </>
  );

  return (
    <PageLayout
      header={{
        props: {
          variant: "title",
          title: "Edit Plan",
          showBackButton: true,
        },
      }}
      stickyFooter={footer}
    >
      <View className="gap-4">
        <PlanDetailSkeleton />

        <ExerciseListSkeleton />
      </View>
    </PageLayout>
  );
}

function PlanDetailSkeleton() {
  return (
    <View className="gap-2">
      <SectionHeaderSkeleton titleWidthClassName="w-20" />

      <FormControlSkeleton />

      <FormControlSkeleton />

      <View className="gap-2">
        <FormLabelSkeleton />

        <CheckboxSkeleton />

        <SkeletonPlaceholderV2
          containerClassName="h-10 w-full"
          skeletonClassName="rounded-lg"
        />

        <View className="flex-row flex-wrap gap-2">
          <SkeletonPlaceholderV2
            containerClassName="h-7 w-24"
            skeletonClassName="rounded-full"
          />

          <SkeletonPlaceholderV2
            containerClassName="h-7 w-20"
            skeletonClassName="rounded-full"
          />

          <SkeletonPlaceholderV2
            containerClassName="h-7 w-28"
            skeletonClassName="rounded-full"
          />
        </View>
      </View>

      <View className="gap-2">
        <FormLabelSkeleton />

        <CheckboxSkeleton />

        <SkeletonPlaceholderV2
          containerClassName="h-10 w-full"
          skeletonClassName="rounded-lg"
        />
      </View>
    </View>
  );
}

function FormControlSkeleton() {
  return (
    <View className="gap-2">
      <FormLabelSkeleton />

      <SkeletonPlaceholderV2
        containerClassName="h-10 w-full"
        skeletonClassName="rounded-lg"
      />
    </View>
  );
}

function FormLabelSkeleton() {
  return (
    <SkeletonPlaceholderV2
      containerClassName="h-5 w-28"
      skeletonClassName="rounded-md"
    />
  );
}

function CheckboxSkeleton() {
  return (
    <View className="flex-row items-center gap-3">
      <SkeletonPlaceholderV2
        containerClassName="h-6 w-6"
        skeletonClassName="rounded-md"
      />

      <SkeletonPlaceholderV2
        containerClassName="h-5 w-24"
        skeletonClassName="rounded-md"
      />
    </View>
  );
}

function ExerciseListSkeleton() {
  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <SectionHeaderSkeleton titleWidthClassName="w-32" />

        <SkeletonPlaceholderV2
          containerClassName="h-7 w-7"
          skeletonClassName="rounded-lg"
        />
      </View>

      <View className="rounded-2xl bg-card p-4">
        <View className="flex-row items-center gap-3">
          <SkeletonPlaceholderV2
            containerClassName="h-14 w-14"
            skeletonClassName="rounded-full"
          />

          <View className="flex-1 gap-2">
            <SkeletonPlaceholderV2
              containerClassName="h-5 w-32"
              skeletonClassName="rounded-md"
            />

            <SkeletonPlaceholderV2
              containerClassName="h-4 w-14"
              skeletonClassName="rounded-md"
            />
          </View>

          <SkeletonPlaceholderV2
            containerClassName="h-9 w-9"
            skeletonClassName="rounded-full"
          />
        </View>

        <View className="mt-5 gap-4">
          <SkeletonPlaceholderV2
            containerClassName="h-5 w-20"
            skeletonClassName="rounded-md"
          />

          <View className="flex-row gap-2">
            <SkeletonPlaceholderV2
              containerClassName="h-5 w-12"
              skeletonClassName="rounded-md"
            />

            <SkeletonPlaceholderV2
              containerClassName="h-5 flex-1"
              skeletonClassName="rounded-md"
            />

            <SkeletonPlaceholderV2
              containerClassName="h-5 flex-1"
              skeletonClassName="rounded-md"
            />
          </View>

          <View className="flex-row items-center gap-2">
            <SkeletonPlaceholderV2
              containerClassName="h-5 w-12"
              skeletonClassName="rounded-md"
            />

            <SkeletonPlaceholderV2
              containerClassName="h-10 flex-1"
              skeletonClassName="rounded-lg"
            />

            <SkeletonPlaceholderV2
              containerClassName="h-10 flex-1"
              skeletonClassName="rounded-lg"
            />
          </View>
        </View>
      </View>
    </View>
  );
}
