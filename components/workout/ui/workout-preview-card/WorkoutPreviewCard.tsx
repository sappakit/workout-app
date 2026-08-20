import { AppButton } from "@/components/custom-ui/app-button";
import { MetaPill } from "@/components/custom-ui/MetaPill";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { CONTENT_PADDING_HORIZONTAL } from "@/components/layout/PageLayout";
import { ContentFeedback } from "@/components/state/ContentFeedback";
import { WORKOUT_IMAGE } from "@/constants/images";
import { useAppColors } from "@/hooks/useAppTheme";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import type { WorkoutCardItem } from "../workout-card/WorkoutCard";
import { MuscleCategoryFilter } from "./muscle-category-filter/MuscleCategoryFilter";
import { WorkoutPreviewSectionSkeleton } from "./WorkoutPreviewSectionSkeleton";

export interface WorkoutPreviewCardItem extends WorkoutCardItem {
  action: () => void;
  favoriteAction: () => void;
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
  const isEmpty = items.length === 0;

  return (
    <View
      className="gap-3"
      style={{
        marginHorizontal: -CONTENT_PADDING_HORIZONTAL,
      }}
    >
      <MuscleCategoryFilter
        selectedMuscleIds={selectedMuscleIds}
        onChange={onChangeMuscleIds}
      />

      {isLoading ? (
        <WorkoutPreviewSectionSkeleton
          contentContainerStyle={{
            paddingHorizontal: CONTENT_PADDING_HORIZONTAL,
          }}
        />
      ) : isError ? (
        <WorkoutPreviewError onRetry={onRetry} />
      ) : isEmpty ? (
        <WorkoutPreviewEmpty />
      ) : (
        <WorkoutPreviewCardList items={items} />
      )}
    </View>
  );
}

function WorkoutPreviewEmpty() {
  return (
    <ContentFeedback
      icon="workout"
      title="No workouts found"
      subtitle="Explore another muscle group to find a workout."
      style={{
        marginHorizontal: CONTENT_PADDING_HORIZONTAL,
      }}
    />
  );
}

function WorkoutPreviewError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ContentFeedback
      icon="warning"
      title="Failed to load workouts"
      subtitle="Something went wrong. Please try again."
      action={
        onRetry
          ? {
              title: "Retry",
              icon: "refresh",
              onPress: onRetry,
            }
          : undefined
      }
      style={{
        marginHorizontal: CONTENT_PADDING_HORIZONTAL,
      }}
    />
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
      contentContainerStyle={{
        gap: 12,
        paddingHorizontal: CONTENT_PADDING_HORIZONTAL,
      }}
    >
      {items.map((workout) => (
        <WorkoutPreviewCard key={workout.id} item={workout} />
      ))}
    </ScrollView>
  );
}

export function WorkoutPreviewCard({ item }: { item: WorkoutPreviewCardItem }) {
  const colors = useAppColors();

  return (
    <Pressable
      className="w-56 overflow-hidden rounded-2xl bg-card active:opacity-90"
      onPress={item.action}
    >
      <View className="relative h-32">
        <Image
          source={{
            uri: item.imageUrl ?? WORKOUT_IMAGE,
          }}
          className="h-full w-full"
          resizeMode="cover"
        />

        <LinearGradient
          colors={["transparent", colors.imageOverlayStrong]}
          locations={[0.4, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        <View className="absolute bottom-0 left-0 right-0 p-2">
          {item.metaItems && item.metaItems.length > 0 ? (
            <View className="flex-row flex-wrap gap-2">
              {item.metaItems.map((metaItem) => (
                <MetaPill
                  key={String(metaItem.key)}
                  icon={metaItem.icon}
                  label={metaItem.label}
                  variant="overlay"
                />
              ))}
            </View>
          ) : null}
        </View>
      </View>

      <View className="flex-row items-end justify-between gap-2 p-3">
        <View className="min-w-0 flex-1">
          {item.subtitle ? (
            <ThemedText type="caption" tone="muted" numberOfLines={1}>
              {item.subtitle}
            </ThemedText>
          ) : null}

          <ThemedText type="bodyStrong" numberOfLines={1}>
            {item.title}
          </ThemedText>
        </View>

        <AppButton
          variant="contrast"
          size="icon"
          className="h-9 w-9 rounded-full"
          icon={{
            name: "favorite",
            variant: "outline",
            size: "md",
          }}
          onPress={item.favoriteAction}
        />
      </View>
    </Pressable>
  );
}
