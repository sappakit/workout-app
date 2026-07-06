import { authApi } from "@/app/api/auth.api";
import ResetPasswordContent from "@/components/auth/reset-password/ResetPasswordContent";
import { ResetPasswordSkeleton } from "@/components/auth/reset-password/ui/ResetPasswordSkeleton";
import { ErrorState } from "@/components/state/ErrorState";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token?: string }>();

  const hasToken = !!token;

  const { isLoading, isError, error, refetch } = useQuery({
    queryKey: ["verify-reset-password-token", token],
    enabled: hasToken,
    retry: false,
    queryFn: async () => {
      return api.post(authApi.verifyResetPasswordToken(), {
        token,
      });
    },
  });

  if (!hasToken) {
    return (
      <ErrorState
        title="Reset link is missing"
        message="This password reset link doesn't include a valid token. Please request a new reset link."
        actionLabel="Request New Link"
        onRetry={() => router.replace("/(auth)/forgot-password")}
        showHomeButton={false}
      />
    );
  }

  if (isLoading) {
    return <ResetPasswordSkeleton />;
  }

  if (isError) {
    const status = (error as AxiosError)?.response?.status;

    if (status === 400) {
      return (
        <ErrorState
          title="Reset link expired"
          message="This password reset link is invalid or has expired. Please request a new reset link."
          actionLabel="Request New Link"
          onRetry={() => router.replace("/(auth)/forgot-password")}
          showHomeButton={false}
        />
      );
    }

    return (
      <ErrorState
        title="Unable to verify reset link"
        message="We're having trouble verifying your reset link right now. Please try again."
        onRetry={refetch}
        showHomeButton={false}
      />
    );
  }

  return <ResetPasswordContent token={token} />;
}
