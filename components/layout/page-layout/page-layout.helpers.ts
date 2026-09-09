import {
  CONTENT_PADDING_BOTTOM,
  CONTENT_PADDING_HORIZONTAL,
  CONTENT_PADDING_TOP,
} from "@/constants/page-layout.constants";
import type { ViewStyle } from "react-native";
import type {
  ContentPaddingSide,
  DisableContentPadding,
  IncludeInsets,
  InsetSide,
} from "./page-layout.types";

type GetContentContainerStyleParams = {
  disableContentPadding: DisableContentPadding;
  includeInsets: IncludeInsets;
  topInset: number;
  bottomInset: number;
  stickyFooterHeight: number;
  workoutTimerBottomSpace: number;
  hasStickyFooter: boolean;
};

export function getContentContainerStyle({
  disableContentPadding,
  includeInsets,
  topInset,
  bottomInset,
  stickyFooterHeight,
  workoutTimerBottomSpace,
  hasStickyFooter,
}: GetContentContainerStyleParams): ViewStyle {
  return {
    paddingTop:
      getContentPadding("top", disableContentPadding) +
      getInset("top", includeInsets, topInset),

    paddingBottom:
      getContentPadding("bottom", disableContentPadding) +
      stickyFooterHeight +
      (!hasStickyFooter ? getInset("bottom", includeInsets, bottomInset) : 0) +
      workoutTimerBottomSpace,

    paddingLeft: getContentPadding("left", disableContentPadding),
    paddingRight: getContentPadding("right", disableContentPadding),
  };
}

function getContentPadding(
  side: ContentPaddingSide,
  disabledPadding: DisableContentPadding,
) {
  const isDisabled =
    disabledPadding === true ||
    (typeof disabledPadding === "object" && disabledPadding[side] === true);

  if (isDisabled) {
    return 0;
  }

  switch (side) {
    case "top":
      return CONTENT_PADDING_TOP;

    case "bottom":
      return CONTENT_PADDING_BOTTOM;

    case "left":
    case "right":
      return CONTENT_PADDING_HORIZONTAL;
  }
}

function getInset(
  side: InsetSide,
  includeInsets: IncludeInsets,
  value: number,
) {
  const isIncluded =
    includeInsets === true ||
    (typeof includeInsets === "object" && includeInsets[side] === true);

  return isIncluded ? value : 0;
}
