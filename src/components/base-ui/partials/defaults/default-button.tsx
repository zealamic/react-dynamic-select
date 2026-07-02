"use client";
import type { BaseUiButtonSlotProps } from "../../types";
import styles from "./default.module.css";
import { joinClassNames } from "./merge-class-name";

export function DefaultButton({
  type = "button",
  className,
  ...props
}: BaseUiButtonSlotProps) {
  return (
    <button
      type={type}
      className={joinClassNames(styles["rds-base-ui__button"], className)}
      {...props}
    />
  );
}
