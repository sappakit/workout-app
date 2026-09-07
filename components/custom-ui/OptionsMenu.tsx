import type { AppIconName } from "@/components/custom-ui/app-icon/app-icon.registry";
import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { useAppColors } from "@/hooks/useAppColors";
import { type ReactNode } from "react";
import { View } from "react-native";
import {
  Menu,
  MenuOption,
  type MenuOptionProps,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

interface OptionsMenuProps {
  children: ReactNode;
  isDisabled?: boolean;
  menuTrigger?: (props: { isDisabled?: boolean }) => ReactNode;
}

export function OptionsMenu({
  children,
  isDisabled,
  menuTrigger,
}: OptionsMenuProps) {
  const colors = useAppColors();

  return (
    <Menu>
      <MenuTrigger disabled={isDisabled}>
        {menuTrigger ? (
          menuTrigger({ isDisabled })
        ) : (
          <OptionsButton isDisabled={isDisabled} />
        )}
      </MenuTrigger>

      <MenuOptions
        customStyles={{
          optionsContainer: {
            backgroundColor: colors.popover,
            borderColor: colors.border,
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
  icon?: AppIconName;
  isToggleItem?: boolean;
  checked?: boolean;
}

export function DropdownItem({
  label,
  color,
  icon,
  isToggleItem,
  checked,
  onSelect,
  ...props
}: DropdownItemProps) {
  const colors = useAppColors();

  const contentColor = color ?? colors.foreground;

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
      customStyles={{
        optionWrapper: {
          padding: 0,
        },
      }}
    >
      <View
        className="flex-row items-center justify-between"
        style={{
          paddingVertical: 12,
          paddingRight: 12,
        }}
      >
        <View className="flex-row items-center">
          <View className="w-8 items-center">
            {checked ? (
              <AppIcon name="check" size="xs" color={contentColor} />
            ) : null}
          </View>

          <ThemedText
            type="body"
            style={{
              color: contentColor,
            }}
          >
            {label}
          </ThemedText>
        </View>

        {icon ? <AppIcon name={icon} size="xs" color={contentColor} /> : null}
      </View>
    </MenuOption>
  );
}

export function MenuSectionLabel({ label }: { label: string }) {
  return (
    <View
      style={{
        paddingLeft: 32,
        paddingRight: 12,
        paddingTop: 8,
      }}
    >
      <ThemedText type="caption" tone="muted">
        {label}
      </ThemedText>
    </View>
  );
}

// TODO: add animation on button
function OptionsButton({ isDisabled }: { isDisabled?: boolean }) {
  const colors = useAppColors();

  return (
    <View
      className="h-7 w-7 items-center justify-center rounded-lg bg-secondary"
      style={{
        opacity: isDisabled ? 0.6 : 1,
      }}
    >
      <AppIcon name="more" size="xs" color={colors.secondaryForeground} />
    </View>
  );
}
