import type { AppTextType } from "@/components/custom-ui/themed-text";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { type StyleProp, type TextStyle, View } from "react-native";

type SectionHeaderSize = "small" | "default";

type SectionHeaderTextTypes = {
  title: AppTextType;
  subtitle: AppTextType;
};

const sizeTextTypeMap = {
  small: {
    title: "heading",
    subtitle: "caption",
  },
  default: {
    title: "title",
    subtitle: "small",
  },
} satisfies Record<SectionHeaderSize, SectionHeaderTextTypes>;

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
  const textTypes = sizeTextTypeMap[size];

  return (
    <View className={className}>
      <View className="flex-row items-center justify-between gap-3">
        <ThemedText
          type={textTypes.title}
          className={cn("flex-1", titleClassName)}
          style={titleStyle}
        >
          {title}
        </ThemedText>

        {action}
      </View>

      {subtitle && (
        <ThemedText
          type={textTypes.subtitle}
          tone="muted"
          className={subtitleClassName}
          style={subtitleStyle}
        >
          {subtitle}
        </ThemedText>
      )}
    </View>
  );
}
