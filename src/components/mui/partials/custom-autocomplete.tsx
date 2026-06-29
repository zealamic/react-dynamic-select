"use client";

import Autocomplete, {
  type AutocompleteProps,
} from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { Fragment, useCallback, useMemo } from "react";
import type { ResolvedOption } from "@/general-types";
import type { MuiDynamicSelectProps, UseMuiDynamicSelectReturn } from "../types";
import {
  getOptionLabel,
  isOptionEqualToValue,
  resolveAutocompleteValue,
  toChangeValue,
} from "../utils";
import { MuiAutocompletePaper } from "./autocomplete-paper";

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
  listHeight = 200,
  multiple = false,
  value,
  defaultValue,
  onChange,
  onInputChange,
  renderInput,
  placeholder,
  label,
  slots,
  slotProps,
  ...autocompleteProps
}: MuiCustomAutocompleteProps<DataType, ApiResponse, ApiParams>) {
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
      if (reason === "input" || reason === "clear") {
        handleInlineSearch(reason === "clear" ? "" : newInputValue);
      }

      onInputChange?.(event, newInputValue, reason);
    },
    [handleInlineSearch, onInputChange],
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

  const listboxSlotProps =
    slotProps?.listbox && typeof slotProps.listbox === "object"
      ? slotProps.listbox
      : {};
  const paperSlotProps =
    slotProps?.paper && typeof slotProps.paper === "object"
      ? slotProps.paper
      : {};

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
      inputValue={isOpen ? searchValue : undefined}
      onInputChange={handleInputChange}
      loading={loading}
      filterOptions={(filteredOptions) => filteredOptions}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      slots={{
        paper: MuiAutocompletePaper,
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
        paper: {
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
        },
      }}
      renderInput={renderInput ?? defaultRenderInput}
    />
  );
}
