import { useRouter } from "expo-router";
import { Plus, SearchX } from "lucide-react-native";
import { PageState } from "./base/PageState";

type EmptyStateProps = {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title = "No data found",
  message = "There's nothing to show here yet.",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const router = useRouter();

  return (
    <PageState
      title={title}
      message={message}
      icon={SearchX}
      actionLabel={actionLabel}
      actionIcon={Plus}
      onAction={onAction}
      onPressHome={() => router.replace("/(tabs)")}
    />
  );
}
