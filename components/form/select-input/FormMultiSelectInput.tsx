import { AppButton } from "@/components/custom-ui/AppButton";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useDefaultBottomSheetAnimation } from "@/hooks/useBottomSheetAnimation";
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import clsx from "clsx";
import { Check, ChevronDown, ChevronUp, X } from "lucide-react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  ListRenderItem,
  Pressable,
  PressableProps,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface FormMultiSelectInputProps {
  options: SelectOption[];
  value?: (string | number)[];
  onChange?: (value: (string | number)[]) => void;
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
  disabled?: boolean;
}

export default function FormMultiSelectInput({
  options,
  value = [],
  onChange,
  placeholder = "Select options",
  validationError,
  className,
  style,
  title,
  isLoading,
  isError,
  isFetchingNextPage,
  onEndReached,
  snapPoints,
  disabled,
}: FormMultiSelectInputProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const listRef = useRef<BottomSheetFlatListMethods>(null);
  const animationConfigs = useDefaultBottomSheetAnimation();

  const selectedValues = value ?? [];

  const selectedOptions = useMemo(() => {
    const selectedSet = new Set(selectedValues);
    return options.filter((option) => selectedSet.has(option.value));
  }, [options, selectedValues]);

  const selectedLabel = useMemo(() => {
    if (selectedOptions.length === 0) return undefined;
    if (selectedOptions.length === 1) return "1 muscle group selected";
    return `${selectedOptions.length} muscle groups selected`;
  }, [selectedOptions]);

  const firstSelectedIndex = useMemo(() => {
    if (selectedValues.length === 0) return -1;
    return options.findIndex((option) => selectedValues.includes(option.value));
  }, [options, selectedValues]);

  // Chips display
  const [showAll, setShowAll] = useState(false);

  const visibleOptions = showAll
    ? selectedOptions
    : selectedOptions.slice(0, 3);
  const remainingCount = selectedOptions.length - 3;

  const openSheet = () => {
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
    if (disabled) return;
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
      <View className={twMerge(clsx("px-2", index > 0 && "pt-1"))}>
        <Pressable
          onPress={() => handleToggle(item.value)}
          className="h-14 flex-row items-center justify-between rounded-xl p-4"
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
        disabled={disabled}
        className={twMerge(
          clsx(
            "h-12 flex-row items-center justify-between rounded-lg border px-4",
            className,
          ),
        )}
        style={[
          {
            opacity: disabled ? 0.5 : 1,
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

      {/* Selected chips display */}
      {selectedOptions.length > 0 && (
        <View className="mt-2">
          {/* Show all */}
          {selectedOptions.length > 3 && (
            <Pressable
              className="mb-2 flex-row items-center gap-1"
              onPress={() => setShowAll((prev) => !prev)}
            >
              <ThemedText type="default" variant="primary" className="text-sm">
                {showAll ? "Show less" : "Show all"}
              </ThemedText>

              <View>
                {showAll ? (
                  <ChevronUp size={12} color={colors.app.textPrimary} />
                ) : (
                  <ChevronDown size={12} color={colors.app.textPrimary} />
                )}
              </View>
            </Pressable>
          )}

          <View className="flex-row flex-wrap items-center gap-2">
            {visibleOptions.map((option) => (
              <SelectedMuscleBadge
                key={option.value}
                option={option}
                handleRemove={handleRemove}
                disabled={disabled}
              />
            ))}

            {!showAll && remainingCount > 0 && (
              <Pressable onPress={() => setShowAll(true)}>
                <ThemedText
                  type="default"
                  variant="primary"
                  className="text-sm"
                >
                  +{remainingCount} more
                </ThemedText>
              </Pressable>
            )}
          </View>
        </View>
      )}

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
          backgroundColor: colors.app.toastBackground,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.app.borderSecondary,
        }}
      >
        {/* Header */}
        <View className="px-6 py-3">
          {title && (
            <ThemedText type="title" variant="accent">
              {title}
            </ThemedText>
          )}

          {!isLoading && !isError && options.length > 0 && (
            <ThemedText type="default" variant="primary" className="mt-1">
              {selectedValues.length} selected
            </ThemedText>
          )}
        </View>

        {/* Content */}
        {isLoading || isError || options.length === 0 ? (
          <View className="px-2" style={{ paddingBottom: insets.bottom + 16 }}>
            <ThemedText type="default" variant="primary" className="p-4">
              {content}
            </ThemedText>
          </View>
        ) : (
          <View className="flex-1">
            <BottomSheetFlatList
              ref={listRef}
              data={options}
              keyExtractor={(item: SelectOption) => item.value.toString()}
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
              style={{ paddingBottom: insets.bottom }}
            >
              <AppButton
                title="Done"
                variant="primary"
                onPress={closeSheet}
                icon={Check}
              />
            </View>
          </View>
        )}
      </BottomSheetModal>
    </>
  );
}

interface BaseDisplayProps extends PressableProps {
  option: SelectOption;
  handleRemove: (optionValue: string | number) => void;
  className?: string;
}

function SelectedMuscleBadge({
  option,
  handleRemove,
  disabled,
  className,
}: BaseDisplayProps) {
  const { colors } = useAppTheme();

  return (
    <View
      className={twMerge(
        clsx(
          "flex-shrink-0 flex-row items-center justify-center gap-1 rounded-full border py-1 pl-4 pr-3",
          className,
        ),
      )}
      style={{
        backgroundColor: colors.app.cardSecondary,
        borderColor: colors.app.borderTertiary,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <ThemedText type="default" variant="primary" className="text-xs">
        {option.label}
      </ThemedText>

      <Pressable onPress={() => handleRemove(option.value)}>
        <X size={14} color={colors.app.textPrimary} />
      </Pressable>
    </View>
  );
}
