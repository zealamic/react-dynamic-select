"use client";

import type { SearchableApiParams } from "@/general-types";
import { SEARCH_PLACEMENT } from "@/lib/constants";
import { useMuiDynamicSelect } from "./hooks/use-dynamic-select";
import { MuiCustomAutocomplete } from "./partials/custom-autocomplete";
import { MuiCustomSelect } from "./partials/custom-select";
import type { MuiDynamicSelectProps } from "./types";

export function MuiDynamicSelect<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
>(props: MuiDynamicSelectProps<DataType, ApiResponse, ApiParams>) {
  const hookReturn = useMuiDynamicSelect(props);
  const isInlineSearch =
    hookReturn.dynamicConfig.search?.placement === SEARCH_PLACEMENT.INLINE;

  if (isInlineSearch) {
    return <MuiCustomAutocomplete {...hookReturn} />;
  }

  return <MuiCustomSelect {...hookReturn} />;
}
