import { AppButton } from "@/components/custom-ui/AppButton";
import { ThemedText } from "@/components/themed-text";
import { FALLBACK_WORKOUT_IMAGE } from "@/constants/images";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ArrowUpRight, RefreshCw } from "lucide-react-native";
import { Image, Pressable, ScrollView, View } from "react-native";
import { MuscleCategoryFilter } from "./muscle-category-filter/MuscleCategoryFilter";
import { WorkoutPreviewSectionSkeleton } from "./WorkoutPreviewSectionSkeleton";

export interface WorkoutPreviewCardItem {
  id: number | string;
  title: string;
  subtitle: string;
  imageUrl?: string | null;
  action: () => void;
  favoriteAction?: () => void;
}

export interface WorkoutPreviewSectionProps {
  items: WorkoutPreviewCardItem[];
  selectedMuscleIds: number[];
  onChangeMuscleIds: (muscleIds: number[]) => void;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export function WorkoutPreviewSection({
  items,
  selectedMuscleIds,
  onChangeMuscleIds,
  isLoading = false,
  isError = false,
  onRetry,
}: WorkoutPreviewSectionProps) {
  return (
    <View className="gap-3">
      <MuscleCategoryFilter
        selectedMuscleIds={selectedMuscleIds}
        onChange={onChangeMuscleIds}
      />

      {isLoading ? (
        <WorkoutPreviewSectionSkeleton
          showHeader={false}
          showCategories={false}
        />
      ) : isError ? (
        <WorkoutPreviewError onRetry={onRetry} />
      ) : (
        <WorkoutPreviewCardList items={items} />
      )}
    </View>
  );
}

function WorkoutPreviewCardList({
  items,
}: {
  items: WorkoutPreviewCardItem[];
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-3"
    >
      {items.map((workout) => (
        <WorkoutPreviewCard key={workout.id} item={workout} />
      ))}
    </ScrollView>
  );
}

function WorkoutPreviewError({ onRetry }: { onRetry?: () => void }) {
  return (
    <View className="items-center justify-center gap-2 rounded-2xl py-4">
      <ThemedText type="small" variant="accent" className="text-center">
        Failed to load workouts.
      </ThemedText>

      {onRetry ? (
        <AppButton
          title="Retry"
          icon={RefreshCw}
          variant="secondary"
          className="w-28"
          onPress={onRetry}
        />
      ) : null}
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
      className="w-64 overflow-hidden rounded-2xl"
      style={{ backgroundColor: colors.app.cardPrimary }}
      onPress={item.action}
    >
      <View className="relative h-32">
        <Image
          source={{ uri: item.imageUrl ?? FALLBACK_WORKOUT_IMAGE }}
          className="h-full w-full"
          resizeMode="cover"
        />

        {/* TODO: add favorite */}
        {/* <View className="absolute right-0 top-0 p-3">
          <AppButton
            variant="white"
            icon={Heart}
            className="h-9 w-9"
            shape="pill"
            onPress={item.favoriteAction}
          />
        </View> */}
      </View>

      <View className="flex-row justify-between p-3">
        <View className="flex-1">
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
