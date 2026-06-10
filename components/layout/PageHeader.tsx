import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { ReactNode } from "react";
import { View } from "react-native";
import { AppButton } from "../custom-ui/AppButton";
import { ThemeToggle } from "../custom-ui/ThemeToggle";
import { UserAvatar } from "../custom-ui/UserAvatar";
import { ThemedText } from "../themed-text";

type HomePageHeaderProps = {
  variant: "home";
  greeting?: string;
};

type TitlePageHeaderProps = {
  variant: "title";
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
};

export type PageHeaderProps = HomePageHeaderProps | TitlePageHeaderProps;

type PageHeaderRootProps = PageHeaderProps & {
  headerBottom?: ReactNode;
};

export default function PageHeader(props: PageHeaderRootProps) {
  const router = useRouter();
  const { user } = useAuth();

  const handleBackPress =
    props.variant === "title" ? (props.onBackPress ?? router.back) : undefined;

  return (
    <View className="relative z-50">
      <View className="h-16 flex-row items-center justify-between px-4">
        {props.variant === "title" ? (
          <TitleHeader
            title={props.title}
            subtitle={props.subtitle}
            showBackButton={props.showBackButton}
            onBackPress={handleBackPress}
          />
        ) : (
          <HomeHeader
            greeting={props.greeting ?? "Ready to work out?"}
            firstName={user?.profile?.firstName}
            imageUrl={user?.profile?.imageUrl}
          />
        )}

        <ThemeToggle className="z-10 ml-auto" />
      </View>

      {props.headerBottom ? props.headerBottom : null}
    </View>
  );
}

type HomeHeaderProps = {
  greeting: string;
  firstName?: string;
  imageUrl?: string | null;
};

function HomeHeader({ greeting, firstName, imageUrl }: HomeHeaderProps) {
  const displayName = firstName?.trim() || "there";

  return (
    <View className="flex-row items-center gap-4">
      <UserAvatar imageUrl={imageUrl} />

      <View>
        <ThemedText type="default" variant="accent">
          Welcome back,{" "}
          <ThemedText type="defaultSemiBold" variant="accent">
            {displayName}
          </ThemedText>
        </ThemedText>

        <ThemedText type="extraSmall" variant="primary">
          {greeting}
        </ThemedText>
      </View>
    </View>
  );
}

type TitleHeaderProps = {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
};

function TitleHeader({
  title,
  subtitle,
  showBackButton,
  onBackPress,
}: TitleHeaderProps) {
  return (
    <>
      {showBackButton && (
        <AppButton
          variant="option"
          icon={ArrowLeft}
          className="z-10 h-10 w-10"
          onPress={onBackPress}
        />
      )}

      <View className="absolute left-0 right-0 flex-1 items-center">
        <ThemedText type="subtitle" variant="accent">
          {title}
        </ThemedText>

        {subtitle && (
          <ThemedText type="extraSmall" variant="primary">
            {subtitle}
          </ThemedText>
        )}
      </View>
    </>
  );
}
