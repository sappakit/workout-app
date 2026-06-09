import { userApi } from "@/app/api/user.api";
import ProfileContent from "@/components/profile/ProfileContent";
import { ProfileSkeleton } from "@/components/profile/ui/ProfileSkeleton";
import { EmptyState } from "@/components/state/EmptyState";
import { ErrorState } from "@/components/state/ErrorState";
import { useGetQuery } from "@/lib/query/useGetQuery";
import { userQueryKeys } from "@/lib/user/keys";
import { User } from "@/types/user/response/user.types";

export default function ProfileScreen() {
  const url = userApi.getMyProfile();

  const { data, isLoading, isError, refetch } = useGetQuery<User>(
    userQueryKeys.me,
    url,
  );

  if (isLoading) return <ProfileSkeleton />;

  if (isError) return <ErrorState onRetry={refetch} />;

  if (!data) return <EmptyState />;

  return <ProfileContent data={data} />;
}
