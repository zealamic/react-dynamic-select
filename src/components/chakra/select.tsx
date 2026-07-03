"use client";

import type { SearchableApiParams } from "@/general-types";
import { useChakraDynamicSelect } from "./hooks/use-dynamic-select";
import { ChakraDynamicSelectView } from "./partials/dynamic-select-view";
import type { ChakraDynamicSelectProps } from "./types";

export function ChakraDynamicSelect<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
>(props: ChakraDynamicSelectProps<DataType, ApiResponse, ApiParams>) {
  const hookReturn = useChakraDynamicSelect(props);

  return <ChakraDynamicSelectView {...hookReturn} />;
}
