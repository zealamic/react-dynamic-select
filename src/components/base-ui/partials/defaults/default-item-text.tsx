import type { BaseUiItemTextSlotProps } from "../../types";

export function DefaultItemText({ option }: BaseUiItemTextSlotProps) {
  return <span>{option.label ?? String(option.value ?? "")}</span>;
}
