import { FormSelectTrigger } from "@/components/form/select-input/FormSelectTrigger";

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
  const selectedLabel = formatEstimatedDurationLabel(value);

  return (
    <FormSelectTrigger
      label={selectedLabel}
      onPress={onPress}
      disabled={disabled}
      error={error}
      className={className}
    />
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
