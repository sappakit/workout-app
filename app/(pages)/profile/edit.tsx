import EditProfileContent from "@/components/edit-profile/EditProfileContent";
import { EditProfileSkeleton } from "@/components/edit-profile/ui/EditProfileSkeleton";
import { EmptyState } from "@/components/state/EmptyState";
import { ErrorState } from "@/components/state/ErrorState";
import { userApi } from "@/lib/api/user.api";
import { useGetQuery } from "@/lib/query/useGetQuery";
import { userQueryKeys } from "@/lib/user/keys";
import type { User } from "@/types/user/response/user.types";

export default function EditProfileScreen() {
  const url = userApi.getMyProfile();

  const { data, isLoading, isError, refetch } = useGetQuery<User>(
    userQueryKeys.me,
    url,
  );

  if (isLoading) {
    return <EditProfileSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        icon="profile"
        title="Couldn't load profile"
        message="We couldn't load your profile information. Check your connection and try again."
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

  return <EditProfileContent data={data} />;
}
