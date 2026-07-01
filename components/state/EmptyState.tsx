import { useRouter } from "expo-router";
import { LucideIcon, Plus, SearchX } from "lucide-react-native";
import { PageState } from "./base/PageState";

type EmptyStateProps = {
  title?: string;
  message?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  actionIcon?: LucideIcon;
  onAction?: () => void;
  showHomeButton?: boolean;
};

export function EmptyState({
  title = "No data found",
  message = "There's nothing to show here yet.",
  icon = SearchX,
  actionLabel,
  actionIcon = Plus,
  onAction,
  showHomeButton = true,
}: EmptyStateProps) {
  const router = useRouter();

  return (
    <PageState
      title={title}
      message={message}
      icon={icon}
      actionLabel={actionLabel}
      actionIcon={actionIcon}
      onAction={onAction}
      showHomeButton={showHomeButton}
      onPressHome={() => router.replace("/(tabs)")}
    />
  );
}
