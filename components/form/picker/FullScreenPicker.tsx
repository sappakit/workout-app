import { AppButton } from "@/components/custom-ui/AppButton";
import FormTextInput from "@/components/form/FormTextInput";
import { PageLayout } from "@/components/layout/PageLayout";
import { ThemedText } from "@/components/themed-text";
import { Search } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, StyleProp, View, ViewStyle } from "react-native";

interface FullScreenPickerProps {
  title: string;
  description?: string;

  onClose: () => void;
  onDone: () => void;
  doneDisabled?: boolean;
  doneText?: string;
  closeText?: string;

  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  searchRight?: React.ReactNode;

  isLoading?: boolean;
  isError?: boolean;
  errorText?: string;
  onRetry?: () => void;

  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  footerExtra?: React.ReactNode;
}

export default function FullScreenPicker({
  title,
  description,
  onClose,
  onDone,
  doneDisabled = false,
  doneText = "Done",
  closeText = "Cancel",
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search",
  searchRight,
  isLoading = false,
  isError = false,
  errorText = "Failed to load data",
  onRetry,
  children,
  contentContainerStyle,
  footerExtra,
}: FullScreenPickerProps) {
  const shouldShowSearch =
    searchValue !== undefined && onSearchChange !== undefined;

  const footer = (
    <>
      <AppButton
        title={doneText}
        variant="primary"
        className="flex-1"
        textClassName="font-medium"
        onPress={onDone}
        disabled={doneDisabled}
      />

      <AppButton
        title={closeText}
        variant="secondary"
        className="w-36"
        onPress={onClose}
      />
    </>
  );

  return (
    <PageLayout
      className="px-0"
      scrollable={false}
      showHeader={false}
      stickyFooter={{
        content: footer,
        options: { addBottomInset: true },
      }}
    >
      <View className="px-4">
        <ThemedText type="title" variant="accent">
          {title}
        </ThemedText>

        {description ? (
          <ThemedText type="default" variant="primary" className="mt-2">
            {description}
          </ThemedText>
        ) : null}

        {shouldShowSearch ? (
          <View className="mt-4 flex-row items-center gap-2">
            <FormTextInput
              className="flex-1 rounded-full"
              value={searchValue}
              onChangeText={onSearchChange}
              placeholder={searchPlaceholder}
              icon={Search}
            />

            {searchRight}
          </View>
        ) : null}

        {footerExtra}
      </View>

      <View className="mt-4 flex-1" style={contentContainerStyle}>
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator />
          </View>
        ) : isError ? (
          <View className="flex-1 items-center justify-center px-6">
            <ThemedText type="default" variant="secondary">
              {errorText}
            </ThemedText>

            {onRetry ? (
              <View className="mt-4">
                <AppButton
                  title="Try Again"
                  variant="secondary"
                  className="px-10"
                  onPress={onRetry}
                />
              </View>
            ) : null}
          </View>
        ) : (
          children
        )}
      </View>
    </PageLayout>
  );
}
