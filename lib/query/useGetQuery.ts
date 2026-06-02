import { api } from "@/lib/api";
import { QueryKey, useQuery } from "@tanstack/react-query";

export type QueryParamValue =
  | string
  | number
  | boolean
  | Array<string | number>;

type UseGetQueryOptions = {
  params?: Record<string, QueryParamValue | undefined>;
  enabled?: boolean;
  staleTime?: number;
};

export function useGetQuery<T>(
  queryKey: QueryKey,
  url: string,
  options?: UseGetQueryOptions,
) {
  return useQuery({
    queryKey: options?.params ? [...queryKey, options.params] : queryKey,
    queryFn: async () => {
      const { data } = await api.get<T>(url, {
        params: options?.params,
      });

      return data;
    },
    staleTime: options?.staleTime ?? 1000 * 60 * 5,
    enabled: options?.enabled ?? true,
  });
}
