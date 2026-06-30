"use client";

import { Input, type InputProps, type InputRef } from "antd";
import { useEffect, useRef } from "react";

function focusSearchInput(
  event: React.MouseEvent<HTMLInputElement>,
  inputRef: React.RefObject<InputRef | null>,
) {
  const input =
    event.target instanceof HTMLInputElement
      ? event.target
      : inputRef.current?.input;

  input?.focus({ preventScroll: true });
}

export function AntdMenuSearchInput({
  onKeyDown,
  onMouseDown,
  autoFocus,
  disabled,
  ...props
}: InputProps) {
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (!autoFocus || disabled) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      inputRef.current?.input?.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(frame);
  }, [autoFocus, disabled]);

  return (
    <Input
      ref={inputRef}
      {...props}
      disabled={disabled}
      autoFocus={false}
      onKeyDown={(event) => {
        event.stopPropagation();
        onKeyDown?.(event);
      }}
      onMouseDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
        focusSearchInput(event, inputRef);
        onMouseDown?.(event);
      }}
    />
  );
}
