import { userApi } from "@/app/api/user.api";
import ProfileContent from "@/components/profile/ProfileContent";
import { useGetQuery } from "@/lib/query/useGetQuery";
import { userQueryKeys } from "@/lib/user/keys";
import { User } from "@/types/user/response/user.types";

export default function ProfileScreen() {
  const url = userApi.getMyProfile();

  const { data, isLoading, isError } = useGetQuery<User>(userQueryKeys.me, url);

  // TODO: add loading/error
  if (isLoading) return null;
  if (isError || !data) return null;

  // if (isLoading) return <WorkoutSkeleton />;

  // if (isError || !data)
  //   return (
  //     <ErrorState
  //       title="Failed to Load Workout"
  //       message="We couldn't load today's workout."
  //       onRetry={refetch}
  //     />
  //   );

  return <ProfileContent data={data} />;
}
