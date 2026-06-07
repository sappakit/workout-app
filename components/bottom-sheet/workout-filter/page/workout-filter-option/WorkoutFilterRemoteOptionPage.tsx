import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useInfiniteOptionsQuery } from "@/lib/query/useInfiniteOptionsQuery";
import { PaginatedResponse } from "@/types/api.types";
import { useMemo } from "react";
import { View } from "react-native";
import {
  FilterOption,
  FilterOptionHeader,
  WorkoutFilterOptionPage,
} from "./WorkoutFilterOptionPage";

type WorkoutFilterRemoteOptionPageProps<TItem> = {
  title: string;
  url: string;
  queryKey: readonly unknown[];
  selectedIds: number[];
  bottomInset: number;
  onBack: () => void;
  onChangeSelectedIds: (ids: number[]) => void;
  mapOption: (item: TItem) => FilterOption;
  limit?: number;
};

export function WorkoutFilterRemoteOptionPage<TItem>({
  title,
  url,
  queryKey,
  selectedIds,
  bottomInset,
  onBack,
  onChangeSelectedIds,
  mapOption,
  limit = 20,
}: WorkoutFilterRemoteOptionPageProps<TItem>) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteOptionsQuery<TItem>({
    url,
    queryKey,
    limit,
  });

  const options = useMemo(() => {
    const pages = data?.pages ?? [];

    return pages.flatMap((page: PaginatedResponse<TItem>) =>
      page.data.map(mapOption),
    );
  }, [data?.pages, mapOption]);

  const handleEndReached = () => {
    if (!hasNextPage || isFetchingNextPage) return;

    fetchNextPage();
  };

  if (isLoading) {
    return (
      <RemoteOptionStatePage
        title={title}
        message="Loading options..."
        bottomInset={bottomInset}
        onBack={onBack}
      />
    );
  }

  if (isError) {
    return (
      <RemoteOptionStatePage
        title={title}
        message="Failed to load options."
        bottomInset={bottomInset}
        onBack={onBack}
      />
    );
  }

  if (options.length === 0) {
    return (
      <RemoteOptionStatePage
        title={title}
        message="No options available."
        bottomInset={bottomInset}
        onBack={onBack}
      />
    );
  }

  return (
    <WorkoutFilterOptionPage
      title={title}
      options={options}
      selectionMode="multiple"
      selectedIds={selectedIds}
      onChangeSelectedIds={onChangeSelectedIds}
      bottomInset={bottomInset}
      onBack={onBack}
      onEndReached={handleEndReached}
      isFetchingNextPage={isFetchingNextPage}
    />
  );
}

function RemoteOptionStatePage({
  title,
  message,
  bottomInset,
  onBack,
}: {
  title: string;
  message: string;
  bottomInset: number;
  onBack: () => void;
}) {
  const { colors } = useAppTheme();

  return (
    <View className="gap-4 px-4" style={{ paddingBottom: bottomInset + 20 }}>
      <FilterOptionHeader title={title} onBack={onBack} />

      <View
        className="gap-3 rounded-2xl p-4"
        style={{ backgroundColor: colors.app.cardSecondary }}
      >
        <ThemedText type="default" variant="primary">
          {message}
        </ThemedText>
      </View>
    </View>
  );
}
