import { useAppTheme } from "@/hooks/useAppTheme";
import clsx from "clsx";
import { ImageIcon } from "lucide-react-native";
import { Image, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { twMerge } from "tailwind-merge";

interface ThumbnailProps {
  imageUri?: string | null;
  className?: string;
  style?: StyleProp<ViewStyle>;
  iconSize?: number;
  iconColor?: string;
}

export default function Thumbnail({
  imageUri,
  className,
  style,
  iconSize = 28,
  iconColor,
}: ThumbnailProps) {
  const { colors } = useAppTheme();

  return (
    <View
      className={twMerge(clsx("rounded-2xl", className))}
      style={[
        styles.imageWrapper,
        {
          backgroundColor: colors.app.cardSecondary,
        },
        style,
      ]}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
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
    // borderWidth: 1,
    // borderRadius: 14,
    width: 112,
  },
  image: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
