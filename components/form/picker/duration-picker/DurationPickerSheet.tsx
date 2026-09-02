import { AppBottomSheetModal } from "@/components/bottom-sheet/AppBottomSheetModal";
import { AppButton } from "@/components/custom-ui/app-button";
import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { CONTENT_PADDING_BOTTOM } from "@/components/layout/PageLayout";
import { useAppColors } from "@/hooks/useAppColors";
import { cn } from "@/lib/utils";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FormSelectTrigger } from "../../select-input/FormSelectTrigger";
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

  const openSheet = () => {
    if (disabled) {
      return;
    }

    bottomSheetModalRef.current?.present();
  };

  const closeSheet = () => {
    bottomSheetModalRef.current?.dismiss();
  };

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
      >
        <BottomSheetView>
          <View
            className="gap-4 px-4"
            style={{
              paddingBottom: insets.bottom + CONTENT_PADDING_BOTTOM,
            }}
          >
            <ThemedText type="title">{title}</ThemedText>

            <DurationWheelPicker
              value={secondsToDuration(value)}
              onChange={(duration) => {
                onChange?.(durationToSeconds(duration));
              }}
            />

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
