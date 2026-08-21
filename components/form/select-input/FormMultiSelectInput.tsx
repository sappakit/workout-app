import { AppButton } from "@/components/custom-ui/app-button";
import type { AppIconName } from "@/components/custom-ui/app-icon/app-icon.registry";
import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { MetaPill, MetaPillList } from "@/components/custom-ui/MetaPill";
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
import { useCallback, useMemo, useRef, useState } from "react";
import type { ListRenderItem, StyleProp, ViewStyle } from "react-native";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MAX_VISIBLE_SELECTED_OPTIONS = 3;

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface FormMultiSelectInputProps {
  options: SelectOption[];
  value?: (string | number)[];
  onChange?: (value: (string | number)[]) => void;
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

  title?: string;
  isLoading?: boolean;
  isError?: boolean;
  isFetchingNextPage?: boolean;
  onEndReached?: () => void;
  snapPoints?: (string | number)[];
  disabled?: boolean;
}

export default function FormMultiSelectInput({
  options,
  value = [],
  onChange,
  placeholder = "Select options",
  validationError = false,
  className,
  style,
  icon,
  title,
  isLoading,
  isError,
  isFetchingNextPage,
  onEndReached,
  snapPoints,
  disabled = false,
}: FormMultiSelectInputProps) {
  const colors = useAppColors();
  const insets = useSafeAreaInsets();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const listRef = useRef<BottomSheetFlatListMethods>(null);

  const animationConfigs = useDefaultBottomSheetAnimation();

  const [showAll, setShowAll] = useState(false);

  const selectedValues = value ?? [];

  const selectedOptions = useMemo(() => {
    const selectedSet = new Set(selectedValues);

    return options.filter((option) => selectedSet.has(option.value));
  }, [options, selectedValues]);

  const selectedPillOptions = useMemo(
    () =>
      selectedOptions.map((option) => ({
        ...option,
        key: option.value,
      })),
    [selectedOptions],
  );

  const selectedLabel = useMemo(() => {
    if (selectedOptions.length === 0) {
      return undefined;
    }

    if (selectedOptions.length === 1) {
      return "1 muscle group selected";
    }

    return `${selectedOptions.length} muscle groups selected`;
  }, [selectedOptions]);

  const firstSelectedIndex = useMemo(() => {
    if (selectedValues.length === 0) {
      return -1;
    }

    return options.findIndex((option) => selectedValues.includes(option.value));
  }, [options, selectedValues]);

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
    if (index === 0 && firstSelectedIndex >= 0) {
      listRef.current?.scrollToIndex({
        index: firstSelectedIndex,
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

  const handleToggle = (optionValue: string | number) => {
    const exists = selectedValues.includes(optionValue);

    if (exists) {
      onChange?.(selectedValues.filter((item) => item !== optionValue));
      return;
    }

    onChange?.([...selectedValues, optionValue]);
  };

  const handleRemove = (optionValue: string | number) => {
    if (disabled) {
      return;
    }

    onChange?.(selectedValues.filter((item) => item !== optionValue));
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
  } else if (options.length === 0) {
    content = "No options available.";
  }

  const renderItem: ListRenderItem<SelectOption> = ({ item, index }) => {
    const isSelected = selectedValues.includes(item.value);

    return (
      <View className={cn("px-2", index > 0 && "pt-1")}>
        <Pressable
          onPress={() => handleToggle(item.value)}
          className="h-14 flex-row items-center justify-between rounded-xl p-4 active:opacity-80"
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
            tone={isSelected ? "primary" : "default"}
            className="min-w-0 flex-1"
            numberOfLines={1}
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

      {/* Selected chips display */}
      {selectedOptions.length > 0 ? (
        <View>
          {/* Show all */}
          {selectedOptions.length > MAX_VISIBLE_SELECTED_OPTIONS ? (
            <Pressable
              className="mb-2 flex-row items-center gap-1 self-start active:opacity-80"
              onPress={() => setShowAll((previous) => !previous)}
            >
              <ThemedText type="small" tone="muted">
                {showAll ? "Show less" : "Show all"}
              </ThemedText>

              <AppIcon
                name={showAll ? "chevron-up" : "chevron-down"}
                size="xs"
                color={colors.mutedForeground}
              />
            </Pressable>
          ) : null}

          <MetaPillList
            items={selectedPillOptions}
            maxVisibleItems={
              showAll
                ? selectedPillOptions.length
                : MAX_VISIBLE_SELECTED_OPTIONS
            }
            className={showAll ? "flex-wrap overflow-visible" : undefined}
            renderItem={(option) => (
              <MetaPill
                label={option.label}
                disabled={disabled}
                onRemove={() => handleRemove(option.value)}
              />
            )}
          />
        </View>
      ) : null}

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
        {/* Header */}
        <View className="px-6 py-3">
          {title ? <ThemedText type="title">{title}</ThemedText> : null}

          {!isLoading && !isError && options.length > 0 ? (
            <ThemedText type="small" tone="muted" className="mt-1">
              {selectedValues.length} selected
            </ThemedText>
          ) : null}
        </View>

        {/* Content */}
        {isLoading || isError || options.length === 0 ? (
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
          <View className="flex-1">
            <BottomSheetFlatList
              ref={listRef}
              data={options}
              keyExtractor={(item: SelectOption) => String(item.value)}
              renderItem={renderItem}
              onEndReached={onEndReached}
              onEndReachedThreshold={0.4}
              keyboardShouldPersistTaps="handled"
              onScrollToIndexFailed={onScrollToIndexFailed}
              ListFooterComponent={listFooterComponent}
              contentContainerStyle={{
                paddingBottom: 12,
              }}
            />

            <View
              className="px-4 pt-2"
              style={{
                paddingBottom: insets.bottom,
              }}
            >
              <AppButton
                title="Done"
                variant="primary"
                icon={{
                  name: "check",
                  size: "sm",
                }}
                onPress={closeSheet}
              />
            </View>
          </View>
        )}
      </BottomSheetModal>
    </>
  );
}
