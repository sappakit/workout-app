import { AppButton } from "@/components/custom-ui/AppButton";
import { useRouter } from "expo-router";
import { Mail, Send } from "lucide-react-native";
import { View } from "react-native";
import { AuthHeader } from "../../ui/AuthHeader";

interface ForgotPasswordSuccessProps {
  email: string;
  loading: boolean;
  onResend: () => void;
}

export function ForgotPasswordSuccess({
  email,
  loading,
  onResend,
}: ForgotPasswordSuccessProps) {
  const router = useRouter();

  return (
    <View className="gap-6">
      <AuthHeader
        title="Check your Email"
        subtitle={`If an account exists, reset instructions were sent to ${maskEmail(email)}. Check Spam or send another email if needed.`}
      />

      <View className="gap-3">
        <AppButton
          title="Back to Sign In"
          variant="primary"
          icon={Mail}
          onPress={() => router.back()}
        />

        <AppButton
          title="Send another email"
          variant="secondary"
          icon={Send}
          loading={loading}
          disabled={loading}
          onPress={onResend}
        />
      </View>
    </View>
  );
}

function maskEmail(email: string) {
  const [name, domain] = email.split("@");

  if (!name || !domain) return email;

  const visibleName = name.slice(0, Math.min(2, name.length));
  return `${visibleName}••••@${domain}`;
}
