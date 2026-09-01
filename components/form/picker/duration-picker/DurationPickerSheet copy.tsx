import { AppButton } from "@/components/custom-ui/app-button";
import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { useAppColors } from "@/hooks/useAppColors";
import { useDefaultBottomSheetAnimation } from "@/hooks/useBottomSheetAnimation";
import { cn } from "@/lib/utils";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import type { ReactNode } from "react";
import { useCallback, useRef, useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { type DurationValue, DurationWheelPicker } from "./DurationWheelPicker";
import { durationToSeconds, formatDuration, secondsToDuration } from "./utils";

type DurationBottomSheetPickerRenderTriggerProps = {
  value: number;
  openSheet: () => void;
  disabled?: boolean;
};

type DurationBottomSheetPickerProps = {
  value: number;
  title: string;
  onChange?: (value: number) => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  renderTrigger?: (
    props: DurationBottomSheetPickerRenderTriggerProps,
  ) => ReactNode;
};

export function DurationBottomSheetPicker({
  value,
  title,
  onChange,
  className,
  style,
  disabled = false,
  renderTrigger,
}: DurationBottomSheetPickerProps) {
  const colors = useAppColors();
  const insets = useSafeAreaInsets();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const animationConfigs = useDefaultBottomSheetAnimation();

  const [draftValue, setDraftValue] = useState<DurationValue>(
    secondsToDuration(value),
  );

  const hasChanges = durationToSeconds(draftValue) !== value;

  const openSheet = () => {
    if (disabled) {
      return;
    }

    setDraftValue(secondsToDuration(value));

    bottomSheetModalRef.current?.present();
  };

  const closeSheet = () => {
    bottomSheetModalRef.current?.dismiss();
  };

  const handleCancel = () => {
    setDraftValue(secondsToDuration(value));

    closeSheet();
  };

  const handleDone = () => {
    onChange?.(durationToSeconds(draftValue));

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
      {renderTrigger ? (
        renderTrigger({
          value,
          openSheet,
          disabled,
        })
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

      <BottomSheetModal
        ref={bottomSheetModalRef}
        enableDynamicSizing
        topInset={insets.top}
        enablePanDownToClose
        enableOverDrag
        enableContentPanningGesture={false}
        animationConfigs={animationConfigs}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: colors.popover,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.borderStrong,
        }}
        onDismiss={() => setDraftValue(secondsToDuration(value))}
      >
        <BottomSheetView>
          <View className="px-6 py-3">
            <ThemedText type="title">{title}</ThemedText>
          </View>

          <DurationWheelPicker value={draftValue} onChange={setDraftValue} />

          <View
            className="flex-row gap-3 px-4 pt-3"
            style={{
              paddingBottom: insets.bottom,
            }}
          >
            <AppButton
              title="Cancel"
              variant="secondary"
              className="flex-1"
              icon={{
                name: "close",
                size: "sm",
              }}
              onPress={handleCancel}
            />

            <AppButton
              title="Done"
              variant="primary"
              className="flex-1"
              icon={{
                name: "check",
                size: "sm",
              }}
              onPress={handleDone}
              disabled={!hasChanges}
            />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}
