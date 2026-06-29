import { type UIEvent, useCallback, useEffect, useRef } from "react";
import type { DynamicSelectConfig } from "@/general-types";
import { LOAD_MORE_TYPE } from "@/lib/constants";
import {
  hasMoreToLoad,
  isScrolledToBottom,
  resolveLoadMoreConfig,
} from "@/lib/utils";

type UseLoadMoreOptions<
  DataType = any,
  ApiResponse = any,
  ApiParams = Record<string, any>,
> = {
  dynamicConfig: DynamicSelectConfig<DataType, ApiResponse, ApiParams>;
  fetchLoadMore: () => Promise<void> | void;
  loading: boolean;
  isLoadingMore: boolean;
  loadedCount: number;
  total: number;
  onPopupScroll?: (event: UIEvent<HTMLDivElement>) => void;
};

export function useLoadMore<
  DataType = any,
  ApiResponse = any,
  ApiParams = Record<string, any>,
>({
  dynamicConfig,
  fetchLoadMore,
  loading,
  isLoadingMore,
  loadedCount,
  total,
  onPopupScroll,
}: UseLoadMoreOptions<DataType, ApiResponse, ApiParams>) {
  const loadMoreDebounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const loadMoreConfig = resolveLoadMoreConfig(dynamicConfig.loadMore);

  const canLoadMore = hasMoreToLoad(loadedCount, total);

  const handleLoadMoreClick = useCallback(() => {
    if (
      !loadMoreConfig ||
      loadMoreConfig.type !== LOAD_MORE_TYPE.CLICK ||
      loading ||
      isLoadingMore ||
      !canLoadMore
    ) {
      return;
    }

    void fetchLoadMore();
  }, [canLoadMore, fetchLoadMore, isLoadingMore, loadMoreConfig, loading]);

  const handlePopupScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      onPopupScroll?.(event);

      if (
        !loadMoreConfig ||
        loadMoreConfig.type !== LOAD_MORE_TYPE.SCROLL ||
        loading ||
        isLoadingMore ||
        !canLoadMore
      ) {
        return;
      }

      const distance = loadMoreConfig.distance ?? loadMoreConfig.threshold ?? 0;

      if (!isScrolledToBottom(event.currentTarget, distance)) {
        return;
      }

      if (loadMoreConfig.debounce) {
        clearTimeout(loadMoreDebounceRef.current);
        loadMoreDebounceRef.current = setTimeout(() => {
          void fetchLoadMore();
        }, loadMoreConfig.debounce);
        return;
      }

      void fetchLoadMore();
    },
    [
      canLoadMore,
      fetchLoadMore,
      isLoadingMore,
      loadMoreConfig,
      loading,
      onPopupScroll,
    ],
  );

  useEffect(() => {
    return () => {
      clearTimeout(loadMoreDebounceRef.current);
    };
  }, []);

  return {
    handleLoadMoreClick,
    handlePopupScroll,
    loadMoreConfig,
    canLoadMore,
  };
}
