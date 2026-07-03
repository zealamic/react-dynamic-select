import { Input, type InputProps } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

type ChakraMenuSearchInputProps = InputProps & {
  /** Re-focus the input whenever the menu opens. */
  shouldFocus?: boolean;
};

function focusMenuSearchInput(input: HTMLInputElement | null) {
  input?.focus({ preventScroll: true });
}

export function ChakraMenuSearchInput({
  onKeyDown,
  onMouseDown,
  onPointerDown,
  autoFocus,
  disabled,
  shouldFocus,
  ...props
}: ChakraMenuSearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ((!autoFocus && !shouldFocus) || disabled) {
      return;
    }

    let outerFrame = 0;
    let innerFrame = 0;

    // Run after the combobox finishes its own open/focus handling.
    outerFrame = requestAnimationFrame(() => {
      innerFrame = requestAnimationFrame(() => {
        focusMenuSearchInput(inputRef.current);
      });
    });

    return () => {
      cancelAnimationFrame(outerFrame);
      cancelAnimationFrame(innerFrame);
    };
  }, [autoFocus, disabled, shouldFocus]);

  return (
    <Input
      type="search"
      size="sm"
      autoComplete="off"
      {...props}
      ref={inputRef}
      disabled={disabled}
      onKeyDown={(event) => {
        event.stopPropagation();
        onKeyDown?.(event);
      }}
      onPointerDownCapture={(event) => {
        event.stopPropagation();
      }}
      onPointerDown={(event) => {
        event.stopPropagation();
        onPointerDown?.(event);
      }}
      onMouseDown={(event) => {
        event.stopPropagation();
        focusMenuSearchInput(inputRef.current);
        onMouseDown?.(event);
      }}
    />
  );
}
