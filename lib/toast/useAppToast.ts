import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

type AppToastParams = {
  title: string;
  message?: string;
};

export function useAppToast() {
  const insets = useSafeAreaInsets();
  const topOffset = insets.top + 12;

  const showToast = (
    type: "success" | "error" | "info",
    { title, message }: AppToastParams,
  ) => {
    Toast.show({
      type,
      text1: title,
      text2: message,
      position: "top",
      topOffset,
    });
  };

  return {
    success: (params: AppToastParams) => showToast("success", params),

    error: (params: AppToastParams) => showToast("error", params),

    info: (params: AppToastParams) => showToast("info", params),
  };
}
