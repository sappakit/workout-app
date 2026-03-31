import { useAppTheme } from "@/hooks/useAppTheme";
import { ImageIcon } from "lucide-react-native";
import { Image, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface ThumbnailProps {
  image?: any;
  style?: StyleProp<ViewStyle>;
  iconSize?: number;
  iconColor?: string;
}

export default function Thumbnail({
  image,
  style,
  iconSize = 28,
  iconColor,
}: ThumbnailProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.imageWrapper,
        {
          borderColor: colors.app.borderPrimary,
          backgroundColor: colors.app.cardSecondary,
        },
        style,
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
          style={[styles.image, { backgroundColor: colors.app.cardSecondary }]}
        >
          <ImageIcon
            size={iconSize}
            color={iconColor ?? colors.app.textPrimary}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageWrapper: {
    overflow: "hidden",
    borderWidth: 1,
    borderRadius: 14,
    width: 112,
  },
  image: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
