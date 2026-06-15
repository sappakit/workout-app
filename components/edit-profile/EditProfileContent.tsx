import { userApi } from "@/app/api/user.api";
import { AppButton } from "@/components/custom-ui/AppButton";
import FormTextInput from "@/components/form/FormTextInput";
import { PageLayout } from "@/components/layout/PageLayout";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { appendImageToFormData } from "@/lib/form-data/utils";
import { useInvalidateQueries } from "@/lib/query/utils";
import { useAppToast } from "@/lib/toast/useAppToast";
import { userQueryKeys } from "@/lib/user/keys";
import { EditProfileForm, editProfileSchema } from "@/schemas/user.schema";
import { ReactNativeFile } from "@/types/common/file.types";
import { User } from "@/types/user/response/user.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Save } from "lucide-react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Linking, View } from "react-native";
import { AvatarImageEditor } from "../profile/ui/AvatarImageEditor";
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

  const [selectedImage, setSelectedImage] = useState<ReactNativeFile | null>(
    null,
  );
  const [pickedImageUri, setPickedImageUri] = useState<string | null>(null);
  const [isEditorVisible, setIsEditorVisible] = useState(false);

  const form = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: data.profile?.firstName ?? "",
      lastName: data.profile?.lastName ?? "",
      email: data.email ?? "",
      phoneNumber: data.profile?.phoneNumber ?? "",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = form;

  const hasUnsavedChanges = isDirty || !!selectedImage;

  const handleCancelEdit = () => {
    const resetFormAndBack = () => {
      reset();
      setSelectedImage(null);
      setPickedImageUri(null);
      setIsEditorVisible(false);
      router.back();
    };

    if (!hasUnsavedChanges) {
      resetFormAndBack();
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
          onPress: resetFormAndBack,
        },
      ],
    );
  };

  const closeImageEditor = () => {
    setIsEditorVisible(false);
    setPickedImageUri(null);
  };

  const pickImageFromLibrary = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      if (!permissionResult.canAskAgain) {
        Alert.alert(
          "Photo access is blocked",
          "Please enable photo library access in your phone settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ],
        );
        return;
      }

      Alert.alert(
        "Permission needed",
        "Please allow photo library access to update your profile image.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    setPickedImageUri(asset.uri);
    setIsEditorVisible(true);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: EditProfileForm) => {
      const formData = new FormData();

      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      formData.append("phoneNumber", values.phoneNumber ?? "");

      if (selectedImage) {
        await appendImageToFormData(formData, selectedImage);
      }

      return await api.patch(userApi.updateMyProfile(), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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

  const avatarImage = selectedImage?.uri ?? data.profile?.imageUrl;

  return (
    <PageLayout
      topInset={0}
      headerProps={{
        variant: "title",
        title: "Edit Profile",
        showBackButton: true,
        onBackPress: handleCancelEdit,
      }}
      stickyFooter={{
        content: (
          <AppButton
            className="flex-1"
            title="Save Changes"
            variant="primary"
            icon={Save}
            loading={isPending}
            disabled={isPending}
            onPress={handleSubmit(onSubmit)}
          />
        ),
        options: { addBottomInset: true },
      }}
    >
      <View className="gap-6">
        <View className="items-center">
          <View className="p-6">
            <ProfileAvatar
              image={avatarImage}
              onPressEdit={pickImageFromLibrary}
              showEditIcon
            />
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

      <AvatarImageEditor
        visible={isEditorVisible}
        imageUri={pickedImageUri}
        onClose={closeImageEditor}
        onComplete={(image) => {
          setSelectedImage(image);
          closeImageEditor();
        }}
      />
    </PageLayout>
  );
}
