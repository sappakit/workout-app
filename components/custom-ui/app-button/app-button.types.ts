import { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";
import type { ColorValue } from "react-native";
import { AppIconName } from "../app-icon/app-icon.registry";
import { AppIconSize, AppIconVariant } from "../app-icon/app-icon.types";

type ReusableButtonProps = ComponentProps<typeof Button>;

export type AppButtonV2Variant =
  | "primary"
  | "secondary"
  | "contrast"
  | "outline"
  | "destructive"
  | "ghost";

export type AppButtonV2IconPosition = "left" | "right";

export type AppButtonV2Icon = {
  name: AppIconName;
  variant?: AppIconVariant;
  position?: AppButtonV2IconPosition;
  size?: AppIconSize;
  color?: ColorValue;
};

interface BaseAppButtonV2Props extends Omit<
  ReusableButtonProps,
  "children" | "variant"
> {
  variant?: AppButtonV2Variant;
  loading?: boolean;
  textClassName?: string;
}

type AppButtonV2Content =
  | {
      title: string;
      icon?: AppButtonV2Icon;
    }
  | {
      title?: string;
      icon: AppButtonV2Icon;
    };

export type AppButtonV2Props = BaseAppButtonV2Props & AppButtonV2Content;
