import type { SearchableApiParams } from "@/general-types";
import { LOAD_MORE_TYPE } from "@/lib/constants";
import type { BaseUiListFooterSlotProps } from "../../types";
import { DefaultButton } from "./default-button";

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
  const showFooter =
    loadMoreConfig != null || totalConfig?.path || totalConfig?.label;

  if (!showFooter) {
    return null;
  }

  const loadMoreDisabled = loading || isLoadingMore || !canLoadMore;
  const showClickLoadMore =
    !isLoadingMore && loadMoreConfig?.type === LOAD_MORE_TYPE.CLICK;

  return (
    <div>
      {(totalConfig?.path || totalConfig?.label) && (
        <span>
          {totalConfig?.label || "Total"}: {totalNumber ?? "-"}
        </span>
      )}
      {isLoadingMore && (
        <span>{loadMoreConfig?.loadingLabel || "Loading..."}</span>
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
    </div>
  );
}
