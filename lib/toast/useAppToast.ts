import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

type AppToastParams = {
  title: string;
  message?: string;
};

export const useAppToast = () => {
  const insets = useSafeAreaInsets();
  const toastOffset = insets.top + 12;

  return {
    success: ({ title, message }: AppToastParams) =>
      Toast.show({
        type: "success",
        text1: title,
        text2: message,
        position: "top",
        topOffset: toastOffset,
      }),

    error: ({ title, message }: AppToastParams) =>
      Toast.show({
        type: "error",
        text1: title,
        text2: message,
        position: "top",
        topOffset: toastOffset,
      }),

    info: ({ title, message }: AppToastParams) =>
      Toast.show({
        type: "info",
        text1: title,
        text2: message,
        position: "top",
        topOffset: toastOffset,
      }),
  };
};
