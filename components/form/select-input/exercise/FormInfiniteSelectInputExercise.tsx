import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types/api.types";
import { useInfiniteQuery } from "@tanstack/react-query";
import FormSelectInputExercise, {
  FormSelectInputProps,
  SelectOption,
} from "./FormSelectInputExercise";

interface FormInfiniteSelectInputProps<T> extends Omit<
  FormSelectInputProps<T>,
  "options"
> {
  url: string;
  queryKey: readonly unknown[];
  mapOption: (item: T) => SelectOption<T>;
  selectedOption?: SelectOption<T>;
}

export default function FormInfiniteSelectInputExercise<T>({
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
        params: { page: pageParam, limit: 20 },
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
    <FormSelectInputExercise<T>
      {...props}
      options={mergedOptions}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      isError={isError}
      onEndReached={loadMore}
    />
  );
}
