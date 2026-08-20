import { AppButton } from "@/components/custom-ui/app-button";
import { FormField } from "@/components/form/FormField";
import FormPasswordInput from "@/components/form/FormPasswordInput";
import type { ResetPasswordForm as ResetPasswordFormValues } from "@/schemas/auth.schema";
import { useRouter } from "expo-router";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { View } from "react-native";
import { AuthHeader } from "../../ui/AuthHeader";

interface ResetPasswordFormProps {
  control: Control<ResetPasswordFormValues>;
  loading: boolean;
  onSubmit: () => void;
}

export function ResetPasswordForm({
  control,
  loading,
  onSubmit,
}: ResetPasswordFormProps) {
  const router = useRouter();

  return (
    <View>
      <AuthHeader
        title="Reset Password"
        subtitle="Create a new password for your NextRep account."
      />

      <View className="mt-7 gap-4">
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <FormField
              label="New Password"
              errorMessage={fieldState.error?.message}
            >
              <FormPasswordInput
                placeholder="Enter your new password"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={!!fieldState.error}
              />
            </FormField>
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <FormField
              label="Confirm Password"
              errorMessage={fieldState.error?.message}
            >
              <FormPasswordInput
                placeholder="Confirm your new password"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={!!fieldState.error}
              />
            </FormField>
          )}
        />

        <View className="mt-2 gap-4">
          <AppButton
            title="Reset Password"
            variant="primary"
            icon={{
              name: "password",
              size: "sm",
            }}
            loading={loading}
            disabled={loading}
            onPress={onSubmit}
          />

          <AppButton
            title="Back to Sign In"
            variant="ghost"
            size="sm"
            onPress={() => router.replace("/(auth)/sign-in")}
          />
        </View>
      </View>
    </View>
  );
}
