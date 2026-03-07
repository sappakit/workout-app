import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types/api.types";
import { useInfiniteQuery } from "@tanstack/react-query";
import FormMultiSelectInput, {
  FormMultiSelectInputProps,
  SelectOption,
} from "./FormMultiSelectInput";

interface FormInfiniteMultiSelectInputProps<T> extends Omit<
  FormMultiSelectInputProps,
  "options"
> {
  url: string;
  queryKey: readonly unknown[];
  mapOption: (item: T) => SelectOption;
  selectedOptions?: SelectOption[];
}

export default function FormInfiniteMultiSelectInput<T>({
  url,
  queryKey,
  mapOption,
  selectedOptions,
  ...props
}: FormInfiniteMultiSelectInputProps<T>) {
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
        params: { page: pageParam, limit: 20 },
      });

      return data;
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
  });

  const options = data?.pages.flatMap((page) => page.data.map(mapOption)) ?? [];

  const mergedOptions = selectedOptions
    ? [
        ...selectedOptions.filter(
          (selected) =>
            !options.some((option) => option.value === selected.value),
        ),
        ...options,
      ]
    : options;

  const loadMore = () => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  };

  return (
    <FormMultiSelectInput
      {...props}
      options={mergedOptions}
      isLoading={isLoading}
      isError={isError}
      isFetchingNextPage={isFetchingNextPage}
      onEndReached={loadMore}
    />
  );
}
