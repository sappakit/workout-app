import PageHeader, { PageHeaderProps } from "@/components/layout/PageHeader";
import { useAppTheme } from "@/hooks/useAppTheme";
import clsx from "clsx";
import { ReactNode, useState } from "react";
import { RefreshControl, ScrollView, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";

export type PullToRefreshProps = {
  refreshing: boolean;
  onRefresh: () => void | Promise<void>;
  enabled?: boolean;
};

type PageLayoutProps = {
  children: ReactNode;
  showHeader?: boolean;
  headerProps?: PageHeaderProps;
  scrollable?: boolean;
  className?: string;
  topInset?: number;
  bottomInset?: number;
  backgroundColor?: string;
  containerStyle?: ViewStyle;
  showsVerticalScrollIndicator?: boolean;
  stickyFooter?: { content: ReactNode; options?: { addBottomInset: boolean } };
  pullToRefresh?: PullToRefreshProps;
};

export function PageLayout({
  children,
  showHeader = true,
  headerProps,
  scrollable = true,
  className,
  topInset = 12,
  bottomInset = 12,
  backgroundColor,
  containerStyle,
  showsVerticalScrollIndicator = false,
  stickyFooter,
  pullToRefresh,
}: PageLayoutProps) {
  const { colors } = useAppTheme();

  const insets = useSafeAreaInsets();
  const [footerHeight, setFooterHeight] = useState(0);

  const bg = backgroundColor ?? colors.app.background;
  const paddingBottom = stickyFooter ? footerHeight : bottomInset;
  const bodyContainerStyle = {
    paddingTop: topInset,
    paddingBottom: paddingBottom,
    paddingHorizontal: 16,
  };

  // Pull to refresh
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

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: bg,
        paddingTop: insets.top,
      }}
    >
      {showHeader && headerProps && <PageHeader {...headerProps} />}

      {scrollable ? (
        <ScrollView
          className={className}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          contentContainerStyle={[bodyContainerStyle, containerStyle]}
          refreshControl={refreshControl}
        >
          {children}
        </ScrollView>
      ) : (
        <View
          className={twMerge(clsx("flex-1", className))}
          style={[bodyContainerStyle, containerStyle]}
        >
          {children}
        </View>
      )}

      {stickyFooter && (
        <View
          onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height)}
          className="absolute bottom-0 left-0 right-0 flex-row gap-2 px-4 py-2"
          style={
            stickyFooter.options?.addBottomInset
              ? { paddingBottom: insets.bottom }
              : undefined
          }
        >
          {stickyFooter.content}
        </View>
      )}
    </View>
  );
}
