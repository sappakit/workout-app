import type { PageHeaderProps } from "@/components/layout/PageHeader";
import type { ReactNode } from "react";
import type { ViewStyle } from "react-native";

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

export type ContentPaddingSide = "top" | "bottom" | "left" | "right";

export type InsetSide = "top" | "bottom";

export type DisableContentPadding =
  | boolean
  | Partial<Record<ContentPaddingSide, boolean>>;

export type IncludeInsets = boolean | Partial<Record<InsetSide, boolean>>;

export type PageLayoutHeader = {
  props: PageHeaderProps;
  bottom?: ReactNode;
  scrollEffect?: PageHeaderScrollEffect;
};

export type PageLayoutProps = {
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
