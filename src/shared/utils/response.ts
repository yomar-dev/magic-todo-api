export interface ApiResponse<T = unknown> {
  data: T | null;
  meta?: Record<string, unknown>;
  errors?: Array<{ message: string; details?: unknown }>;
}

export function success<T>(
  data: T,
  meta?: Record<string, unknown>,
): ApiResponse<T> {
  return { data, meta };
}

export function paginated<T>(
  data: T[],
  total: number,
  limit: number,
  offset: number,
): ApiResponse<T[]> {
  return {
    data,
    meta: { total, limit, offset, hasMore: offset + limit < total },
  };
}
