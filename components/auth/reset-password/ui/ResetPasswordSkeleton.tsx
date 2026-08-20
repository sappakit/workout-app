import { PageLayout } from "@/components/layout/PageLayout";
import { SkeletonPlaceholderV2 } from "@/components/loading/SkeletonPlaceholderV2";
import { TextSkeleton } from "@/components/loading/TextSkeleton";
import { View } from "react-native";

export function ResetPasswordSkeleton() {
  return (
    <PageLayout includeInsets scrollable={false}>
      {/* Logo */}
      <View className="items-center py-2">
        <SkeletonPlaceholderV2
          containerClassName="h-36 w-36"
          skeletonClassName="rounded-3xl"
        />
      </View>

      {/* Header */}
      <View className="mt-4 items-center gap-3">
        <TextSkeleton type="title" className="w-36" />

        <TextSkeleton type="small" className="w-72" />
      </View>

      {/* Form */}
      <View className="mt-7 gap-4">
        {/* Password */}
        <View className="gap-2">
          <TextSkeleton type="label" className="w-28" />

          <SkeletonPlaceholderV2
            containerClassName="h-12 w-full"
            skeletonClassName="rounded-lg"
          />
        </View>

        {/* Confirm Password */}
        <View className="gap-2">
          <TextSkeleton type="label" className="w-36" />

          <SkeletonPlaceholderV2
            containerClassName="h-12 w-full"
            skeletonClassName="rounded-lg"
          />
        </View>

        {/* Reset button */}
        <View className="mt-2">
          <SkeletonPlaceholderV2
            containerClassName="h-12 w-full"
            skeletonClassName="rounded-xl"
          />
        </View>

        {/* Back button */}
        <View className="items-center">
          <SkeletonPlaceholderV2
            containerClassName="h-9 w-32"
            skeletonClassName="rounded-lg"
          />
        </View>
      </View>
    </PageLayout>
  );
}
