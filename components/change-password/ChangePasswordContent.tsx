import { authApi } from "@/app/api/auth.api";
import { AppButton } from "@/components/custom-ui/AppButton";
import FormPasswordInput from "@/components/form/FormPasswordInput";
import { PageLayout } from "@/components/layout/PageLayout";
import { ThemedText } from "@/components/themed-text";
import { api } from "@/lib/api";
import { useAppToast } from "@/lib/toast/useAppToast";
import {
  ChangePasswordForm,
  changePasswordSchema,
} from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "expo-router";
import { Save } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { Alert, View } from "react-native";
import { ProfileFormField } from "../edit-profile/ui/ProfileFormField";

export default function ChangePasswordContent() {
  const router = useRouter();
  const toast = useAppToast();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
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
        { text: "Cancel", style: "cancel" },
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
          className="flex-1"
          title="Update Password"
          variant="primary"
          icon={Save}
          loading={isPending}
          disabled={isPending}
          onPress={handleSubmit(onSubmit)}
        />
      }
    >
      <View className="gap-6">
        <View className="gap-4">
          <ProfileFormField
            label="Current Password"
            errorMessage={errors.currentPassword?.message}
          >
            <Controller
              control={control}
              name="currentPassword"
              render={({ field }) => (
                <FormPasswordInput
                  placeholder="Enter your current password"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={!!errors.currentPassword}
                />
              )}
            />
          </ProfileFormField>

          <ProfileFormField
            label="New Password"
            errorMessage={errors.newPassword?.message}
          >
            <Controller
              control={control}
              name="newPassword"
              render={({ field }) => (
                <FormPasswordInput
                  placeholder="Enter your new password"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={!!errors.newPassword}
                />
              )}
            />
          </ProfileFormField>

          <ProfileFormField
            label="Confirm Password"
            errorMessage={errors.confirmPassword?.message}
          >
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
          </ProfileFormField>
        </View>

        <ThemedText type="small" variant="primary" className="leading-5">
          After your password is changed, your other devices may need to sign in
          again after a short while.
        </ThemedText>
      </View>
    </PageLayout>
  );
}
