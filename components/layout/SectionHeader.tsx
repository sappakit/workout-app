import clsx from "clsx";
import { View } from "react-native";
import { twMerge } from "tailwind-merge";
import { ThemedText } from "../themed-text";

interface SectionHeaderProps {
  title: string;
  actionText?: string;
  showActionText?: boolean;
  className?: string;
}

export function SectionHeader({
  title,
  actionText = "View All",
  showActionText = true,
  className,
}: SectionHeaderProps) {
  return (
    <View
      className={twMerge(
        clsx("flex-row items-center justify-between", className),
      )}
    >
      <ThemedText type="defaultSemiBold" variant="accent" className="text-xl">
        {title}
      </ThemedText>

      {showActionText && (
        <ThemedText type="default" variant="primary" className="text-sm">
          {actionText}
        </ThemedText>
      )}
    </View>
  );
}
