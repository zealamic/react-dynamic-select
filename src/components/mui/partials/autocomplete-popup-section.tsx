import Box, { type BoxProps } from "@mui/material/Box";
import type { MouseEvent } from "react";

export const DYNAMIC_SELECT_POPUP_ATTR = "data-dynamic-select-popup";

export function isDynamicSelectPopupElement(
  node: EventTarget | null | undefined,
) {
  return (
    node instanceof Element && node.closest(`[${DYNAMIC_SELECT_POPUP_ATTR}]`) != null
  );
}

export function preventAutocompletePopupClose(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();
}

export function MuiAutocompletePopupSection({
  onMouseDown,
  focusContainedInput = false,
  ...props
}: BoxProps & { focusContainedInput?: boolean }) {
  return (
    <Box
      {...props}
      onMouseDown={(event) => {
        preventAutocompletePopupClose(event);

        if (focusContainedInput) {
          const input = event.currentTarget.querySelector("input");
          input?.focus({ preventScroll: true });
        }

        onMouseDown?.(event);
      }}
    />
  );
}
