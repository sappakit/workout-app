import { AppBottomSheetModal } from "@/components/bottom-sheet/AppBottomSheetModal";
import {
  BottomSheetFooter,
  BottomSheetModal,
  type BottomSheetFooterProps,
} from "@gorhom/bottom-sheet";
import type { ReactNode } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import { View } from "react-native";

type PickerBottomSheetProps = {
  trigger: (props: { open: () => void }) => ReactNode;
  footer?: (props: { close: () => void; isReady: boolean }) => ReactNode;
  children: ReactNode;
};

export function PickerBottomSheet({
  trigger,
  footer,
  children,
}: PickerBottomSheetProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [isReady, setIsReady] = useState(false);

  const snapPoints = useMemo(() => ["60%", "90%"], []);

  const open = useCallback(() => {
    setIsReady(false);

    bottomSheetModalRef.current?.present();
  }, []);

  const close = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const handleChange = useCallback((index: number) => {
    if (index === 0) {
      setIsReady(true);
    }
  }, []);

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => {
      if (!footer) {
        return null;
      }

      return (
        <BottomSheetFooter {...props}>
          {footer({
            close,
            isReady,
          })}
        </BottomSheetFooter>
      );
    },
    [close, footer, isReady],
  );

  return (
    <>
      {trigger({ open })}

      <AppBottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enableContentPanningGesture={isReady}
        enableHandlePanningGesture={isReady}
        footerComponent={footer ? renderFooter : undefined}
        onChange={handleChange}
      >
        <View className="flex-1">
          {!isReady && (
            <View className="absolute inset-0 z-50" pointerEvents="auto" />
          )}

          {children}
        </View>
      </AppBottomSheetModal>
    </>
  );
}
