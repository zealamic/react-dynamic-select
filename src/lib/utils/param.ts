import type { PaginationParams } from "@/general-types";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === "[object Object]";
}

function deepMerge<T>(defaults: T, overrides: Partial<T>): T {
  if (!isPlainObject(defaults) || !isPlainObject(overrides)) {
    return (overrides ?? defaults) as T;
  }

  const result = { ...defaults } as Record<string, unknown>;

  for (const [key, overrideValue] of Object.entries(overrides)) {
    if (overrideValue === undefined) {
      continue;
    }

    const defaultValue = result[key];

    if (isPlainObject(defaultValue) && isPlainObject(overrideValue)) {
      result[key] = deepMerge(defaultValue, overrideValue);
      continue;
    }

    result[key] = overrideValue;
  }

  return result as T;
}

export function getInitialPagination(
  params: PaginationParams = { page: 1 },
): PaginationParams {
  const page = params.page ?? 1;

  if ("pageSize" in params) {
    return { page, pageSize: params.pageSize ?? 10 };
  }

  if ("limit" in params) {
    return { page, limit: params.limit ?? 10 };
  }

  return { page, pageSize: 10 };
}

export function getNextPagePagination(
  current: PaginationParams,
): PaginationParams {
  const nextPage = (current.page ?? 1) + 1;

  if ("pageSize" in current) {
    return { page: nextPage, pageSize: current.pageSize ?? 10 };
  }

  if ("limit" in current) {
    return { page: nextPage, limit: current.limit ?? 10 };
  }

  return { page: nextPage, pageSize: 10 };
}

export function mergeDynamicConfig<DynamicConfigType>({
  defaultConfig,
  config,
}: {
  defaultConfig: DynamicConfigType;
  config?: Partial<DynamicConfigType>;
}): DynamicConfigType {
  if (!config) {
    return defaultConfig;
  }
  return deepMerge(defaultConfig, config ?? {});
}
