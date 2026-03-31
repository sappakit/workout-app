import PageHeader, { PageHeaderProps } from "@/components/layout/PageHeader";
import { useAppTheme } from "@/hooks/useAppTheme";
import clsx from "clsx";
import { ReactNode, useState } from "react";
import { ScrollView, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";

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
}: PageLayoutProps) {
  const insets = useSafeAreaInsets();
  const [footerHeight, setFooterHeight] = useState(0);

  const { colors } = useAppTheme();
  const bg = backgroundColor ?? colors.app.background;
  const paddingBottom = stickyFooter ? footerHeight : bottomInset;
  const mainContainerClassName = className ?? "px-4";

  return (
    <View
      className="flex-1"
      style={[
        {
          backgroundColor: bg,
          paddingTop: insets.top,
        },
        containerStyle,
      ]}
    >
      {showHeader && headerProps && <PageHeader {...headerProps} />}

      {scrollable ? (
        <ScrollView
          className={mainContainerClassName}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          contentContainerStyle={{
            paddingTop: topInset,
            paddingBottom: paddingBottom,
          }}
        >
          {children}
        </ScrollView>
      ) : (
        <View
          className={twMerge(clsx("flex-1", mainContainerClassName))}
          style={{
            paddingTop: topInset,
            paddingBottom: paddingBottom,
          }}
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
