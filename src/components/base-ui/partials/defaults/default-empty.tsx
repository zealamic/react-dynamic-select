import { Combobox } from "@base-ui/react/combobox";
import type { BaseUiEmptySlotProps } from "../../types";

export function DefaultEmpty({
  message,
  children,
  searchValue: _searchValue,
  ...props
}: BaseUiEmptySlotProps) {
  const content = message ?? children;

  if (content == null) {
    return <Combobox.Empty {...props} />;
  }

  return <Combobox.Empty {...props}>{content}</Combobox.Empty>;
}
