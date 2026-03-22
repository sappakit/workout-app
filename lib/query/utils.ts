import { QueryClient, QueryKey } from "@tanstack/react-query";

export const invalidateQueryKeys = async (
  queryClient: QueryClient,
  keys: readonly QueryKey[],
) => {
  await Promise.all(
    keys.map((key) => queryClient.invalidateQueries({ queryKey: key })),
  );
};
