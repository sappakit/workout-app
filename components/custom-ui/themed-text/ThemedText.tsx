import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { textToneClassMap, textTypeClassMap } from "./themed-text.styles";
import type { ThemedTextProps } from "./themed-text.types";

export function ThemedText({
  type = "body",
  tone,
  className,
  ...props
}: ThemedTextProps) {
  return (
    <Text
      {...props}
      className={cn(
        textTypeClassMap[type],
        tone && textToneClassMap[tone],
        className,
      )}
    />
  );
}
