"use client";
import { Select as AntdSelect } from "antd";
import { type ReactElement, useCallback, useMemo } from "react";
import type { SearchableApiParams } from "@/general-types";
import { SEARCH_PLACEMENT } from "@/lib/constants";
import { resolveSelectNoOptionsMessage } from "@/lib/utils/messages";
import { useAntdDynamicSelect } from "./hooks/use-dynamic-select";
import { AntdSelectMenu } from "./partials/select-menu";
import type { AntdDynamicSelectProps } from "./types";

export function AntdDynamicSelect<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
>(props: AntdDynamicSelectProps<DataType, ApiResponse, ApiParams>) {
  const {
    dynamicConfig,
    loading,
    size,
    showSearch,
    listHeight,
    isLoadingMore,
    totalNumber,
    canLoadMore,
    loadMoreConfig,
    handleOpenChange,
    handlePopupScroll,
    handleLoadMoreClick,
    searchValue,
    handleInlineSearch,
    handleMenuSearchChange,
    ...selectProps
  } = useAntdDynamicSelect<DataType, ApiResponse, ApiParams>(props);

  const isInlineSearch =
    dynamicConfig.search?.placement === SEARCH_PLACEMENT.INLINE;

  const resolvedShowSearch = useMemo(() => {
    if (!isInlineSearch) {
      return false;
    }

    const searchConfig =
      typeof showSearch === "object" && showSearch !== null ? showSearch : {};

    return {
      ...searchConfig,
      filterOption: searchConfig.filterOption ?? false,
      searchValue,
      onSearch: (value: string) => {
        if (isLoadingMore) {
          return;
        }

        handleInlineSearch(value);
        searchConfig.onSearch?.(value);
      },
    };
  }, [
    handleInlineSearch,
    isInlineSearch,
    isLoadingMore,
    searchValue,
    showSearch,
  ]);

  const resolvedNotFoundContent = useMemo(() => {
    if (selectProps.notFoundContent !== undefined) {
      return selectProps.notFoundContent;
    }

    return resolveSelectNoOptionsMessage(dynamicConfig.messages, searchValue);
  }, [dynamicConfig.messages, searchValue, selectProps.notFoundContent]);

  const optionListKey = useMemo(() => {
    const options = selectProps.options;
    if (!options?.length) {
      return "0";
    }

    const lastOption = options[options.length - 1] as
      | { value?: unknown }
      | undefined;
    return `${options.length}:${String(lastOption?.value ?? "")}`;
  }, [selectProps.options]);

  const popupRender = useCallback(
    (menu: ReactElement) => (
      <AntdSelectMenu
        loading={loading}
        isLoadingMore={isLoadingMore}
        totalNumber={totalNumber}
        canLoadMore={canLoadMore}
        loadMoreConfig={loadMoreConfig}
        dynamicConfig={dynamicConfig}
        handleLoadMoreClick={handleLoadMoreClick}
        searchValue={searchValue}
        handleMenuSearchChange={handleMenuSearchChange}
        optionListKey={optionListKey}
      >
        {menu}
      </AntdSelectMenu>
    ),
    [
      canLoadMore,
      dynamicConfig,
      handleLoadMoreClick,
      handleMenuSearchChange,
      isLoadingMore,
      loadMoreConfig,
      loading,
      optionListKey,
      searchValue,
      totalNumber,
    ],
  );

  return (
    <AntdSelect
      {...selectProps}
      notFoundContent={resolvedNotFoundContent}
      onOpenChange={handleOpenChange}
      size={size}
      loading={loading}
      showSearch={resolvedShowSearch}
      listHeight={listHeight || 200}
      onPopupScroll={handlePopupScroll}
      popupRender={popupRender}
    />
  );
}
