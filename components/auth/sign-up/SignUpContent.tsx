import { AppButton } from "@/components/custom-ui/AppButton";
import FormPasswordInput from "@/components/form/FormPasswordInput";
import FormTextInput from "@/components/form/FormTextInput";
import { PageLayout } from "@/components/layout/PageLayout";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAppToast } from "@/lib/toast/useAppToast";
import { SignUpForm, signUpSchema } from "@/schemas/auth.schema";
import { SignUpRequest } from "@/types/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { UserPlus } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { AuthHeader } from "../ui/AuthHeader";

export default function SignUpContent() {
  const { colors } = useAppTheme();
  const { signUp } = useAuth();
  const router = useRouter();

  const toast = useAppToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
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
    const { confirmPassword, ...payload } = values;
    mutate(payload);
  };

  return (
    <PageLayout includeInsets={{ top: true }}>
      <AuthHeader
        title="Create Account"
        subtitle="Start tracking your workouts and build your streak."
      />

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
          <AppButton
            title="Sign Up"
            variant="primary"
            icon={UserPlus}
            textClassName="font-medium"
            onPress={handleSubmit(onSubmit)}
            loading={isPending}
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
    </PageLayout>
  );
}
