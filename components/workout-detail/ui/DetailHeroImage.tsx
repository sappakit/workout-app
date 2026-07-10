import {
  CONTENT_PADDING_HORIZONTAL,
  CONTENT_PADDING_TOP,
} from "@/components/layout/PageLayout";
import { WORKOUT_IMAGE } from "@/constants/images";
import { ImageBackground, ImageStyle, StyleProp } from "react-native";

interface DetailHeroImageProps {
  imageUrl?: string | null;
  height?: number;
  style?: StyleProp<ImageStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  className?: string;
}

export function DetailHeroImage({
  imageUrl,
  height = 256,
  style,
  imageStyle,
  className,
}: DetailHeroImageProps) {
  return (
    <ImageBackground
      source={{ uri: imageUrl ?? WORKOUT_IMAGE }}
      resizeMode="cover"
      className={className}
      style={[{ height }, style]}
      imageStyle={[
        {
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          marginHorizontal: -CONTENT_PADDING_HORIZONTAL,
          marginTop: -CONTENT_PADDING_TOP,
        },
        imageStyle,
      ]}
    />
  );
}
