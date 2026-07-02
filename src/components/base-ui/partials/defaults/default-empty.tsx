"use client";
import { Combobox } from "@base-ui/react/combobox";
import type { BaseUiEmptySlotProps } from "../../types";
import styles from "./default.module.css";
import { mergeClassName } from "./merge-class-name";

export function DefaultEmpty({
  message,
  children,
  searchValue: _searchValue,
  className,
  ...props
}: BaseUiEmptySlotProps) {
  const content = message ?? children;

  return (
    <Combobox.Empty
      className={mergeClassName(styles["rds-base-ui__empty"], className)}
      {...props}
    >
      {content}
    </Combobox.Empty>
  );
}
