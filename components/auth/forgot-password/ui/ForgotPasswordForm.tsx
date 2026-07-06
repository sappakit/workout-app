// components/auth/ForgotPasswordForm.tsx
import { AppButton } from "@/components/custom-ui/AppButton";
import FormTextInput from "@/components/form/FormTextInput";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ForgotPasswordForm as ForgotPasswordFormValues } from "@/schemas/auth.schema";
import { useRouter } from "expo-router";
import { Send } from "lucide-react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { View } from "react-native";
import { AuthHeader } from "./AuthHeader";

interface ForgotPasswordFormProps {
  control: Control<ForgotPasswordFormValues>;
  errors: FieldErrors<ForgotPasswordFormValues>;
  loading: boolean;
  onSubmit: () => void;
}

export function ForgotPasswordForm({
  control,
  errors,
  loading,
  onSubmit,
}: ForgotPasswordFormProps) {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <View>
      <AuthHeader
        title="Forgot Password"
        subtitle="Enter your email and we'll send you a link to reset your password."
      />

      <View className="mt-4">
        <View className="mt-3">
          <ThemedText type="default" variant="accent" className="mb-2">
            Email
          </ThemedText>

          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormTextInput
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={!!errors.email}
              />
            )}
          />

          {errors.email?.message ? (
            <ThemedText
              type="default"
              variant="secondary"
              className="mt-2 text-sm"
              style={{ color: colors.app.error }}
            >
              {errors.email.message}
            </ThemedText>
          ) : null}
        </View>

        <View className="mt-6 gap-4">
          <AppButton
            title="Send Reset Link"
            variant="primary"
            icon={Send}
            textClassName="font-medium"
            loading={loading}
            disabled={loading}
            onPress={onSubmit}
          />

          <ThemedText
            type="small"
            variant="primary"
            className="text-center"
            onPress={() => router.back()}
          >
            Back to Sign In
          </ThemedText>
        </View>
      </View>
    </View>
  );
}
