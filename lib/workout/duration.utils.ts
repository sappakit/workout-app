// seconds -> { hours, minutes, seconds }
export function secondsToHMS(totalSeconds: number | null | undefined) {
  if (totalSeconds == null) {
    return {
      hours: null,
      minutes: null,
      seconds: null,
    };
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours,
    minutes,
    seconds,
  };
}

// (hours, minutes, seconds) -> seconds
export function hmsToSeconds(
  hours: number | null | undefined,
  minutes: number | null | undefined,
  seconds: number | null | undefined,
) {
  if (hours == null || minutes == null || seconds == null) {
    return null;
  }

  return hours * 3600 + minutes * 60 + seconds;
}
