import { Text } from "@/components/ui/text";
import type { ComponentProps } from "react";
import type { ThemedTextTone, ThemedTextType } from "./themed-text.styles";

type ReusableTextProps = ComponentProps<typeof Text>;

export type ThemedTextProps = ReusableTextProps & {
  type?: ThemedTextType;
  tone?: ThemedTextTone;
};
