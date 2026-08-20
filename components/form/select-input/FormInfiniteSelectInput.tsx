import FormSelectInput, {
  type FormSelectInputProps,
  type SelectOption,
} from "@/components/form/select-input/FormSelectInput";
import { api } from "@/lib/api/client";
import type { PaginatedResponse } from "@/types/api.types";
import { useInfiniteQuery } from "@tanstack/react-query";

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
  } = useInfiniteQuery<PaginatedResponse<T>>({
    initialPageParam: 1,
    queryKey,

    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<PaginatedResponse<T>>(url, {
        params: {
          page: pageParam,
          limit: 20,
        },
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
    selectedOption &&
    !options.some((option) => option.value === selectedOption.value)
      ? [selectedOption, ...options]
      : options;

  const loadMore = () => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

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
    />
  );
}
