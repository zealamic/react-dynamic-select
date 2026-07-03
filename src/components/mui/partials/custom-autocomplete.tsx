"use client";

import type { AutocompleteProps } from "@mui/material/Autocomplete";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import type { ReactNode } from "react";
import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ResolvedOption } from "@/general-types";
import { SEARCH_PLACEMENT } from "@/lib/constants";
import {
  getMuiOptionChipProps,
  getOptionLabel,
  getOptionLabelNode,
  hasCustomOptionLabel,
  isOptionEqualToValue,
  resolveAutocompleteValue,
  toChangeValue,
} from "../handlers";
import type {
  MuiDynamicSelectProps,
  UseMuiDynamicSelectReturn,
} from "../types";
import { MuiAutocompletePaper } from "./autocomplete-paper";
import { isOutsideDynamicSelectInteraction } from "./autocomplete-popup-section";
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
  renderOption,
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
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isInlineSearch || !isOpen) {
      return;
    }

    const handleDocumentPointerDown = (event: PointerEvent) => {
      if (!isOutsideDynamicSelectInteraction(event.target, rootRef.current)) {
        return;
      }

      handleClose(event as unknown as React.SyntheticEvent, "blur");
    };

    document.addEventListener("pointerdown", handleDocumentPointerDown, true);

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleDocumentPointerDown,
        true,
      );
    };
  }, [handleClose, isInlineSearch, isOpen]);

  const [uncontrolledSelected, setUncontrolledSelected] =
    useState<ResolvedOption | null>(() => {
      if (isControlled || defaultValue === undefined || multiple) {
        return null;
      }

      const resolved = resolveAutocompleteValue(defaultValue, options, false);

      return resolved == null || Array.isArray(resolved) ? null : resolved;
    });

  const singleSelectedOption = useMemo(() => {
    if (multiple) {
      return null;
    }

    if (isControlled) {
      const resolved = resolveAutocompleteValue(value, options, false);

      return resolved == null || Array.isArray(resolved) ? null : resolved;
    }

    return uncontrolledSelected;
  }, [isControlled, multiple, options, uncontrolledSelected, value]);

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
      if (!isControlled && !multiple) {
        setUncontrolledSelected(
          newValue == null || Array.isArray(newValue) ? null : newValue,
        );
      }

      onChange?.(event, toChangeValue(newValue, multiple), reason, details);
    },
    [isControlled, multiple, onChange],
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

  const showCustomSelectedLabel =
    singleSelectedOption != null && hasCustomOptionLabel(singleSelectedOption);

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
            startAdornment: showCustomSelectedLabel ? (
              <Box
                component="span"
                sx={{
                  flex: 1,
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {getOptionLabelNode(singleSelectedOption)}
              </Box>
            ) : (
              params.slotProps.input?.startAdornment
            ),
            endAdornment: (
              <Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.slotProps.input.endAdornment}
              </Fragment>
            ),
          },
          htmlInput: showCustomSelectedLabel
            ? {
                ...params.slotProps?.htmlInput,
                value: "",
                "aria-label": getOptionLabel(singleSelectedOption),
              }
            : params.slotProps?.htmlInput,
        }}
      />
    ),
    [
      label,
      loading,
      placeholder,
      showCustomSelectedLabel,
      singleSelectedOption,
    ],
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
            startAdornment: showCustomSelectedLabel ? (
              <Box
                component="span"
                sx={{
                  flex: 1,
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  zIndex: -1,
                }}
              >
                {getOptionLabelNode(singleSelectedOption)}
              </Box>
            ) : (
              params.slotProps.input?.startAdornment
            ),
            endAdornment: (
              <Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.slotProps.input.endAdornment}
              </Fragment>
            ),
          },
          htmlInput: showCustomSelectedLabel
            ? {
                ...params.slotProps?.htmlInput,
                readOnly: true,
                // value: "",
                style: {
                  display: "none",
                },
                "aria-label": getOptionLabel(singleSelectedOption),
              }
            : {
                ...params.slotProps?.htmlInput,
                readOnly: true,
              },
        }}
      />
    ),
    [
      label,
      loading,
      placeholder,
      showCustomSelectedLabel,
      singleSelectedOption,
    ],
  );

  const resolvedRenderInput =
    renderInput ?? (isInlineSearch ? defaultRenderInput : menuRenderInput);

  const defaultRenderOption = useCallback<
    NonNullable<
      AutocompleteProps<ResolvedOption, boolean, false, false>["renderOption"]
    >
  >(
    ({ key, ...optionProps }, option) => (
      <li key={key} {...optionProps}>
        {getOptionLabelNode(option)}
      </li>
    ),
    [],
  );

  const resolvedRenderOption = renderOption ?? defaultRenderOption;

  const defaultMultipleRenderValue = useCallback<
    NonNullable<
      AutocompleteProps<ResolvedOption, true, false, false>["renderValue"]
    >
  >(
    (selectedValue, getItemProps) =>
      selectedValue.map((option, index) => {
        const { key, ...itemProps } = getItemProps({ index });

        return (
          <Chip
            key={key}
            label={getOptionLabelNode(option)}
            {...itemProps}
            {...getMuiOptionChipProps(option)}
          />
        );
      }),
    [],
  );

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

  const autocompleteRenderValue = multiple
    ? (resolvedAutocompleteRenderValue ?? defaultMultipleRenderValue)
    : resolvedAutocompleteRenderValue;

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
    <div ref={rootRef}>
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
        renderOption={resolvedRenderOption}
        renderValue={
          autocompleteRenderValue as AutocompleteProps<
            ResolvedOption,
            boolean,
            false,
            false
          >["renderValue"]
        }
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
    </div>
  );
}
