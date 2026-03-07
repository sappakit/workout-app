import PageHeader from "@/components/layout/PageHeader";
import { useAppTheme } from "@/hooks/useAppTheme";
import clsx from "clsx";
import { ReactNode, useState } from "react";
import { ScrollView, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";

type ScreenLayoutProps = {
  children: ReactNode;
  showHeader?: boolean;
  scroll?: boolean;
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
  scroll = true,
  className,
  topInset = 12,
  bottomInset = 12,
  backgroundColor,
  containerStyle,
  showsVerticalScrollIndicator = false,
  stickyFooter,
}: ScreenLayoutProps) {
  const insets = useSafeAreaInsets();
  const [footerHeight, setFooterHeight] = useState(0);

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
        <>
          <ScrollView
            className={twMerge(clsx("px-4", className))}
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            contentContainerStyle={{
              paddingTop: topInset,
              paddingBottom: stickyFooter ? footerHeight : bottomInset,
            }}
          >
            {children}
          </ScrollView>

          {stickyFooter && (
            <View
              onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height)}
              className="absolute bottom-0 left-0 right-0 flex-row gap-2 px-4 py-2"
              style={
                stickyFooter.options?.addBottomInset && {
                  paddingBottom: insets.bottom,
                }
              }
            >
              {stickyFooter.content}
            </View>
          )}
        </>
      ) : (
        <>
          <View
            className={twMerge(clsx("px-4", className))}
            style={{ paddingTop: topInset, paddingBottom: bottomInset }}
          >
            {children}
          </View>
        </>
      )}
    </View>
  );
}
