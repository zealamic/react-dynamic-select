import type {
  AutocompleteCloseReason,
  AutocompleteProps,
} from "@mui/material/Autocomplete";
import type { PaperProps } from "@mui/material/Paper";
import type { SelectProps } from "@mui/material/Select";
import type { TextFieldProps } from "@mui/material/TextField";
import type { ChangeEvent, SyntheticEvent, UIEvent } from "react";
import type {
  DynamicSelectConfig,
  ResolvedOption,
  SearchableApiParams,
} from "@/general-types";
import type { ResolvedLoadMoreConfig } from "@/lib/utils/load-more";

export type MuiDynamicSelectValue =
  | string
  | number
  | null
  | Array<string | number>;

export type MuiDynamicSelectConfig<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
> = DynamicSelectConfig<DataType, ApiResponse, ApiParams, TextFieldProps>;

export type MuiSelectMenuPaperSlotProps<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
> = {
  loading?: boolean;
  isLoadingMore?: boolean;
  totalNumber?: number;
  canLoadMore?: boolean;
  loadMoreConfig?: ResolvedLoadMoreConfig<ApiResponse> | null;
  dynamicConfig?: MuiDynamicSelectConfig<DataType, ApiResponse, ApiParams>;
  handleLoadMoreClick?: () => void;
  searchValue?: string;
  handleMenuSearchChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  listHeight?: number;
  onListScroll?: (event: UIEvent<HTMLDivElement>) => void;
};

export type MuiSelectMenuPaperProps<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
> = PaperProps & MuiSelectMenuPaperSlotProps<DataType, ApiResponse, ApiParams>;

export type MuiAutocompletePaperSlotProps<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
> = Omit<
  MuiSelectMenuPaperSlotProps<DataType, ApiResponse, ApiParams>,
  "searchValue" | "handleMenuSearchChange"
>;

export type MuiAutocompletePaperProps<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
> = PaperProps &
  MuiAutocompletePaperSlotProps<DataType, ApiResponse, ApiParams>;

export type MuiDynamicSelectProps<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
> = Omit<
  AutocompleteProps<ResolvedOption, boolean, false, false>,
  "options" | "value" | "defaultValue" | "onChange" | "filterOptions"
> &
  Pick<TextFieldProps, "helperText" | "error" | "required" | "name"> & {
    dynamicConfig?: MuiDynamicSelectConfig<DataType, ApiResponse, ApiParams>;
    value?: MuiDynamicSelectValue;
    defaultValue?: MuiDynamicSelectValue;
    onChange?: (
      event: SyntheticEvent,
      value: MuiDynamicSelectValue,
      reason: string,
      details?: unknown,
    ) => void;
    listHeight?: number;
    placeholder?: string;
    label?: string;
    selectProps?: Omit<
      SelectProps,
      | "value"
      | "defaultValue"
      | "onChange"
      | "open"
      | "onOpen"
      | "onClose"
      | "multiple"
      | "children"
    >;
  };

export type UseMuiDynamicSelectReturn<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
> = MuiDynamicSelectProps<DataType, ApiResponse, ApiParams> & {
  dynamicConfig: MuiDynamicSelectConfig<DataType, ApiResponse, ApiParams>;
  options: ResolvedOption[];
  loading: boolean;
  totalNumber: number;
  isLoadingMore: boolean;
  canLoadMore: boolean;
  loadMoreConfig: ResolvedLoadMoreConfig<ApiResponse> | null;
  isOpen: boolean;
  handleOpen: (event: SyntheticEvent) => void;
  handleClose: (
    event: SyntheticEvent,
    reason?: AutocompleteCloseReason,
  ) => void;
  handlePopupScroll: (event: UIEvent<HTMLDivElement>) => void;
  handleLoadMoreClick: () => void;
  searchValue: string;
  handleInlineSearch: (value: string) => void;
  handleMenuSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
};
