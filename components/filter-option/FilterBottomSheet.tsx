import { AppButton } from "@/components/custom-ui/AppButton";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useDefaultBottomSheetAnimation } from "@/hooks/useBottomSheetAnimation";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { SlidersHorizontal } from "lucide-react-native";
import { ReactNode, useCallback, useRef } from "react";
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
  const { colors } = useAppTheme();
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
        variant="option"
        icon={SlidersHorizontal}
        className="h-12 w-12"
        shape="pill"
        iconSize={18}
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
          backgroundColor: colors.app.cardPrimary,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.app.borderSecondary,
        }}
      >
        <BottomSheetView style={{ minHeight: 380 }}>
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
