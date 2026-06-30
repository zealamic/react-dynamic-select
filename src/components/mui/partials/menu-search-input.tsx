import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { useEffect, useRef } from "react";
import { preventAutocompletePopupClose } from "./autocomplete-popup-section";

function focusSearchInput(
  event: React.MouseEvent<HTMLDivElement>,
  inputRef: React.RefObject<HTMLInputElement | null>,
) {
  const input =
    event.target instanceof HTMLInputElement ? event.target : inputRef.current;

  input?.focus({ preventScroll: true });
}

export function MuiMenuSearchInput({
  onKeyDown,
  onMouseDown,
  slotProps,
  sx,
  autoFocus,
  disabled,
  ...props
}: TextFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!autoFocus || disabled) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(frame);
  }, [autoFocus, disabled]);

  return (
    <TextField
      size="small"
      fullWidth
      {...props}
      disabled={disabled}
      autoFocus={false}
      onKeyDown={(event) => {
        event.stopPropagation();
        onKeyDown?.(event);
      }}
      onMouseDown={(event) => {
        preventAutocompletePopupClose(event);
        focusSearchInput(event, inputRef);
        onMouseDown?.(event);
      }}
      slotProps={{
        ...slotProps,
        htmlInput: {
          ...slotProps?.htmlInput,
          ref: inputRef,
          autoComplete: "off",
        },
      }}
      sx={{
        m: 0,
        ...sx,
      }}
    />
  );
}
