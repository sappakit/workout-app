import { AppButton } from "@/components/custom-ui/app-button";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { FormField } from "@/components/form/FormField";
import { PageLayout } from "@/components/layout/PageLayout";
import { authApi } from "@/lib/api/auth.api";
import { api } from "@/lib/api/client";
import { useAppToast } from "@/lib/toast/useAppToast";
import {
  changePasswordSchema,
  type ChangePasswordForm,
} from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Alert, View } from "react-native";
import FormPasswordInputV2 from "../form/FormPasswordInput";

export default function ChangePasswordContent() {
  const router = useRouter();
  const toast = useAppToast();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onTouched",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleCancel = () => {
    if (!isDirty) {
      router.back();
      return;
    }

    Alert.alert(
      "Discard changes?",
      "You have unsaved changes. If you go back, your edits will be lost.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            reset();
            router.back();
          },
        },
      ],
    );
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: ChangePasswordForm) => {
      return api.patch(authApi.changeMyPassword(), {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
    },

    onSuccess: () => {
      toast.success({
        title: "Password updated",
        message: "Your password has been changed successfully.",
      });

      router.back();
    },

    onError: (error) => {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      const message =
        status && status >= 400 && status < 500
          ? error.message
          : "Unable to change your password. Please try again.";

      toast.error({
        title: "Update failed",
        message,
      });
    },
  });

  const onSubmit = (values: ChangePasswordForm) => {
    mutate(values);
  };

  return (
    <PageLayout
      header={{
        props: {
          variant: "title",
          title: "Change Password",
          showBackButton: true,
          onBackPress: handleCancel,
        },
      }}
      stickyFooter={
        <AppButton
          title="Update Password"
          variant="primary"
          className="flex-1"
          icon={{
            name: "save",
            size: "sm",
          }}
          loading={isPending}
          disabled={isPending}
          onPress={handleSubmit(onSubmit)}
        />
      }
    >
      <View className="gap-6">
        <View className="gap-4">
          <Controller
            control={control}
            name="currentPassword"
            render={({ field, fieldState }) => (
              <FormField
                label="Current Password"
                errorMessage={fieldState.error?.message}
              >
                <FormPasswordInputV2
                  placeholder="Enter your current password"
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
            name="newPassword"
            render={({ field, fieldState }) => (
              <FormField
                label="New Password"
                errorMessage={fieldState.error?.message}
              >
                <FormPasswordInputV2
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
                <FormPasswordInputV2
                  placeholder="Confirm your new password"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={!!fieldState.error}
                />
              </FormField>
            )}
          />
        </View>

        <ThemedText type="small" tone="muted">
          After your password is changed, your other devices may need to sign in
          again after a short while.
        </ThemedText>
      </View>
    </PageLayout>
  );
}
