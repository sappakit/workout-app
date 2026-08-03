import type { ComponentProps } from "react";
import type { ColorValue, StyleProp, TextStyle } from "react-native";

// Icon libraries
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

export type IoniconName = ComponentProps<typeof Ionicons>["name"];

export type MaterialDesignIconName = ComponentProps<
  typeof MaterialDesignIcons
>["name"];

export type AppIconName =
  | "add"
  | "back"
  | "calendar"
  | "check"
  | "chevron-down"
  | "chevron-right"
  | "close"
  | "delete"
  | "duration"
  | "edit"
  | "exercise"
  | "filter"
  | "history"
  | "home"
  | "menu"
  | "more"
  | "pause"
  | "play"
  | "profile"
  | "progress"
  | "reorder"
  | "search"
  | "settings"
  | "streak"
  | "timer"
  | "volume"
  | "workout";

export type AppIconVariant = "filled" | "outline";

export type AppIconProps = {
  name: AppIconName;
  variant?: AppIconVariant;
  size?: number;
  color?: ColorValue;
  style?: StyleProp<TextStyle>;
};

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
