"use client";
import { Select as AntdSelect } from "antd";
import { useMemo } from "react";
import type { SearchableApiParams } from "@/general-types";
import { SEARCH_PLACEMENT } from "@/lib/constants";
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
        handleInlineSearch(value);
        searchConfig.onSearch?.(value);
      },
    };
  }, [handleInlineSearch, isInlineSearch, searchValue, showSearch]);

  return (
    <AntdSelect
      {...selectProps}
      onOpenChange={handleOpenChange}
      size={size}
      loading={loading}
      showSearch={resolvedShowSearch}
      listHeight={listHeight || 200}
      onPopupScroll={handlePopupScroll}
      popupRender={(menu) => (
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
        >
          {menu}
        </AntdSelectMenu>
      )}
    />
  );
}
