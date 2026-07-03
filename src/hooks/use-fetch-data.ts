import { useCallback, useRef, useState } from "react";
import type {
  DynamicSelectConfig,
  PaginationParams,
  ResolvedOption,
} from "@/general-types";
import {
  getInitialPagination,
  getNextPagePagination,
  hasMoreToLoad,
  resolveDataFromTemplate,
  resolveLoadMoreConfig,
  resolveOptionFromTemplate,
} from "@/lib/utils";

function resolveOptionsFromResponse<DataType, ApiResponse, ApiParams>({
  data,
  dynamicConfig,
}: {
  data: ApiResponse;
  dynamicConfig: DynamicSelectConfig<DataType, ApiResponse, ApiParams>;
}): ResolvedOption[] {
  const optionTemplate = dynamicConfig.option?.template;
  const list = resolveDataFromTemplate({
    template: dynamicConfig.list?.path,
    data: data as Record<string, unknown>,
  });

  if (!Array.isArray(list) || !optionTemplate) {
    return [];
  }

  return list.map((item) =>
    resolveOptionFromTemplate<DataType>({
      template: optionTemplate,
      data: item as Record<string, unknown>,
    }),
  );
}

function resolveTotalFromResponse<DataType, ApiResponse, ApiParams>({
  data,
  dynamicConfig,
}: {
  data: ApiResponse;
  dynamicConfig: DynamicSelectConfig<DataType, ApiResponse, ApiParams>;
}): number {
  return (
    (resolveDataFromTemplate({
      template: dynamicConfig.total?.path,
      data: data as Record<string, unknown>,
    }) as number) || 0
  );
}

export function useFetchData<
  DataType = any,
  ApiResponse = any,
  ApiParams = Record<string, any>,
>(dynamicConfig: DynamicSelectConfig<DataType, ApiResponse, ApiParams>) {
  const [options, setOptions] = useState<ResolvedOption[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const paginationRef = useRef(
    getInitialPagination(dynamicConfig.api.params as PaginationParams),
  );
  const queryParamsRef = useRef<Partial<ApiParams>>({});
  const requestIdRef = useRef(0);
  const optionsRef = useRef(options);
  const totalRef = useRef(total);
  const isLoadingMoreRef = useRef(isLoadingMore);

  optionsRef.current = options;
  totalRef.current = total;
  isLoadingMoreRef.current = isLoadingMore;

  const resolveRequestParams = useCallback(
    (extra?: Partial<ApiParams>) => {
      return {
        ...(dynamicConfig.api.params ?? ({} as ApiParams)),
        ...queryParamsRef.current,
        ...extra,
      } as ApiParams;
    },
    [dynamicConfig.api.params],
  );

  const resetPagination = useCallback(() => {
    paginationRef.current = getInitialPagination(
      dynamicConfig.api.params as PaginationParams,
    );
  }, [dynamicConfig.api.params]);

  const runAfterFetch = useCallback(
    async (data: ApiResponse) => {
      const loadMoreConfig = resolveLoadMoreConfig(dynamicConfig.loadMore);
      await loadMoreConfig?.afterFetch?.(data);
    },
    [dynamicConfig.loadMore],
  );

  const fetchData = useCallback(
    async (overrideParams?: Partial<ApiParams>) => {
      if (!dynamicConfig.api.fetch) {
        return;
      }

      const requestId = ++requestIdRef.current;

      if (overrideParams) {
        queryParamsRef.current = {
          ...queryParamsRef.current,
          ...overrideParams,
        };
      }

      resetPagination();
      const initialPagination = getInitialPagination(
        dynamicConfig.api.params as PaginationParams,
      );

      setLoading(true);
      try {
        const data = await dynamicConfig.api.fetch(
          resolveRequestParams(initialPagination as Partial<ApiParams>),
        );

        if (requestId !== requestIdRef.current) {
          return;
        }

        setOptions(resolveOptionsFromResponse({ data, dynamicConfig }));
        setTotal(resolveTotalFromResponse({ data, dynamicConfig }));
        dynamicConfig.api.onSuccess?.(data);
        paginationRef.current = getNextPagePagination(initialPagination);
        await runAfterFetch(data);
      } catch (error: unknown) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        dynamicConfig.api.onError?.(error as Error);
        setOptions([]);
        setTotal(0);
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [dynamicConfig, resetPagination, resolveRequestParams, runAfterFetch],
  );

  const fetchLoadMore = useCallback(async () => {
    if (!dynamicConfig.api.fetch) {
      return;
    }

    if (
      !hasMoreToLoad(optionsRef.current.length, totalRef.current) ||
      isLoadingMoreRef.current
    ) {
      return;
    }

    const requestId = ++requestIdRef.current;
    setIsLoadingMore(true);

    try {
      const data = await dynamicConfig.api.fetch(
        resolveRequestParams(paginationRef.current as Partial<ApiParams>),
      );

      if (requestId !== requestIdRef.current) {
        return;
      }

      setOptions((prev) => [
        ...prev,
        ...resolveOptionsFromResponse({ data, dynamicConfig }),
      ]);
      setTotal(resolveTotalFromResponse({ data, dynamicConfig }));
      paginationRef.current = getNextPagePagination(paginationRef.current);
      dynamicConfig.api.onSuccess?.(data);
      await runAfterFetch(data);
    } catch (error: unknown) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      dynamicConfig.api.onError?.(error as Error);
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoadingMore(false);
      }
    }
  }, [dynamicConfig, resolveRequestParams, runAfterFetch]);

  return {
    options: options,
    total,
    loading,
    isLoadingMore,
    fetchData,
    fetchLoadMore,
  };
}
