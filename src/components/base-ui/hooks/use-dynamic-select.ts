import type { ComboboxRootChangeEventDetails } from "@base-ui/react/combobox";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { defaultDynamicSelectConfig } from "@/default";
import type { SearchableApiParams } from "@/general-types";
import { useFetchData } from "@/hooks/use-fetch-data";
import { useLoadMore } from "@/hooks/use-load-more";
import { useSearch } from "@/hooks/use-search";
import { FETCH_TRIGGER } from "@/lib/constants";
import {
  mergeDynamicConfig,
  mergeOptionsWithCurrent,
  normalizeSelectValues,
  resolveCurrentOptions,
} from "@/lib/utils";
import type {
  BaseUiDynamicSelectConfig,
  BaseUiDynamicSelectProps,
  UseBaseUiDynamicSelectReturn,
} from "../types";

export function useBaseUiDynamicSelect<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
  Multiple extends boolean = false,
>(
  props: BaseUiDynamicSelectProps<DataType, ApiResponse, ApiParams, Multiple>,
): UseBaseUiDynamicSelectReturn<DataType, ApiResponse, ApiParams, Multiple> {
  const { dynamicConfig: dynamicConfigProps, onOpenChange, multiple } = props;
  const dynamicConfig = useMemo(
    () =>
      mergeDynamicConfig<
        BaseUiDynamicSelectConfig<DataType, ApiResponse, ApiParams>
      >({
        defaultConfig: defaultDynamicSelectConfig as BaseUiDynamicSelectConfig<
          DataType,
          ApiResponse,
          ApiParams
        >,
        config: dynamicConfigProps,
      }),
    [dynamicConfigProps],
  );

  const { options, total, loading, isLoadingMore, fetchData, fetchLoadMore } =
    useFetchData<DataType, ApiResponse, ApiParams>(dynamicConfig);

  const isControlledOpen = props.open !== undefined;
  const [localOpen, setLocalOpen] = useState(props.open ?? false);
  const open = isControlledOpen ? (props.open ?? false) : localOpen;
  const hasFetchedOnOpenRef = useRef(false);
  const prevConfigPropsRef = useRef(dynamicConfigProps);

  const handleSearch = useCallback(
    (search: string) => fetchData({ search } as Partial<ApiParams>),
    [fetchData],
  );

  const {
    searchValue,
    handleInlineSearch,
    handleMenuSearchChange,
    resetSearch,
  } = useSearch({
    debounce: dynamicConfig.search?.debounce,
    onSearch: handleSearch,
  });

  const handleOpenChange = useCallback(
    (nextOpen: boolean, eventDetails?: ComboboxRootChangeEventDetails) => {
      if (eventDetails) {
        onOpenChange?.(nextOpen, eventDetails);
      }

      if (!isControlledOpen) {
        setLocalOpen(nextOpen);
      }

      if (
        nextOpen &&
        dynamicConfig.api.trigger === FETCH_TRIGGER.OPEN &&
        !hasFetchedOnOpenRef.current
      ) {
        hasFetchedOnOpenRef.current = true;
        void fetchData();
      }

      if (!nextOpen) {
        if (searchValue) {
          resetSearch();
          void fetchData({ search: "" } as Partial<ApiParams>);
        } else {
          resetSearch();
        }
      }
    },
    [
      dynamicConfig.api.trigger,
      fetchData,
      isControlledOpen,
      onOpenChange,
      resetSearch,
      searchValue,
    ],
  );

  const {
    handleLoadMoreClick,
    handlePopupScroll,
    loadMoreConfig,
    canLoadMore,
  } = useLoadMore<DataType, ApiResponse, ApiParams>({
    dynamicConfig,
    fetchLoadMore,
    loading,
    isLoadingMore,
    loadedCount: options.length,
    total,
  });

  const selectedValues = useMemo(
    () =>
      normalizeSelectValues(props.value ?? props.defaultValue, {
        mode: multiple ? "multiple" : undefined,
      }),
    [props.defaultValue, multiple, props.value],
  );

  const currentOptions = useMemo(
    () => resolveCurrentOptions(dynamicConfig),
    [dynamicConfig],
  );

  const mergedOptions = useMemo(
    () =>
      mergeOptionsWithCurrent({
        fetchedOptions: options,
        currentOptions,
        selectedValues,
      }),
    [currentOptions, options, selectedValues],
  );

  useEffect(() => {
    if (prevConfigPropsRef.current !== dynamicConfigProps) {
      hasFetchedOnOpenRef.current = false;
      prevConfigPropsRef.current = dynamicConfigProps;
    }

    if (dynamicConfig.api.trigger === FETCH_TRIGGER.MOUNT) {
      void fetchData();
      return;
    }

    if (open && !hasFetchedOnOpenRef.current) {
      hasFetchedOnOpenRef.current = true;
      void fetchData();
    }
  }, [fetchData, open, dynamicConfig.api.trigger, dynamicConfigProps]);

  return {
    ...props,
    dynamicConfig,
    options: mergedOptions,
    loading,
    totalNumber: total,
    isLoadingMore,
    canLoadMore,
    loadMoreConfig,
    isOpenControlled: isControlledOpen,
    open,
    handleOpenChange,
    handlePopupScroll,
    handleLoadMoreClick,
    searchValue,
    handleInlineSearch,
    handleMenuSearchChange,
  };
}
