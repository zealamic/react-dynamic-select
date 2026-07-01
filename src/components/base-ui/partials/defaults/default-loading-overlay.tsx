import type { BaseUiLoadingOverlaySlotProps } from "../../types";

export function DefaultLoadingOverlay({
  loading,
}: BaseUiLoadingOverlaySlotProps) {
  if (!loading) {
    return null;
  }

  return <div role="status">Loading...</div>;
}
