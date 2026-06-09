import { useRouter } from "expo-router";
import { RefreshCw, WifiOff } from "lucide-react-native";
import { PageState } from "./base/PageState";

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this page. Please try again.",
  onRetry,
}: ErrorStateProps) {
  const router = useRouter();

  return (
    <PageState
      title={title}
      message={message}
      icon={WifiOff}
      actionLabel="Try Again"
      actionIcon={RefreshCw}
      onAction={onRetry}
      onPressHome={() => router.replace("/(tabs)")}
    />
  );
}
