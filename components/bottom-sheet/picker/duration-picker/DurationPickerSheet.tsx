import { AppBottomSheetModal } from "@/components/bottom-sheet/AppBottomSheetModal";
import { AppButton } from "@/components/custom-ui/app-button";
import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { FormSelectTrigger } from "@/components/form/FormSelectTrigger";
import { CONTENT_PADDING_HORIZONTAL } from "@/constants/page-layout.constants";
import { useAppColors } from "@/hooks/useAppColors";
import { cn } from "@/lib/utils";
import {
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetFooterProps,
} from "@gorhom/bottom-sheet";
import { useCallback, useRef, useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OptionPickerPageHeader } from "../option-picker/OptionPickerPage";
import { DurationWheelPicker } from "./DurationWheelPicker";
import { durationToSeconds, formatDuration, secondsToDuration } from "./utils";

export type DurationPickerTriggerVariant = "label" | "field";

type DurationPickerTextAlign = "left" | "center" | "right";

type DurationBottomSheetPickerProps = {
  value: number;
  title: string;
  onChange?: (value: number) => void;
  triggerVariant?: DurationPickerTriggerVariant;
  textAlign?: DurationPickerTextAlign;
  error?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export function DurationBottomSheetPicker({
  value,
  title,
  onChange,
  triggerVariant = "label",
  textAlign = "left",
  error = false,
  className,
  style,
  disabled = false,
}: DurationBottomSheetPickerProps) {
  const colors = useAppColors();
  const insets = useSafeAreaInsets();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [footerHeight, setFooterHeight] = useState(0);

  const openSheet = () => {
    if (disabled) {
      return;
    }

    bottomSheetModalRef.current?.present();
  };

  const closeSheet = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props}>
        <View
          className="bg-popover px-4 pt-3"
          style={{
            paddingBottom: insets.bottom + CONTENT_PADDING_HORIZONTAL,
          }}
          onLayout={(event) => {
            setFooterHeight(event.nativeEvent.layout.height);
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
      </BottomSheetFooter>
    ),
    [closeSheet, insets.bottom],
  );

  return (
    <>
      {triggerVariant === "field" ? (
        <FormSelectTrigger
          label={formatDurationFieldLabel(value)}
          onPress={openSheet}
          disabled={disabled}
          error={error}
          textAlign={textAlign}
          className={className}
          style={style}
        />
      ) : (
        <Pressable
          onPress={openSheet}
          disabled={disabled}
          className={cn(
            "flex-row items-center gap-2",
            disabled && "opacity-50",
            className,
          )}
          style={style}
        >
          <AppIcon name="timer" size="md" color={colors.primary} />

          <ThemedText type="body" tone="primary">
            {value ? `Rest: ${formatDuration(value)}` : "No rest"}
          </ThemedText>
        </Pressable>
      )}

      <AppBottomSheetModal
        ref={bottomSheetModalRef}
        enableDynamicSizing
        enableContentPanningGesture={false}
        footerComponent={renderFooter}
      >
        <BottomSheetView>
          <View
            className="gap-4 px-4"
            style={{
              paddingBottom:
                footerHeight > 0
                  ? footerHeight + CONTENT_PADDING_HORIZONTAL
                  : 0,
            }}
          >
            <OptionPickerPageHeader title={title} />

            <DurationWheelPicker
              value={secondsToDuration(value)}
              onChange={(duration) => {
                onChange?.(durationToSeconds(duration));
              }}
            />
          </View>
        </BottomSheetView>
      </AppBottomSheetModal>
    </>
  );
}

function formatDurationFieldLabel(seconds: number) {
  if (seconds === 0) {
    return "0 sec";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  }

  if (minutes > 0) {
    parts.push(`${minutes} min`);
  }

  if (remainingSeconds > 0) {
    parts.push(`${remainingSeconds} sec`);
  }

  return parts.join(" ");
}
