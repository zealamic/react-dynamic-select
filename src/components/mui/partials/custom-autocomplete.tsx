"use client";

import Autocomplete, {
  type AutocompleteProps,
} from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  type ReactNode,
  useCallback,
  useMemo,
} from "react";
import type { ResolvedOption } from "@/general-types";
import { SEARCH_PLACEMENT } from "@/lib/constants";
import {
  getOptionLabel,
  isOptionEqualToValue,
  resolveAutocompleteValue,
  toChangeValue,
} from "../handlers";
import type {
  MuiDynamicSelectProps,
  UseMuiDynamicSelectReturn,
} from "../types";
import { MuiAutocompletePaper } from "./autocomplete-paper";
import { MuiSelectMenuPaper } from "./select-menu-paper";

function getChipChildren(content: ReactNode): ReactNode[] {
  if (!isValidElement(content)) {
    return content == null ? [] : [content];
  }

  const props = content.props as { children?: ReactNode };
  if (props.children != null) {
    return Children.toArray(props.children);
  }

  return [content];
}

type MuiCustomAutocompleteProps<
  DataType = any,
  ApiResponse = any,
  ApiParams extends Record<string, unknown> = Record<string, unknown>,
> = UseMuiDynamicSelectReturn<DataType, ApiResponse, ApiParams>;

export function MuiCustomAutocomplete<
  DataType = any,
  ApiResponse = any,
  ApiParams extends Record<string, unknown> = Record<string, unknown>,
>({
  options,
  loading,
  isLoadingMore,
  totalNumber,
  canLoadMore,
  loadMoreConfig,
  dynamicConfig,
  handleLoadMoreClick,
  isOpen,
  handleOpen,
  handleClose,
  handlePopupScroll,
  searchValue,
  handleInlineSearch,
  handleMenuSearchChange,
  listHeight = 200,
  multiple = false,
  value,
  defaultValue,
  onChange,
  onInputChange,
  renderInput,
  placeholder,
  label,
  renderValue,
  slots,
  slotProps,
  ...autocompleteProps
}: MuiCustomAutocompleteProps<DataType, ApiResponse, ApiParams>) {
  const isInlineSearch =
    dynamicConfig.search?.placement === SEARCH_PLACEMENT.INLINE;
  const isControlled = value !== undefined;

  const autocompleteValueProps = useMemo(() => {
    if (isControlled) {
      return {
        value: resolveAutocompleteValue(value, options, multiple),
      };
    }

    if (defaultValue !== undefined) {
      return {
        defaultValue: resolveAutocompleteValue(defaultValue, options, multiple),
      };
    }

    if (multiple) {
      return { defaultValue: [] as ResolvedOption[] };
    }

    return {};
  }, [defaultValue, isControlled, multiple, options, value]);

  const handleChange = useCallback<
    NonNullable<
      AutocompleteProps<ResolvedOption, boolean, false, false>["onChange"]
    >
  >(
    (event, newValue, reason, details) => {
      onChange?.(event, toChangeValue(newValue, multiple), reason, details);
    },
    [multiple, onChange],
  );

  const handleInputChange = useCallback<
    NonNullable<
      AutocompleteProps<ResolvedOption, boolean, false, false>["onInputChange"]
    >
  >(
    (event, newInputValue, reason) => {
      if (isInlineSearch && (reason === "input" || reason === "clear")) {
        handleInlineSearch(reason === "clear" ? "" : newInputValue);
      }

      onInputChange?.(event, newInputValue, reason);
    },
    [handleInlineSearch, isInlineSearch, onInputChange],
  );

  const defaultRenderInput = useCallback<
    NonNullable<MuiDynamicSelectProps["renderInput"]>
  >(
    (params) => (
      <TextField
        {...params}
        label={label}
        placeholder={placeholder}
        slotProps={{
          ...params.slotProps,
          input: {
            ...params.slotProps.input,
            endAdornment: (
              <Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.slotProps.input.endAdornment}
              </Fragment>
            ),
          },
        }}
      />
    ),
    [label, loading, placeholder],
  );

  const menuRenderInput = useCallback<
    NonNullable<MuiDynamicSelectProps["renderInput"]>
  >(
    (params) => (
      <TextField
        {...params}
        label={label}
        placeholder={placeholder}
        slotProps={{
          ...params.slotProps,
          input: {
            ...params.slotProps.input,
            readOnly: true,
            endAdornment: (
              <Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.slotProps.input.endAdornment}
              </Fragment>
            ),
          },
          htmlInput: {
            ...params.slotProps?.htmlInput,
            readOnly: true,
          },
        }}
      />
    ),
    [label, loading, placeholder],
  );

  const resolvedRenderInput =
    renderInput ?? (isInlineSearch ? defaultRenderInput : menuRenderInput);

  const listboxSlotProps =
    slotProps?.listbox && typeof slotProps.listbox === "object"
      ? slotProps.listbox
      : {};
  const paperSlotProps =
    slotProps?.paper && typeof slotProps.paper === "object"
      ? slotProps.paper
      : {};

  const resolvedAutocompleteRenderValue = useMemo(() => {
    if (!renderValue) {
      return undefined;
    }

    const adapter: NonNullable<
      AutocompleteProps<ResolvedOption, boolean, false, false>["renderValue"]
    > = (value, getItemProps) => {
      const selected = Array.isArray(value)
        ? value
        : value == null
          ? []
          : [value];
      const ids = selected
        .map((option) => option.value)
        .filter((item): item is string | number => item != null);

      const content = renderValue(ids);
      if (!content) {
        return null;
      }

      if (!multiple) {
        return content;
      }

      const chips = getChipChildren(content);
      return chips.map((chip, index) =>
        isValidElement(chip)
          ? cloneElement(chip, {
              ...getItemProps({ index }),
              key: chip.key ?? String(ids[index] ?? index),
            })
          : chip,
      );
    };

    return adapter;
  }, [multiple, renderValue]);

  const sharedPaperSlotProps = {
    ...paperSlotProps,
    loading,
    isLoadingMore,
    totalNumber,
    canLoadMore,
    loadMoreConfig,
    dynamicConfig,
    handleLoadMoreClick,
    listHeight,
    onListScroll: handlePopupScroll,
  };

  return (
    <Autocomplete
      {...autocompleteProps}
      multiple={multiple}
      open={isOpen}
      onOpen={handleOpen}
      onClose={handleClose}
      options={options}
      {...autocompleteValueProps}
      onChange={handleChange}
      disableCloseOnSelect={multiple}
      {...(isInlineSearch
        ? { inputValue: isOpen ? searchValue : undefined }
        : {})}
      onInputChange={handleInputChange}
      loading={loading}
      filterOptions={(filteredOptions) => filteredOptions}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      renderValue={resolvedAutocompleteRenderValue}
      slots={{
        paper: isInlineSearch ? MuiAutocompletePaper : MuiSelectMenuPaper,
        ...slots,
      }}
      slotProps={{
        ...slotProps,
        listbox: {
          ...listboxSlotProps,
          sx: [
            {
              maxHeight: "none",
              overflow: "visible",
              py: 0,
            },
            ...(Array.isArray(listboxSlotProps.sx)
              ? listboxSlotProps.sx
              : listboxSlotProps.sx
                ? [listboxSlotProps.sx]
                : []),
          ],
        },
        paper: isInlineSearch
          ? sharedPaperSlotProps
          : {
              ...sharedPaperSlotProps,
              searchValue,
              handleMenuSearchChange,
            },
      }}
      renderInput={resolvedRenderInput}
    />
  );
}
