import { AppButton } from "@/components/custom-ui/AppButton";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import * as ImageManipulator from "expo-image-manipulator";
import { X } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Image as RNImage,
  View,
  useWindowDimensions,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Defs, Mask, Rect } from "react-native-svg";

type AvatarImageEditorProps = {
  visible: boolean;
  imageUri: string | null;
  onClose: () => void;
  onComplete: (image: { uri: string; name: string; type: string }) => void;
};

type ImageSize = {
  width: number;
  height: number;
};

const OUTPUT_SIZE = 600;

const MIN_EXTRA_SCALE = 1;
const MAX_EXTRA_SCALE = 4;

const MIN_GESTURE_SCALE = 0.5;
const MAX_GESTURE_SCALE = 12;

const SNAP_ANIMATION_DURATION = 200;

export function AvatarImageEditor({
  visible,
  imageUri,
  onClose,
  onComplete,
}: AvatarImageEditorProps) {
  const { colors } = useAppTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const editorSize = width;
  const cropSize = editorSize;
  const cropRadius = cropSize / 2;

  const [imageSize, setImageSize] = useState<ImageSize | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const imageScale = useSharedValue(1);
  const savedImageScale = useSharedValue(1);

  const isPinching = useSharedValue(false);

  const pinchStartScale = useSharedValue(1);
  const pinchStartTranslateX = useSharedValue(0);
  const pinchStartTranslateY = useSharedValue(0);

  const baseScale = useMemo(() => {
    if (!imageSize) return 1;

    return Math.max(cropSize / imageSize.width, cropSize / imageSize.height);
  }, [cropSize, imageSize]);

  const displayedImageSize = useMemo(() => {
    if (!imageSize) return null;

    return {
      width: imageSize.width * baseScale,
      height: imageSize.height * baseScale,
    };
  }, [baseScale, imageSize]);

  const resetTransform = () => {
    translateX.value = 0;
    translateY.value = 0;
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;

    imageScale.value = 1;
    savedImageScale.value = 1;

    isPinching.value = false;

    pinchStartScale.value = 1;
    pinchStartTranslateX.value = 0;
    pinchStartTranslateY.value = 0;
  };

  const loadImageSize = (uri: string) => {
    RNImage.getSize(
      uri,
      (imageWidth, imageHeight) => {
        setImageSize({
          width: imageWidth,
          height: imageHeight,
        });

        resetTransform();
      },
      () => {
        setImageSize(null);
      },
    );
  };

  React.useEffect(() => {
    if (!visible || !imageUri) return;

    loadImageSize(imageUri);
  }, [visible, imageUri]);

  const getClampedTranslate = (
    targetTranslateX: number,
    targetTranslateY: number,
    targetScale: number,
  ) => {
    "worklet";

    if (!displayedImageSize) {
      return {
        x: targetTranslateX,
        y: targetTranslateY,
      };
    }

    const scaledWidth = displayedImageSize.width * targetScale;
    const scaledHeight = displayedImageSize.height * targetScale;

    const maxTranslateX = Math.max(0, (scaledWidth - cropSize) / 2);
    const maxTranslateY = Math.max(0, (scaledHeight - cropSize) / 2);

    return {
      x: Math.min(Math.max(targetTranslateX, -maxTranslateX), maxTranslateX),
      y: Math.min(Math.max(targetTranslateY, -maxTranslateY), maxTranslateY),
    };
  };

  const snapToBounds = (targetScale: number) => {
    "worklet";

    const clampedTranslate = getClampedTranslate(
      translateX.value,
      translateY.value,
      targetScale,
    );

    translateX.value = withTiming(clampedTranslate.x, {
      duration: SNAP_ANIMATION_DURATION,
    });

    translateY.value = withTiming(clampedTranslate.y, {
      duration: SNAP_ANIMATION_DURATION,
    });

    savedTranslateX.value = clampedTranslate.x;
    savedTranslateY.value = clampedTranslate.y;
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (isPinching.value) return;

      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
    })
    .onEnd(() => {
      if (isPinching.value) return;

      snapToBounds(imageScale.value);
    });

  const pinchGesture = Gesture.Pinch()
    .onBegin(() => {
      isPinching.value = true;

      pinchStartScale.value = imageScale.value;
      pinchStartTranslateX.value = translateX.value;
      pinchStartTranslateY.value = translateY.value;
    })
    .onUpdate((event) => {
      const rawNextScale = pinchStartScale.value * event.scale;

      const nextScale = Math.min(
        Math.max(rawNextScale, MIN_GESTURE_SCALE),
        MAX_GESTURE_SCALE,
      );

      const scaleRatio = nextScale / pinchStartScale.value;

      translateX.value = pinchStartTranslateX.value * scaleRatio;
      translateY.value = pinchStartTranslateY.value * scaleRatio;
      imageScale.value = nextScale;
    })
    .onEnd(() => {
      const clampedScale = Math.min(
        Math.max(imageScale.value, MIN_EXTRA_SCALE),
        MAX_EXTRA_SCALE,
      );

      const scaleRatio = clampedScale / imageScale.value;

      const finalTranslateX = translateX.value * scaleRatio;
      const finalTranslateY = translateY.value * scaleRatio;

      const clampedTranslate = getClampedTranslate(
        finalTranslateX,
        finalTranslateY,
        clampedScale,
      );

      imageScale.value = withTiming(clampedScale, {
        duration: SNAP_ANIMATION_DURATION,
      });

      translateX.value = withTiming(clampedTranslate.x, {
        duration: SNAP_ANIMATION_DURATION,
      });

      translateY.value = withTiming(clampedTranslate.y, {
        duration: SNAP_ANIMATION_DURATION,
      });

      savedImageScale.value = clampedScale;
      savedTranslateX.value = clampedTranslate.x;
      savedTranslateY.value = clampedTranslate.y;

      isPinching.value = false;
    })
    .onFinalize(() => {
      isPinching.value = false;
    });

  const composedGesture = Gesture.Race(pinchGesture, panGesture);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: imageScale.value },
      ],
    };
  });

  const resetPosition = () => {
    translateX.value = withTiming(0, {
      duration: SNAP_ANIMATION_DURATION,
    });

    translateY.value = withTiming(0, {
      duration: SNAP_ANIMATION_DURATION,
    });

    imageScale.value = withTiming(1, {
      duration: SNAP_ANIMATION_DURATION,
    });

    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
    savedImageScale.value = 1;

    isPinching.value = false;

    pinchStartScale.value = 1;
    pinchStartTranslateX.value = 0;
    pinchStartTranslateY.value = 0;
  };

  const handleDone = async () => {
    if (!imageUri || !imageSize || !displayedImageSize) return;

    try {
      setIsProcessing(true);

      const currentScale = imageScale.value;
      const currentTranslateX = translateX.value;
      const currentTranslateY = translateY.value;

      const finalDisplayScale = baseScale * currentScale;

      const imageLeft =
        editorSize / 2 -
        (imageSize.width * finalDisplayScale) / 2 +
        currentTranslateX;

      const imageTop =
        editorSize / 2 -
        (imageSize.height * finalDisplayScale) / 2 +
        currentTranslateY;

      const cropLeft = (editorSize - cropSize) / 2;
      const cropTop = (editorSize - cropSize) / 2;

      const cropOriginX = clamp(
        (cropLeft - imageLeft) / finalDisplayScale,
        0,
        imageSize.width,
      );

      const cropOriginY = clamp(
        (cropTop - imageTop) / finalDisplayScale,
        0,
        imageSize.height,
      );

      const cropWidth = clamp(
        cropSize / finalDisplayScale,
        1,
        imageSize.width - cropOriginX,
      );

      const cropHeight = clamp(
        cropSize / finalDisplayScale,
        1,
        imageSize.height - cropOriginY,
      );

      const context = ImageManipulator.ImageManipulator.manipulate(imageUri);

      context
        .crop({
          originX: Math.round(cropOriginX),
          originY: Math.round(cropOriginY),
          width: Math.round(cropWidth),
          height: Math.round(cropHeight),
        })
        .resize({
          width: OUTPUT_SIZE,
          height: OUTPUT_SIZE,
        });

      const renderedImage = await context.renderAsync();

      const result = await renderedImage.saveAsync({
        compress: 0.9,
        format: ImageManipulator.SaveFormat.JPEG,
      });

      onComplete({
        uri: result.uri,
        name: `profile-${Date.now()}.jpg`,
        type: "image/jpeg",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View
          className="flex-1"
          style={{
            backgroundColor: colors.app.background,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          }}
        >
          <View className="flex-1 py-4">
            <View className="flex-row items-center justify-between gap-2 px-4">
              <View className="flex-1">
                <ThemedText type="title" variant="accent">
                  Adjust Photo
                </ThemedText>

                <ThemedText type="default" variant="primary">
                  Pinch to zoom and drag to reposition
                </ThemedText>
              </View>

              <AppButton
                className="h-10 w-10"
                shape="pill"
                variant="option"
                icon={X}
                onPress={onClose}
              />
            </View>

            <View className="flex-1 items-center justify-center">
              <View
                className="overflow-hidden"
                style={{
                  width: editorSize,
                  height: editorSize,
                  backgroundColor: colors.app.cardSecondary,
                }}
              >
                {!imageUri || !displayedImageSize ? (
                  <View className="flex-1 items-center justify-center">
                    <ActivityIndicator color={colors.app.brand} />
                  </View>
                ) : (
                  <GestureDetector gesture={composedGesture}>
                    <Animated.View className="flex-1 items-center justify-center">
                      <Animated.Image
                        source={{ uri: imageUri }}
                        resizeMode="cover"
                        style={[
                          {
                            width: displayedImageSize.width,
                            height: displayedImageSize.height,
                          },
                          imageAnimatedStyle,
                        ]}
                      />
                    </Animated.View>
                  </GestureDetector>
                )}

                <View pointerEvents="none" className="absolute inset-0">
                  <Svg width={editorSize} height={editorSize}>
                    <Defs>
                      <Mask id="avatarCropMask">
                        <Rect width="100%" height="100%" fill="white" />

                        <Circle
                          cx={editorSize / 2}
                          cy={editorSize / 2}
                          r={cropRadius}
                          fill="black"
                        />
                      </Mask>
                    </Defs>

                    <Rect
                      width="100%"
                      height="100%"
                      fill="rgba(0, 0, 0, 0.5)"
                      mask="url(#avatarCropMask)"
                    />
                  </Svg>
                </View>
              </View>
            </View>

            <View className="gap-3 px-4">
              <AppButton
                title="Use Photo"
                variant="primary"
                loading={isProcessing}
                disabled={isProcessing || !imageUri || !imageSize}
                onPress={handleDone}
              />

              <AppButton
                title="Reset Position"
                variant="secondary"
                disabled={isProcessing}
                onPress={resetPosition}
              />
            </View>
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
