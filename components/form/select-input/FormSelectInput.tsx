import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import clsx from "clsx";
import { Check, ChevronDown } from "lucide-react-native";
import { useCallback, useRef } from "react";
import { ListRenderItem, Pressable, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";

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
  snapPoints?: (string | number)[];
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
  snapPoints,
}: FormSelectInputProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  const listRef = useRef<BottomSheetFlatListMethods>(null);
  const selectedIndex =
    value !== undefined ? options.findIndex((o) => o.value === value) : -1;

  const openSheet = () => {
    bottomSheetModalRef.current?.present();
  };

  const closeSheet = () => bottomSheetModalRef.current?.dismiss();

  const handleSheetChange = (index: number) => {
    if (index === 0 && selectedIndex >= 0) {
      listRef.current?.scrollToIndex({
        index: selectedIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }
  };

  const onScrollToIndexFailed = (info: any) => {
    setTimeout(() => {
      listRef.current?.scrollToIndex({
        index: info.index,
        animated: false,
      });
    }, 200);
  };

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

  const listFooterComponent = isFetchingNextPage ? (
    <View className="px-2">
      <ThemedText type="default" variant="primary" className="p-4">
        Loading more...
      </ThemedText>
    </View>
  ) : null;

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
        onChange={handleSheetChange}
        snapPoints={snapPoints ?? ["100%"]}
        topInset={insets.top}
        enableDynamicSizing={false}
        enablePanDownToClose
        enableOverDrag
        enableContentPanningGesture
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: colors.app.toastBackground,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.app.borderSecondary,
        }}
      >
        {/* Title */}
        {title && (
          <ThemedText type="title" variant="accent" className="px-6 py-3">
            {title}
          </ThemedText>
        )}

        {/* Options display */}
        {isLoading || isError || options.length === 0 ? (
          <View
            className={clsx("px-2")}
            style={{ paddingBottom: insets.bottom + 16 }}
          >
            <ThemedText type="default" variant="primary" className="p-4">
              {content}
            </ThemedText>
          </View>
        ) : (
          <BottomSheetFlatList
            ref={listRef}
            data={options}
            keyExtractor={(item: SelectOption) => item.value.toString()}
            renderItem={renderItem}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.4}
            keyboardShouldPersistTaps="handled"
            bounces={false}
            onScrollToIndexFailed={onScrollToIndexFailed}
            ListFooterComponent={listFooterComponent}
            contentContainerStyle={{
              paddingBottom: insets.bottom + 16,
            }}
          />
        )}
      </BottomSheetModal>
    </>
  );
}
