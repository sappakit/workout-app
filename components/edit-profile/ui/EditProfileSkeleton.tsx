import { PageLayout } from "@/components/layout/PageLayout";
import { SkeletonPlaceholderV2 } from "@/components/loading/SkeletonPlaceholderV2";
import { TextSkeleton } from "@/components/loading/TextSkeleton";
import { View } from "react-native";

export function EditProfileSkeleton() {
  return (
    <PageLayout
      disableContentPadding={{ top: true }}
      header={{
        props: {
          variant: "title",
          title: "Edit Profile",
          showBackButton: true,
        },
      }}
    >
      <View className="gap-6">
        {/* Avatar */}
        <View className="items-center">
          <View className="p-6">
            <SkeletonPlaceholderV2
              containerClassName="h-24 w-24"
              skeletonClassName="rounded-full"
            />
          </View>
        </View>

        {/* Form fields */}
        <View className="gap-4">
          <EditProfileFieldSkeleton labelWidthClassName="w-24" />

          <EditProfileFieldSkeleton labelWidthClassName="w-24" />

          <EditProfileFieldSkeleton labelWidthClassName="w-12" />

          <EditProfileFieldSkeleton labelWidthClassName="w-28" />
        </View>
      </View>
    </PageLayout>
  );
}

type EditProfileFieldSkeletonProps = {
  labelWidthClassName?: string;
};

function EditProfileFieldSkeleton({
  labelWidthClassName = "w-24",
}: EditProfileFieldSkeletonProps) {
  return (
    <View className="gap-2">
      <TextSkeleton type="label" className={labelWidthClassName} />

      <SkeletonPlaceholderV2
        containerClassName="h-10 w-full"
        skeletonClassName="rounded-lg"
      />
    </View>
  );
}
