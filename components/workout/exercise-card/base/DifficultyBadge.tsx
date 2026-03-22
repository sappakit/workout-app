import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import clsx from "clsx";
import { View } from "react-native";
import { twMerge } from "tailwind-merge";

export function DifficultyBadge({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const { colors } = useAppTheme();

  return (
    <View
      className={twMerge(clsx("px-3 py-0.5", className))}
      style={{
        backgroundColor: colors.app.brand,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
      }}
    >
      <ThemedText
        type="default"
        className="text-xs"
        style={{ color: colors.app.textWhite }}
      >
        {label}
      </ThemedText>
    </View>
  );
}
