import { AppButton } from "@/components/custom-ui/AppButton";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useDefaultBottomSheetAnimation } from "@/hooks/useBottomSheetAnimation";
import { hmsToSeconds, secondsToHMS } from "@/lib/workout/mappers";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import clsx from "clsx";
import { Check, Timer, X } from "lucide-react-native";
import { useCallback, useRef, useState } from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";
import { DurationValue, DurationWheelPicker } from "./DurationWheelPicker";

type DurationBottomSheetPickerProps = {
  value: number;
  title: string;
  onChange: (value: number) => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export function DurationBottomSheetPicker({
  value,
  title,
  onChange,
  className,
  style,
  disabled,
}: DurationBottomSheetPickerProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const animationConfigs = useDefaultBottomSheetAnimation();

  const [draftValue, setDraftValue] = useState<DurationValue>(
    secondsToDuration(value),
  );

  const hasChanges = durationToSeconds(draftValue) !== value;

  const openSheet = () => {
    if (disabled) return;
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
      <Pressable
        onPress={openSheet}
        disabled={disabled}
        className={twMerge(clsx("flex-row items-center gap-1", className))}
        style={[{ opacity: disabled ? 0.5 : 1 }, style]}
      >
        <Timer size={20} color={colors.app.brand} />

        <ThemedText type="default" variant="brand">
          {value ? `Rest: ${formatDuration(value)}` : `No rest`}
        </ThemedText>
      </Pressable>

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
          backgroundColor: colors.app.toastBackground,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.app.borderSecondary,
        }}
        onDismiss={() => setDraftValue(secondsToDuration(value))}
      >
        <BottomSheetView>
          <View className="px-6 py-3">
            <ThemedText type="title" variant="accent">
              {title}
            </ThemedText>
          </View>

          <DurationWheelPicker value={draftValue} onChange={setDraftValue} />

          <View
            className="flex-row gap-3 px-4 pt-3"
            style={{ paddingBottom: insets.bottom }}
          >
            <AppButton
              title="Cancel"
              variant="secondary"
              icon={X}
              className="flex-1"
              onPress={handleCancel}
            />

            <AppButton
              title="Done"
              variant="primary"
              icon={Check}
              className="flex-1"
              onPress={handleDone}
              disabled={!hasChanges}
            />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}

function secondsToDuration(totalSeconds: number): DurationValue {
  const { hours, minutes, seconds } = secondsToHMS(totalSeconds);

  return {
    hours: hours ?? 0,
    minutes: minutes ?? 0,
    seconds: seconds ?? 0,
  };
}

function durationToSeconds(value: DurationValue) {
  return hmsToSeconds(value.hours, value.minutes, value.seconds) ?? 0;
}

export function formatDuration(totalSeconds: number) {
  const { hours, minutes, seconds } = secondsToDuration(totalSeconds);

  const paddedMinutes = minutes.toString().padStart(2, "0");
  const paddedSeconds = seconds.toString().padStart(2, "0");

  // H:MM:SS
  if (hours > 0) {
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  }

  // M:SS
  return `${minutes}:${paddedSeconds}`;
}
