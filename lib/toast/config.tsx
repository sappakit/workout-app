import { AppDarkTheme, AppLightTheme } from "@/constants/theme";
import { ColorSchemeName } from "react-native";
import { BaseToast, ErrorToast, ToastConfig } from "react-native-toast-message";

export const createToastConfig = (
  colorScheme: ColorSchemeName,
): ToastConfig => {
  const theme = colorScheme === "dark" ? AppDarkTheme : AppLightTheme;

  return {
    success: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: theme.colors.app.success,
          backgroundColor: theme.colors.app.toastBackground,
          borderRadius: 14,
        }}
        text1Style={{
          color: theme.colors.app.textAccent,
          fontWeight: "500",
        }}
        text2Style={{
          color: theme.colors.app.textPrimary,
        }}
      />
    ),

    error: (props) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: theme.colors.app.error,
          backgroundColor: theme.colors.app.toastBackground,
          borderRadius: 14,
        }}
        text1Style={{
          color: theme.colors.app.textAccent,
          fontWeight: "500",
        }}
        text2Style={{
          color: theme.colors.app.textPrimary,
        }}
      />
    ),

    info: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: theme.colors.app.warning,
          backgroundColor: theme.colors.app.toastBackground,
          borderRadius: 14,
        }}
        text1Style={{
          color: theme.colors.app.textAccent,
          fontWeight: "500",
        }}
        text2Style={{
          color: theme.colors.app.textPrimary,
        }}
      />
    ),
  };
};
