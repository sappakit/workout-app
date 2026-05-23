import { useAppTheme } from "@/hooks/useAppTheme";
import { User } from "lucide-react-native";
import { Image, View } from "react-native";

type UserAvatarProps = {
  imageUrl?: string | null;
};

export function UserAvatar({ imageUrl }: UserAvatarProps) {
  const { colors } = useAppTheme();

  return (
    <View
      className="h-12 w-12 items-center justify-center overflow-hidden rounded-full border"
      style={{
        backgroundColor: colors.app.cardPrimary,
        borderColor: colors.app.borderPrimary,
      }}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          className="h-full w-full"
          resizeMode="cover"
        />
      ) : (
        <User size={28} color={colors.app.borderPrimary} />
      )}
    </View>
  );
}
