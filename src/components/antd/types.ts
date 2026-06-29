import type { SelectProps as AntdSelectProps, InputProps } from "antd";
import type { ChangeEvent, ReactNode, UIEvent } from "react";
import type {
  DynamicSelectConfig,
  ResolvedOption,
  SearchableApiParams,
} from "@/general-types";
import type { ResolvedLoadMoreConfig } from "@/lib/utils/load-more";

export type AntdDynamicSelectConfig<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
> = DynamicSelectConfig<DataType, ApiResponse, ApiParams, InputProps>;

export type AntdDynamicSelectProps<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
> = AntdSelectProps & {
  dynamicConfig?: AntdDynamicSelectConfig<DataType, ApiResponse, ApiParams>;
};

export type UseAntdDynamicSelectReturn<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
> = AntdDynamicSelectProps<DataType, ApiResponse, ApiParams> & {
  dynamicConfig: AntdDynamicSelectConfig<DataType, ApiResponse, ApiParams>;
  options: ResolvedOption[];
  loading: boolean;
  totalNumber: number;
  isLoadingMore: boolean;
  canLoadMore: boolean;
  loadMoreConfig: ResolvedLoadMoreConfig<ApiResponse> | null;
  handleOpenChange: (open: boolean) => void;
  handlePopupScroll: (event: UIEvent<HTMLDivElement>) => void;
  handleLoadMoreClick: () => void;
  searchValue: string;
  handleInlineSearch: (value: string) => void;
  handleMenuSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export type AntdSelectMenuProps<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
> = {
  children?: ReactNode;
  loading?: boolean;
  dynamicConfig?: AntdDynamicSelectConfig<DataType, ApiResponse, ApiParams>;
  isLoadingMore?: boolean;
  totalNumber?: number;
  canLoadMore?: boolean;
  loadMoreConfig?: ResolvedLoadMoreConfig<ApiResponse> | null;
  handleLoadMoreClick?: () => void;
  searchValue?: string;
  handleMenuSearchChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};
