import type { ChangeEvent, UIEvent } from "react";
import type { ResolvedLoadMoreConfig } from "@/lib/utils/load-more";
import type { MuiDynamicSelectConfig } from "./types";

declare module "@mui/material/Autocomplete" {
  interface AutocompletePaperSlotPropsOverrides {
    loading?: boolean;
    isLoadingMore?: boolean;
    totalNumber?: number;
    canLoadMore?: boolean;
    loadMoreConfig?: ResolvedLoadMoreConfig<any> | null;
    dynamicConfig?: MuiDynamicSelectConfig<any, any, any>;
    handleLoadMoreClick?: () => void;
    searchValue?: string;
    handleMenuSearchChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    listHeight?: number;
    onListScroll?: (event: UIEvent<HTMLDivElement>) => void;
  }
}

declare module "@mui/material/Menu" {
  interface MenuPaperSlotPropsOverrides {
    loading?: boolean;
    isLoadingMore?: boolean;
    totalNumber?: number;
    canLoadMore?: boolean;
    loadMoreConfig?: ResolvedLoadMoreConfig<any> | null;
    dynamicConfig?: MuiDynamicSelectConfig<any, any, any>;
    handleLoadMoreClick?: () => void;
    searchValue?: string;
    handleMenuSearchChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    listHeight?: number;
    onListScroll?: (event: UIEvent<HTMLDivElement>) => void;
  }
}

declare module "@mui/material/Paper" {
  interface PaperPropsSlotOverrides {
    loading?: boolean;
    isLoadingMore?: boolean;
    totalNumber?: number;
    canLoadMore?: boolean;
    loadMoreConfig?: ResolvedLoadMoreConfig<any> | null;
    dynamicConfig?: MuiDynamicSelectConfig<any, any, any>;
    handleLoadMoreClick?: () => void;
    searchValue?: string;
    handleMenuSearchChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    listHeight?: number;
    onListScroll?: (event: UIEvent<HTMLDivElement>) => void;
  }
}
