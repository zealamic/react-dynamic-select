"use client";
import type { SearchableApiParams } from "@/general-types";
import { DefaultPlusIcon } from "@/icons/default-plus-icon";
import { ADD_PLACEMENT, LOAD_MORE_TYPE } from "@/lib/constants";
import type { BaseUiListFooterSlotProps } from "../../types";
import styles from "./default.module.css";
import { DefaultButton } from "./default-button";
import { joinClassNames } from "./merge-class-name";

export function DefaultListFooter<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
>({
  dynamicConfig,
  totalNumber,
  isLoadingMore,
  canLoadMore,
  loadMoreConfig,
  onLoadMoreClick,
  loading,
  Button = DefaultButton,
}: BaseUiListFooterSlotProps<DataType, ApiResponse, ApiParams>) {
  const totalConfig = dynamicConfig?.total;
  const addConfig = dynamicConfig?.add;
  const showFooter =
    loadMoreConfig != null ||
    totalConfig?.path ||
    totalConfig?.label ||
    addConfig?.placement != null;

  if (!showFooter) {
    return null;
  }

  const loadMoreDisabled = loading || isLoadingMore || !canLoadMore;
  const showClickLoadMore =
    !isLoadingMore && loadMoreConfig?.type === LOAD_MORE_TYPE.CLICK;

  return (
    <div className={styles["rds-base-ui__list-footer"]}>
      <div className={styles["rds-base-ui__list-footer-start"]}>
        {addConfig?.placement === ADD_PLACEMENT.START && (
          <Button
            type="button"
            className={joinClassNames(
              styles["rds-base-ui__button"],
              styles["rds-base-ui__button--add"],
            )}
            onClick={addConfig?.onClick}
            disabled={addConfig?.disabled}
          >
            {addConfig?.icon || <DefaultPlusIcon />}
            {addConfig?.label}
          </Button>
        )}
        {(totalConfig?.path || totalConfig?.label) && (
          <span className={styles["rds-base-ui__list-footer-total"]}>
            {totalConfig?.label || "Total"}:{" "}
            {loading && totalNumber === 0 ? "..." : (totalNumber ?? "-")}
          </span>
        )}
      </div>
      <div className={styles["rds-base-ui__list-footer-actions"]}>
        {isLoadingMore && (
          <span className={styles["rds-base-ui__list-footer-loading"]}>
            {loadMoreConfig?.loadingLabel || "Loading..."}
          </span>
        )}
        {showClickLoadMore && (
          <Button
            type="button"
            onClick={onLoadMoreClick}
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
            disabled={loadMoreDisabled}
          >
            {loadMoreConfig?.label || "Load More"}
          </Button>
        )}
        {addConfig?.placement === ADD_PLACEMENT.END && (
          <Button
            type="button"
            className={joinClassNames(
              styles["rds-base-ui__button"],
              styles["rds-base-ui__button--add"],
            )}
            onClick={addConfig?.onClick}
            disabled={addConfig?.disabled}
          >
            {addConfig?.icon || <DefaultPlusIcon />}
            {addConfig?.label}
          </Button>
        )}
      </div>
    </div>
  );
}
