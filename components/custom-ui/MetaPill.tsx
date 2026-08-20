import type { AppIconName } from "@/components/custom-ui/app-icon/app-icon.registry";
import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { useAppColors } from "@/hooks/useAppTheme";
import { cn, hexWithOpacity } from "@/lib/utils";
import type { ReactNode } from "react";
import { Pressable, View } from "react-native";

export type MetaPillVariant = "default" | "overlay";

export type MetaPillProps = {
  label: string;
  icon?: AppIconName;
  variant?: MetaPillVariant;
  onRemove?: () => void;
  disabled?: boolean;
  className?: string;
};

export function MetaPill({
  label,
  icon,
  variant = "default",
  onRemove,
  disabled = false,
  className,
}: MetaPillProps) {
  const colors = useAppColors();

  const isOverlay = variant === "overlay";

  const contentColor = isOverlay
    ? colors.primaryForeground
    : colors.mutedForeground;

  return (
    <View
      className={cn(
        "min-w-0 flex-row items-center gap-1 rounded-full px-2 py-1",
        !isOverlay && "bg-secondary",
        disabled && "opacity-50",
        className,
      )}
      style={
        isOverlay
          ? {
              backgroundColor: hexWithOpacity(colors.primaryForeground, 15),
            }
          : undefined
      }
    >
      {icon ? <AppIcon name={icon} size="xs" color={contentColor} /> : null}

      <ThemedText
        type="caption"
        tone={isOverlay ? undefined : "muted"}
        className="min-w-0 shrink"
        numberOfLines={1}
        style={
          isOverlay
            ? {
                color: contentColor,
              }
            : undefined
        }
      >
        {label}
      </ThemedText>

      {onRemove ? (
        <Pressable
          onPress={onRemove}
          disabled={disabled}
          hitSlop={4}
          className="shrink-0 active:opacity-80"
        >
          <AppIcon name="close" size="xs" color={contentColor} />
        </Pressable>
      ) : null}
    </View>
  );
}

type MetaPillListItem = {
  key: string | number;
};

type MetaPillListProps<TItem extends MetaPillListItem> = {
  items: TItem[];
  maxVisibleItems?: number;
  renderItem: (item: TItem) => ReactNode;
  className?: string;
};

export function MetaPillList<TItem extends MetaPillListItem>({
  items,
  maxVisibleItems = 2,
  renderItem,
  className,
}: MetaPillListProps<TItem>) {
  const visibleItems = items.slice(0, maxVisibleItems);

  const remainingItemCount = items.length - visibleItems.length;

  if (items.length === 0) {
    return null;
  }

  return (
    <View
      className={cn(
        "min-w-0 flex-row items-center gap-2 overflow-hidden",
        className,
      )}
    >
      {visibleItems.map((item) => (
        <View key={String(item.key)} className="min-w-0 shrink">
          {renderItem(item)}
        </View>
      ))}

      {remainingItemCount > 0 ? (
        <ThemedText
          type="caption"
          tone="muted"
          className="shrink-0"
          numberOfLines={1}
        >
          +{remainingItemCount} more
        </ThemedText>
      ) : null}
    </View>
  );
}
