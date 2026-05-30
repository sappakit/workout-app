import { AppButton } from "@/components/custom-ui/AppButton";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ArrowUpRight, Heart, ImageIcon } from "lucide-react-native";
import { Image, Pressable, ScrollView, View } from "react-native";
import { MuscleCategoryFilter } from "./MuscleCategoryFilter";

export interface WorkoutPreviewCardItem {
  id: number | string;
  title: string;
  subtitle: string;
  imageUrl?: string | null;
  action: () => void;
  favoriteAction?: () => void;
}

interface WorkoutPreviewSectionProps {
  items: WorkoutPreviewCardItem[];
  selectedMuscleIds: number[];
  onChangeMuscleIds: (muscleIds: number[]) => void;
}

export function WorkoutPreviewSection({
  items,
  selectedMuscleIds,
  onChangeMuscleIds,
}: WorkoutPreviewSectionProps) {
  return (
    <View className="gap-3">
      <MuscleCategoryFilter
        selectedMuscleIds={selectedMuscleIds}
        onChange={onChangeMuscleIds}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3"
      >
        {items.map((workout) => (
          <WorkoutPreviewCard key={workout.id} item={workout} />
        ))}
      </ScrollView>
    </View>
  );
}

interface WorkoutPreviewCardProps {
  item: WorkoutPreviewCardItem;
}

export function WorkoutPreviewCard({ item }: WorkoutPreviewCardProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      className="overflow-hidden rounded-2xl"
      style={{ backgroundColor: colors.app.cardPrimary, width: 240 }}
      onPress={item.action}
    >
      <View className="relative h-32">
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : (
          <View
            className="h-full w-full items-center justify-center"
            style={{ backgroundColor: colors.app.cardTertiary }}
          >
            <ImageIcon size={32} color={colors.app.cardPrimary} />
          </View>
        )}

        <View className="absolute right-0 top-0 p-3">
          <AppButton
            variant="white"
            icon={Heart}
            className="h-9 w-9"
            shape="pill"
            onPress={item.favoriteAction}
          />
        </View>
      </View>

      <View className="flex-row justify-between p-3">
        <View>
          <ThemedText type="subtitle" variant="accent" numberOfLines={1}>
            {item.title}
          </ThemedText>

          <ThemedText type="small" variant="primary" numberOfLines={1}>
            {item.subtitle}
          </ThemedText>
        </View>

        <AppButton
          variant="primary"
          icon={ArrowUpRight}
          className="h-9 w-9 self-end"
          shape="pill"
          onPress={item.action}
        />
      </View>
    </Pressable>
  );
}
