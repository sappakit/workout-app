import { AppButton } from "@/components/custom-ui/AppButton";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useDefaultBottomSheetAnimation } from "@/hooks/useBottomSheetAnimation";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import clsx from "clsx";
import { Timer } from "lucide-react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";
import { DurationValue, DurationWheelPicker } from "./DurationWheelPicker";


type DurationBottomSheetPickerProps = {
  title?: string;
  value?: DurationValue;
  onChange?: (value: DurationValue) => void;
  placeholder?: string;
  className?: string;
  style?: ViewStyle;
  disabled?: boolean;
  snapPoints?: (string | number)[];
};

const DEFAULT_VALUE: DurationValue = {
  hours: 0,
  minutes: 1,
  seconds: 0,
};

function formatDuration(value: DurationValue) {
  const { hours, minutes, seconds } = value;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}

function isSameDuration(a: DurationValue, b: DurationValue) {
  return (
    a.hours === b.hours && a.minutes === b.minutes && a.seconds === b.seconds
  );
}

export function DurationBottomSheetPicker({
  title,
  value = DEFAULT_VALUE,
  onChange,
  placeholder = "Select duration",
  className,
  style,
  disabled,
  snapPoints,
}: DurationBottomSheetPickerProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const animationConfigs = useDefaultBottomSheetAnimation();

  const [draftValue, setDraftValue] = useState<DurationValue>(value);

  const selectedLabel = useMemo(() => formatDuration(value), [value]);
  const hasChanges = useMemo(
    () => !isSameDuration(draftValue, value),
    [draftValue, value],
  );

  const openSheet = () => {
    if (disabled) return;
    setDraftValue(value);
    bottomSheetModalRef.current?.present();
  };

  const closeSheet = () => {
    bottomSheetModalRef.current?.dismiss();
  };

  const handleCancel = () => {
    setDraftValue(value);
    closeSheet();
  };

  const handleDone = () => {
    onChange?.(draftValue);
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
          1 min rest
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
        onDismiss={() => {
          setDraftValue(value);
        }}
      >
        <BottomSheetView>
          <View className="px-6 py-3">
            <ThemedText type="title" variant="accent">
              {title}
            </ThemedText>

            {/* <ThemedText type="default" variant="primary" className="mt-1">
              {formatDuration(draftValue)}
            </ThemedText> */}
          </View>

          <DurationWheelPicker value={draftValue} onChange={setDraftValue} />

          <View
            className="flex-row gap-3 px-4 py-2"
            style={{ paddingBottom: insets.bottom }}
          >
            <AppButton
              title="Cancel"
              variant="secondary"
              className="flex-1"
              onPress={handleCancel}
            />

            <AppButton
              title="Done"
              variant="primary"
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
