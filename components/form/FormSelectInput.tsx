import { useAppTheme } from "@/hooks/useAppTheme";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import clsx from "clsx";
import { Check, ChevronDown } from "lucide-react-native";
import React, { useCallback, useRef } from "react";
import { Pressable, View, ViewStyle } from "react-native";
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
  error?: boolean;
  className?: string;
  style?: ViewStyle;
  title?: string;
}

export default function FormSelectInput({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  error,
  className,
  style,
  title,
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
            borderColor: error ? colors.app.error : colors.app.borderPrimary,
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
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: colors.app.toastBackground,
        }}
        handleIndicatorStyle={{ backgroundColor: colors.app.borderSecondary }}
      >
        <BottomSheetView style={{ paddingBottom: insets.bottom + 16 }}>
          {/* Title */}
          {title && (
            <ThemedText type="title" variant="accent" className="px-6 py-3">
              {title}
            </ThemedText>
          )}

          {/* Options */}
          {options.map((option, index) => {
            const isSelected = option.value === value;

            return (
              <View
                key={option.value}
                className={clsx("px-2", index > 0 && "pt-1")}
              >
                <Pressable
                  onPress={() => handleSelect(option.value)}
                  className="flex-row items-center justify-between rounded-xl p-4"
                  style={{
                    backgroundColor: isSelected
                      ? colors.app.brand + "20"
                      : "transparent",
                  }}
                >
                  <ThemedText
                    type="default"
                    variant={isSelected ? "brand" : "accent"}
                  >
                    {option.label}
                  </ThemedText>

                  {isSelected && <Check size={18} color={colors.app.brand} />}
                </Pressable>
              </View>
            );
          })}
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}
