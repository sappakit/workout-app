import PageHeader from "@/components/layout/PageHeader";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { ScrollView, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ScreenLayoutProps = {
  children: React.ReactNode;
  showHeader?: boolean;
  scroll?: boolean;
  contentClassName?: string;
  topInset?: number;
  bottomInset?: number;
  backgroundColor?: string;
  containerStyle?: ViewStyle;
  showsVerticalScrollIndicator?: boolean;
};

export function PageLayout({
  children,
  showHeader = true,
  scroll = true,
  contentClassName = "px-4",
  topInset = 12,
  bottomInset = 12,
  backgroundColor,
  containerStyle,
  showsVerticalScrollIndicator = false,
}: ScreenLayoutProps) {
  const insets = useSafeAreaInsets();

  const { colors } = useAppTheme();
  const bg = backgroundColor ?? colors.app.background;

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
      {showHeader ? <PageHeader /> : null}

      {scroll ? (
        <ScrollView
          className={contentClassName}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          contentContainerStyle={{
            paddingTop: topInset,
            paddingBottom: bottomInset,
          }}
        >
          {children}
        </ScrollView>
      ) : (
        <View
          className={contentClassName}
          style={{ paddingTop: topInset, paddingBottom: bottomInset }}
        >
          {children}
        </View>
      )}
    </View>
  );
}
