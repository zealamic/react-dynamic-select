"use client";

import type { SearchableApiParams } from "@/general-types";
import { useMuiDynamicSelect } from "./hooks/use-dynamic-select";
import { MuiCustomAutocomplete } from "./partials/custom-autocomplete";
import type { MuiDynamicSelectProps } from "./types";

export function MuiDynamicSelect<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
>(props: MuiDynamicSelectProps<DataType, ApiResponse, ApiParams>) {
  const hookReturn = useMuiDynamicSelect(props);

  return <MuiCustomAutocomplete {...hookReturn} />;
}
