import { PageLayout } from "@/components/layout/PageLayout";
import { SkeletonPlaceholder } from "@/components/loading/SkeletonPlaceholder";
import { TextSkeleton } from "@/components/loading/TextSkeleton";
import { View } from "react-native";

export function ResetPasswordSkeleton() {
  return (
    <PageLayout>
      {/* Logo */}
      <View className="items-center">
        <SkeletonPlaceholder className="h-40 w-40 rounded-3xl" />
      </View>

      {/* Title */}
      <View className="mt-4 items-center gap-3">
        <TextSkeleton type="title" className="w-36" />
        <TextSkeleton type="default" className="w-72" />
      </View>

      {/* Form */}
      <View className="mt-4">
        {/* Password */}
        <View className="mt-3 gap-2">
          <TextSkeleton type="default" className="w-28" />
          <SkeletonPlaceholder className="h-12 w-full rounded-xl" />
        </View>

        {/* Confirm Password */}
        <View className="mt-4 gap-2">
          <TextSkeleton type="default" className="w-36" />
          <SkeletonPlaceholder className="h-12 w-full rounded-xl" />
        </View>

        {/* Button */}
        <View className="mt-6">
          <SkeletonPlaceholder className="h-12 w-full rounded-xl" />
        </View>

        {/* Back link */}
        <View className="mt-4 items-center">
          <TextSkeleton type="small" className="w-28" />
        </View>
      </View>
    </PageLayout>
  );
}
