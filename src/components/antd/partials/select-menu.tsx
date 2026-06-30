import { Button, Divider, Flex, Spin, Typography } from "antd";
import type { SearchableApiParams } from "@/general-types";
import { LOAD_MORE_TYPE, SEARCH_PLACEMENT } from "@/lib/constants";
import type { AntdSelectMenuProps } from "../types";
import { AntdMenuSearchInput } from "./menu-search-input";

export function AntdSelectMenu<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
>(props: AntdSelectMenuProps<DataType, ApiResponse, ApiParams>) {
  const { total: totalConfig } = props.dynamicConfig ?? {};
  const {
    isLoadingMore,
    totalNumber,
    canLoadMore,
    loadMoreConfig,
    handleLoadMoreClick,
  } = props;

  const search = props.dynamicConfig?.search;
  const showFooter =
    loadMoreConfig != null || totalConfig?.path || totalConfig?.label;

  const searchDisabled =
    search?.inputSearchMenuProps?.disabled || props.loading || isLoadingMore;
  const loadMoreDisabled = props.loading || isLoadingMore || !canLoadMore;
  const showClickLoadMore =
    !isLoadingMore && loadMoreConfig?.type === LOAD_MORE_TYPE.CLICK;

  return (
    <Flex orientation="vertical">
      {search?.placement === SEARCH_PLACEMENT.MENU && (
        <>
          <AntdMenuSearchInput
            autoFocus
            allowClear
            {...search?.inputSearchMenuProps}
            value={props.searchValue}
            onChange={props.handleMenuSearchChange}
            disabled={searchDisabled}
          />
          <Divider size="small" />
        </>
      )}

      <div>
        {props.loading ? (
          <Flex
            justify="center"
            align="center"
            style={{ padding: "1rem", minHeight: "4rem" }}
          >
            <Spin />
          </Flex>
        ) : (
          <>
            {props.children}
            {showFooter && (
              <>
                <Divider size="small" />
                <Flex
                  align="center"
                  justify="space-between"
                  style={{ padding: "0 0.5rem 0.25rem", minHeight: "1.6rem" }}
                  gap="small"
                >
                  {(totalConfig?.path || totalConfig?.label) && (
                    <Typography.Text strong>
                      {totalConfig?.label || "Total"}: {totalNumber || "-"}
                    </Typography.Text>
                  )}
                  {isLoadingMore && (
                    <Flex align="center" gap="small">
                      <Spin spinning size="small" />
                      <Typography.Text>
                        {loadMoreConfig?.loadingLabel || "Loading..."}
                      </Typography.Text>
                    </Flex>
                  )}
                  {showClickLoadMore && (
                    <Button
                      type="default"
                      color="primary"
                      size="small"
                      onClick={handleLoadMoreClick}
                      onMouseDown={(event) => {
                        event.stopPropagation();
                      }}
                      disabled={loadMoreDisabled}
                    >
                      {loadMoreConfig?.label || "Load More"}
                    </Button>
                  )}
                </Flex>
              </>
            )}
          </>
        )}
      </div>
    </Flex>
  );
}
