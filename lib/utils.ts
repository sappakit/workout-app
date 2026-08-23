import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const hexWithOpacity = (hexColor: string, opacity: number) => {
  const normalizedHex = hexColor.replace("#", "").slice(0, 6);
  const normalizedOpacity = Math.max(0, Math.min(100, opacity));

  const alpha = Math.round((normalizedOpacity / 100) * 255)
    .toString(16)
    .padStart(2, "0")
    .toUpperCase();

  return `#${normalizedHex}${alpha}`;
};
