import ProfileContent from "@/components/profile/ProfileContent";
import { ProfileSkeleton } from "@/components/profile/ui/ProfileSkeleton";
import { EmptyState } from "@/components/state/EmptyState";
import { ErrorState } from "@/components/state/ErrorState";
import { userApi } from "@/lib/api/user.api";
import { useGetQuery } from "@/lib/query/useGetQuery";
import { userQueryKeys } from "@/lib/user/keys";
import type { User } from "@/types/user/response/user.types";

export default function ProfileScreen() {
  const url = userApi.getMyProfile();

  const { data, isLoading, isError, refetch } = useGetQuery<User>(
    userQueryKeys.me,
    url,
  );

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        primaryAction={{
          onPress: refetch,
        }}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        icon="profile"
        title="Profile unavailable"
        message="Your profile information is not available right now."
      />
    );
  }

  return <ProfileContent data={data} />;
}
