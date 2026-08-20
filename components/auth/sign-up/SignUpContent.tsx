import { AppButton } from "@/components/custom-ui/app-button";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { FormField } from "@/components/form/FormField";
import FormPasswordInputV2 from "@/components/form/FormPasswordInput";
import FormTextInputV2 from "@/components/form/FormTextInputV2";
import { PageLayout } from "@/components/layout/PageLayout";
import { useAuth } from "@/context/AuthContext";
import { useAppToast } from "@/lib/toast/useAppToast";
import { type SignUpForm, signUpSchema } from "@/schemas/auth.schema";
import type { SignUpRequest } from "@/types/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Pressable, View } from "react-native";
import { AuthHeader } from "../ui/AuthHeader";

export default function SignUpContent() {
  const { signUp } = useAuth();
  const router = useRouter();
  const toast = useAppToast();

  const { control, handleSubmit } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      firstName: "",
      lastName: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: SignUpRequest) => signUp(values),

    onSuccess: () => {
      toast.success({
        title: "Welcome!",
        message: "Your account has been created.",
      });
    },

    onError: (err: unknown) => {
      const message =
        (err as any)?.response?.data?.message ??
        (err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.");

      toast.error({
        title: "Sign-up failed",
        message: Array.isArray(message) ? message.join("\n") : message,
      });
    },
  });

  const onSubmit = (values: SignUpForm) => {
    const { confirmPassword: _confirmPassword, ...payload } = values;

    mutate(payload);
  };

  return (
    <PageLayout includeInsets={{ top: true, bottom: true }}>
      <AuthHeader
        title="Create Account"
        subtitle="Start tracking your workouts and build your streak."
      />

      <View className="mt-7 gap-4">
        {/* Username */}
        <Controller
          control={control}
          name="username"
          render={({ field, fieldState }) => (
            <FormField
              label="Username"
              errorMessage={fieldState.error?.message}
            >
              <FormTextInputV2
                placeholder="Choose a username"
                autoCapitalize="none"
                autoCorrect={false}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={!!fieldState.error}
                icon="profile"
                clearable
              />
            </FormField>
          )}
        />

        {/* Password */}
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <FormField
              label="Password"
              errorMessage={fieldState.error?.message}
            >
              <FormPasswordInputV2
                placeholder="Create a password"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={!!fieldState.error}
                icon="password"
              />
            </FormField>
          )}
        />

        {/* Confirm Password */}
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <FormField
              label="Confirm Password"
              errorMessage={fieldState.error?.message}
            >
              <FormPasswordInputV2
                placeholder="Re-enter your password"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={!!fieldState.error}
                icon="password"
              />
            </FormField>
          )}
        />

        {/* First Name */}
        <Controller
          control={control}
          name="firstName"
          render={({ field, fieldState }) => (
            <FormField
              label="First Name"
              errorMessage={fieldState.error?.message}
            >
              <FormTextInputV2
                placeholder="Enter your first name"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={!!fieldState.error}
                icon="profile"
                clearable
              />
            </FormField>
          )}
        />

        {/* Last Name */}
        <Controller
          control={control}
          name="lastName"
          render={({ field, fieldState }) => (
            <FormField
              label="Last Name"
              errorMessage={fieldState.error?.message}
            >
              <FormTextInputV2
                placeholder="Enter your last name"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={!!fieldState.error}
                icon="profile"
                clearable
              />
            </FormField>
          )}
        />

        {/* Email */}
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <FormField label="Email" errorMessage={fieldState.error?.message}>
              <FormTextInputV2
                placeholder="Enter your email"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
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

        {/* Submit */}
        <View className="mt-2 gap-4">
          <AppButton
            title="Sign Up"
            variant="primary"
            icon={{
              name: "sign-up",
              size: "sm",
            }}
            loading={isPending}
            disabled={isPending}
            onPress={handleSubmit(onSubmit)}
          />

          <View className="flex-row items-center justify-center gap-1">
            <ThemedText type="small" tone="muted">
              Already have an account?
            </ThemedText>

            <Pressable
              hitSlop={8}
              accessibilityRole="button"
              onPress={() => router.push("/(auth)/sign-in")}
            >
              <ThemedText type="small" tone="primary">
                Sign In
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </PageLayout>
  );
}
