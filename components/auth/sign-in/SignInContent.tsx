import { AppButton } from "@/components/custom-ui/app-button";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { FormField } from "@/components/form/FormField";
import FormPasswordInputV2 from "@/components/form/FormPasswordInput";
import FormTextInput from "@/components/form/FormTextInput";
import { PageLayout } from "@/components/layout/PageLayout";
import { useAuth } from "@/context/AuthContext";
import { useAppColors } from "@/hooks/useAppColors";
import { useAppToast } from "@/lib/toast/useAppToast";
import { type SignInForm, signInSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Pressable, View } from "react-native";
import { AuthHeader } from "../ui/AuthHeader";

export default function SignInContent() {
  const colors = useAppColors();
  const { signIn } = useAuth();
  const router = useRouter();
  const toast = useAppToast();

  const { control, handleSubmit } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    mode: "onTouched",
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: SignInForm) => signIn(values),

    onSuccess: () => {
      toast.success({
        title: "Welcome back 👋",
        message: "You're ready to train.",
      });
    },

    onError: () => {
      toast.error({
        title: "Sign in failed",
        message: "Incorrect email/username or password.",
      });
    },
  });

  const onSubmit = (values: SignInForm) => {
    mutate(values);
  };

  return (
    <PageLayout includeInsets={{ top: true }}>
      <AuthHeader
        title="Sign In"
        subtitle="Welcome back — log your workouts and keep the streak going."
      />

      {/* Form */}
      <View className="mt-7 gap-4">
        {/* Email / username */}
        <Controller
          control={control}
          name="identifier"
          render={({ field, fieldState }) => (
            <FormField
              label="Email or username"
              errorMessage={fieldState.error?.message}
            >
              <FormTextInput
                placeholder="Enter your email or username"
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

        {/* Password */}
        <View className="gap-3">
          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <FormField
                label="Password"
                errorMessage={fieldState.error?.message}
              >
                <FormPasswordInputV2
                  placeholder="Enter your password"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={!!fieldState.error}
                  icon="password"
                />
              </FormField>
            )}
          />

          {/* Forgot password */}
          <View className="items-end">
            <Pressable
              hitSlop={8}
              accessibilityRole="button"
              onPress={() => router.push("/(auth)/forgot-password")}
            >
              <ThemedText type="small" tone="primary">
                Forgot password?
              </ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Submit */}
        <View className="mt-2 gap-4">
          <AppButton
            title="Sign In"
            variant="primary"
            icon={{
              name: "sign-in",
              size: "sm",
            }}
            loading={isPending}
            disabled={isPending}
            onPress={handleSubmit(onSubmit)}
          />

          {/* Sign up */}
          <View className="flex-row items-center justify-center gap-1">
            <ThemedText type="small" tone="muted">
              Don't have an account?
            </ThemedText>

            <Pressable
              hitSlop={8}
              accessibilityRole="button"
              onPress={() => router.push("/(auth)/sign-up")}
            >
              <ThemedText type="small" tone="primary">
                Sign Up
              </ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Third-party login */}
        <View className="mt-2 flex-row items-center gap-3">
          <View className="h-px flex-1 bg-border" />

          <ThemedText type="caption" tone="muted">
            or continue with
          </ThemedText>

          <View className="h-px flex-1 bg-border" />
        </View>

        {/* TODO: Add third-party authentication */}
        <View className="flex-row justify-center gap-4">
          <AppButton
            variant="secondary"
            size="icon"
            className="h-14 w-16 rounded-lg"
            icon={{
              name: "facebook",
              size: "lg",
            }}
            onPress={() => {
              // TODO: handle Facebook sign in
            }}
          />

          <AppButton
            variant="secondary"
            size="icon"
            className="h-14 w-16 rounded-lg"
            icon={{
              name: "google",
              size: "lg",
            }}
            onPress={() => {
              // TODO: handle Google sign in
            }}
          />

          <AppButton
            variant="secondary"
            size="icon"
            className="h-14 w-16 rounded-lg"
            icon={{
              name: "email",
              variant: "outline",
              size: "lg",
            }}
            onPress={() => {
              // TODO: handle email provider sign in
            }}
          />
        </View>
      </View>
    </PageLayout>
  );
}
