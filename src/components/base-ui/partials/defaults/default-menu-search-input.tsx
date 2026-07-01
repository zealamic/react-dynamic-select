import type { ComboboxInputProps } from "@base-ui/react/combobox";
import type { InputHTMLAttributes } from "react";
import type { BaseUiMenuSearchInputSlotProps } from "../../types";

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
  const resolvedClassName =
    typeof className === "string" ? className : undefined;
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
