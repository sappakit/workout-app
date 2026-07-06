import { AppButton } from "@/components/custom-ui/AppButton";
import { useRouter } from "expo-router";
import { Mail } from "lucide-react-native";
import { View } from "react-native";
import { AuthHeader } from "./AuthHeader";

export function ForgotPasswordSuccess() {
  const router = useRouter();

  return (
    <View className="gap-6">
      <AuthHeader
        title="Check your Email"
        subtitle="If an account exists for this email, we've sent password reset instructions."
      />

      <AppButton
        title="Back to Sign In"
        variant="primary"
        icon={Mail}
        onPress={() => router.back()}
      />
    </View>
  );
}
