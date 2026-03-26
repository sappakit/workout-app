import clsx from "clsx";
import { ReactNode } from "react";
import { View } from "react-native";
import { twMerge } from "tailwind-merge";
import { ThemedText } from "../themed-text";

interface SectionHeaderProps {
  title: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  action,
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

      {action}
    </View>
  );
}
