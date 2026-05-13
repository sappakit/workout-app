import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types/api.types";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UseInfiniteOptionsQueryProps<T> {
  url: string;
  queryKey: readonly unknown[];
  limit?: number;
  search?: string;
  enabled?: boolean;
}

export function useInfiniteOptionsQuery<T>({
  url,
  queryKey,
  limit = 20,
  search,
  enabled = true,
}: UseInfiniteOptionsQueryProps<T>) {
  return useInfiniteQuery<PaginatedResponse<T>>({
    initialPageParam: 1,
    enabled,
    queryKey: [...queryKey, { search, limit }],
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<PaginatedResponse<T>>(url, {
        params: {
          page: pageParam,
          limit,
          search: search?.trim() || undefined,
        },
      });

      return data;
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
  });
}
