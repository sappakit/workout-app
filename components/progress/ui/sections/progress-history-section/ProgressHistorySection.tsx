import { SectionHeader } from "@/components/layout/SectionHeader";
import { ActivityIndicator, FlatList, View } from "react-native";
import { RecentWorkoutCard, RecentWorkoutCardItem } from "./RecentWorkoutCard";

interface ProgressHistorySectionProps {
  data: RecentWorkoutCardItem[];
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

export function ProgressHistorySection({
  data,
  isFetchingNextPage,
  onLoadMore,
}: ProgressHistorySectionProps) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.id)}
      contentContainerClassName="gap-3 p-4"
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.3}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <SectionHeader
          title="Recent Workouts"
          subtitle="Your completed workout history"
        />
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="py-4">
            <ActivityIndicator />
          </View>
        ) : null
      }
      renderItem={({ item }) => <RecentWorkoutCard item={item} />}
    />
  );
}
