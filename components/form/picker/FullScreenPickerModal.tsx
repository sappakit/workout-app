import { AppButton } from "@/components/custom-ui/AppButton";
import FormTextInput from "@/components/form/FormTextInput";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Search } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FullScreenPickerModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  onDone: () => void;
  doneDisabled?: boolean;

  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  searchRight?: React.ReactNode;

  isLoading?: boolean;
  isError?: boolean;
  errorText?: string;
  onRetry?: () => void;

  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export default function FullScreenPickerModal({
  visible,
  title,
  onClose,
  onDone,
  doneDisabled = false,
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
}: FullScreenPickerModalProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View
        className="flex-1"
        style={{
          backgroundColor: colors.app.background,
          paddingTop: insets.top,
        }}
      >
        {/* Header and search bar */}
        <View className="flex gap-2 px-4 py-2">
          <View className="relative flex-row items-center justify-between">
            <Pressable onPress={onClose} className="z-10">
              <ThemedText type="default" variant="primary">
                Cancel
              </ThemedText>
            </Pressable>

            <ThemedText
              type="subtitle"
              variant="accent"
              className="absolute left-0 right-0 text-center"
            >
              {title}
            </ThemedText>
          </View>

          <View className="flex-row items-center gap-2">
            <FormTextInput
              className="flex-1 rounded-full"
              value={searchValue}
              onChangeText={onSearchChange}
              placeholder={searchPlaceholder}
              icon={Search}
            />

            {searchRight}
          </View>
        </View>

        {/* Content */}
        <View className="flex-1" style={contentContainerStyle}>
          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator />
            </View>
          ) : isError ? (
            <View className="flex-1 items-center justify-center px-6">
              <ThemedText type="default" variant="secondary">
                {errorText}
              </ThemedText>

              {onRetry && (
                <View className="mt-4">
                  <AppButton
                    title="Try Again"
                    variant="secondary"
                    className="px-10"
                    onPress={onRetry}
                  />
                </View>
              )}
            </View>
          ) : (
            children
          )}

          <View className="px-4 py-2" style={{ paddingBottom: insets.bottom }}>
            <AppButton
              title="Done"
              variant="primary"
              disabled={doneDisabled}
              textClassName="font-medium"
              onPress={onDone}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
