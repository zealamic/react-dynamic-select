"use client";
import type { BaseUiLoadingOverlaySlotProps } from "../../types";
import styles from "./default.module.css";
import { joinClassNames } from "./merge-class-name";

export function DefaultLoadingOverlay({
  loading,
  className,
}: BaseUiLoadingOverlaySlotProps & { className?: string }) {
  if (!loading) {
    return null;
  }

  return (
    <div
      className={joinClassNames(
        styles["rds-base-ui__loading-overlay"],
        className,
      )}
      role="status"
    >
      Loading...
    </div>
  );
}
