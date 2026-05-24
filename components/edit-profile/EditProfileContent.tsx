import { userApi } from "@/app/api/user.api";
import { AppButton } from "@/components/custom-ui/AppButton";
import FormTextInput from "@/components/form/FormTextInput";
import { PageLayout } from "@/components/layout/PageLayout";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { useInvalidateQueries } from "@/lib/query/utils";
import { useAppToast } from "@/lib/toast/useAppToast";
import { userQueryKeys } from "@/lib/user/keys";
import { EditProfileForm, editProfileSchema } from "@/schemas/user.schema";
import { User } from "@/types/user/response/user.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Save } from "lucide-react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { ProfileAvatar } from "../profile/ui/ProfileAvatar";
import { ProfileFormField } from "./ui/ProfileFormField";

interface EditProfileContentProps {
  data: User;
}

export default function EditProfileContent({ data }: EditProfileContentProps) {
  const router = useRouter();
  const toast = useAppToast();
  const invalidateQueries = useInvalidateQueries();

  const { loadUser } = useAuth();

  const form = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: data.profile?.firstName ?? "",
      lastName: data.profile?.lastName ?? "",
      email: data.email ?? "",
      phoneNumber: data.profile?.phoneNumber ?? "",
      // dateOfBirth: data.profile?.dateOfBirth ?? "",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: EditProfileForm) => {
      const url = userApi.updateMyProfile();

      return await api.patch(url, values);
    },
    onSuccess: async (_, values) => {
      reset(values);

      // Re-fetch user info
      await invalidateQueries([userQueryKeys.me]);
      await loadUser();

      toast.success({
        title: "Profile updated",
        message: "Your profile information has been saved.",
      });

      router.back();
    },
    onError: () => {
      toast.error({
        title: "Update failed",
        message: "Unable to save your profile.",
      });
    },
  });

  const onSubmit = (values: EditProfileForm) => {
    mutate(values);
  };

  return (
    <PageLayout
      topInset={0}
      headerProps={{
        variant: "title",
        title: "Edit Profile",
        showBackButton: true,
      }}
      stickyFooter={{
        content: (
          <AppButton
            className="flex-1"
            title="Save Changes"
            variant="primary"
            icon={Save}
            loading={isPending}
            onPress={handleSubmit(onSubmit)}
          />
        ),
        options: { addBottomInset: true },
      }}
    >
      <View className="gap-6">
        <View className="items-center">
          <View className="p-6">
            <ProfileAvatar image={data.profile?.imageUrl} />
          </View>
        </View>

        <View className="gap-4">
          <ProfileFormField
            label="First Name"
            errorMessage={errors.firstName?.message}
          >
            <Controller
              control={control}
              name="firstName"
              render={({ field }) => (
                <FormTextInput
                  placeholder="Enter your first name"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={!!errors.firstName}
                />
              )}
            />
          </ProfileFormField>

          <ProfileFormField
            label="Last Name"
            errorMessage={errors.lastName?.message}
          >
            <Controller
              control={control}
              name="lastName"
              render={({ field }) => (
                <FormTextInput
                  placeholder="Enter your last name"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={!!errors.lastName}
                />
              )}
            />
          </ProfileFormField>

          <ProfileFormField label="Email" errorMessage={errors.email?.message}>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <FormTextInput
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={!!errors.email}
                />
              )}
            />
          </ProfileFormField>

          <ProfileFormField
            label="Phone Number"
            errorMessage={errors.phoneNumber?.message}
          >
            <Controller
              control={control}
              name="phoneNumber"
              render={({ field }) => (
                <FormTextInput
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={!!errors.phoneNumber}
                />
              )}
            />
          </ProfileFormField>

          {/* TODO: add date of birth */}
          {/* <ProfileFormField
            label="Date of Birth"
            errorMessage={errors.dateOfBirth?.message}
          >
            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormTextInput
                  icon={Calendar}
                  placeholder="Enter your date of birth"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={!!errors.dateOfBirth}
                />
              )}
            />
          </ProfileFormField> */}
        </View>
      </View>
    </PageLayout>
  );
}
