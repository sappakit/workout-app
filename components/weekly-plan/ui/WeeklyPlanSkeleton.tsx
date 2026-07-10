import { PageLayout } from "@/components/layout/PageLayout";
import { SkeletonPlaceholder } from "@/components/loading/SkeletonPlaceholder";
import { TextSkeleton } from "@/components/loading/TextSkeleton";
import { ScrollView, View } from "react-native";

export function WeeklyPlanSkeleton() {
  return (
    <PageLayout
      header={{
        props: {
          variant: "title",
          title: "Weekly Plan",
          showBackButton: true,
        },
      }}
    >
      <View className="gap-4">
        <SkeletonPlaceholder className="aspect-[2.75] w-full rounded-3xl" />

        <View className="gap-3">
          <View className="gap-2">
            <TextSkeleton type="subtitle" className="w-28" />
            <TextSkeleton type="small" className="w-64" />
          </View>

          <ScrollView
            horizontal
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-3"
          >
            {Array.from({ length: 7 }).map((_, index) => (
              <DayPillSkeleton key={index} />
            ))}
          </ScrollView>
        </View>

        <SkeletonPlaceholder className="aspect-[2.25] w-full rounded-3xl" />
      </View>
    </PageLayout>
  );
}

function DayPillSkeleton() {
  return <SkeletonPlaceholder className="aspect-[0.9] w-20 rounded-3xl" />;
}
