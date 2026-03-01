import { useAppTheme } from "@/hooks/useAppTheme";
import clsx from "clsx";
import { View } from "react-native";
import { twMerge } from "tailwind-merge";

type SeparatorProps = {
  orientation?: "vertical" | "horizontal";
  color?: string;
  className?: string;
};

export function Separator({
  orientation = "vertical",
  color,
  className,
}: SeparatorProps) {
  const { colors } = useAppTheme();
  const lineOrientation =
    orientation === "vertical" ? "h-full w-[1px]" : "w-full h-[1px]";

  return (
    <View
      className={twMerge(clsx(lineOrientation, className))}
      style={{
        backgroundColor: color ?? colors.app.borderTertiary,
      }}
    />
  );
}
