import { useRouter } from "expo-router";
import { CircleAlert, House, LucideIcon, RefreshCw } from "lucide-react-native";
import { PageState, PageStateAction } from "./PageState";

type ErrorStateProps = {
  title?: string;
  message?: string;
  icon?: LucideIcon;
  primaryAction?: PageStateAction;
  secondaryAction?: PageStateAction;
};

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this page. Please try again.",
  icon = CircleAlert,
  primaryAction,
  secondaryAction,
}: ErrorStateProps) {
  const router = useRouter();

  return (
    <PageState
      title={title}
      message={message}
      icon={icon}
      primaryAction={
        primaryAction ?? {
          label: "Try Again",
          icon: RefreshCw,
          onPress: () => {},
          hidden: true,
        }
      }
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
