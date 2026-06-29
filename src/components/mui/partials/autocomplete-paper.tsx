import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import { forwardRef } from "react";
import type { SearchableApiParams } from "@/general-types";
import type { MuiAutocompletePaperProps } from "../types";
import { MuiListMenuFooter } from "./list-menu-footer";

export const MuiAutocompletePaper = forwardRef(function MuiAutocompletePaper<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
>(
  props: MuiAutocompletePaperProps<DataType, ApiResponse, ApiParams>,
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
    listHeight = 200,
    onListScroll,
    sx,
    ...paperProps
  } = props;

  return (
    <Paper
      ref={ref}
      {...paperProps}
      sx={[
        {
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
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
