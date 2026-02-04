import { useAppTheme } from "@/hooks/useAppTheme";
import { ImageIcon } from "lucide-react-native";
import { Image, StyleSheet, View } from "react-native";

interface ThumbnailProps {
  image?: any;
  width?: number;
  aspectRatio?: number;
  borderRadius?: number;
  iconSize?: number;
  iconColor?: string;
}

export default function Thumbnail({
  image,
  width = 100,
  aspectRatio = 4 / 3,
  borderRadius = 8,
  iconSize = 28,
  iconColor = "#CCCCCC",
}: ThumbnailProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.imageWrapper,
        {
          width,
          aspectRatio,
          borderRadius,
          borderColor: colors.app.borderPrimary,
          backgroundColor: colors.app.borderPrimary,
        },
      ]}
    >
      {image ? (
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.image,
            { backgroundColor: colors.app.borderSecondary },
          ]}
        >
          <ImageIcon size={iconSize} color={iconColor} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageWrapper: {
    overflow: "hidden",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
