import { PageLayout } from "@/components/layout/PageLayout";
import { SectionHeaderSkeleton } from "@/components/loading/SectionHeaderSkeleton";
import { SkeletonPlaceholder } from "@/components/loading/SkeletonPlaceholder";
import { View } from "react-native";

export function EditPlanSkeleton() {
  const footer = (
    <>
      <SkeletonPlaceholder
        containerClassName="h-12 flex-1"
        skeletonClassName="rounded-xl"
      />

      <SkeletonPlaceholder
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

        <SkeletonPlaceholder
          containerClassName="h-10 w-full"
          skeletonClassName="rounded-lg"
        />

        <View className="flex-row flex-wrap gap-2">
          <SkeletonPlaceholder
            containerClassName="h-7 w-24"
            skeletonClassName="rounded-full"
          />

          <SkeletonPlaceholder
            containerClassName="h-7 w-20"
            skeletonClassName="rounded-full"
          />

          <SkeletonPlaceholder
            containerClassName="h-7 w-28"
            skeletonClassName="rounded-full"
          />
        </View>
      </View>

      <View className="gap-2">
        <FormLabelSkeleton />

        <CheckboxSkeleton />

        <SkeletonPlaceholder
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

      <SkeletonPlaceholder
        containerClassName="h-10 w-full"
        skeletonClassName="rounded-lg"
      />
    </View>
  );
}

function FormLabelSkeleton() {
  return (
    <SkeletonPlaceholder
      containerClassName="h-5 w-28"
      skeletonClassName="rounded-md"
    />
  );
}

function CheckboxSkeleton() {
  return (
    <View className="flex-row items-center gap-3">
      <SkeletonPlaceholder
        containerClassName="h-6 w-6"
        skeletonClassName="rounded-md"
      />

      <SkeletonPlaceholder
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

        <SkeletonPlaceholder
          containerClassName="h-7 w-7"
          skeletonClassName="rounded-lg"
        />
      </View>

      <View className="rounded-2xl bg-card p-4">
        <View className="flex-row items-center gap-3">
          <SkeletonPlaceholder
            containerClassName="h-14 w-14"
            skeletonClassName="rounded-full"
          />

          <View className="flex-1 gap-2">
            <SkeletonPlaceholder
              containerClassName="h-5 w-32"
              skeletonClassName="rounded-md"
            />

            <SkeletonPlaceholder
              containerClassName="h-4 w-14"
              skeletonClassName="rounded-md"
            />
          </View>

          <SkeletonPlaceholder
            containerClassName="h-9 w-9"
            skeletonClassName="rounded-full"
          />
        </View>

        <View className="mt-5 gap-4">
          <SkeletonPlaceholder
            containerClassName="h-5 w-20"
            skeletonClassName="rounded-md"
          />

          <View className="flex-row gap-2">
            <SkeletonPlaceholder
              containerClassName="h-5 w-12"
              skeletonClassName="rounded-md"
            />

            <SkeletonPlaceholder
              containerClassName="h-5 flex-1"
              skeletonClassName="rounded-md"
            />

            <SkeletonPlaceholder
              containerClassName="h-5 flex-1"
              skeletonClassName="rounded-md"
            />
          </View>

          <View className="flex-row items-center gap-2">
            <SkeletonPlaceholder
              containerClassName="h-5 w-12"
              skeletonClassName="rounded-md"
            />

            <SkeletonPlaceholder
              containerClassName="h-10 flex-1"
              skeletonClassName="rounded-lg"
            />

            <SkeletonPlaceholder
              containerClassName="h-10 flex-1"
              skeletonClassName="rounded-lg"
            />
          </View>
        </View>
      </View>
    </View>
  );
}
