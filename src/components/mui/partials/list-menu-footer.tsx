import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import type { SearchableApiParams } from "@/general-types";
import { DefaultPlusIcon } from "@/icons/default-plus-icon";
import { ADD_PLACEMENT, LOAD_MORE_TYPE } from "@/lib/constants";
import type { ResolvedLoadMoreConfig } from "@/lib/utils/load-more";
import type { MuiDynamicSelectConfig } from "../types";
import { MuiAutocompletePopupSection } from "./autocomplete-popup-section";

type MuiListMenuFooterProps<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
> = {
  dynamicConfig?: MuiDynamicSelectConfig<DataType, ApiResponse, ApiParams>;
  totalNumber?: number;
  isLoadingMore?: boolean;
  canLoadMore?: boolean;
  loadMoreConfig?: ResolvedLoadMoreConfig<ApiResponse> | null;
  handleLoadMoreClick?: () => void;
  loading?: boolean;
};

export function MuiListMenuFooter<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
>({
  dynamicConfig,
  totalNumber,
  isLoadingMore,
  canLoadMore,
  loadMoreConfig,
  handleLoadMoreClick,
  loading,
}: MuiListMenuFooterProps<DataType, ApiResponse, ApiParams>) {
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
    <>
      <Divider sx={{ flexShrink: 0 }} />
      <MuiAutocompletePopupSection
        sx={{
          display: "flex",
          flexShrink: 0,
          alignItems: "center",
          justifyContent: "space-between",
          p: 1,
          gap: 1,
          bgcolor: "background.paper",
          minHeight: "1.5rem",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {addConfig?.placement === ADD_PLACEMENT.START && (
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={addConfig?.onClick}
              sx={{ minWidth: "auto" }}
              disabled={addConfig?.disabled}
            >
              {addConfig?.icon || <DefaultPlusIcon />}
              {addConfig?.label}
            </Button>
          )}
          {(totalConfig?.path || totalConfig?.label) && (
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {totalConfig?.label || "Total"}: {totalNumber ?? "-"}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isLoadingMore && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={12} />
              <Typography variant="body2">
                {loadMoreConfig?.loadingLabel || "Loading..."}
              </Typography>
            </Box>
          )}
          {showClickLoadMore && (
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={handleLoadMoreClick}
              disabled={loadMoreDisabled}
              sx={{ fontSize: "0.6rem", padding: "0.1rem 0.5rem" }}
            >
              {loadMoreConfig?.label || "Load More"}
            </Button>
          )}
          {addConfig?.placement === ADD_PLACEMENT.END && (
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={addConfig?.onClick}
              sx={{ minWidth: "auto" }}
              disabled={addConfig?.disabled}
            >
              {addConfig?.icon || <DefaultPlusIcon />}
              {addConfig?.label}
            </Button>
          )}
        </Box>
      </MuiAutocompletePopupSection>
    </>
  );
}
