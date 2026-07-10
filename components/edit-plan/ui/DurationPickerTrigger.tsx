import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ChevronDown } from "lucide-react-native";
import { Pressable } from "react-native";

type DurationPickerTriggerProps = {
  value: number;
  onPress: () => void;
  disabled?: boolean;
  error?: boolean;
};

export function DurationPickerTrigger({
  value,
  onPress,
  disabled,
  error,
}: DurationPickerTriggerProps) {
  const { colors } = useAppTheme();

  const selectedLabel = formatEstimatedDurationLabel(value);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className="h-12 flex-row items-center justify-between rounded-lg border px-4"
      style={{
        backgroundColor: colors.app.cardSecondary,
        borderColor: error ? colors.app.error : colors.app.borderPrimary,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <ThemedText className="flex-1 text-sm" variant="accent" numberOfLines={1}>
        {selectedLabel}
      </ThemedText>

      <ChevronDown size={16} color={colors.app.textPrimary} />
    </Pressable>
  );
}

function formatEstimatedDurationLabel(seconds: number) {
  if (seconds === 0) return "0 sec";

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
