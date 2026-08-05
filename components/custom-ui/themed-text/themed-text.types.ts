import { Text } from "@/components/ui/text";
import type { ComponentProps } from "react";

type ReusableTextProps = ComponentProps<typeof Text>;

export type AppTextType =
  | "display"
  | "title"
  | "heading"
  | "body"
  | "bodyStrong"
  | "label"
  | "small"
  | "caption";

export type AppTextTone =
  | "default"
  | "muted"
  | "subtle"
  | "primary"
  | "contrast"
  | "success"
  | "warning"
  | "destructive";

export type ThemedTextV2Props = ReusableTextProps & {
  type?: AppTextType;
  tone?: AppTextTone;
};
