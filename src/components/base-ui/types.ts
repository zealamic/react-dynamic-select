import type {
  ComboboxArrowProps,
  ComboboxBackdropProps,
  ComboboxChipProps,
  ComboboxChipRemoveProps,
  ComboboxChipsProps,
  ComboboxClearProps,
  ComboboxCollectionProps,
  ComboboxEmptyProps,
  ComboboxGroupLabelProps,
  ComboboxGroupProps,
  ComboboxIconProps,
  ComboboxInputGroupProps,
  ComboboxInputProps,
  ComboboxItemIndicatorProps,
  ComboboxItemProps,
  ComboboxLabelProps,
  ComboboxListProps,
  ComboboxPopupProps,
  ComboboxPortalProps,
  ComboboxPositionerProps,
  ComboboxRootChangeEventDetails,
  ComboboxRootProps,
  ComboboxRowProps,
  ComboboxStatusProps,
  ComboboxTriggerProps,
  ComboboxValueProps,
} from "@base-ui/react/combobox";
import type {
  ButtonHTMLAttributes,
  ChangeEvent,
  ComponentType,
  HTMLAttributes,
  ReactNode,
  SVGProps,
  UIEvent,
} from "react";
import type {
  DynamicSelectConfig,
  ResolvedOption,
  SearchableApiParams,
} from "@/general-types";
import type { ResolvedLoadMoreConfig } from "@/lib/utils/load-more";

/** Injectable slot — consumer passes a component, library renders it with typed props. */
export type BaseUiSlotComponent<Props> = ComponentType<Props>;

export type BaseUiSvgIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export type BaseUiDynamicSelectConfig<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
> = DynamicSelectConfig<DataType, ApiResponse, ApiParams, ComboboxInputProps>;

export type BaseUiDynamicSelectValue<Multiple extends boolean = false> =
  Multiple extends true ? ResolvedOption[] : ResolvedOption | null;

/** Props managed internally by dynamic-select; not exposed on the public Root surface. */
type BaseUiDynamicSelectOwnedRootProps =
  | "items"
  | "filteredItems"
  | "filter"
  | "onInputValueChange"
  | "children";

export type BaseUiDynamicSelectRootProps<Multiple extends boolean = false> =
  Omit<
    ComboboxRootProps<ResolvedOption, Multiple>,
    BaseUiDynamicSelectOwnedRootProps
  >;

/** Context passed when overriding a single option row. */
export type BaseUiItemSlotProps = ComboboxItemProps & {
  option: ResolvedOption;
};

/** Context passed when overriding option label rendering. */
export type BaseUiItemTextSlotProps = {
  option: ResolvedOption;
};

/** Context passed when overriding the menu search input (`SEARCH_PLACEMENT.MENU`). */
export type BaseUiMenuSearchInputSlotProps = ComboboxInputProps & {
  searchValue: string;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

/** Context passed when overriding async / empty-state messaging inside `Status`. */
export type BaseUiStatusSlotProps = ComboboxStatusProps & {
  loading?: boolean;
  error?: string | null;
  searchValue?: string;
  message?: ReactNode;
};

/** Context passed when overriding the no-results block inside `Empty`. */
export type BaseUiEmptySlotProps = ComboboxEmptyProps & {
  searchValue?: string;
  message?: ReactNode;
};

/** Context passed when overriding the popup footer (total, load more). */
export type BaseUiListFooterSlotProps<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
> = {
  loading?: boolean;
  isLoadingMore?: boolean;
  totalNumber?: number;
  canLoadMore?: boolean;
  loadMoreConfig?: ResolvedLoadMoreConfig<ApiResponse> | null;
  onLoadMoreClick?: () => void;
  dynamicConfig?: BaseUiDynamicSelectConfig<DataType, ApiResponse, ApiParams>;
  Button?: BaseUiSlotComponent<BaseUiButtonSlotProps>;
};

/** Context passed when overriding the initial loading overlay above the list. */
export type BaseUiLoadingOverlaySlotProps = {
  loading?: boolean;
};

/** Props for the separator between popup sections. Library-agnostic — defaults to `<div>`. */
export type BaseUiSeparatorSlotProps = HTMLAttributes<HTMLDivElement>;

/** Props for injectable action buttons (e.g. load more). Library-agnostic — native `<button>`, MUI, Ant Design, etc. */
export type BaseUiButtonSlotProps = ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Overridable Combobox parts.
 *
 * - Primitive slots: same props as `@base-ui/react/combobox` — drop-in replacements.
 * - Enriched slots: Base UI props plus library context (`option`, `searchValue`, …).
 */
export type BaseUiDynamicSelectComponents<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
> = {
  Root?: BaseUiSlotComponent<ComboboxRootProps<ResolvedOption, boolean>>;
  Label?: BaseUiSlotComponent<ComboboxLabelProps>;
  InputGroup?: BaseUiSlotComponent<ComboboxInputGroupProps>;
  Input?: BaseUiSlotComponent<ComboboxInputProps>;
  Chips?: BaseUiSlotComponent<ComboboxChipsProps>;
  Value?: BaseUiSlotComponent<ComboboxValueProps>;
  Chip?: BaseUiSlotComponent<ComboboxChipProps>;
  ChipRemove?: BaseUiSlotComponent<ComboboxChipRemoveProps>;
  Clear?: BaseUiSlotComponent<ComboboxClearProps>;
  Trigger?: BaseUiSlotComponent<ComboboxTriggerProps>;
  Icon?: BaseUiSlotComponent<ComboboxIconProps>;
  Portal?: BaseUiSlotComponent<ComboboxPortalProps>;
  Backdrop?: BaseUiSlotComponent<ComboboxBackdropProps>;
  Positioner?: BaseUiSlotComponent<ComboboxPositionerProps>;
  Popup?: BaseUiSlotComponent<ComboboxPopupProps>;
  Arrow?: BaseUiSlotComponent<ComboboxArrowProps>;
  List?: BaseUiSlotComponent<ComboboxListProps>;
  Group?: BaseUiSlotComponent<ComboboxGroupProps>;
  GroupLabel?: BaseUiSlotComponent<ComboboxGroupLabelProps>;
  Collection?: BaseUiSlotComponent<ComboboxCollectionProps>;
  Row?: BaseUiSlotComponent<ComboboxRowProps>;
  Status?: BaseUiSlotComponent<BaseUiStatusSlotProps>;
  Empty?: BaseUiSlotComponent<BaseUiEmptySlotProps>;
  Item?: BaseUiSlotComponent<BaseUiItemSlotProps>;
  ItemIndicator?: BaseUiSlotComponent<ComboboxItemIndicatorProps>;
  ItemText?: BaseUiSlotComponent<BaseUiItemTextSlotProps>;
  MenuSearchInput?: BaseUiSlotComponent<BaseUiMenuSearchInputSlotProps>;
  ListFooter?: BaseUiSlotComponent<
    BaseUiListFooterSlotProps<DataType, ApiResponse, ApiParams>
  >;
  LoadingOverlay?: BaseUiSlotComponent<BaseUiLoadingOverlaySlotProps>;
  Separator?: BaseUiSlotComponent<BaseUiSeparatorSlotProps>;
  Button?: BaseUiSlotComponent<BaseUiButtonSlotProps>;
};

/** Overridable icons used by the default Combobox chrome. */
export type BaseUiDynamicSelectIcons = {
  Check?: BaseUiSvgIconComponent;
  Clear?: BaseUiSvgIconComponent;
  CaretDown?: BaseUiSvgIconComponent;
  CaretUpDown?: BaseUiSvgIconComponent;
  ChipRemove?: BaseUiSvgIconComponent;
};

export type BaseUiDynamicSelectProps<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
  Multiple extends boolean = false,
> = BaseUiDynamicSelectRootProps<Multiple> & {
  dynamicConfig?: BaseUiDynamicSelectConfig<DataType, ApiResponse, ApiParams>;
  components?: BaseUiDynamicSelectComponents<DataType, ApiResponse, ApiParams>;
  icons?: BaseUiDynamicSelectIcons;
  placeholder?: string;
  label?: string;
  listHeight?: number;
  onValueChange?: (
    value: BaseUiDynamicSelectValue<Multiple>,
    eventDetails: ComboboxRootChangeEventDetails,
  ) => void;
};

export type UseBaseUiDynamicSelectReturn<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
  Multiple extends boolean = false,
> = BaseUiDynamicSelectProps<DataType, ApiResponse, ApiParams, Multiple> & {
  dynamicConfig: BaseUiDynamicSelectConfig<DataType, ApiResponse, ApiParams>;
  options: ResolvedOption[];
  loading: boolean;
  totalNumber: number;
  isLoadingMore: boolean;
  canLoadMore: boolean;
  loadMoreConfig: ResolvedLoadMoreConfig<ApiResponse> | null;
  isOpenControlled: boolean;
  open: boolean;
  handleOpenChange: (
    open: boolean,
    eventDetails?: ComboboxRootChangeEventDetails,
  ) => void;
  handlePopupScroll: (event: UIEvent<HTMLDivElement>) => void;
  handleLoadMoreClick: () => void;
  searchValue: string;
  handleInlineSearch: (value: string) => void;
  handleMenuSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
};
