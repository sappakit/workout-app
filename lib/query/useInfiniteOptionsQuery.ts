import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types/api.types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { QueryParamValue } from "./useGetQuery";

interface UseInfiniteOptionsQueryProps {
  url: string;
  queryKey: readonly unknown[];
  limit?: number;
  search?: string;
  enabled?: boolean;
  params?: Record<string, QueryParamValue | undefined>;
}

export function useInfiniteOptionsQuery<T>({
  url,
  queryKey,
  limit = 20,
  search,
  enabled = true,
  params,
}: UseInfiniteOptionsQueryProps) {
  return useInfiniteQuery<PaginatedResponse<T>>({
    initialPageParam: 1,
    enabled,
    queryKey: [...queryKey, { search, limit, params }],
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<PaginatedResponse<T>>(url, {
        params: {
          page: pageParam,
          limit,
          search: search?.trim() || undefined,
          ...params,
        },
        paramsSerializer: {
          indexes: null,
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
