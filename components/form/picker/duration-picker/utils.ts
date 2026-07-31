import { hmsToSeconds, secondsToHMS } from "@/lib/workout/duration.utils";
import { DurationValue, PickerItem } from "./DurationWheelPicker";

export function durationToSeconds(value: DurationValue) {
  return hmsToSeconds(value.hours, value.minutes, value.seconds) ?? 0;
}

export function secondsToDuration(totalSeconds: number): DurationValue {
  const { hours, minutes, seconds } = secondsToHMS(totalSeconds);

  return {
    hours: hours ?? 0,
    minutes: minutes ?? 0,
    seconds: seconds ?? 0,
  };
}

export function formatDuration(totalSeconds: number) {
  const { hours, minutes, seconds } = secondsToDuration(totalSeconds);

  const paddedMinutes = minutes.toString().padStart(2, "0");
  const paddedSeconds = seconds.toString().padStart(2, "0");

  // H:MM:SS
  if (hours > 0) {
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  }

  // M:SS
  return `${minutes}:${paddedSeconds}`;
}

export function buildNumberData(min: number, max: number): PickerItem[] {
  return Array.from({ length: max - min + 1 }, (_, index) => {
    const itemValue = min + index;

    return {
      label: String(itemValue),
      value: itemValue,
    };
  });
}
