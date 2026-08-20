import { AppButton } from "@/components/custom-ui/app-button";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { AuthHeader } from "../../ui/AuthHeader";

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
          icon={{
            name: "sign-in",
            size: "sm",
          }}
          onPress={() => router.replace("/(auth)/sign-in")}
        />
      </View>
    </View>
  );
}
