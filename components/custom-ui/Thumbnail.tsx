import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import type { AppIconSize } from "@/components/custom-ui/app-icon/app-icon.styles";
import { useAppColors } from "@/hooks/useAppColors";
import { cn } from "@/lib/utils";
import type { ColorValue, StyleProp, ViewStyle } from "react-native";
import { Image, View } from "react-native";

interface ThumbnailProps {
  imageUri?: string | null;
  className?: string;
  style?: StyleProp<ViewStyle>;
  iconSize?: AppIconSize;
  iconColor?: ColorValue;
}

export default function Thumbnail({
  imageUri,
  className,
  style,
  iconSize = "lg",
  iconColor,
}: ThumbnailProps) {
  const colors = useAppColors();

  return (
    <View
      className={cn("w-28 overflow-hidden rounded-2xl bg-secondary", className)}
      style={style}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          className="h-full w-full"
          resizeMode="cover"
        />
      ) : (
        <View className="h-full w-full items-center justify-center bg-secondary">
          <AppIcon
            name="image"
            size={iconSize}
            color={iconColor ?? colors.mutedForeground}
          />
        </View>
      )}
    </View>
  );
}
