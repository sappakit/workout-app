import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types/api.types";
import { useInfiniteQuery } from "@tanstack/react-query";
import FormSelectInput, {
  FormSelectInputProps,
  SelectOption,
} from "./FormSelectInput2";

interface FormInfiniteSelectInputProps<T> extends Omit<
  FormSelectInputProps,
  "options"
> {
  url: string;
  queryKey: readonly unknown[];
  mapOption: (item: T) => SelectOption;
  selectedOption?: SelectOption;
}

export default function FormInfiniteSelectInput<T>({
  url,
  queryKey,
  mapOption,
  selectedOption,
  ...props
}: FormInfiniteSelectInputProps<T>) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<PaginatedResponse<T[]>>({
    initialPageParam: 1,
    queryKey,
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<PaginatedResponse<T[]>>(url, {
        params: { page: pageParam },
      });

      return data;
    },

    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
  });

  // Get options
  const options = data?.pages.flatMap((page) => page.data.map(mapOption)) ?? [];

  // Merged with selected option
  const mergedOptions =
    selectedOption && !options.some((o) => o.value === selectedOption.value)
      ? [selectedOption, ...options]
      : options;

  const loadMore = () => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  };

  return (
    <FormSelectInput
      {...props}
      options={mergedOptions}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      isError={isError}
      onEndReached={loadMore}
      snapPoints={["30%"]}
    />
  );
}
