import { QueryClient, QueryKey, useQueryClient } from "@tanstack/react-query";

export const invalidateQueryKeys = async (
  queryClient: QueryClient,
  keys: readonly QueryKey[],
) => {
  await Promise.all(
    keys.map((key) => queryClient.invalidateQueries({ queryKey: key })),
  );
};

export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();

  return async (keys: readonly QueryKey[]) => {
    await Promise.all(
      keys.map((key) => queryClient.invalidateQueries({ queryKey: key })),
    );
  };
};
