import { AppButton } from "@/components/custom-ui/AppButton";
import FormPasswordInput from "@/components/form/FormPasswordInput";
import FormTextInput from "@/components/form/FormTextInput";
import { AppLogo } from "@/components/image/AppLogo";
import { PageLayout } from "@/components/layout/PageLayout";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAppToast } from "@/lib/toast/useAppToast";
import { SignInForm, signInSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { AtSign, Facebook, LogIn, Mail } from "lucide-react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

export default function SignInScreen() {
  const { colors } = useAppTheme();
  const { signIn } = useAuth();
  const router = useRouter();

  const toast = useAppToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    mode: "onTouched",
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["auth", "sign-in"],
    mutationFn: (values: SignInForm) => signIn(values),
    onSuccess: () => {
      toast.success({
        title: "Welcome back 👋",
        message: "You're ready to train.",
      });
    },
    onError: (_err: unknown) => {
      toast.error({
        title: "Sign in failed",
        message: "Incorrect email/username or password",
      });
    },
  });

  const onSubmit = (values: SignInForm) => {
    mutate(values);
  };

  return (
    <PageLayout showHeader={false}>
      <View>
        {/* Logo here */}
        <AppLogo size={200} />

        {/* Title */}
        <View className="-mt-6 items-center">
          <ThemedText
            type="title"
            variant="primary"
            style={{
              color: colors.app.textAccent,
            }}
          >
            Sign In
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
            Welcome back — log your workouts and keep the streak going.
          </ThemedText>
        </View>

        {/* Form */}
        <View className="mt-4">
          {/* Email */}
          <View className="mt-3">
            <ThemedText type="default" variant="accent" className="mb-2">
              Email or username
            </ThemedText>

            <Controller
              control={control}
              name="identifier"
              render={({ field }) => (
                <FormTextInput
                  placeholder="Enter your email or username"
                  autoCapitalize="none"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={!!errors.identifier}
                />
              )}
            />

            {errors.identifier?.message ? (
              <ThemedText
                type="default"
                variant="secondary"
                className="mt-2 text-sm"
                style={{
                  color: colors.app.error ?? "red",
                }}
              >
                {errors.identifier.message}
              </ThemedText>
            ) : null}
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
                  placeholder="Enter your password"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={!!errors.password}
                />
              )}
            />

            {errors.password?.message ? (
              <ThemedText
                type="default"
                variant="secondary"
                style={{
                  color: colors.app.error ?? "red",
                }}
                className="mt-2 text-sm"
              >
                {errors.password.message}
              </ThemedText>
            ) : null}

            {/* Forgot */}
            <View className="mt-3 items-end">
              <ThemedText
                type="default"
                variant="primary"
                className="text-sm"
                // onPress={() => router.push("/(auth)/forgot-password")}
              >
                Forgot password?
              </ThemedText>
            </View>
          </View>

          {/* Submit */}
          <View className="mt-6">
            <AppButton
              title="Sign in"
              variant="primary"
              icon={LogIn}
              textClassName="font-medium"
              onPress={handleSubmit(onSubmit)}
              loading={isPending}
            />

            {/* Sign Up */}
            <View className="mt-4 flex-row justify-center">
              <ThemedText type="default" variant="primary" className="text-sm">
                Don't have an account?{" "}
                <ThemedText
                  type="default"
                  variant="primary"
                  className="text-sm"
                  style={{
                    color: colors.app.brand,
                  }}
                  onPress={() => router.push("/(auth)/sign-up")}
                >
                  Sign Up
                </ThemedText>
              </ThemedText>
            </View>
          </View>

          {/* Third party login */}
          {/* Divider */}
          <View className="mt-6 flex-row items-center">
            <View
              className="flex-1"
              style={{ height: 1, backgroundColor: colors.app.borderSecondary }}
            />
            <ThemedText
              type="default"
              variant="secondary"
              style={{
                marginHorizontal: 10,
                color: colors.app.textPrimary,
                fontSize: 13,
              }}
            >
              or continue with
            </ThemedText>
            <View
              className="flex-1"
              style={{ height: 1, backgroundColor: colors.app.borderSecondary }}
            />
          </View>

          {/* TODO: Facebook, Google, Hotmail */}
          <View className="mt-6 flex-row justify-center gap-4">
            <View
              className="h-14 w-16 items-center justify-center rounded-lg"
              style={{ backgroundColor: colors.app.cardSecondary }}
            >
              <Facebook size={24} color={colors.app.textAccent} />
            </View>

            <View
              className="h-14 w-16 items-center justify-center rounded-lg"
              style={{ backgroundColor: colors.app.cardSecondary }}
            >
              <Mail size={24} color={colors.app.textAccent} />
            </View>

            <View
              className="h-14 w-16 items-center justify-center rounded-lg"
              style={{ backgroundColor: colors.app.cardSecondary }}
            >
              <AtSign size={24} color={colors.app.textAccent} />
            </View>
          </View>

          {/* Terms */}
          {/* <View className="mt-7 items-center">
            <ThemedText
              type="default"
              variant="secondary"
              style={{
                color: colors.app.textSecondary,
                fontSize: 12,
                textAlign: "center",
              }}
            >
              By signing in, you agree to our{" "}
              <ThemedText
                type="default"
                variant="primary"
                style={{
                  color: colors.app.textAccent,
                  textDecorationLine: "underline",
                }}
                // onPress={() => router.push("/(auth)/terms")}
              >
                Terms
              </ThemedText>{" "}
              and{" "}
              <ThemedText
                type="default"
                variant="primary"
                style={{
                  color: colors.app.textAccent,
                  textDecorationLine: "underline",
                }}
                // onPress={() => router.push("/(auth)/privacy")}
              >
                Privacy Policy
              </ThemedText>
              .
            </ThemedText>
          </View> */}
        </View>
      </View>
    </PageLayout>
  );
}
