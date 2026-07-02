"use client";
import type { BaseUiItemTextSlotProps } from "../../types";
import styles from "./default.module.css";

export function DefaultItemText({ option }: BaseUiItemTextSlotProps) {
  return (
    <span className={styles["rds-base-ui__item-text"]}>
      {option.label ?? String(option.value ?? "")}
    </span>
  );
}
