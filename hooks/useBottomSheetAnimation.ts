import { useBottomSheetSpringConfigs } from "@gorhom/bottom-sheet";

export function useDefaultBottomSheetAnimation() {
  return useBottomSheetSpringConfigs({
    overshootClamping: false,
  });
}
