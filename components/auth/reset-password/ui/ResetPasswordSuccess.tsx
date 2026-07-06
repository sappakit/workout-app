import { AppButton } from "@/components/custom-ui/AppButton";
import { useRouter } from "expo-router";
import { LogIn } from "lucide-react-native";
import { View } from "react-native";
import { AuthHeader } from "../../forgot-password/ui/AuthHeader";

export function ResetPasswordSuccess() {
  const router = useRouter();

  return (
    <View>
      <AuthHeader
        title="Password Updated"
        subtitle="Your password has been changed successfully. You can now sign in with your new password."
      />

      <View className="mt-10">
        <AppButton
          title="Back to Sign In"
          variant="primary"
          icon={LogIn}
          textClassName="font-medium"
          onPress={() => router.replace("/(auth)/sign-in")}
        />
      </View>
    </View>
  );
}
