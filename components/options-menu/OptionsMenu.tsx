import { useAppTheme } from "@/hooks/useAppTheme";
import { Check, Ellipsis, LucideIcon } from "lucide-react-native";
import { ReactNode } from "react";
import { View } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptionProps,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { ThemedText } from "../themed-text";

export function OptionsMenu({
  children,
  isDisabled,
}: {
  children: ReactNode;
  isDisabled?: boolean;
}) {
  const { colors } = useAppTheme();

  return (
    <Menu>
      <MenuTrigger disabled={isDisabled}>
        <OptionsButton isDisabled={isDisabled} />
      </MenuTrigger>

      <MenuOptions
        customStyles={{
          optionsContainer: {
            backgroundColor: colors.app.toastBackground,
            borderColor: colors.app.borderTertiary,
            borderWidth: 1,
            borderRadius: 12,
            marginTop: 32,

            // Disable library shadow
            shadowColor: "transparent",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,

            boxShadow: "0px 6px 2px rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        {children}
      </MenuOptions>
    </Menu>
  );
}

interface DropdownItemProps extends MenuOptionProps {
  label: string;
  color?: string;
  icon?: LucideIcon;
  isToggleItem?: boolean;
  checked?: boolean;
}

export function DropdownItem({
  label,
  color,
  icon: Icon,
  isToggleItem,
  checked,
  onSelect,
  ...props
}: DropdownItemProps) {
  const { colors } = useAppTheme();

  const handleSelect: MenuOptionProps["onSelect"] = (...args) => {
    onSelect?.(...args);

    if (isToggleItem) {
      return false;
    }
  };

  return (
    <MenuOption
      {...props}
      onSelect={handleSelect}
      customStyles={{ optionWrapper: { padding: 0 } }}
    >
      <View
        className="flex-row items-center justify-between"
        style={{
          paddingVertical: 12,
          paddingRight: 12,
        }}
      >
        {/* Check/label */}
        <View className="flex-row items-center">
          <View style={{ width: 32, alignItems: "center" }}>
            {checked && <Check size={14} color={colors.app.textAccent} />}
          </View>

          <ThemedText
            style={{
              color: color ?? colors.app.textAccent,
            }}
          >
            {label}
          </ThemedText>
        </View>

        {/* Icon */}
        {Icon && <Icon size={14} color={color ?? colors.app.textPrimary} />}
      </View>
    </MenuOption>
  );
}

export function MenuSectionLabel({ label }: { label: string }) {
  return (
    <View style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 8 }}>
      <ThemedText type="default" variant="primary" className="text-xs">
        {label}
      </ThemedText>
    </View>
  );
}

// TODO: add animation on button
function OptionsButton({ isDisabled }: { isDisabled?: boolean }) {
  const { colors } = useAppTheme();

  return (
    <View
      className="h-7 w-7 items-center justify-center rounded-lg"
      style={{
        backgroundColor: colors.app.cardSecondary,
        opacity: isDisabled ? 0.6 : 1,
      }}
    >
      <Ellipsis size={12} color={colors.app.textPrimary} />
    </View>
  );
}
