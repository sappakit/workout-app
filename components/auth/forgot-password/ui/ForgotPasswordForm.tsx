import { AppButton } from "@/components/custom-ui/app-button";
import { FormField } from "@/components/form/FormField";
import FormTextInputV2 from "@/components/form/FormTextInputV2";
import type { ForgotPasswordForm as ForgotPasswordFormValues } from "@/schemas/auth.schema";
import { useRouter } from "expo-router";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { View } from "react-native";
import { AuthHeader } from "../../ui/AuthHeader";

interface ForgotPasswordFormProps {
  control: Control<ForgotPasswordFormValues>;
  loading: boolean;
  onSubmit: () => void;
}

export function ForgotPasswordForm({
  control,
  loading,
  onSubmit,
}: ForgotPasswordFormProps) {
  const router = useRouter();

  return (
    <View>
      <AuthHeader
        title="Forgot Password"
        subtitle="Enter your email and we'll send you a link to reset your password."
      />

      <View className="mt-7">
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <FormField label="Email" errorMessage={fieldState.error?.message}>
              <FormTextInputV2
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={!!fieldState.error}
                icon="email"
                clearable
              />
            </FormField>
          )}
        />

        <View className="mt-6 gap-4">
          <AppButton
            title="Send Reset Link"
            variant="primary"
            icon={{
              name: "send",
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
            onPress={() => router.back()}
          />
        </View>
      </View>
    </View>
  );
}
