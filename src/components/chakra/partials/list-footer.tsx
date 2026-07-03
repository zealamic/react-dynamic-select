import { Box, Button, HStack, Spinner, Text } from "@chakra-ui/react";
import type { SearchableApiParams } from "@/general-types";
import { DefaultPlusIcon } from "@/icons/default-plus-icon";
import { ADD_PLACEMENT, LOAD_MORE_TYPE } from "@/lib/constants";
import type { ResolvedLoadMoreConfig } from "@/lib/utils/load-more";
import type { ChakraDynamicSelectConfig } from "../types";
import { ChakraComboboxPopupSection } from "./combobox-popup-section";

type ChakraListFooterProps<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
> = {
  dynamicConfig?: ChakraDynamicSelectConfig<DataType, ApiResponse, ApiParams>;
  totalNumber?: number;
  isLoadingMore?: boolean;
  canLoadMore?: boolean;
  loadMoreConfig?: ResolvedLoadMoreConfig<ApiResponse> | null;
  handleLoadMoreClick?: () => void;
  loading?: boolean;
};

export function ChakraListFooter<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
>({
  dynamicConfig,
  totalNumber,
  isLoadingMore,
  canLoadMore,
  loadMoreConfig,
  handleLoadMoreClick,
  loading,
}: ChakraListFooterProps<DataType, ApiResponse, ApiParams>) {
  const totalConfig = dynamicConfig?.total;
  const addConfig = dynamicConfig?.add;
  const showFooter =
    loadMoreConfig != null ||
    totalConfig?.path ||
    totalConfig?.label ||
    addConfig?.placement != null;

  if (!showFooter) {
    return null;
  }

  const loadMoreDisabled = loading || isLoadingMore || !canLoadMore;
  const showClickLoadMore =
    !isLoadingMore && loadMoreConfig?.type === LOAD_MORE_TYPE.CLICK;

  return (
    <>
      <Box borderTopWidth="1px" flexShrink={0} />
      <ChakraComboboxPopupSection
        display="flex"
        flexShrink={0}
        alignItems="center"
        justifyContent="space-between"
        p={2}
        gap={2}
        minH="3rem"
      >
        <HStack gap={2}>
          {addConfig?.placement === ADD_PLACEMENT.START && (
            <Button
              size="xs"
              colorPalette="blue"
              onClick={addConfig?.onClick}
              disabled={addConfig?.disabled}
            >
              {addConfig?.icon || <DefaultPlusIcon />}
              {addConfig?.label}
            </Button>
          )}
          {(totalConfig?.path || totalConfig?.label) && (
            <Text fontSize="sm" fontWeight="semibold">
              {totalConfig?.label || "Total"}: {totalNumber ?? "-"}
            </Text>
          )}
        </HStack>
        <HStack gap={2}>
          {isLoadingMore && (
            <HStack gap={2}>
              <Spinner size="xs" />
              <Text fontSize="sm">
                {loadMoreConfig?.loadingLabel || "Loading..."}
              </Text>
            </HStack>
          )}
          {showClickLoadMore && (
            <Button
              size="xs"
              variant="outline"
              colorPalette="blue"
              onClick={handleLoadMoreClick}
              disabled={loadMoreDisabled}
            >
              {loadMoreConfig?.label || "Load More"}
            </Button>
          )}
          {addConfig?.placement === ADD_PLACEMENT.END && (
            <Button
              size="xs"
              colorPalette="blue"
              onClick={addConfig?.onClick}
              disabled={addConfig?.disabled}
            >
              {addConfig?.icon || <DefaultPlusIcon />}
              {addConfig?.label}
            </Button>
          )}
        </HStack>
      </ChakraComboboxPopupSection>
    </>
  );
}
