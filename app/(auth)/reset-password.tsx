import ResetPasswordContent from "@/components/auth/reset-password/ResetPasswordContent";
import { ResetPasswordSkeleton } from "@/components/auth/reset-password/ui/ResetPasswordSkeleton";
import { ErrorState } from "@/components/state/ErrorState";
import { authApi } from "@/lib/api/auth.api";
import { api } from "@/lib/api/client";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LogIn, MailPlus } from "lucide-react-native";

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
        primaryAction={{
          label: "Resend Email",
          icon: MailPlus,
          onPress: () => router.replace("/(auth)/forgot-password"),
        }}
        secondaryAction={{
          label: "Sign In",
          icon: LogIn,
          onPress: () => router.replace("/(auth)/sign-in"),
        }}
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
          primaryAction={{
            label: "Resend Email",
            icon: MailPlus,
            onPress: () => router.replace("/(auth)/forgot-password"),
          }}
          secondaryAction={{
            label: "Sign In",
            icon: LogIn,
            onPress: () => router.replace("/(auth)/sign-in"),
          }}
        />
      );
    }

    return (
      <ErrorState
        title="Unable to verify reset link"
        message="We're having trouble verifying your reset link right now. Please try again."
        primaryAction={{
          onPress: refetch,
        }}
        secondaryAction={{
          label: "Sign In",
          icon: LogIn,
          onPress: () => router.replace("/(auth)/sign-in"),
        }}
      />
    );
  }

  return <ResetPasswordContent token={token} />;
}
