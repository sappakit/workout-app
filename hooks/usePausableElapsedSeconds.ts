import { useEffect, useState } from "react";

type UsePausableElapsedSecondsParams = {
  startedAt: string | Date | null;
  pausedAt: string | Date | null;
  totalPausedDuration: number;
};

export function usePausableElapsedSeconds({
  startedAt,
  pausedAt,
  totalPausedDuration,
}: UsePausableElapsedSecondsParams) {
  const [now, setNow] = useState(Date.now());

  const isPaused = pausedAt != null;

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const elapsedSeconds = getPausableElapsedSeconds({
    startedAt,
    pausedAt,
    // avoid stale 'now' on the first resumed render
    now: isPaused ? now : Date.now(),
    totalPausedDuration,
  });

  return {
    elapsedSeconds,
    isPaused,
  };
}

type GetPausableElapsedSecondsParams = {
  startedAt: string | Date | null;
  pausedAt: string | Date | null;
  now: number;
  totalPausedDuration: number;
};

export function getPausableElapsedSeconds({
  startedAt,
  pausedAt,
  now,
  totalPausedDuration,
}: GetPausableElapsedSecondsParams) {
  const startedAtTime = getTime(startedAt);

  if (!startedAtTime) return 0;

  const pausedAtTime = getTime(pausedAt);

  // If paused -> freeze time at pausedAt
  // If active -> use current time (now)
  const currentTime = pausedAtTime ?? now;

  // Calculate elapsed seconds
  const elapsedMs = currentTime - startedAtTime;
  const elapsedSeconds = Math.floor(elapsedMs / 1000) - totalPausedDuration;

  return Math.max(0, elapsedSeconds);
}

function getTime(value: string | Date | null) {
  if (!value) return null;

  const time =
    typeof value === "string" ? new Date(value).getTime() : value.getTime();

  return Number.isNaN(time) ? null : time;
}
