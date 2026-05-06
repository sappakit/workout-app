export type PageParams = { page?: number; limit?: number };

export type PaginatedResponse<T> = {
  data: T;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
