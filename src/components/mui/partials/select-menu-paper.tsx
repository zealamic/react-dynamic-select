import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import { forwardRef } from "react";
import type { SearchableApiParams } from "@/general-types";
import type { MuiSelectMenuPaperProps } from "../types";
import {
  DYNAMIC_SELECT_POPUP_ATTR,
  MuiAutocompletePopupSection,
} from "./autocomplete-popup-section";
import { MuiListMenuFooter } from "./list-menu-footer";
import { MuiMenuSearchInput } from "./menu-search-input";

export const MuiSelectMenuPaper = forwardRef(function MuiSelectMenuPaper<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
>(
  props: MuiSelectMenuPaperProps<DataType, ApiResponse, ApiParams>,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    children,
    loading,
    isLoadingMore,
    totalNumber,
    canLoadMore,
    loadMoreConfig,
    dynamicConfig,
    handleLoadMoreClick,
    searchValue,
    handleMenuSearchChange,
    listHeight = 200,
    onListScroll,
    sx,
    ...paperProps
  } = props;

  const search = dynamicConfig?.search;
  const searchDisabled =
    search?.inputSearchMenuProps?.disabled || loading || isLoadingMore;

  return (
    <Paper
      ref={ref}
      {...paperProps}
      {...{ [DYNAMIC_SELECT_POPUP_ATTR]: "" }}
      sx={[
        {
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          mt: 0.5,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <MuiAutocompletePopupSection
        focusContainedInput
        sx={{ flexShrink: 0, px: 1.5, pt: 1, pb: 1 }}
      >
        <MuiMenuSearchInput
          autoFocus
          variant="outlined"
          {...search?.inputSearchMenuProps}
          value={searchValue}
          onChange={handleMenuSearchChange}
          disabled={searchDisabled}
        />
      </MuiAutocompletePopupSection>
      <Divider sx={{ flexShrink: 0 }} />

      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexShrink: 0,
            justifyContent: "center",
            alignItems: "center",
            p: 2,
            minHeight: "4rem",
          }}
        >
          <CircularProgress size={24} />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              flex: "1 1 auto",
              minHeight: 0,
              maxHeight: listHeight,
              overflowY: "auto",
              overflowX: "hidden",
            }}
            onScroll={onListScroll}
          >
            {children}
          </Box>

          <MuiListMenuFooter
            dynamicConfig={dynamicConfig}
            totalNumber={totalNumber}
            isLoadingMore={isLoadingMore}
            canLoadMore={canLoadMore}
            loadMoreConfig={loadMoreConfig}
            handleLoadMoreClick={handleLoadMoreClick}
            loading={loading}
          />
        </>
      )}
    </Paper>
  );
});
