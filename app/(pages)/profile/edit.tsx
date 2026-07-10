import EditProfileContent from "@/components/edit-profile/EditProfileContent";
import { EditProfileSkeleton } from "@/components/edit-profile/ui/EditProfileSkeleton";
import { EmptyState } from "@/components/state/EmptyState";
import { ErrorState } from "@/components/state/ErrorState";
import { userApi } from "@/lib/api/user.api";
import { useGetQuery } from "@/lib/query/useGetQuery";
import { userQueryKeys } from "@/lib/user/keys";
import { User } from "@/types/user/response/user.types";

export default function EditProfileScreen() {
  const url = userApi.getMyProfile();

  const { data, isLoading, isError, refetch } = useGetQuery<User>(
    userQueryKeys.me,
    url,
  );

  if (isLoading) return <EditProfileSkeleton />;

  if (isError)
    return (
      <ErrorState
        primaryAction={{
          onPress: refetch,
        }}
      />
    );

  if (!data) return <EmptyState />;

  return <EditProfileContent data={data} />;
}
