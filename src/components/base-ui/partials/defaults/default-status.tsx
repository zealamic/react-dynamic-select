"use client";
import { Combobox } from "@base-ui/react/combobox";
import type { BaseUiStatusSlotProps } from "../../types";
import styles from "./default.module.css";
import { mergeClassName } from "./merge-class-name";

export function DefaultStatus({
  message,
  children,
  loading: _loading,
  error: _error,
  searchValue: _searchValue,
  className,
  ...props
}: BaseUiStatusSlotProps) {
  const content = message ?? children;

  return (
    <Combobox.Status
      className={mergeClassName(styles["rds-base-ui__status"], className)}
      {...props}
    >
      {content}
    </Combobox.Status>
  );
}
