import { useRouter } from "expo-router";
import { CircleAlert, House, LucideIcon, RefreshCw } from "lucide-react-native";
import {
  PageState,
  PageStateAction,
  PageStateActionOverride,
} from "./base/PageState";

type ErrorStateProps = {
  title?: string;
  message?: string;
  icon?: LucideIcon;
  primaryAction?: PageStateActionOverride;
  secondaryAction?: PageStateActionOverride;
};

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this page. Please try again.",
  icon = CircleAlert,
  primaryAction,
  secondaryAction,
}: ErrorStateProps) {
  const router = useRouter();

  const defaultPrimaryAction: PageStateAction = {
    label: "Try Again",
    icon: RefreshCw,
    onPress: () => {},
  };

  const defaultSecondaryAction: PageStateAction = {
    label: "Home",
    icon: House,
    onPress: () => router.replace("/(tabs)"),
  };

  return (
    <PageState
      title={title}
      message={message}
      icon={icon}
      primaryAction={{
        ...defaultPrimaryAction,
        ...primaryAction,
      }}
      secondaryAction={{
        ...defaultSecondaryAction,
        ...secondaryAction,
      }}
    />
  );
}
