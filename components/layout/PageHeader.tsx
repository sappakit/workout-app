import { AppButton } from "@/components/custom-ui/app-button";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { ThemeToggle } from "@/components/custom-ui/ThemeToggle";
import { UserAvatar } from "@/components/custom-ui/UserAvatar";
import type { PageHeaderScrollEffect } from "@/components/layout/PageLayout";
import { useAuth } from "@/context/AuthContext";
import { useAppColors } from "@/hooks/useAppColors";
import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { Animated, StyleSheet, View, type ViewStyle } from "react-native";
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
  const colors = useAppColors();
  const insets = useSafeAreaInsets();

  const handleBackPress =
    props.variant === "title" ? (props.onBackPress ?? router.back) : undefined;

  const backgroundOpacity =
    props.scrollY && props.scrollEffect
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
    props.scrollY && props.scrollEffect
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
            backgroundColor: colors.background,
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

      {props.headerBottom ?? null}
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
    <View className="flex-row items-center gap-3">
      <UserAvatar imageUrl={imageUrl} />

      <View>
        <ThemedText type="body">
          Welcome back, <ThemedText type="bodyStrong">{displayName}</ThemedText>
        </ThemedText>

        <ThemedText type="caption" tone="muted">
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
          variant="ghost"
          size="icon"
          className="z-10 h-10 w-10 rounded-full"
          icon={{
            name: "back",
            size: "lg",
          }}
          onPress={onBackPress}
        />
      ) : null}

      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            left: 56,
            right: 56,
            alignItems: "center",
          },
          titleStyle,
        ]}
      >
        <ThemedText type="heading" className="text-center" numberOfLines={1}>
          {title}
        </ThemedText>

        {subtitle ? (
          <ThemedText
            type="caption"
            tone="muted"
            className="text-center"
            numberOfLines={1}
          >
            {subtitle}
          </ThemedText>
        ) : null}
      </Animated.View>
    </>
  );
}
