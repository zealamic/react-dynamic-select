import type { AutocompleteCloseReason } from "@mui/material/Autocomplete";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { defaultDynamicSelectConfig } from "@/default";
import type { SearchableApiParams } from "@/general-types";
import { useFetchData } from "@/hooks/use-fetch-data";
import { useLoadMore } from "@/hooks/use-load-more";
import { useSearch } from "@/hooks/use-search";
import { FETCH_TRIGGER, SEARCH_PLACEMENT } from "@/lib/constants";
import {
  mergeDynamicConfig,
  mergeOptionsWithCurrent,
  normalizeSelectValues,
  resolveCurrentOptions,
} from "@/lib/utils";
import { shouldKeepMenuOpenOnSearchBlur } from "../partials/autocomplete-popup-section";
import type {
  MuiDynamicSelectConfig,
  MuiDynamicSelectProps,
  UseMuiDynamicSelectReturn,
} from "../types";

export function useMuiDynamicSelect<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
>(
  props: MuiDynamicSelectProps<DataType, ApiResponse, ApiParams>,
): UseMuiDynamicSelectReturn<DataType, ApiResponse, ApiParams> {
  const {
    dynamicConfig: dynamicConfigProps,
    onOpen,
    onClose,
    multiple,
  } = props;
  const dynamicConfig = useMemo(
    () =>
      mergeDynamicConfig<
        MuiDynamicSelectConfig<DataType, ApiResponse, ApiParams>
      >({
        defaultConfig: defaultDynamicSelectConfig as MuiDynamicSelectConfig<
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
  const isOpen = isControlledOpen ? props.open : localOpen;
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

  const handleOpen = useCallback(
    (event: React.SyntheticEvent) => {
      onOpen?.(event);

      if (!isControlledOpen) {
        setLocalOpen(true);
      }
    },
    [isControlledOpen, onOpen],
  );

  const isMenuSearch =
    dynamicConfig.search?.placement !== SEARCH_PLACEMENT.INLINE;

  const handleClose = useCallback(
    (event: React.SyntheticEvent, reason?: AutocompleteCloseReason) => {
      if (multiple && reason === "selectOption") {
        return;
      }

      if (isMenuSearch && reason === "blur") {
        const relatedTarget = (event as React.FocusEvent).relatedTarget;

        if (shouldKeepMenuOpenOnSearchBlur(relatedTarget)) {
          return;
        }
      }

      if (reason) {
        onClose?.(event, reason);
      } else {
        (onClose as ((event: React.SyntheticEvent) => void) | undefined)?.(
          event,
        );
      }

      if (!isControlledOpen) {
        setLocalOpen(false);
      }

      if (searchValue) {
        resetSearch();
        void fetchData({ search: "" } as Partial<ApiParams>);
      } else {
        resetSearch();
      }
    },
    [
      fetchData,
      isControlledOpen,
      isMenuSearch,
      multiple,
      onClose,
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
        mode: props.multiple ? "multiple" : undefined,
      }),
    [props.defaultValue, props.multiple, props.value],
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

    if (isOpen && !hasFetchedOnOpenRef.current) {
      hasFetchedOnOpenRef.current = true;
      void fetchData();
    }
  }, [fetchData, isOpen, dynamicConfig.api.trigger, dynamicConfigProps]);

  return {
    ...props,
    dynamicConfig,
    options: mergedOptions,
    loading,
    totalNumber: total,
    isLoadingMore,
    canLoadMore,
    loadMoreConfig,
    isOpen: isOpen ?? false,
    handleOpen,
    handleClose,
    handlePopupScroll,
    handleLoadMoreClick,
    searchValue,
    handleInlineSearch,
    handleMenuSearchChange,
  };
}
