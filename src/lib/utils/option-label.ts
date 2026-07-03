import type { ReactNode } from "react";
import type { ResolvedOption } from "@/general-types";

export function hasCustomOptionLabel(
  option: ResolvedOption | null | undefined,
): boolean {
  return option?.label != null && typeof option.label !== "string";
}

export function getOptionLabelText(option: ResolvedOption): string {
  if (typeof option.label === "string") {
    return option.label;
  }

  return String(option.value ?? "");
}

export function getOptionLabelNode(option: ResolvedOption): ReactNode {
  if (hasCustomOptionLabel(option)) {
    return option.label;
  }

  return option.label ?? String(option.value ?? "");
}
