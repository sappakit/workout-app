import { useRouter } from "expo-router";
import { AppIconName } from "../custom-ui/app-icon/app-icon.registry";
import {
  PageState,
  type PageStateAction,
  type PageStateActionOverride,
} from "./base/PageState";

type ErrorStateProps = {
  title?: string;
  message?: string;
  icon?: AppIconName;
  primaryAction?: PageStateActionOverride;
  secondaryAction?: PageStateActionOverride;
};

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this page. Please try again.",
  icon = "warning",
  primaryAction,
  secondaryAction,
}: ErrorStateProps) {
  const router = useRouter();

  const defaultPrimaryAction: PageStateAction = {
    label: "Try Again",
    icon: "refresh",
    onPress: () => {},
  };

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
