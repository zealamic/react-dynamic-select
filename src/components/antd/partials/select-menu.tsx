import { Button, Divider, Flex, Spin, Typography } from "antd";
import {
  Fragment,
  type MouseEvent,
  type ReactNode,
  useLayoutEffect,
  useRef,
} from "react";
import { LoadMoreStatusChip } from "@/components/_shared/load-more-status-chip";
import type { SearchableApiParams } from "@/general-types";
import { DefaultPlusIcon } from "@/icons/default-plus-icon";
import {
  ADD_PLACEMENT,
  LOAD_MORE_TYPE,
  SEARCH_PLACEMENT,
} from "@/lib/constants";
import { isSelectSearchDisabled } from "@/lib/utils/search";
import {
  shouldShowListFooter,
  shouldShowLoadMoreStatusChip,
  shouldShowTotalLabel,
} from "@/lib/utils/total";
import type { AntdSelectMenuProps } from "../types";
import { AntdMenuSearchInput } from "./menu-search-input";

function findListScrollHolder(root: HTMLElement | null) {
  if (!root) {
    return null;
  }

  return (
    (root.querySelector(".rc-virtual-list-holder") as HTMLElement | null) ??
    (root.firstElementChild as HTMLElement | null)
  );
}

function keepSelectFocused(event: MouseEvent) {
  event.preventDefault();
}

function AntdOptionListGate({
  optionListKey,
  children,
}: {
  optionListKey?: string;
  children?: ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const scrollTopRef = useRef(0);

  useLayoutEffect(() => {
    const holder = findListScrollHolder(wrapRef.current);
    if (!holder || !optionListKey) {
      return;
    }

    holder.scrollTop = scrollTopRef.current;
  }, [optionListKey]);

  return (
    <div
      ref={wrapRef}
      onScrollCapture={(event) => {
        const holder = findListScrollHolder(wrapRef.current);
        if (
          holder &&
          (event.target === holder || holder.contains(event.target as Node))
        ) {
          scrollTopRef.current = holder.scrollTop;
        }
      }}
    >
      <Fragment key={optionListKey ?? "0"}>{children}</Fragment>
    </div>
  );
}

export function AntdSelectMenu<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
>(props: AntdSelectMenuProps<DataType, ApiResponse, ApiParams>) {
  const { total: totalConfig, add: addConfig } = props.dynamicConfig ?? {};
  const {
    isLoadingMore,
    totalNumber,
    canLoadMore,
    loadMoreConfig,
    handleLoadMoreClick,
  } = props;

  const search = props.dynamicConfig?.search;
  const showTotal = shouldShowTotalLabel(totalConfig);
  const showFooter = shouldShowListFooter({
    isMenuFooterVisible: props.dynamicConfig?.isMenuFooterVisible,
    loadMoreConfig,
    total: totalConfig,
    add: addConfig,
  });
  const showLoadMoreStatusChip = shouldShowLoadMoreStatusChip({
    isMenuFooterVisible: props.dynamicConfig?.isMenuFooterVisible,
    isLoadingMore,
  });

  const searchDisabled = isSelectSearchDisabled({
    disabled: search?.inputSearchMenuProps?.disabled,
    loading: props.loading,
    isLoadingMore,
  });
  const loadMoreDisabled = props.loading || isLoadingMore || !canLoadMore;
  const showClickLoadMore = loadMoreConfig?.type === LOAD_MORE_TYPE.CLICK;
  const showScrollLoadMoreStatus =
    Boolean(isLoadingMore) && loadMoreConfig?.type !== LOAD_MORE_TYPE.CLICK;

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

      <div style={{ position: "relative" }}>
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
            <AntdOptionListGate optionListKey={props.optionListKey}>
              {props.children}
            </AntdOptionListGate>
            <LoadMoreStatusChip
              visible={showLoadMoreStatusChip}
              label={loadMoreConfig?.loadingLabel || "Loading..."}
            />
            {showFooter && (
              <>
                <Divider size="small" />
                <Flex
                  align="center"
                  justify="space-between"
                  style={{ padding: "0 0.5rem 0.25rem", minHeight: "1.6rem" }}
                  gap="small"
                  onMouseDown={keepSelectFocused}
                >
                  <Flex align="center" gap="small">
                    {addConfig?.placement === ADD_PLACEMENT.START && (
                      <Button
                        type="primary"
                        size="small"
                        onClick={addConfig?.onClick}
                        icon={addConfig?.icon || <DefaultPlusIcon />}
                        disabled={addConfig?.disabled}
                      >
                        {addConfig?.label}
                      </Button>
                    )}
                    {showTotal && (
                      <Typography.Text strong>
                        {totalConfig?.label || "Total"}: {totalNumber || "-"}
                      </Typography.Text>
                    )}
                  </Flex>
                  <Flex align="center" gap="small">
                    {showScrollLoadMoreStatus && (
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
                        onMouseDown={keepSelectFocused}
                        loading={isLoadingMore}
                        disabled={loadMoreDisabled}
                      >
                        {isLoadingMore
                          ? loadMoreConfig?.loadingLabel || "Loading..."
                          : loadMoreConfig?.label || "Load More"}
                      </Button>
                    )}
                    {addConfig?.placement === ADD_PLACEMENT.END && (
                      <Button
                        type="primary"
                        size="small"
                        onClick={addConfig?.onClick}
                        icon={addConfig?.icon || <DefaultPlusIcon />}
                        disabled={addConfig?.disabled}
                      >
                        {addConfig?.label}
                      </Button>
                    )}
                  </Flex>
                </Flex>
              </>
            )}
          </>
        )}
      </div>
    </Flex>
  );
}
