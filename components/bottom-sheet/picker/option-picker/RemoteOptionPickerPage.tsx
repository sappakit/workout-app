import { ThemedText } from "@/components/custom-ui/themed-text";
import { useInfiniteOptionsQuery } from "@/lib/query/useInfiniteOptionsQuery";
import type { PaginatedResponse } from "@/types/api.types";
import { DistributiveOmit } from "@/types/utils";
import { useEffect, useMemo } from "react";
import { View } from "react-native";
import {
  type OptionPickerOption,
  type OptionPickerPageProps,
  type OptionPickerValue,
  OptionPickerPage,
  OptionPickerPageHeader,
} from "./OptionPickerPage";

export type RemoteOptionPickerPageProps<
  TItem,
  TValue extends OptionPickerValue,
> = DistributiveOmit<
  OptionPickerPageProps<TValue>,
  "options" | "onEndReached" | "isFetchingNextPage"
> & {
  url: string;
  queryKey: readonly unknown[];
  mapOption: (item: TItem) => OptionPickerOption<TValue>;
  limit?: number;
  onOptionsChange?: (options: OptionPickerOption<TValue>[]) => void;
};

export function RemoteOptionPickerPage<
  TItem,
  TValue extends OptionPickerValue = number,
>(props: RemoteOptionPickerPageProps<TItem, TValue>) {
  const {
    url,
    queryKey,
    mapOption,
    limit = 20,
    onOptionsChange,
    ...pickerProps
  } = props;

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

  useEffect(() => {
    onOptionsChange?.(options);
  }, [onOptionsChange, options]);

  const handleEndReached = () => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    fetchNextPage();
  };

  if (isLoading) {
    return (
      <RemoteOptionPickerStatePage
        title={pickerProps.title}
        message="Loading options..."
        onBack={pickerProps.onBack}
      />
    );
  }

  if (isError) {
    return (
      <RemoteOptionPickerStatePage
        title={pickerProps.title}
        message="Failed to load options."
        onBack={pickerProps.onBack}
      />
    );
  }

  if (options.length === 0) {
    return (
      <RemoteOptionPickerStatePage
        title={pickerProps.title}
        message="No options available."
        onBack={pickerProps.onBack}
      />
    );
  }

  if (pickerProps.selectionMode === "multiple") {
    return (
      <OptionPickerPage
        {...pickerProps}
        options={options}
        onEndReached={handleEndReached}
        isFetchingNextPage={isFetchingNextPage}
      />
    );
  }

  return (
    <OptionPickerPage
      {...pickerProps}
      options={options}
      onEndReached={handleEndReached}
      isFetchingNextPage={isFetchingNextPage}
    />
  );
}

function RemoteOptionPickerStatePage({
  title,
  message,
  onBack,
}: {
  title: string;
  message: string;
  onBack?: () => void;
}) {
  return (
    <View className="gap-4 px-4">
      <OptionPickerPageHeader title={title} onBack={onBack} />

      <View className="rounded-2xl bg-secondary p-4">
        <ThemedText type="body" tone="muted">
          {message}
        </ThemedText>
      </View>
    </View>
  );
}
