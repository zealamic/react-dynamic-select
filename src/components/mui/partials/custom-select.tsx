"use client";

import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import type { SelectChangeEvent, SelectProps } from "@mui/material/Select";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { useCallback, useMemo, type SyntheticEvent } from "react";
import type {
  MuiDynamicSelectValue,
  UseMuiDynamicSelectReturn,
} from "../types";
import {
  formatSelectDisplayValue,
  getOptionLabel,
  resolveSelectValue,
} from "../utils";
import { MuiSelectMenuPaper } from "./select-menu-paper";

type MuiCustomSelectProps<
  DataType = any,
  ApiResponse = any,
  ApiParams extends Record<string, unknown> = Record<string, unknown>,
> = UseMuiDynamicSelectReturn<DataType, ApiResponse, ApiParams>;

export function MuiCustomSelect<
  DataType = any,
  ApiResponse = any,
  ApiParams extends Record<string, unknown> = Record<string, unknown>,
>(hookReturn: MuiCustomSelectProps<DataType, ApiResponse, ApiParams>) {
  const {
    dynamicConfig,
    options,
    loading,
    isLoadingMore,
    totalNumber,
    canLoadMore,
    loadMoreConfig,
    isOpen,
    handleOpen,
    handleClose,
    handlePopupScroll,
    handleLoadMoreClick,
    searchValue,
    handleMenuSearchChange,
    listHeight = 200,
    multiple = false,
    value,
    defaultValue,
    onChange,
    placeholder,
    label,
    selectProps,
    disabled,
    fullWidth,
    size,
    sx,
    className,
    helperText,
    error,
    required,
    name,
    id,
  } = hookReturn;

  const isControlled = value !== undefined;

  const resolvedValue = useMemo(
    () => resolveSelectValue(isControlled ? value : defaultValue, multiple),
    [defaultValue, isControlled, multiple, value],
  );

  const selectValueProps = isControlled
    ? { value: resolvedValue }
    : defaultValue !== undefined
      ? { defaultValue: resolvedValue }
      : multiple
        ? { defaultValue: [] as Array<string | number> }
        : {};

  const handleSelectChange = useCallback(
    (event: SelectChangeEvent<string | number | Array<string | number>>) => {
      const nextValue = event.target.value;

      if (multiple) {
        const values = Array.isArray(nextValue)
          ? nextValue
          : String(nextValue).split(",").filter(Boolean);

        onChange?.(
          event as unknown as SyntheticEvent,
          values as MuiDynamicSelectValue,
          "selectOption",
        );
        return;
      }

      onChange?.(
        event as unknown as SyntheticEvent,
        nextValue as MuiDynamicSelectValue,
        "selectOption",
      );
    },
    [multiple, onChange],
  );

  const defaultRenderValue = useCallback(
    (selected: unknown) => {
      const resolvedSelected =
        isControlled &&
        multiple &&
        Array.isArray(resolvedValue) &&
        resolvedValue.length > 0 &&
        (!Array.isArray(selected) || selected.length === 0)
          ? resolvedValue
          : selected;

      return formatSelectDisplayValue(
        resolvedSelected,
        options,
        placeholder,
        multiple,
      );
    },
    [isControlled, multiple, options, placeholder, resolvedValue],
  );

  const { MenuProps: userMenuProps, ...restSelectProps } = selectProps ?? {};
  const userMenuSlotProps =
    userMenuProps?.slotProps && typeof userMenuProps.slotProps === "object"
      ? userMenuProps.slotProps
      : {};
  const userListSlotProps =
    userMenuSlotProps.list && typeof userMenuSlotProps.list === "object"
      ? userMenuSlotProps.list
      : {};
  const userPaperSlotProps =
    userMenuSlotProps.paper && typeof userMenuSlotProps.paper === "object"
      ? userMenuSlotProps.paper
      : {};

  const selectSlotProps = {
    ...restSelectProps,
    ...selectValueProps,
    multiple,
    open: isOpen,
    onOpen: handleOpen,
    onClose: (event: SyntheticEvent) => handleClose(event),
    onChange: handleSelectChange as SelectProps["onChange"],
    displayEmpty: true,
    renderValue: selectProps?.renderValue ?? defaultRenderValue,
    IconComponent:
      typeof loading === "boolean" && loading ? () => <span /> : undefined,
    endAdornment:
      typeof loading === "boolean" && loading ? (
        <CircularProgress color="inherit" size={12} />
      ) : undefined,
    MenuProps: {
      autoFocus: false,
      disableAutoFocusItem: true,
      ...userMenuProps,
      slotProps: {
        ...userMenuSlotProps,
        paper: {
          ...userPaperSlotProps,
          component: MuiSelectMenuPaper,
          loading,
          isLoadingMore,
          totalNumber,
          canLoadMore,
          loadMoreConfig,
          dynamicConfig,
          handleLoadMoreClick,
          searchValue,
          handleMenuSearchChange,
          listHeight,
          onListScroll: handlePopupScroll,
        },
        list: {
          ...userListSlotProps,
          sx: [
            {
              maxHeight: "none",
              overflow: "visible",
              py: 0,
            },
            ...(Array.isArray(userListSlotProps.sx)
              ? userListSlotProps.sx
              : userListSlotProps.sx
                ? [userListSlotProps.sx]
                : []),
          ],
        },
      },
    },
  } as Partial<SelectProps>;

  return (
    <TextField
      id={id}
      name={name}
      className={className}
      sx={sx}
      select
      label={label}
      disabled={disabled}
      fullWidth={fullWidth}
      size={size}
      helperText={helperText}
      error={error}
      required={required}
      slotProps={{
        input: {
          endAdornment: loading ? (
            <CircularProgress color="inherit" size={20} />
          ) : null,
        },
        select: selectSlotProps as NonNullable<
          TextFieldProps["slotProps"]
        >["select"],
      }}
    >
      {options.map((option) => (
        <MenuItem
          key={String(option.value)}
          value={option.value ?? ""}
          disabled={option.value == null}
        >
          {getOptionLabel(option)}
        </MenuItem>
      ))}
    </TextField>
  );
}
