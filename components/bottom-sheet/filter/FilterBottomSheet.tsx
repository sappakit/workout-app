import { AppButton } from "@/components/custom-ui/app-button";
import { CONTENT_PADDING_HORIZONTAL } from "@/components/layout/PageLayout";
import type { ReactNode } from "react";
import { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PickerBottomSheet } from "../picker/PickerBottomSheet";

type FilterBottomSheetProps<TValue> = {
  value: TValue;
  onChange: (value: TValue) => void;
  resetValue: TValue;

  children: (props: {
    value: TValue;
    onChange: (value: TValue) => void;
    bottomContentInset: number;
  }) => ReactNode;
};

export function FilterBottomSheet<TValue>({
  value,
  onChange,
  resetValue,
  children,
}: FilterBottomSheetProps<TValue>) {
  const insets = useSafeAreaInsets();

  const [footerHeight, setFooterHeight] = useState(0);

  const bottomContentInset =
    footerHeight > 0 ? footerHeight + CONTENT_PADDING_HORIZONTAL : 0;

  const handleReset = () => {
    onChange(resetValue);
  };

  return (
    <PickerBottomSheet
      trigger={({ open }) => (
        <AppButton
          variant="secondary"
          size="icon"
          className="h-10 w-10 rounded-full"
          icon={{
            name: "filter",
            size: "sm",
          }}
          onPress={open}
        />
      )}
      footer={({ close, isReady }) => (
        <View
          className="flex-row gap-3 bg-popover px-4 pt-3"
          style={{
            paddingBottom: insets.bottom + CONTENT_PADDING_HORIZONTAL,
          }}
          onLayout={(event) => {
            setFooterHeight(event.nativeEvent.layout.height);
          }}
        >
          <AppButton
            title="Reset"
            variant="outline"
            className="flex-1"
            icon={{
              name: "refresh",
              size: "sm",
            }}
            onPress={handleReset}
            disabled={!isReady}
          />

          <AppButton
            title="View results"
            variant="primary"
            className="flex-1"
            icon={{
              name: "filter",
              size: "sm",
            }}
            onPress={close}
            disabled={!isReady}
          />
        </View>
      )}
    >
      {children({
        value,
        onChange,
        bottomContentInset,
      })}
    </PickerBottomSheet>
  );
}
