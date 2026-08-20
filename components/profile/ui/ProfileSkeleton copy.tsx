import { PageLayout } from "@/components/layout/PageLayout";
import { SkeletonPlaceholderV2 } from "@/components/loading/SkeletonPlaceholderV2";
import { TextSkeleton } from "@/components/loading/TextSkeleton";
import { cn } from "@/lib/utils";
import { View } from "react-native";

export function ProfileSkeleton() {
  return (
    <PageLayout
      disableContentPadding={{ top: true }}
      header={{
        props: {
          variant: "title",
          title: "Profile",
        },
      }}
      scrollable={false}
    >
      <View className="gap-4">
        {/* Profile header */}
        <View className="items-center">
          <View className="p-6">
            <SkeletonPlaceholderV2
              containerClassName="h-24 w-24"
              skeletonClassName="rounded-full"
            />
          </View>

          <View className="items-center gap-3">
            <SkeletonPlaceholderV2
              containerClassName="h-5 w-28"
              skeletonClassName="rounded-full"
            />

            <SkeletonPlaceholderV2
              containerClassName="h-4 w-40"
              skeletonClassName="rounded-full"
            />
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row gap-2">
          <SkeletonPlaceholderV2
            containerClassName="h-20 flex-1"
            skeletonClassName="rounded-2xl"
          />

          <SkeletonPlaceholderV2
            containerClassName="h-20 flex-1"
            skeletonClassName="rounded-2xl"
          />

          <SkeletonPlaceholderV2
            containerClassName="h-20 flex-1"
            skeletonClassName="rounded-2xl"
          />
        </View>

        {/* Menu sections */}
        <View className="gap-4">
          <ProfileMenuSectionSkeleton
            labelClassName="w-24"
            aspectRatio="aspect-[1.78]"
          />

          <ProfileMenuSectionSkeleton
            labelClassName="w-16"
            aspectRatio="aspect-[3.55]"
          />

          <ProfileMenuSectionSkeleton
            labelClassName="w-12"
            aspectRatio="aspect-[3.55]"
          />

          <SkeletonPlaceholderV2
            containerClassName="aspect-[7.1] w-full"
            skeletonClassName="rounded-2xl"
          />
        </View>
      </View>
    </PageLayout>
  );
}

type ProfileMenuSectionSkeletonProps = {
  aspectRatio?: string;
  labelClassName?: string;
};

function ProfileMenuSectionSkeleton({
  aspectRatio = "",
  labelClassName = "w-24",
}: ProfileMenuSectionSkeletonProps) {
  return (
    <View className="gap-2">
      <TextSkeleton type="label" className={labelClassName} />

      <SkeletonPlaceholderV2
        containerClassName={cn("w-full", aspectRatio)}
        skeletonClassName="rounded-2xl"
      />
    </View>
  );
}
