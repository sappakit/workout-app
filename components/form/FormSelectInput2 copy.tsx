import { useAppTheme } from "@/hooks/useAppTheme";
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import clsx from "clsx";
import { Check, ChevronDown } from "lucide-react-native";
import React, { useCallback, useRef } from "react";
import { ListRenderItem, Pressable, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";
import { ThemedText } from "../themed-text";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface FormSelectInputProps {
  options: SelectOption[];
  value?: string | number;
  onChange?: (value: string | number | undefined) => void;
  placeholder?: string;
  validationError?: boolean;
  className?: string;
  style?: ViewStyle;
  title?: string;
  isLoading?: boolean;
  isError?: boolean;
  isFetchingNextPage?: boolean;
  onEndReached?: () => void;
  selectedOption?: SelectOption;
}

export default function FormSelectInput({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  validationError,
  className,
  style,
  title,
  isLoading,
  isError,
  isFetchingNextPage,
  onEndReached,
  selectedOption,
}: FormSelectInputProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  const openSheet = () => bottomSheetModalRef.current?.present();
  const closeSheet = () => bottomSheetModalRef.current?.dismiss();

  const handleSelect = (optionValue: string | number) => {
    onChange?.(optionValue);
    closeSheet();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  let content;
  if (isLoading) {
    content = "Loading options...";
  } else if (isError) {
    content = "Failed to load options.";
  } else if (options.length === 0) {
    content = "No options available.";
  }

  const renderItem: ListRenderItem<SelectOption> = ({ item, index }) => {
    const isSelected = item.value === value;

    return (
      <View className={twMerge(clsx("px-2", index > 0 && "pt-1"))}>
        <Pressable
          onPress={() => handleSelect(item.value)}
          className="flex-row items-center justify-between rounded-xl p-4"
          style={{
            backgroundColor: isSelected
              ? colors.app.brand + "20"
              : "transparent",
          }}
        >
          <ThemedText type="default" variant={isSelected ? "brand" : "accent"}>
            {item.label}
          </ThemedText>

          {isSelected && <Check size={18} color={colors.app.brand} />}
        </Pressable>
      </View>
    );
  };

  const ListFooterComponent = (
    <View className="px-2">
      <ThemedText type="default" variant="primary" className="p-4">
        Loading more...
      </ThemedText>
    </View>
  );

  return (
    <>
      {/* Trigger */}
      <Pressable
        onPress={openSheet}
        className={twMerge(
          clsx(
            "h-12 flex-row items-center justify-between rounded-lg border px-4",
            className,
          ),
        )}
        style={[
          {
            backgroundColor: colors.app.cardSecondary,
            borderColor: validationError
              ? colors.app.error
              : colors.app.borderPrimary,
          },
          style,
        ]}
      >
        <ThemedText
          className="flex-1 text-sm"
          variant={selectedLabel ? "accent" : "primary"}
          numberOfLines={1}
        >
          {selectedLabel ?? placeholder}
        </ThemedText>

        <ChevronDown size={16} color={colors.app.textPrimary} />
      </Pressable>

      {/* Bottom Sheet Modal */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={["20%"]}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: colors.app.toastBackground,
        }}
        handleIndicatorStyle={{ backgroundColor: colors.app.borderSecondary }}
      >
        {/* Options display */}
        {isLoading || isError || options.length === 0 ? (
          <BottomSheetView style={{ paddingBottom: insets.bottom + 16 }}>
            {title && (
              <ThemedText type="title" variant="accent" className="px-6 py-3">
                {title}
              </ThemedText>
            )}
            <View className="px-2">
              <ThemedText type="default" variant="primary" className="p-4">
                {content}
              </ThemedText>
            </View>
          </BottomSheetView>
        ) : (
          <BottomSheetFlatList
            data={options}
            keyExtractor={(item: SelectOption) => item.value.toString()}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.4}
            renderItem={renderItem}
            ListHeaderComponent={
              title ? (
                <ThemedText type="title" variant="accent" className="px-6 py-3">
                  {title}
                </ThemedText>
              ) : null
            }
            ListFooterComponent={
              isFetchingNextPage ? ListFooterComponent : null
            }
            contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
          />
        )}
      </BottomSheetModal>
    </>
  );
}
