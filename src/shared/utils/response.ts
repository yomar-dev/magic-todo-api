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
