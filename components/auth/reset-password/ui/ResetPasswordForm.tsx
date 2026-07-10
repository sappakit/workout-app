import { AppButton } from "@/components/custom-ui/AppButton";
import FormPasswordInput from "@/components/form/FormPasswordInput";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ResetPasswordForm as ResetPasswordFormValues } from "@/schemas/auth.schema";
import { useRouter } from "expo-router";
import { KeyRound } from "lucide-react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { View } from "react-native";
import { AuthHeader } from "../../ui/AuthHeader";

interface ResetPasswordFormProps {
  control: Control<ResetPasswordFormValues>;
  errors: FieldErrors<ResetPasswordFormValues>;
  loading: boolean;
  disabled: boolean;
  onSubmit: () => void;
}

export function ResetPasswordForm({
  control,
  errors,
  loading,
  disabled,
  onSubmit,
}: ResetPasswordFormProps) {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <View>
      <AuthHeader
        title="Reset Password"
        subtitle="Create a new password for your NextRep account."
      />

      <View className="mt-4">
        <View className="mt-3">
          <ThemedText type="default" variant="accent" className="mb-2">
            New Password
          </ThemedText>

          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormPasswordInput
                placeholder="Enter your new password"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={!!errors.password}
              />
            )}
          />

          {errors.password?.message ? (
            <ThemedText
              type="default"
              className="mt-2 text-sm"
              style={{ color: colors.app.error }}
            >
              {errors.password.message}
            </ThemedText>
          ) : null}
        </View>

        <View className="mt-4">
          <ThemedText type="default" variant="accent" className="mb-2">
            Confirm Password
          </ThemedText>

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <FormPasswordInput
                placeholder="Confirm your new password"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={!!errors.confirmPassword}
              />
            )}
          />

          {errors.confirmPassword?.message ? (
            <ThemedText
              type="default"
              className="mt-2 text-sm"
              style={{ color: colors.app.error }}
            >
              {errors.confirmPassword.message}
            </ThemedText>
          ) : null}
        </View>

        {!disabled ? null : (
          <ThemedText
            type="default"
            className="mt-4 text-sm"
            style={{ color: colors.app.error }}
          >
            Reset token is missing. Please request a new reset link.
          </ThemedText>
        )}

        <View className="mt-6">
          <AppButton
            title="Reset Password"
            variant="primary"
            icon={KeyRound}
            textClassName="font-medium"
            loading={loading}
            disabled={loading || disabled}
            onPress={onSubmit}
          />
        </View>

        <View className="mt-4 items-center">
          <ThemedText
            type="default"
            variant="primary"
            className="text-sm"
            onPress={() => router.replace("/(auth)/sign-in")}
          >
            Back to Sign In
          </ThemedText>
        </View>
      </View>
    </View>
  );
}
