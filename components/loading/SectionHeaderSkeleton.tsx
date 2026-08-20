import { type StyleProp, View, type ViewStyle } from "react-native";
import { TextSkeleton } from "./TextSkeleton";

type SectionHeaderSkeletonProps = {
  titleWidthClassName?: string;
  showAction?: boolean;
  actionWidthClassName?: string;
  style?: StyleProp<ViewStyle>;
};

export function SectionHeaderSkeleton({
  titleWidthClassName = "w-32",
  showAction = false,
  actionWidthClassName = "w-16",
  style,
}: SectionHeaderSkeletonProps) {
  return (
    <View className="flex-row items-center justify-between" style={style}>
      <TextSkeleton type="title" className={titleWidthClassName} />

      {showAction ? (
        <TextSkeleton type="small" className={actionWidthClassName} />
      ) : null}
    </View>
  );
}
