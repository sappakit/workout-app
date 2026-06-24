import { useRouter } from "expo-router";
import { LucideIcon, RefreshCw, WifiOff } from "lucide-react-native";
import { PageState } from "./base/PageState";

type ErrorStateProps = {
  title?: string;
  message?: string;
  actionLabel?: string;
  actionIcon?: LucideIcon;
  onRetry?: () => void;
  showHomeButton?: boolean;
};

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this page. Please try again.",
  actionLabel = "Try Again",
  actionIcon = RefreshCw,
  onRetry,
  showHomeButton = true,
}: ErrorStateProps) {
  const router = useRouter();

  return (
    <PageState
      title={title}
      message={message}
      icon={WifiOff}
      actionLabel={actionLabel}
      actionIcon={actionIcon}
      onAction={onRetry}
      showHomeButton={showHomeButton}
      onPressHome={() => router.replace("/(tabs)")}
    />
  );
}
