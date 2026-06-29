import TextField, { type TextFieldProps } from "@mui/material/TextField";

export function MuiMenuSearchInput({
  onKeyDown,
  onMouseDown,
  slotProps,
  sx,
  ...props
}: TextFieldProps) {
  return (
    <TextField
      size="small"
      fullWidth
      {...props}
      onKeyDown={(event) => {
        event.stopPropagation();
        onKeyDown?.(event);
      }}
      onMouseDown={(event) => {
        event.stopPropagation();
        onMouseDown?.(event);
      }}
      slotProps={{
        ...slotProps,
        htmlInput: {
          ...slotProps?.htmlInput,
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
