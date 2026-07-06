import { useRouter } from "expo-router";
import { House, LucideIcon, SearchX } from "lucide-react-native";
import { PageState, PageStateAction } from "./PageState";

type EmptyStateProps = {
  title?: string;
  message?: string;
  icon?: LucideIcon;
  primaryAction?: PageStateAction;
  secondaryAction?: PageStateAction;
};

export function EmptyState({
  title = "No data found",
  message = "There's nothing to show here yet.",
  icon = SearchX,
  primaryAction,
  secondaryAction,
}: EmptyStateProps) {
  const router = useRouter();

  return (
    <PageState
      title={title}
      message={message}
      icon={icon}
      primaryAction={primaryAction}
      secondaryAction={
        secondaryAction ?? {
          label: "Home",
          icon: House,
          onPress: () => router.replace("/(tabs)"),
        }
      }
    />
  );
}
