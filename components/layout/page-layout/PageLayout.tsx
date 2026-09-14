import PageHeader from "@/components/layout/PageHeader";
import {
  STICKY_FOOTER_PADDING_BOTTOM,
  STICKY_FOOTER_PADDING_TOP,
} from "@/constants/page-layout.constants";
import { useAppColors } from "@/hooks/useAppColors";
import { cn } from "@/lib/utils";
import {
  selectHasActiveWorkoutSession,
  useWorkoutSessionStore,
} from "@/stores/workoutSessionStore";
import {
  selectWorkoutTimerSheetCollapsedSnapPoint,
  useWorkoutTimerSheetStore,
} from "@/stores/workoutTimerSheetStore";
import { useRef, useState } from "react";
import {
  Animated,
  Platform,
  RefreshControl,
  View,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getContentContainerStyle } from "./page-layout.helpers";
import type { PageLayoutProps } from "./page-layout.types";

export type {
  PageHeaderScrollEffect,
  PullToRefreshProps,
} from "./page-layout.types";

export function PageLayout({
  children,
  header,
  scrollable = true,
  className,
  containerStyle,
  disableContentPadding = false,
  stickyFooter,
  pullToRefresh,
  hasWorkoutTimerSheet = true,
  includeInsets = false,
}: PageLayoutProps) {
  const colors = useAppColors();
  const insets = useSafeAreaInsets();

  const scrollY = useRef(new Animated.Value(0)).current;
  const [footerHeight, setFooterHeight] = useState(0);

  const hasActiveWorkoutSession = useWorkoutSessionStore(
    selectHasActiveWorkoutSession,
  );

  const collapsedWorkoutTimerSheetHeight = useWorkoutTimerSheetStore(
    selectWorkoutTimerSheetCollapsedSnapPoint,
  );

  const workoutTimerBottomSpace =
    hasWorkoutTimerSheet && hasActiveWorkoutSession
      ? collapsedWorkoutTimerSheetHeight
      : 0;

  const contentContainerStyle = getContentContainerStyle({
    disableContentPadding,
    includeInsets,
    topInset: insets.top,
    bottomInset: insets.bottom,
    stickyFooterHeight: stickyFooter ? footerHeight : 0,
    workoutTimerBottomSpace,
    hasStickyFooter: !!stickyFooter,
  });

  const stickyFooterStyle: ViewStyle = {
    paddingTop: STICKY_FOOTER_PADDING_TOP,
    paddingBottom: insets.bottom + STICKY_FOOTER_PADDING_BOTTOM,
  };

  const shouldEnablePullToRefresh =
    !!pullToRefresh && pullToRefresh.enabled !== false;

  const refreshControl = shouldEnablePullToRefresh ? (
    <RefreshControl
      refreshing={pullToRefresh.refreshing}
      onRefresh={pullToRefresh.onRefresh}
      tintColor={colors.primary}
      colors={Platform.OS === "android" ? [colors.primary] : undefined}
      progressBackgroundColor={
        Platform.OS === "android" ? colors.card : undefined
      }
    />
  ) : undefined;

  const headerScrollEffect = header?.scrollEffect;

  const scrollHandler = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
    },
  );

  return (
    <View className="flex-1 bg-background">
      {header && (
        <PageHeader
          {...header.props}
          headerBottom={header.bottom}
          scrollY={scrollY}
          scrollEffect={headerScrollEffect}
          overlay={!!headerScrollEffect?.overlay}
        />
      )}

      {scrollable ? (
        <Animated.ScrollView
          className={className}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[contentContainerStyle, containerStyle]}
          refreshControl={refreshControl}
          scrollEventThrottle={16}
          onScroll={headerScrollEffect ? scrollHandler : undefined}
        >
          {children}
        </Animated.ScrollView>
      ) : (
        <View
          className={cn("flex-1", className)}
          style={[contentContainerStyle, containerStyle]}
        >
          {children}
        </View>
      )}

      {stickyFooter && (
        <View
          onLayout={(event) => {
            setFooterHeight(event.nativeEvent.layout.height);
          }}
          className="absolute bottom-0 left-0 right-0 flex-row gap-2 bg-background px-4"
          style={stickyFooterStyle}
        >
          {stickyFooter}
        </View>
      )}
    </View>
  );
}
