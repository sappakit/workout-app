import clsx from "clsx";
import { ReactNode } from "react";
import { StyleProp, TextStyle, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { ThemedText } from "../themed-text";

type SectionHeaderSize = "small" | "default";

type SectionHeaderSizeClasses = {
  title: string;
  subtitle: string;
};

const sizeClassMap = {
  small: { title: "text-lg", subtitle: "text-xs" },
  default: { title: "text-xl", subtitle: "text-sm" },
} satisfies Record<SectionHeaderSize, SectionHeaderSizeClasses>;

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  size?: SectionHeaderSize;
  className?: string;
  titleClassName?: string;
  titleStyle?: StyleProp<TextStyle>;
  subtitleClassName?: string;
  subtitleStyle?: StyleProp<TextStyle>;
  action?: ReactNode;
}

export function SectionHeader({
  title,
  subtitle,
  size = "default",
  className,
  titleClassName,
  titleStyle,
  subtitleClassName,
  subtitleStyle,
  action,
}: SectionHeaderProps) {
  return (
    <View className={className}>
      <View className="flex-row items-center justify-between">
        <ThemedText
          type="defaultSemiBold"
          variant="accent"
          className={twMerge(clsx(sizeClassMap[size].title, titleClassName))}
          style={titleStyle}
        >
          {title}
        </ThemedText>

        {action}
      </View>

      {subtitle && (
        <ThemedText
          type="default"
          variant="primary"
          className={twMerge(
            clsx(sizeClassMap[size].subtitle, subtitleClassName),
          )}
          style={subtitleStyle}
        >
          {subtitle}
        </ThemedText>
      )}
    </View>
  );
}
