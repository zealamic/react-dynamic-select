import type { DynamicSelectConfig } from "@/general-types";
import { LOAD_MORE_TYPE } from "@/lib/constants";

export type ResolvedLoadMoreConfig<ApiResponse> = {
  type: (typeof LOAD_MORE_TYPE)[keyof typeof LOAD_MORE_TYPE];
  label?: string | null;
  loadingLabel?: string | null;
  threshold?: number;
  distance?: number;
  debounce?: number;
  afterFetch?: (data: ApiResponse) => Promise<void>;
};

export function resolveLoadMoreConfig<ApiResponse>(
  loadMore: DynamicSelectConfig<ApiResponse>["loadMore"],
): ResolvedLoadMoreConfig<ApiResponse> | null {
  if (!loadMore) {
    return null;
  }

  if (loadMore === true) {
    return { type: LOAD_MORE_TYPE.CLICK };
  }

  return {
    type: loadMore.type ?? LOAD_MORE_TYPE.CLICK,
    ...loadMore,
  };
}

export function hasMoreToLoad(loadedCount: number, total: number) {
  return total > 0 && loadedCount < total;
}
