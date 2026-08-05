import { Ionicons } from "@react-native-vector-icons/ionicons";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import type { ComponentProps } from "react";

export type IoniconName = ComponentProps<typeof Ionicons>["name"];

export type MaterialDesignIconName = ComponentProps<
  typeof MaterialDesignIcons
>["name"];

export type AppIconVariant = "filled" | "outline";

export type AppIconSize = "xs" | "sm" | "md" | "lg" | "xl";

export type IconDefinition =
  | {
      family: "ionicons";
      name: IoniconName;
    }
  | {
      family: "material-design-icons";
      name: MaterialDesignIconName;
    };

export type IconVariantDefinition = {
  filled: IconDefinition;
  outline?: IconDefinition;
};
