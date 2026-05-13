import { userApi } from "@/app/api/user.api";
import EditProfileContent from "@/components/edit-profile/EditProfileContent";
import { useGetQuery } from "@/lib/query/useGetQuery";
import { userQueryKeys } from "@/lib/user/keys";
import { User } from "@/types/user/response/user.types";

export default function EditProfileScreen() {
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

  return <EditProfileContent data={data} />;
}
