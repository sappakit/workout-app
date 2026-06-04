import clsx from "clsx";
import { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { twMerge } from "tailwind-merge";

interface ScreenSectionProps {
  children: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export function ScreenSection({
  children,
  className,
  style,
}: ScreenSectionProps) {
  return (
    <View className={twMerge(clsx("gap-3", className))} style={style}>
      {children}
    </View>
  );
}
