import { useAppTheme } from "@/hooks/useAppTheme";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { ReactNode } from "react";
import { View } from "react-native";
import { AppButton } from "../custom-ui/AppButton";
import { ThemeToggle } from "../custom-ui/ThemeToggle";
import { UserIcon } from "../custom-ui/UserIcon";
import { ThemedText } from "../themed-text";

type HomeHeaderProps = {
  variant: "home";
  userName: string;
  greeting?: string;
};

type TitleHeaderProps = {
  variant: "title";
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
};

export type PageHeaderProps = HomeHeaderProps | TitleHeaderProps;

type PageHeaderRootProps = PageHeaderProps & {
  headerBottom?: ReactNode;
};

export default function PageHeader(props: PageHeaderRootProps) {
  const { colors } = useAppTheme();
  const router = useRouter();

  const handleBackPress =
    props.variant === "title" ? (props.onBackPress ?? router.back) : undefined;

  return (
    <View
      className="relative z-50"
      style={{
        backgroundColor: colors.app.pageHeaderBackground,
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
      }}
    >
      <View className="h-16 flex-row items-center justify-between px-4">
        {props.variant === "title" && props.showBackButton && (
          <AppButton
            variant="option"
            icon={ArrowLeft}
            className="z-10 h-10 w-10"
            onPress={handleBackPress}
          />
        )}

        <PageHeaderMain {...props} />

        <ThemeToggle className="z-10 ml-auto" />
      </View>

      {props.headerBottom ? (
        <View className="px-4 pb-2">{props.headerBottom}</View>
      ) : null}
    </View>
  );
}

function PageHeaderMain(props: PageHeaderProps) {
  if (props.variant === "home") {
    return (
      <View className="flex-row items-center gap-4">
        <UserIcon />

        <View>
          <ThemedText type="default" variant="accent">
            Welcome back,{" "}
            <ThemedText type="defaultSemiBold" variant="accent">
              {props.userName}
            </ThemedText>
          </ThemedText>

          <ThemedText className="text-xs" variant="primary">
            {props.greeting ?? "Ready to work out?"}
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View className="absolute left-0 right-0 flex-1 items-center">
      <ThemedText
        type="default"
        variant="accent"
        className="text-xl font-medium"
      >
        {props.title}
      </ThemedText>

      {props.subtitle && (
        <ThemedText className="text-xs" variant="primary">
          {props.subtitle}
        </ThemedText>
      )}
    </View>
  );
}
