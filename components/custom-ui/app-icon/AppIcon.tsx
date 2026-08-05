import { Ionicons } from "@react-native-vector-icons/ionicons";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { ColorValue, StyleProp, TextStyle } from "react-native";
import { AppIconName, appIconRegistry } from "./app-icon.registry";
import { appIconSizeMap } from "./app-icon.styles";
import { AppIconSize, AppIconVariant } from "./app-icon.types";

const DEFAULT_ICON_COLOR = "#000000";

export type AppIconProps = {
  name: AppIconName;
  variant?: AppIconVariant;
  size?: AppIconSize;
  color?: ColorValue;
  style?: StyleProp<TextStyle>;
};

export function AppIcon({
  name,
  variant = "filled",
  size = "lg",
  color = DEFAULT_ICON_COLOR,
  style,
}: AppIconProps) {
  const iconDefinition = appIconRegistry[name];
  const resolvedSize = appIconSizeMap[size];

  const selectedIcon =
    variant === "outline" &&
    "outline" in iconDefinition &&
    iconDefinition.outline
      ? iconDefinition.outline
      : iconDefinition.filled;

  switch (selectedIcon.family) {
    case "ionicons":
      return (
        <Ionicons
          name={selectedIcon.name}
          size={resolvedSize}
          color={color}
          style={style}
        />
      );

    case "material-design-icons":
      return (
        <MaterialDesignIcons
          name={selectedIcon.name}
          size={resolvedSize}
          color={color}
          style={style}
        />
      );
  }
}
