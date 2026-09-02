import { AppButton } from "@/components/custom-ui/app-button";
import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { CONTENT_PADDING_BOTTOM } from "@/components/layout/PageLayout";
import { useAppColors } from "@/hooks/useAppColors";
import { useDefaultBottomSheetAnimation } from "@/hooks/useBottomSheetAnimation";
import { cn } from "@/lib/utils";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import type { ReactNode } from "react";
import { useCallback, useRef } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DurationWheelPicker } from "./DurationWheelPicker";
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

  const openSheet = () => {
    if (disabled) {
      return;
    }

    bottomSheetModalRef.current?.present();
  };

  const closeSheet = () => {
    bottomSheetModalRef.current?.dismiss();
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
      </BottomSheetModal>
    </>
  );
}
