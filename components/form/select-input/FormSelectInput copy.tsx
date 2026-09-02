import type { AppIconName } from "@/components/custom-ui/app-icon/app-icon.registry";
import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { useAppColors } from "@/hooks/useAppColors";
import { useDefaultBottomSheetAnimation } from "@/hooks/useBottomSheetAnimation";
import { cn, hexWithOpacity } from "@/lib/utils";
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  type BottomSheetFlatListMethods,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef } from "react";
import type { ListRenderItem, StyleProp, ViewStyle } from "react-native";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface SelectOption {
  label: string;
  value: string | number;
}

type FormSelectValue = SelectOption["value"] | null;

type DisplaySelectOption = {
  label: string;
  value: FormSelectValue;
};

export interface FormSelectInputProps {
  options: SelectOption[];
  value?: FormSelectValue;
  onChange?: (value: FormSelectValue) => void;
  placeholder?: string;

  /**
   * Shows the destructive/error input state.
   */
  validationError?: boolean;

  /**
   * Controls the outer select trigger.
   */
  className?: string;

  /**
   * Controls inline styles for the outer select trigger.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Optional leading semantic app icon.
   */
  icon?: AppIconName;

  disabled?: boolean;

  title?: string;
  isLoading?: boolean;
  isError?: boolean;
  isFetchingNextPage?: boolean;
  onEndReached?: () => void;
  snapPoints?: (string | number)[];
  allowEmpty?: boolean;
  emptySelectionLabel?: string;
}

export default function FormSelectInput({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  validationError = false,
  className,
  style,
  icon,
  disabled = false,
  title,
  isLoading,
  isError,
  isFetchingNextPage,
  onEndReached,
  snapPoints,
  allowEmpty = false,
  emptySelectionLabel = "No selection",
}: FormSelectInputProps) {
  const colors = useAppColors();
  const insets = useSafeAreaInsets();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const listRef = useRef<BottomSheetFlatListMethods>(null);

  const animationConfigs = useDefaultBottomSheetAnimation();

  const displayOptions = useMemo<DisplaySelectOption[]>(() => {
    if (!allowEmpty) {
      return options;
    }

    return [
      {
        label: emptySelectionLabel,
        value: null,
      },
      ...options,
    ];
  }, [allowEmpty, emptySelectionLabel, options]);

  const selectedLabel =
    value !== null && value !== undefined
      ? displayOptions.find((option) => option.value === value)?.label
      : undefined;

  const selectedIndex = displayOptions.findIndex(
    (option) => option.value === value,
  );

  const openSheet = () => {
    if (disabled) {
      return;
    }

    bottomSheetModalRef.current?.present();
  };

  const closeSheet = () => {
    bottomSheetModalRef.current?.dismiss();
  };

  const handleSheetChange = (index: number) => {
    if (index === 0 && selectedIndex >= 0) {
      listRef.current?.scrollToIndex({
        index: selectedIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }
  };

  const onScrollToIndexFailed = (info: { index: number }) => {
    setTimeout(() => {
      listRef.current?.scrollToIndex({
        index: info.index,
        animated: false,
      });
    }, 200);
  };

  const handleSelect = (optionValue: FormSelectValue) => {
    if (optionValue === value) {
      closeSheet();
      return;
    }

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

  let content: string | undefined;

  if (isLoading) {
    content = "Loading options...";
  } else if (isError) {
    content = "Failed to load options.";
  } else if (displayOptions.length === 0) {
    content = "No options available.";
  }

  const renderItem: ListRenderItem<DisplaySelectOption> = ({ item, index }) => {
    const isSelected = item.value === value;
    const isEmptySelection = item.value === null;

    return (
      <View className={cn("px-2", index > 0 && "pt-1")}>
        <Pressable
          onPress={() => handleSelect(item.value)}
          className="flex-row items-center justify-between rounded-xl p-4 active:opacity-80"
          style={
            isSelected
              ? {
                  backgroundColor: hexWithOpacity(colors.primary, 13),
                }
              : undefined
          }
        >
          <ThemedText
            type="body"
            tone={
              isSelected ? "primary" : isEmptySelection ? "muted" : "default"
            }
            className="flex-1"
          >
            {item.label}
          </ThemedText>

          {isSelected ? (
            <AppIcon name="check" size="sm" color={colors.primary} />
          ) : null}
        </Pressable>
      </View>
    );
  };

  const listFooterComponent = isFetchingNextPage ? (
    <View className="px-2">
      <ThemedText type="body" tone="muted" className="p-4">
        Loading more...
      </ThemedText>
    </View>
  ) : null;

  return (
    <>
      {/* Trigger */}
      <Pressable
        onPress={openSheet}
        disabled={disabled}
        className={cn(
          "h-10 flex-row items-center gap-2 rounded-lg border bg-secondary px-3 active:opacity-80",
          validationError ? "border-destructive" : "border-input",
          disabled && "opacity-50",
          className,
        )}
        style={style}
      >
        {icon ? (
          <AppIcon
            name={icon}
            variant="outline"
            size="sm"
            color={colors.mutedForeground}
          />
        ) : null}

        <ThemedText
          type="small"
          tone={selectedLabel ? "default" : "muted"}
          className="min-w-0 flex-1"
          numberOfLines={1}
        >
          {selectedLabel ?? placeholder}
        </ThemedText>

        <AppIcon name="chevron-down" size="sm" color={colors.mutedForeground} />
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
        animationConfigs={animationConfigs}
        enableContentPanningGesture
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: colors.popover,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.borderStrong,
        }}
      >
        {/* Title */}
        {title ? (
          <View className="px-6 py-3">
            <ThemedText type="title">{title}</ThemedText>
          </View>
        ) : null}

        {/* Options display */}
        {isLoading || isError || displayOptions.length === 0 ? (
          <View
            className="px-2"
            style={{
              paddingBottom: insets.bottom + 16,
            }}
          >
            <ThemedText type="body" tone="muted" className="p-4">
              {content}
            </ThemedText>
          </View>
        ) : (
          <BottomSheetFlatList
            ref={listRef}
            data={displayOptions}
            keyExtractor={(item: DisplaySelectOption) =>
              item.value === null ? "__empty__" : String(item.value)
            }
            renderItem={renderItem}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.4}
            keyboardShouldPersistTaps="handled"
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
