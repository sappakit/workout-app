import { useAppTheme } from "@/hooks/useAppTheme";
import clsx from "clsx";
import { ChevronDown, ChevronUp, LucideIcon } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { twMerge } from "tailwind-merge";
import { ThemedText } from "../themed-text";

interface ExpandableToggleProps {
  expanded: boolean;
  onToggleExpanded: () => void;
  expandedLabel?: string;
  expandedIcon?: LucideIcon;
  collapsedLabel?: string;
  collapsedIcon?: LucideIcon;
  className?: string;
}

export function ExpandableToggle({
  expanded,
  onToggleExpanded,
  expandedLabel = "Show less",
  expandedIcon,
  collapsedLabel = "Show more",
  collapsedIcon,
  className,
}: ExpandableToggleProps) {
  const { colors } = useAppTheme();

  const label = expanded ? expandedLabel : collapsedLabel;

  const ExpandedIcon = expandedIcon ?? ChevronUp;
  const CollapsedIcon = collapsedIcon ?? ChevronDown;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onToggleExpanded}
      className={twMerge(clsx("flex-row items-center gap-1", className))}
    >
      <ThemedText type="default" variant="primary" className="text-xs">
        {label}
      </ThemedText>

      {expanded ? (
        <ExpandedIcon size={12} color={colors.app.textPrimary} />
      ) : (
        <CollapsedIcon size={12} color={colors.app.textPrimary} />
      )}
    </TouchableOpacity>
  );
}
