import { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";
import type { ColorValue } from "react-native";
import type { AppIconName } from "../app-icon/app-icon.registry";
import type { AppIconSize } from "../app-icon/app-icon.styles";
import type { AppIconVariant } from "../app-icon/app-icon.types";
import type { AppButtonVariant } from "./app-button.styles";

type ReusableButtonProps = ComponentProps<typeof Button>;

export type AppButtonIconPosition = "left" | "right";

export type AppButtonIcon = {
  name: AppIconName;
  variant?: AppIconVariant;
  position?: AppButtonIconPosition;
  size?: AppIconSize;
  color?: ColorValue;
};

interface BaseAppButtonProps extends Omit<
  ReusableButtonProps,
  "children" | "variant"
> {
  variant?: AppButtonVariant;
  loading?: boolean;
  textClassName?: string;
}

type AppButtonContent =
  | {
      title: string;
      icon?: AppButtonIcon;
    }
  | {
      title?: string;
      icon: AppButtonIcon;
    };

export type AppButtonProps = BaseAppButtonProps & AppButtonContent;
