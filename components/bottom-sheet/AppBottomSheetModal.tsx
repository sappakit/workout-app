import { useAppColors } from "@/hooks/useAppColors";
import { useDefaultBottomSheetAnimation } from "@/hooks/useBottomSheetAnimation";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  type BottomSheetModalProps,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AppBottomSheetModalProps = Omit<
  BottomSheetModalProps,
  | "backdropComponent"
  | "backgroundStyle"
  | "handleIndicatorStyle"
  | "animationConfigs"
  | "topInset"
>;

export const AppBottomSheetModal = forwardRef<
  BottomSheetModal,
  AppBottomSheetModalProps
>(function AppBottomSheetModal(
  { children, enablePanDownToClose = true, enableOverDrag = true, ...props },
  ref,
) {
  const colors = useAppColors();
  const insets = useSafeAreaInsets();

  const animationConfigs = useDefaultBottomSheetAnimation();

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
    <BottomSheetModal
      ref={ref}
      topInset={insets.top}
      enablePanDownToClose={enablePanDownToClose}
      enableOverDrag={enableOverDrag}
      animationConfigs={animationConfigs}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: colors.popover,
      }}
      handleIndicatorStyle={{
        backgroundColor: colors.borderStrong,
      }}
      {...props}
    >
      {children}
    </BottomSheetModal>
  );
});
