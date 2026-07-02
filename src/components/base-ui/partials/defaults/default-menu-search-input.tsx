"use client";
import type { ComboboxInputProps } from "@base-ui/react/combobox";
import type { InputHTMLAttributes } from "react";
import type { BaseUiMenuSearchInputSlotProps } from "../../types";
import styles from "./default.module.css";
import { joinClassNames } from "./merge-class-name";

type NativeMenuSearchInputProps = Omit<
  ComboboxInputProps,
  "className" | "style" | "render" | "value" | "defaultValue"
> &
  Pick<InputHTMLAttributes<HTMLInputElement>, "className" | "style">;

export function DefaultMenuSearchInput({
  searchValue,
  onSearchChange,
  className,
  style,
  render: _render,
  ...inputProps
}: BaseUiMenuSearchInputSlotProps) {
  const nativeProps = inputProps as NativeMenuSearchInputProps;
  const resolvedClassName = joinClassNames(
    styles["rds-base-ui__menu-search-input"],
    typeof className === "string" ? className : undefined,
  );
  const resolvedStyle = typeof style === "object" ? style : undefined;

  return (
    <input
      type="search"
      autoComplete="off"
      value={searchValue}
      onChange={onSearchChange}
      className={resolvedClassName}
      style={resolvedStyle}
      {...nativeProps}
    />
  );
}
