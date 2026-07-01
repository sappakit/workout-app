import { PageLayout } from "@/components/layout/PageLayout";
import { SkeletonPlaceholder } from "@/components/loading/SkeletonPlaceholder";
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
            <SkeletonPlaceholder className="h-24 w-24 rounded-full" />
          </View>
        </View>

        {/* Form fields */}
        <View className="gap-4">
          <EditProfileFieldSkeleton labelClassName="w-24" />
          <EditProfileFieldSkeleton labelClassName="w-28" />
          <EditProfileFieldSkeleton labelClassName="w-32" />
          <EditProfileFieldSkeleton labelClassName="w-20" />
        </View>
      </View>
    </PageLayout>
  );
}

type EditProfileFieldSkeletonProps = {
  labelClassName?: string;
};

function EditProfileFieldSkeleton({
  labelClassName = "w-24",
}: EditProfileFieldSkeletonProps) {
  return (
    <View className="gap-2">
      <TextSkeleton type="default" className={labelClassName} />
      <SkeletonPlaceholder className="h-12 w-full rounded-2xl" />
    </View>
  );
}
