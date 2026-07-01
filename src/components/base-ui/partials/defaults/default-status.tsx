import { Combobox } from "@base-ui/react/combobox";
import type { BaseUiStatusSlotProps } from "../../types";

export function DefaultStatus({
  message,
  children,
  loading: _loading,
  error: _error,
  searchValue: _searchValue,
  ...props
}: BaseUiStatusSlotProps) {
  const content = message ?? children;

  if (content == null) {
    return <Combobox.Status {...props} />;
  }

  return <Combobox.Status {...props}>{content}</Combobox.Status>;
}
