import { Box, type BoxProps } from "@chakra-ui/react";
import type { MouseEvent } from "react";

export const DYNAMIC_SELECT_POPUP_ATTR = "data-dynamic-select-popup";

export function isDynamicSelectPopupElement(
  node: EventTarget | null | undefined,
) {
  return (
    node instanceof Element &&
    node.closest(`[${DYNAMIC_SELECT_POPUP_ATTR}]`) != null
  );
}

export function isOutsideDynamicSelectInteraction(
  target: EventTarget | null,
  root: HTMLElement | null,
) {
  if (!(target instanceof Node)) {
    return false;
  }

  if (root?.contains(target)) {
    return false;
  }

  if (isDynamicSelectPopupElement(target)) {
    return false;
  }

  return true;
}

function isFocusableTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLButtonElement ||
      target.isContentEditable ||
      target.closest("input, textarea, button, [contenteditable='true']") !=
        null)
  );
}

export function preventComboboxPopupClose(event: MouseEvent) {
  // Only prevent default (which would steal/deny focus) when the click is on a
  // non-focusable area. Clicking directly on the input must retain the native
  // focus behavior so it can be re-focused after a blur.
  if (!isFocusableTarget(event.target)) {
    event.preventDefault();
  }

  event.stopPropagation();
}

export function ChakraComboboxPopupSection({
  onMouseDown,
  focusContainedInput = false,
  ...props
}: BoxProps & { focusContainedInput?: boolean }) {
  return (
    <Box
      {...props}
      onMouseDown={(event) => {
        preventComboboxPopupClose(event);

        if (focusContainedInput && !isFocusableTarget(event.target)) {
          const input = event.currentTarget.querySelector("input");
          input?.focus({ preventScroll: true });
        }

        onMouseDown?.(event);
      }}
    />
  );
}
