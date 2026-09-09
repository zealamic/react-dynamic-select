"use client";
import type { MouseEvent, ReactNode } from "react";

function keepMenuOpen(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();
}

export function LoadMoreStatusChip({
  visible,
  label = "Loading...",
}: {
  visible?: boolean;
  label?: ReactNode;
}) {
  if (!visible) {
    return null;
  }

  return (
    <span
      role="status"
      aria-live="polite"
      onMouseDown={keepMenuOpen}
      style={{
        position: "absolute",
        right: "1rem",
        bottom: "0.25rem",
        zIndex: 2,
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        maxWidth: "calc(100% - 1rem)",
        padding: "0.2rem 0.55rem",
        borderRadius: "999px",
        fontSize: "0.75rem",
        lineHeight: 1.25,
        fontWeight: 500,
        color: "CanvasText",
        backgroundColor: "Canvas",
        border: "1px solid color-mix(in srgb, CanvasText 16%, transparent)",
        boxShadow: "0 1px 2px color-mix(in srgb, CanvasText 12%, transparent)",
        pointerEvents: "none",
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
        <title>Loading</title>
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="3"
        />
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="28"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 12 12"
            to="360 12 12"
            dur="0.7s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </span>
  );
}
