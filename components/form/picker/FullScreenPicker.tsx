import { AppButton } from "@/components/custom-ui/AppButton";
import FormTextInput from "@/components/form/FormTextInput";
import { PageLayout } from "@/components/layout/PageLayout";
import { EmptyState } from "@/components/state/EmptyState";
import { ErrorState } from "@/components/state/ErrorState";
import { ThemedText } from "@/components/themed-text";
import { Check, Search, X } from "lucide-react-native";
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
  isEmpty?: boolean;

  errorTitle?: string;
  errorText?: string;
  onRetry?: () => void;

  emptyTitle?: string;
  emptyText?: string;
  emptyState?: React.ReactNode;

  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  footerExtra?: React.ReactNode;
  loadingSkeleton?: React.ReactNode;
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
  isEmpty = false,

  errorTitle = "Something went wrong",
  errorText = "Failed to load data",
  onRetry,

  emptyTitle = "No data found",
  emptyText = "There's nothing to show here yet.",
  emptyState,

  children,
  contentContainerStyle,
  footerExtra,
  loadingSkeleton,
}: FullScreenPickerProps) {
  const shouldShowSearch =
    searchValue !== undefined && onSearchChange !== undefined;

  const footer = (
    <>
      <AppButton
        title={doneText}
        variant="primary"
        icon={Check}
        className="flex-1"
        textClassName="font-medium"
        onPress={onDone}
        disabled={doneDisabled}
      />

      <AppButton
        title={closeText}
        variant="secondary"
        icon={X}
        className="w-36"
        onPress={onClose}
      />
    </>
  );

  let content = children;

  if (isLoading) {
    content = loadingSkeleton ?? (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  } else if (isError) {
    content = (
      <ErrorState
        title={errorTitle}
        message={errorText}
        onRetry={onRetry}
        showHomeButton={false}
      />
    );
  } else if (isEmpty) {
    content = emptyState ?? (
      <EmptyState
        title={emptyTitle}
        message={emptyText}
        showHomeButton={false}
      />
    );
  }

  return (
    <PageLayout scrollable={false} stickyFooter={footer}>
      <View className="gap-3">
        <View>
          <ThemedText type="title" variant="accent">
            {title}
          </ThemedText>

          {description ? (
            <ThemedText type="default" variant="primary">
              {description}
            </ThemedText>
          ) : null}
        </View>

        {shouldShowSearch ? (
          <View className="flex-row items-center gap-2">
            <FormTextInput
              clearable
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
        {content}
      </View>
    </PageLayout>
  );
}
