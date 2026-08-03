import { Ionicons } from "@react-native-vector-icons/ionicons";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { appIconRegistry } from "./app-icon.registry";
import type { AppIconProps } from "./app-icon.types";

const DEFAULT_ICON_SIZE = 24;
const DEFAULT_ICON_COLOR = "#000000";

export function AppIcon({
  name,
  variant = "filled",
  size = DEFAULT_ICON_SIZE,
  color = DEFAULT_ICON_COLOR,
  style,
}: AppIconProps) {
  const iconDefinition = appIconRegistry[name];

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
          size={size}
          color={color}
          style={style}
        />
      );

    case "material-design-icons":
      return (
        <MaterialDesignIcons
          name={selectedIcon.name}
          size={size}
          color={color}
          style={style}
        />
      );
  }
}
