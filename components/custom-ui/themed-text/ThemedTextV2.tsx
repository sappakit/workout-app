import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { textToneClassMap, textTypeClassMap } from "./themed-text.styles";
import type { ThemedTextV2Props } from "./themed-text.types";

export function ThemedTextV2({
  type = "body",
  tone,
  className,
  ...props
}: ThemedTextV2Props) {
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
