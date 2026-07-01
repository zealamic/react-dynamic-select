"use client";

import type { SearchableApiParams } from "@/general-types";
import { useBaseUiDynamicSelect } from "./hooks/use-dynamic-select";
import { BaseUiDynamicSelectView } from "./partials/dynamic-select-view";
import type {
  BaseUiDynamicSelectProps,
  UseBaseUiDynamicSelectReturn,
} from "./types";

export function BaseUiDynamicSelect<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
  Multiple extends boolean = false,
>(props: BaseUiDynamicSelectProps<DataType, ApiResponse, ApiParams, Multiple>) {
  const hookReturn = useBaseUiDynamicSelect(props);

  return (
    <BaseUiDynamicSelectView
      {...(hookReturn as UseBaseUiDynamicSelectReturn<
        DataType,
        ApiResponse,
        ApiParams,
        boolean
      >)}
    />
  );
}
