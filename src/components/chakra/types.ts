import type {
  ComboboxInputProps,
  ComboboxOpenChangeDetails,
  ComboboxRootProps,
  ComboboxValueChangeDetails,
} from "@chakra-ui/react";
import type { ChangeEvent, UIEvent } from "react";
import type {
  DynamicSelectConfig,
  ResolvedOption,
  SearchableApiParams,
} from "@/general-types";
import type { ResolvedLoadMoreConfig } from "@/lib/utils/load-more";

export type ChakraDynamicSelectValue =
  | string
  | number
  | null
  | Array<string | number>;

export type ChakraDynamicSelectConfig<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
> = DynamicSelectConfig<DataType, ApiResponse, ApiParams, ComboboxInputProps>;

type ChakraDynamicSelectOwnedRootProps =
  | "collection"
  | "onInputValueChange"
  | "onValueChange"
  | "value"
  | "defaultValue"
  | "onOpenChange";

export type ChakraDynamicSelectRootProps = Omit<
  ComboboxRootProps<ResolvedOption>,
  ChakraDynamicSelectOwnedRootProps
>;

export type ChakraDynamicSelectProps<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
> = ChakraDynamicSelectRootProps & {
  dynamicConfig?: ChakraDynamicSelectConfig<DataType, ApiResponse, ApiParams>;
  value?: ChakraDynamicSelectValue;
  defaultValue?: ChakraDynamicSelectValue;
  onChange?: (value: ChakraDynamicSelectValue) => void;
  placeholder?: string;
  label?: string;
  listHeight?: number;
  onOpenChange?: (open: boolean, details: ComboboxOpenChangeDetails) => void;
  onValueChange?: (details: ComboboxValueChangeDetails<ResolvedOption>) => void;
};

export type UseChakraDynamicSelectReturn<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
> = ChakraDynamicSelectProps<DataType, ApiResponse, ApiParams> & {
  dynamicConfig: ChakraDynamicSelectConfig<DataType, ApiResponse, ApiParams>;
  options: ResolvedOption[];
  loading: boolean;
  totalNumber: number;
  isLoadingMore: boolean;
  canLoadMore: boolean;
  loadMoreConfig: ResolvedLoadMoreConfig<ApiResponse> | null;
  isOpenControlled: boolean;
  open: boolean;
  handleOpenChange: (
    nextOpen: boolean,
    details?: ComboboxOpenChangeDetails,
  ) => void;
  handlePopupScroll: (event: UIEvent<HTMLDivElement>) => void;
  handleLoadMoreClick: () => void;
  searchValue: string;
  handleInlineSearch: (value: string) => void;
  handleMenuSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
};
