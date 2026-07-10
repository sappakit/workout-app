import clsx from "clsx";
import React from "react";
import { Image, ImageStyle, StyleProp, View } from "react-native";
import { twMerge } from "tailwind-merge";

type AppLogoVariant = "color" | "mono";

type AppLogoProps = {
  size?: number;
  variant?: AppLogoVariant;
  className?: string;
  style?: StyleProp<ImageStyle>;
};

const SOURCES = {
  color: require("@/assets/images/brand/brand_logo_color.png"),
  mono: require("@/assets/images/brand/brand_logo_mono.png"),
} as const;

export function AppLogo({
  size = 144,
  variant = "color",
  className,
  style,
}: AppLogoProps) {
  return (
    <View className={twMerge(clsx("items-center justify-center", className))}>
      <Image
        source={SOURCES[variant]}
        resizeMode="contain"
        style={[{ width: size, height: size }, style]}
      />
    </View>
  );
}
