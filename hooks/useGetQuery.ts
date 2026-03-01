import { api } from "@/lib/api";
import { QueryKey, useQuery } from "@tanstack/react-query";

export function useGetQuery<T>(
  queryKey: QueryKey,
  url: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    select?: (data: T) => any;
  },
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await api.get<T>(url);
      return data;
    },
    staleTime: options?.staleTime ?? 1000 * 60 * 5,
    enabled: options?.enabled,
    select: options?.select,
  });
}
