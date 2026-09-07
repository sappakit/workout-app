import { CONTENT_PADDING_HORIZONTAL } from "@/components/layout/PageLayout";
import type { ReactNode } from "react";
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";

type AnimatedFilterPageProps = {
  pageKey: string;
  isMainPage: boolean;
  shouldAnimate: boolean;
  children: ReactNode;
};

export function AnimatedFilterPage({
  pageKey,
  isMainPage,
  shouldAnimate,
  children,
}: AnimatedFilterPageProps) {
  const entering = isMainPage ? SlideInLeft : SlideInRight;
  const exiting = isMainPage ? SlideOutLeft : SlideOutRight;

  return (
    <Animated.View
      key={pageKey}
      entering={shouldAnimate ? entering.duration(350) : undefined}
      exiting={shouldAnimate ? exiting.duration(350) : undefined}
      style={{
        flex: 1,
        paddingHorizontal: CONTENT_PADDING_HORIZONTAL,
      }}
    >
      {children}
    </Animated.View>
  );
}

// TODO: new animation
// export function AnimatedFilterPage({
//   pageKey,
//   shouldAnimate,
//   children,
// }: AnimatedFilterPageProps) {
//   const translateX = useSharedValue(0);

//   useEffect(() => {
//     if (!shouldAnimate) {
//       translateX.value = 0;
//       return;
//     }

//     translateX.value = pageKey === "main" ? -48 : 48;

//     translateX.value = withTiming(0, {
//       duration: 420,
//       easing: Easing.out(Easing.cubic),
//     });
//   }, [pageKey, shouldAnimate, translateX]);

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ translateX: translateX.value }],
//   }));

//   return (
//     <Animated.View key={pageKey} style={[{ flex: 1 }, animatedStyle]}>
//       {children}
//     </Animated.View>
//   );
// }

export function getSelectedCountSummary<TValue>(
  selectedValues: TValue[],
  emptyLabel: string,
) {
  if (selectedValues.length === 0) {
    return emptyLabel;
  }

  if (selectedValues.length === 1) {
    return "1 selected";
  }

  return `${selectedValues.length} selected`;
}
