import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { useAppColors } from "@/hooks/useAppTheme";
import { cn } from "@/lib/utils";
import { Pressable } from "react-native";

type DurationPickerTriggerProps = {
  value: number;
  onPress: () => void;
  disabled?: boolean;
  error?: boolean;
  className?: string;
};

export function DurationPickerTrigger({
  value,
  onPress,
  disabled = false,
  error = false,
  className,
}: DurationPickerTriggerProps) {
  const colors = useAppColors();

  const selectedLabel = formatEstimatedDurationLabel(value);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={cn(
        "h-10 flex-row items-center gap-2 rounded-lg border bg-secondary px-3 active:opacity-80",
        error ? "border-destructive" : "border-input",
        disabled && "opacity-50",
        className,
      )}
    >
      <ThemedText type="small" className="min-w-0 flex-1" numberOfLines={1}>
        {selectedLabel}
      </ThemedText>

      <AppIcon name="chevron-down" size="sm" color={colors.mutedForeground} />
    </Pressable>
  );
}

function formatEstimatedDurationLabel(seconds: number) {
  if (seconds === 0) {
    return "0 sec";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  }

  if (minutes > 0) {
    parts.push(`${minutes} min`);
  }

  if (remainingSeconds > 0) {
    parts.push(`${remainingSeconds} sec`);
  }

  return parts.join(" ");
}
