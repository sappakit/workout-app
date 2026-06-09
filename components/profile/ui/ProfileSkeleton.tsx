import { PageLayout } from "@/components/layout/PageLayout";
import { SkeletonPlaceholder } from "@/components/loading/SkeletonPlaceholder";
import { TextSkeleton } from "@/components/loading/TextSkeleton";
import { View } from "react-native";

export function ProfileSkeleton() {
  return (
    <PageLayout
      topInset={0}
      headerProps={{
        variant: "title",
        title: "Profile",
      }}
    >
      <View className="gap-4">
        {/* Profile header */}
        <View className="items-center">
          <View className="p-6">
            <SkeletonPlaceholder className="h-24 w-24 rounded-full" />
          </View>

          <View className="items-center gap-3">
            <SkeletonPlaceholder className="h-5 w-28 rounded-full" />
            <SkeletonPlaceholder className="h-4 w-40 rounded-full" />
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row gap-2">
          <SkeletonPlaceholder className="h-20 flex-1 rounded-2xl" />
          <SkeletonPlaceholder className="h-20 flex-1 rounded-2xl" />
          <SkeletonPlaceholder className="h-20 flex-1 rounded-2xl" />
        </View>

        {/* Menu sections */}
        <View className="gap-4">
          <ProfileMenuSectionSkeleton labelClassName="w-24" itemCount={4} />
          <ProfileMenuSectionSkeleton labelClassName="w-16" itemCount={2} />
          <ProfileMenuSectionSkeleton labelClassName="w-12" itemCount={2} />

          <SkeletonPlaceholder className="h-14 w-full rounded-2xl" />
        </View>
      </View>
    </PageLayout>
  );
}

type ProfileMenuSectionSkeletonProps = {
  itemCount?: number;
  labelClassName?: string;
};

function ProfileMenuSectionSkeleton({
  itemCount = 1,
  labelClassName = "w-24",
}: ProfileMenuSectionSkeletonProps) {
  return (
    <View className="gap-2">
      <TextSkeleton type="default" className={labelClassName} />
      <SkeletonPlaceholder
        className="w-full rounded-2xl"
        style={{ height: 56 * itemCount }}
      />
    </View>
  );
}
