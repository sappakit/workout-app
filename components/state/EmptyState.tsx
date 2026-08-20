import { useRouter } from "expo-router";
import { AppIconName } from "../custom-ui/app-icon/app-icon.registry";
import {
  PageState,
  type PageStateAction,
  type PageStateActionOverride,
} from "./base/PageState";

type EmptyStateProps = {
  title?: string;
  message?: string;
  icon?: AppIconName;
  primaryAction?: PageStateAction;
  secondaryAction?: PageStateActionOverride;
};

export function EmptyState({
  title = "No data found",
  message = "There's nothing to show here yet.",
  icon = "search-off",
  primaryAction,
  secondaryAction,
}: EmptyStateProps) {
  const router = useRouter();

  const defaultSecondaryAction: PageStateAction = {
    label: "Home",
    icon: "home",
    onPress: () => router.replace("/(tabs)"),
  };

  return (
    <PageState
      title={title}
      message={message}
      icon={icon}
      primaryAction={primaryAction}
      secondaryAction={{
        ...defaultSecondaryAction,
        ...secondaryAction,
      }}
    />
  );
}
