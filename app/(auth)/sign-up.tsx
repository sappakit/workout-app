import MainButton from "@/components/custom-ui/MainButton";
import FormPasswordInput from "@/components/form/FormPasswordInput";
import FormTextInput from "@/components/form/FormTextInput";
import { AppLogo } from "@/components/image/AppLogo";
import { PageLayout } from "@/components/layout/PageLayout";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { SignUpForm, SignUpRequest, signUpSchema } from "@/types/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { UserPlus } from "lucide-react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, View } from "react-native";

export default function SignUpScreen() {
  const { colors } = useAppTheme();
  const { signUp } = useAuth();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
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

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["auth", "sign-up"],
    mutationFn: (values: SignUpRequest) => signUp(values),
    onSuccess: () => {
      Alert.alert("Success", "Account created successfully!");
      router.replace("/(auth)/sign-in");
    },
    onError: (err: unknown) => {
      const message =
        (err as any)?.response?.data?.message ??
        (err instanceof Error
          ? err.message
          : "Sign up failed. Please try again.");

      Alert.alert(
        "Error",
        Array.isArray(message) ? message.join("\n") : message,
      );
    },
  });

  const onSubmit = async (values: SignUpForm) => {
    const { confirmPassword, ...payload } = values;
    await mutateAsync(payload);
  };
  const loading = isPending || isSubmitting;

  return (
    <PageLayout showHeader={false}>
      <View>
        {/* Logo */}
        <AppLogo size={200} />

        {/* Title */}
        <View className="-mt-6 items-center">
          <ThemedText
            type="title"
            variant="primary"
            style={{ color: colors.app.textAccent }}
          >
            Create Account
          </ThemedText>

          <ThemedText
            type="default"
            variant="secondary"
            style={{
              color: colors.app.textPrimary,
              fontSize: 14,
              marginTop: 6,
              textAlign: "center",
            }}
          >
            Start tracking your workouts and build your streak.
          </ThemedText>
        </View>

        {/* Form */}
        <View className="mt-4">
          {/* Username */}
          <View className="mt-4">
            <ThemedText type="default" variant="accent" className="mb-2">
              Username
            </ThemedText>

            <Controller
              control={control}
              name="username"
              render={({ field }) => (
                <FormTextInput
                  placeholder="Choose a username"
                  autoCapitalize="none"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={!!errors.username}
                />
              )}
            />

            {errors.username?.message && (
              <ThemedText
                type="default"
                variant="secondary"
                className="mt-2 text-sm"
                style={{ color: colors.app.error ?? "red" }}
              >
                {errors.username.message}
              </ThemedText>
            )}
          </View>

          {/* Password */}
          <View className="mt-4">
            <ThemedText type="default" variant="accent" className="mb-2">
              Password
            </ThemedText>

            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <FormPasswordInput
                  placeholder="Create a password"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={!!errors.password}
                />
              )}
            />

            {errors.password?.message && (
              <ThemedText
                type="default"
                variant="secondary"
                className="mt-2 text-sm"
                style={{ color: colors.app.error ?? "red" }}
              >
                {errors.password.message}
              </ThemedText>
            )}
          </View>

          {/* Confirm Password */}
          <View className="mt-4">
            <ThemedText type="default" variant="accent" className="mb-2">
              Confirm Password
            </ThemedText>

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <FormPasswordInput
                  placeholder="Re-enter your password"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={!!errors.confirmPassword}
                />
              )}
            />

            {errors.confirmPassword?.message && (
              <ThemedText
                type="default"
                variant="secondary"
                className="mt-2 text-sm"
                style={{ color: colors.app.error ?? "red" }}
              >
                {errors.confirmPassword.message}
              </ThemedText>
            )}
          </View>

          {/* First Name */}
          <View className="mt-3">
            <ThemedText type="default" variant="accent" className="mb-2">
              First Name
            </ThemedText>

            <Controller
              control={control}
              name="firstName"
              render={({ field }) => (
                <FormTextInput
                  placeholder="Enter your first name"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={!!errors.firstName}
                />
              )}
            />

            {errors.firstName?.message && (
              <ThemedText
                type="default"
                variant="secondary"
                className="mt-2 text-sm"
                style={{ color: colors.app.error ?? "red" }}
              >
                {errors.firstName.message}
              </ThemedText>
            )}
          </View>

          {/* Last Name */}
          <View className="mt-4">
            <ThemedText type="default" variant="accent" className="mb-2">
              Last Name
            </ThemedText>

            <Controller
              control={control}
              name="lastName"
              render={({ field }) => (
                <FormTextInput
                  placeholder="Enter your last name"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={!!errors.lastName}
                />
              )}
            />

            {errors.lastName?.message && (
              <ThemedText
                type="default"
                variant="secondary"
                className="mt-2 text-sm"
                style={{ color: colors.app.error ?? "red" }}
              >
                {errors.lastName.message}
              </ThemedText>
            )}
          </View>

          {/* Email */}
          <View className="mt-4">
            <ThemedText type="default" variant="accent" className="mb-2">
              Email
            </ThemedText>

            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <FormTextInput
                  placeholder="Enter your email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={!!errors.email}
                />
              )}
            />

            {errors.email?.message && (
              <ThemedText
                type="default"
                variant="secondary"
                className="mt-2 text-sm"
                style={{ color: colors.app.error ?? "red" }}
              >
                {errors.email.message}
              </ThemedText>
            )}
          </View>

          {/* Submit */}
          <View className="mt-6">
            <MainButton
              title="Sign Up"
              icon={
                <UserPlus
                  size={18}
                  color={colors.app.textWhite}
                  style={{ marginRight: 8 }}
                />
              }
              onPress={handleSubmit(onSubmit)}
              loading={loading}
            />

            <View className="mt-4 flex-row justify-center">
              <ThemedText type="default" variant="primary" className="text-sm">
                Already have an account?{" "}
                <ThemedText
                  type="default"
                  variant="primary"
                  className="text-sm"
                  style={{ color: colors.app.brand }}
                  onPress={() => router.push("/(auth)/sign-in")}
                >
                  Sign In
                </ThemedText>
              </ThemedText>
            </View>
          </View>
        </View>
      </View>
    </PageLayout>
  );
}
