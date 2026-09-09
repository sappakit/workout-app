import { AppButton } from "@/components/custom-ui/app-button";
import FormTextInput from "@/components/form/FormTextInput";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { EmptyState } from "@/components/state/EmptyState";
import { ErrorState } from "@/components/state/ErrorState";
import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { ActivityIndicator, View } from "react-native";
import { PageLayout } from "../layout/page-layout/PageLayout";

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
  searchRight?: ReactNode;

  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;

  errorTitle?: string;
  errorText?: string;
  onRetry?: () => void;

  emptyTitle?: string;
  emptyText?: string;
  emptyState?: ReactNode;

  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  footerExtra?: ReactNode;
  loadingSkeleton?: ReactNode;
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
        className="flex-1"
        icon={{
          name: "check",
          size: "sm",
        }}
        onPress={onDone}
        disabled={doneDisabled}
      />

      <AppButton
        title={closeText}
        variant="secondary"
        className="w-36"
        icon={{
          name: "close",
          size: "sm",
        }}
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
        icon="warning"
        title={errorTitle}
        message={errorText}
        primaryAction={{
          onPress: onRetry,
        }}
        secondaryAction={{
          hidden: true,
        }}
      />
    );
  } else if (isEmpty) {
    content = emptyState ?? (
      <EmptyState
        icon="search-off"
        title={emptyTitle}
        message={emptyText}
        secondaryAction={{
          hidden: true,
        }}
      />
    );
  }

  return (
    <PageLayout
      scrollable={false}
      stickyFooter={footer}
      includeInsets
      disableContentPadding={{ bottom: true }}
    >
      <View className="flex-1 gap-4">
        <View className="gap-2">
          <SectionHeader title={title} subtitle={description} />

          {shouldShowSearch ? (
            <View className="flex-row items-center gap-2">
              <FormTextInput
                containerClassName="flex-1 rounded-full"
                value={searchValue}
                onChangeText={onSearchChange}
                placeholder={searchPlaceholder}
                icon="search"
                clearable
              />

              {searchRight}
            </View>
          ) : null}

          {footerExtra}
        </View>

        <View style={contentContainerStyle}>{content}</View>
      </View>
    </PageLayout>
  );
}
