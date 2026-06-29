export { defaultDynamicSelectConfig } from "@/default";
export type {
  DynamicSelectConfig,
  DynamicSelectHookProps,
  FetchTrigger,
  LoadMoreType,
  OptionTemplate,
  PaginationParams,
  ResolvedOption,
  SearchableApiParams,
  SearchPlacement,
} from "@/general-types";
export { useFetchData } from "@/hooks/use-fetch-data";
export { useLoadMore } from "@/hooks/use-load-more";
export { useSearch } from "@/hooks/use-search";

export {
  FETCH_TRIGGER,
  INVALID_VALUE,
  LOAD_MORE_TYPE,
  SEARCH_PLACEMENT,
} from "@/lib/constants";

export {
  getInitialPagination,
  getNextPagePagination,
  hasMoreToLoad,
  mergeDynamicConfig,
  mergeOptionsWithCurrent,
  normalizeSelectValues,
  resolveCurrentOptions,
  resolveDataFromTemplate,
  resolveLoadMoreConfig,
  resolveOptionFromTemplate,
} from "@/lib/utils";

export type { ResolvedLoadMoreConfig } from "@/lib/utils/load-more";
