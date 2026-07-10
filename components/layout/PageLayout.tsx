import PageHeader, { PageHeaderProps } from "@/components/layout/PageHeader";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  selectHasActiveWorkoutSession,
  useWorkoutSessionStore,
} from "@/stores/workoutSessionStore";
import {
  selectWorkoutTimerSheetCollapsedSnapPoint,
  useWorkoutTimerSheetStore,
} from "@/stores/workoutTimerSheetStore";
import clsx from "clsx";
import { ReactNode, useRef, useState } from "react";
import { Animated, RefreshControl, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";

export const CONTENT_PADDING_TOP = 16;
export const CONTENT_PADDING_BOTTOM = 16;
export const CONTENT_PADDING_HORIZONTAL = 16;

const STICKY_FOOTER_PADDING_TOP = 16;
const STICKY_FOOTER_PADDING_BOTTOM = 8;

export type PullToRefreshProps = {
  refreshing: boolean;
  onRefresh: () => void | Promise<void>;
  enabled?: boolean;
};

export type PageHeaderScrollEffect = {
  overlay?: boolean;
  backgroundFadeStart?: number;
  backgroundFadeEnd?: number;
  titleFadeStart?: number;
  titleFadeEnd?: number;
};

type ContentPaddingSide = "top" | "bottom" | "left" | "right";
type InsetSide = "top" | "bottom";

type DisableContentPadding =
  | boolean
  | Partial<Record<ContentPaddingSide, boolean>>;

type IncludeInsets = boolean | Partial<Record<InsetSide, boolean>>;

type PageLayoutHeader = {
  props: PageHeaderProps;
  bottom?: ReactNode;
  scrollEffect?: PageHeaderScrollEffect;
};

type PageLayoutProps = {
  children: ReactNode;
  header?: PageLayoutHeader;
  scrollable?: boolean;
  className?: string;
  containerStyle?: ViewStyle;
  disableContentPadding?: DisableContentPadding;
  stickyFooter?: ReactNode;
  pullToRefresh?: PullToRefreshProps;
  hasWorkoutTimerSheet?: boolean;
  includeInsets?: IncludeInsets;
};

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
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  const scrollY = useRef(new Animated.Value(0)).current;

  const [footerHeight, setFooterHeight] = useState(0);

  const hasActiveWorkoutSession = useWorkoutSessionStore(
    selectHasActiveWorkoutSession,
  );

  const collapsedWorkoutTimerSheetHeight = useWorkoutTimerSheetStore(
    selectWorkoutTimerSheetCollapsedSnapPoint,
  );

  const shouldReserveWorkoutTimerSpace =
    hasWorkoutTimerSheet && hasActiveWorkoutSession;

  const workoutTimerBottomSpace = shouldReserveWorkoutTimerSpace
    ? collapsedWorkoutTimerSheetHeight
    : 0;

  const contentTopBasePadding = isContentPaddingDisabled(
    disableContentPadding,
    "top",
  )
    ? 0
    : CONTENT_PADDING_TOP;

  const contentBottomBasePadding = isContentPaddingDisabled(
    disableContentPadding,
    "bottom",
  )
    ? 0
    : CONTENT_PADDING_BOTTOM;

  const stickyFooterBottomSpace = stickyFooter ? footerHeight : 0;

  const safeAreaTopSpace = shouldIncludeInset(includeInsets, "top")
    ? insets.top
    : 0;

  const safeAreaBottomSpace =
    !stickyFooter && shouldIncludeInset(includeInsets, "bottom")
      ? insets.bottom
      : 0;

  const contentPaddingTop = contentTopBasePadding + safeAreaTopSpace;

  const contentPaddingBottom =
    contentBottomBasePadding +
    stickyFooterBottomSpace +
    safeAreaBottomSpace +
    workoutTimerBottomSpace;

  const contentContainerStyle: ViewStyle = {
    paddingTop: contentPaddingTop,
    paddingBottom: contentPaddingBottom,

    paddingLeft: isContentPaddingDisabled(disableContentPadding, "left")
      ? 0
      : CONTENT_PADDING_HORIZONTAL,

    paddingRight: isContentPaddingDisabled(disableContentPadding, "right")
      ? 0
      : CONTENT_PADDING_HORIZONTAL,
  };

  const rootStyle: ViewStyle = {
    backgroundColor: colors.app.background,
  };

  const stickyFooterStyle: ViewStyle = {
    paddingTop: STICKY_FOOTER_PADDING_TOP,
    paddingBottom: insets.bottom + STICKY_FOOTER_PADDING_BOTTOM,
  };

  const shouldEnablePullToRefresh =
    scrollable &&
    pullToRefresh?.enabled !== false &&
    !!pullToRefresh?.onRefresh;

  const refreshControl = shouldEnablePullToRefresh ? (
    <RefreshControl
      refreshing={pullToRefresh.refreshing}
      onRefresh={pullToRefresh.onRefresh}
    />
  ) : undefined;

  const headerScrollEffect = header?.scrollEffect;
  const isOverlayHeader = !!headerScrollEffect?.overlay;

  const scrollHandler = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
    },
  );

  return (
    <View className="flex-1" style={rootStyle}>
      {header && (
        <PageHeader
          {...header.props}
          headerBottom={header.bottom}
          scrollY={scrollY}
          scrollEffect={headerScrollEffect}
          overlay={isOverlayHeader}
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
          className={twMerge(clsx("flex-1", className))}
          style={[contentContainerStyle, containerStyle]}
        >
          {children}
        </View>
      )}

      {stickyFooter && (
        <View
          onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height)}
          className="absolute bottom-0 left-0 right-0 flex-row gap-2 px-4"
          style={stickyFooterStyle}
        >
          {stickyFooter}
        </View>
      )}
    </View>
  );
}

function isContentPaddingDisabled(
  disabledPadding: DisableContentPadding | undefined,
  side: ContentPaddingSide,
) {
  if (disabledPadding === true) return true;
  if (!disabledPadding) return false;

  return disabledPadding[side] === true;
}

function shouldIncludeInset(
  includeInsets: IncludeInsets | undefined,
  side: InsetSide,
) {
  if (includeInsets === true) return true;
  if (!includeInsets) return false;

  return includeInsets[side] === true;
}
