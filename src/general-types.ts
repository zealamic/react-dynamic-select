import type {
  FETCH_TRIGGER,
  LOAD_MORE_TYPE,
  SEARCH_PLACEMENT,
} from "@/lib/constants";

export type SearchPlacement =
  (typeof SEARCH_PLACEMENT)[keyof typeof SEARCH_PLACEMENT];
export type LoadMoreType = (typeof LOAD_MORE_TYPE)[keyof typeof LOAD_MORE_TYPE];
export type FetchTrigger = (typeof FETCH_TRIGGER)[keyof typeof FETCH_TRIGGER];

export type OptionTemplate = {
  label?: string | null;
  value?: string | null;
};

export type PaginationParams =
  | {
      page?: number;
      limit?: number;
    }
  | {
      page?: number;
      pageSize?: number;
    };

export type ResolvedOption = {
  label?: string | null;
  value: string | number | null | undefined;
};

export type SearchConfig<InputSearchProps> = {
  placement?: SearchPlacement;
  inputSearchMenuProps?: InputSearchProps;
  debounce?: number;
};

export type DynamicSelectConfig<
  DataType = any,
  ApiResponse = any,
  ApiParams = Record<string, any>,
  InputSearchProps = Record<string, any>,
> = {
  api: {
    fetch?: (params: ApiParams) => Promise<ApiResponse>;
    params?: ApiParams;
    onSuccess?: (data: ApiResponse) => void;
    onError?: (error: Error) => void;
    trigger?: FetchTrigger;
  };
  currentData?: DataType | DataType[];
  total?: {
    path?: string | null;
    label?: string | null;
  };
  list?: {
    path?: string | null;
  };
  option?: {
    template?: OptionTemplate;
  };
  search?: SearchConfig<InputSearchProps>;
  loadMore?:
    | boolean
    | {
        type?: LoadMoreType;
        label?: string | null;
        loadingLabel?: string | null;
        threshold?: number;
        distance?: number;
        debounce?: number;
        afterFetch?: (data: ApiResponse) => Promise<void>;
      };
};

export type SearchableApiParams = Record<string, any> & { search?: string };

export type DynamicSelectHookProps<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
> = {
  dynamicConfig?: DynamicSelectConfig<DataType, ApiResponse, ApiParams>;
};
