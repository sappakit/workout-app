import { AppButton } from "@/components/custom-ui/AppButton";
import { ThemeToggle } from "@/components/custom-ui/ThemeToggle";
import { UserAvatar } from "@/components/custom-ui/UserAvatar";
import { PageHeaderScrollEffect } from "@/components/layout/PageLayout";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { ReactNode } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  scrollY?: Animated.Value;
  scrollEffect?: PageHeaderScrollEffect;
  overlay?: boolean;
};

export default function PageHeader(props: PageHeaderRootProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  const handleBackPress =
    props.variant === "title" ? (props.onBackPress ?? router.back) : undefined;

  const backgroundOpacity =
    !!props.scrollY && !!props.scrollEffect
      ? props.scrollY.interpolate({
          inputRange: [
            props.scrollEffect.backgroundFadeStart ?? 0,
            props.scrollEffect.backgroundFadeEnd ?? 80,
          ],
          outputRange: [0, 1],
          extrapolate: "clamp",
        })
      : 1;

  const titleOpacity =
    !!props.scrollY && !!props.scrollEffect
      ? props.scrollY.interpolate({
          inputRange: [
            props.scrollEffect.titleFadeStart ?? 40,
            props.scrollEffect.titleFadeEnd ?? 100,
          ],
          outputRange: [0, 1],
          extrapolate: "clamp",
        })
      : 1;

  const rootStyle: ViewStyle = {
    paddingTop: insets.top,
  };

  const overlayStyle: ViewStyle | undefined = props.overlay
    ? {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        elevation: 50,
      }
    : undefined;

  return (
    <View className="relative z-50" style={[rootStyle, overlayStyle]}>
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: colors.app.background,
            opacity: backgroundOpacity,
          },
        ]}
      />

      <View className="h-16 flex-row items-center justify-between px-4">
        {props.variant === "title" ? (
          <TitleHeader
            title={props.title}
            subtitle={props.subtitle}
            showBackButton={props.showBackButton}
            onBackPress={handleBackPress}
            titleStyle={{ opacity: titleOpacity }}
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
  firstName?: string | null;
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
  titleStyle?: Animated.WithAnimatedObject<ViewStyle>;
};

function TitleHeader({
  title,
  subtitle,
  showBackButton,
  onBackPress,
  titleStyle,
}: TitleHeaderProps) {
  return (
    <>
      {showBackButton ? (
        <AppButton
          variant="option"
          icon={ArrowLeft}
          className="z-10 h-10 w-10"
          onPress={onBackPress}
        />
      ) : null}

      <Animated.View
        style={[
          {
            position: "absolute",
            left: 0,
            right: 0,
            alignItems: "center",
          },
          titleStyle,
        ]}
      >
        <ThemedText type="subtitle" variant="accent">
          {title}
        </ThemedText>

        {subtitle ? (
          <ThemedText type="extraSmall" variant="primary">
            {subtitle}
          </ThemedText>
        ) : null}
      </Animated.View>
    </>
  );
}
