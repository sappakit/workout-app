import { useAppTheme } from "@/hooks/useAppTheme";
import clsx from "clsx";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { twMerge } from "tailwind-merge";
import { ThemedText } from "../themed-text";

interface ExpandableToggleProps {
  expanded: boolean;
  onToggleExpanded: () => void;
  className?: string;
}

export function ExpandableToggle({
  expanded,
  onToggleExpanded,
  className,
}: ExpandableToggleProps) {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onToggleExpanded}
      className={twMerge(clsx("flex-row items-center gap-1", className))}
    >
      <ThemedText type="default" variant="primary" className="text-xs">
        {expanded ? "Show less" : "Show more"}
      </ThemedText>

      {expanded ? (
        <ChevronUp size={12} color={colors.app.textPrimary} />
      ) : (
        <ChevronDown size={12} color={colors.app.textPrimary} />
      )}
    </TouchableOpacity>
  );
}
