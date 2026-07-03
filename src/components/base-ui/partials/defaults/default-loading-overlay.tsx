"use client";
import type { ReactNode } from "react";
import type { BaseUiLoadingOverlaySlotProps } from "../../types";
import { DEFAULT_SELECT_MESSAGES } from "@/lib/utils/messages";
import styles from "./default.module.css";
import { joinClassNames } from "./merge-class-name";

export function DefaultLoadingOverlay({
  loading,
  message,
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
      {message ?? DEFAULT_SELECT_MESSAGES.loading}
    </div>
  );
}
