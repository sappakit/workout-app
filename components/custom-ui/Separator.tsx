import { useAppTheme } from "@/hooks/useAppTheme";
import clsx from "clsx";
import { View, ViewProps } from "react-native";
import { twMerge } from "tailwind-merge";

interface SeparatorProps extends ViewProps {
  orientation?: "vertical" | "horizontal";
  className?: string;
}

export function Separator({
  orientation = "vertical",
  className,
  style,
  ...props
}: SeparatorProps) {
  const { colors } = useAppTheme();
  const lineOrientation =
    orientation === "vertical" ? "h-full w-[1px]" : "w-full h-[1px]";

  return (
    <View
      {...props}
      className={twMerge(clsx(lineOrientation, className))}
      style={[{ backgroundColor: colors.app.borderTertiary }, style]}
    />
  );
}
