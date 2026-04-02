import { AppButton } from "@/components/custom-ui/AppButton";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import BottomSheet, {
  BottomSheetView,
  useBottomSheet,
} from "@gorhom/bottom-sheet";
import { CircleCheckBig, Pause, SkipForward, Timer } from "lucide-react-native";
import { useMemo, useRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

export default function WorkoutTimerBottomSheet() {
  const { colors } = useAppTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => [100, 180], []);

  return (
    <View
      pointerEvents="box-none"
      style={[StyleSheet.absoluteFillObject, { zIndex: 20 }]}
    >
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose={false}
        enableOverDrag
        animateOnMount
        detached={false}
        backgroundStyle={{
          backgroundColor: colors.app.cardPrimary,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.app.borderSecondary,
        }}
      >
        <WorkoutTimerSheetContent />
      </BottomSheet>
    </View>
  );
}

function WorkoutTimerSheetContent() {
  const { colors } = useAppTheme();
  const { animatedIndex } = useBottomSheet();

  const collapsedAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        animatedIndex.value,
        [0, 0.4, 1],
        [1, 0.4, 0],
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          translateY: interpolate(
            animatedIndex.value,
            [0, 1],
            [0, -6],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const expandedAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        animatedIndex.value,
        [0, 0.6, 1],
        [0, 0.3, 1],
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          translateY: interpolate(
            animatedIndex.value,
            [0, 1],
            [8, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <BottomSheetView
      style={{
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
      }}
    >
      <View style={{ position: "relative" }}>
        {/* COLLAPSED */}
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
            },
            collapsedAnimatedStyle,
          ]}
        >
          <View className="flex-row items-center justify-between">
            {/* Left */}
            <View className="flex-1 flex-row items-center gap-2">
              <Timer size={16} color={colors.app.textPrimary} />

              <ThemedText type="default" variant="accent" className="text-lg">
                01:12:30
              </ThemedText>
            </View>

            {/* Middle */}
            <View className="flex-[2] flex-row items-center justify-center">
              <TouchableOpacity
                activeOpacity={0.8}
                className="rounded-full p-4"
              >
                <CircleCheckBig size={20} color={colors.app.brand} />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                className="rounded-full p-4"
                style={{
                  backgroundColor: colors.app.cardSecondary,
                }}
              >
                <Pause size={20} color={colors.app.textAccent} />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                className="rounded-full p-4"
              >
                <SkipForward size={20} color={colors.app.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Right */}
            <View className="flex-1 items-end">
              <ThemedText type="default" variant="primary" className="text-sm">
                Exercise
              </ThemedText>
              <ThemedText type="default" variant="accent" className="text-lg">
                2 of 3
              </ThemedText>
            </View>
          </View>
        </Animated.View>

        {/* EXPANDED */}
        <Animated.View pointerEvents="none" style={expandedAnimatedStyle}>
          <View className="gap-3">
            <View className="flex-row justify-between">
              {/* Left */}
              <View className="flex-1 gap-1">
                <View>
                  <ThemedText
                    type="default"
                    variant="primary"
                    className="text-xs"
                  >
                    Set
                  </ThemedText>
                  <ThemedText
                    type="default"
                    variant="accent"
                    className="text-sm"
                  >
                    2 of 4
                  </ThemedText>
                </View>

                <View>
                  <ThemedText
                    type="default"
                    variant="primary"
                    className="text-xs"
                  >
                    Total time
                  </ThemedText>
                  <ThemedText
                    type="default"
                    variant="accent"
                    className="text-sm"
                  >
                    12:30
                  </ThemedText>
                </View>
              </View>

              {/* Middle */}
              <View className="flex-[2] items-center justify-between">
                <ThemedText type="default" variant="primary">
                  Current time
                </ThemedText>

                <ThemedText
                  type="default"
                  variant="accent"
                  className="text-5xl font-semibold"
                >
                  01:12:30
                </ThemedText>
              </View>

              {/* Right */}
              <View className="flex-1 gap-1">
                <View className="items-end">
                  <ThemedText
                    type="default"
                    variant="primary"
                    className="text-xs"
                  >
                    Exercise
                  </ThemedText>
                  <ThemedText
                    type="default"
                    variant="accent"
                    className="text-sm"
                  >
                    2 of 3
                  </ThemedText>
                </View>

                <View className="items-end">
                  <ThemedText
                    type="default"
                    variant="primary"
                    className="text-xs"
                  >
                    Current
                  </ThemedText>
                  <ThemedText
                    type="default"
                    variant="accent"
                    className="text-sm"
                  >
                    Dumbbell fly
                  </ThemedText>
                </View>
              </View>
            </View>

            {/* Actions */}
            <View className="flex-row items-center gap-2">
              <AppButton
                title="Complete Set"
                variant="primary"
                icon={CircleCheckBig}
                className="flex-1"
                textClassName="font-medium"
                onPress={() => {}}
              />

              <AppButton
                variant="tertiary"
                icon={Pause}
                className="h-12 w-12"
                onPress={() => {}}
              />

              <AppButton
                title="Skip"
                variant="secondary"
                icon={SkipForward}
                className="flex-1"
                onPress={() => {}}
              />
            </View>
          </View>
        </Animated.View>
      </View>
    </BottomSheetView>
  );
}
