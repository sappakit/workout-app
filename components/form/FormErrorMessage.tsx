import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { ThemedText } from "../themed-text";

type FormErrorMessageProps = {
  message?: string;
  className?: string;
};

export function FormErrorMessage({
  message,
  className,
}: FormErrorMessageProps) {
  if (!message) return null;

  return (
    <ThemedText
      type="default"
      variant="error"
      className={twMerge(clsx("mt-2 text-sm", className))}
    >
      {message}
    </ThemedText>
  );
}
