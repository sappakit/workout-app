import { AppButton } from "@/components/custom-ui/app-button";
import { useAppColors } from "@/hooks/useAppColors";
import { useDefaultBottomSheetAnimation } from "@/hooks/useBottomSheetAnimation";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import type { ReactNode } from "react";
import { useCallback, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FilterBottomSheetProps<TValue> = {
  value: TValue;
  onApplyFilters: (value: TValue) => void;
  renderContent: (props: {
    value: TValue;
    bottomInset: number;
    onClose: () => void;
    onApplyFilters: (value: TValue) => void;
  }) => ReactNode;
};

export function FilterBottomSheet<TValue>({
  value,
  onApplyFilters,
  renderContent,
}: FilterBottomSheetProps<TValue>) {
  const colors = useAppColors();
  const insets = useSafeAreaInsets();

  const animationConfigs = useDefaultBottomSheetAnimation();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const openSheet = () => {
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
      <AppButton
        variant="secondary"
        size="icon"
        className="h-10 w-10 rounded-full"
        icon={{
          name: "filter",
          size: "sm",
        }}
        onPress={openSheet}
      />

      <BottomSheetModal
        ref={bottomSheetModalRef}
        topInset={insets.top}
        enableDynamicSizing
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
        <BottomSheetView
          style={{
            minHeight: 380,
          }}
        >
          {renderContent({
            value,
            bottomInset: insets.bottom,
            onClose: closeSheet,
            onApplyFilters,
          })}
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}
