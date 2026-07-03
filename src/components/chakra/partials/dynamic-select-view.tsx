"use client";

import type {
  ComboboxInputValueChangeDetails,
  ComboboxOpenChangeDetails,
  ComboboxRootProps,
  ComboboxValueChangeDetails,
} from "@chakra-ui/react";
import {
  Box,
  Combobox,
  createListCollection,
  Portal,
  Spinner,
  Tag,
} from "@chakra-ui/react";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ResolvedOption } from "@/general-types";
import { SEARCH_PLACEMENT } from "@/lib/constants";
import { hasCustomOptionLabel } from "@/lib/utils/option-label";
import {
  fromComboboxValues,
  getOptionLabel,
  getOptionLabelNode,
  toComboboxValues,
} from "../handlers";
import type { ChakraDynamicSelectValue } from "../types";
import type { UseChakraDynamicSelectReturn } from "../types";
import {
  ChakraComboboxPopupSection,
  DYNAMIC_SELECT_POPUP_ATTR,
  isOutsideDynamicSelectInteraction,
} from "./combobox-popup-section";
import { ChakraListFooter } from "./list-footer";
import { ChakraMenuSearchInput } from "./menu-search-input";

type ChakraDynamicSelectViewProps<
  DataType = any,
  ApiResponse = any,
  ApiParams extends Record<string, unknown> = Record<string, unknown>,
> = UseChakraDynamicSelectReturn<DataType, ApiResponse, ApiParams>;

export function ChakraDynamicSelectView<
  DataType = any,
  ApiResponse = any,
  ApiParams extends Record<string, unknown> = Record<string, unknown>,
>({
  options,
  loading,
  isLoadingMore,
  totalNumber,
  canLoadMore,
  loadMoreConfig,
  dynamicConfig,
  open,
  handleOpenChange,
  handlePopupScroll,
  handleLoadMoreClick,
  searchValue,
  handleInlineSearch,
  handleMenuSearchChange,
  placeholder,
  label,
  listHeight = 200,
  multiple: multipleProp = false,
  value,
  defaultValue,
  onChange,
  onValueChange,
  onOpenChange,
  ...rootProps
}: ChakraDynamicSelectViewProps<DataType, ApiResponse, ApiParams>) {
  const multiple = Boolean(multipleProp);
  const rootRef = useRef<HTMLDivElement>(null);
  const isControlled = value !== undefined;
  const isInlineSearch =
    dynamicConfig.search?.placement === SEARCH_PLACEMENT.INLINE;
  const isMenuSearch =
    dynamicConfig.search?.placement === SEARCH_PLACEMENT.MENU;

  const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(() =>
    toComboboxValues(defaultValue),
  );

  const comboboxValue = useMemo(() => {
    if (isControlled) {
      return toComboboxValues(value);
    }

    return uncontrolledValue;
  }, [isControlled, uncontrolledValue, value]);

  const selectedValues = comboboxValue;

  const collection = useMemo(
    () =>
      createListCollection({
        items: options,
        itemToString: getOptionLabel,
        itemToValue: (item) => String(item.value ?? ""),
      }),
    [options],
  );

  const selectedOptions = useMemo(
    () =>
      selectedValues
        .map((selectedValue) =>
          options.find((option) => String(option.value) === selectedValue),
        )
        .filter((option): option is ResolvedOption => option != null),
    [options, selectedValues],
  );

  const singleSelectedOption = multiple ? null : (selectedOptions[0] ?? null);
  const showCustomSelectedLabel =
    singleSelectedOption != null && hasCustomOptionLabel(singleSelectedOption);

  const isInitialLoading = loading && !isLoadingMore && options.length === 0;
  const comboboxOpen = open && !isInitialLoading;

  useEffect(() => {
    if (isInlineSearch || !comboboxOpen) {
      return;
    }

    const handleDocumentPointerDown = (event: PointerEvent) => {
      if (!isOutsideDynamicSelectInteraction(event.target, rootRef.current)) {
        return;
      }

      handleOpenChange(false);
    };

    document.addEventListener("pointerdown", handleDocumentPointerDown, true);

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleDocumentPointerDown,
        true,
      );
    };
  }, [comboboxOpen, handleOpenChange, isInlineSearch]);

  const handleRootOpenChange = useCallback(
    (details: ComboboxOpenChangeDetails) => {
      // Ignore spurious close events while the initial fetch is in progress.
      // The dropdown stays closed until data is ready, but `open` remains true.
      if (!details.open && isInitialLoading && open) {
        return;
      }

      onOpenChange?.(details.open, details);
      handleOpenChange(details.open, details);
    },
    [handleOpenChange, isInitialLoading, onOpenChange, open],
  );

  const handleRootValueChange = useCallback(
    (details: ComboboxValueChangeDetails<ResolvedOption>) => {
      const nextValue = fromComboboxValues(
        details.value,
        options,
        multiple,
      ) as ChakraDynamicSelectValue;

      if (!isControlled) {
        setUncontrolledValue(details.value);
      }

      onValueChange?.(details);
      onChange?.(nextValue);
    },
    [isControlled, multiple, onChange, onValueChange, options],
  );

  const handleRemoveOption = useCallback(
    (optionValue: string | number | null | undefined) =>
      (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const target = String(optionValue ?? "");
        const nextValues = comboboxValue.filter((value) => value !== target);

        if (!isControlled) {
          setUncontrolledValue(nextValues);
        }

        onChange?.(
          fromComboboxValues(
            nextValues,
            options,
            true,
          ) as ChakraDynamicSelectValue,
        );
      },
    [comboboxValue, isControlled, onChange, options],
  );

  const handleRootInputValueChange = useCallback(
    (details: ComboboxInputValueChangeDetails) => {
      if (!isInlineSearch) {
        return;
      }

      if (details.reason === "item-select") {
        return;
      }

      handleInlineSearch(details.inputValue);
    },
    [handleInlineSearch, isInlineSearch],
  );

  const emptyMessage = useMemo(() => {
    if (loading || options.length > 0) {
      return null;
    }

    if (searchValue) {
      return "No results found.";
    }

    return "No items found";
  }, [loading, options.length, searchValue]);

  const menuSearchInputProps = dynamicConfig.search?.inputSearchMenuProps;
  const searchDisabled =
    menuSearchInputProps?.disabled || isInitialLoading;

  const rootPassthrough = rootProps as Omit<
    ComboboxRootProps<ResolvedOption>,
    | "collection"
    | "multiple"
    | "open"
    | "onOpenChange"
    | "value"
    | "defaultValue"
    | "onValueChange"
    | "onInputValueChange"
  >;

  const valueProps = isControlled
    ? { value: comboboxValue }
    : { value: uncontrolledValue };

  const multipleInputProps = multiple
    ? {
        flex: "1 0 5rem",
        minW: "5rem",
        border: "none",
        bg: "transparent",
        outline: "none",
        boxShadow: "none",
        minH: "6",
        h: "auto",
        px: 0,
        py: 0,
        _focus: { outline: "none", boxShadow: "none" },
        _focusVisible: { outline: "none", boxShadow: "none" },
      }
    : {};

  const multipleControlProps = multiple
    ? {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "1",
        bg: "bg.panel",
        borderWidth: "1px",
        borderColor: "border.emphasized",
        borderRadius: "l2",
        minH: "var(--combobox-input-height)",
        px: "var(--combobox-input-padding-x)",
        py: "1.5",
      }
    : {};

  return (
    <Box ref={rootRef}>
      <Combobox.Root
        {...rootPassthrough}
        collection={collection}
        multiple={multiple}
        closeOnSelect={!multiple}
        open={comboboxOpen}
        onOpenChange={handleRootOpenChange}
        {...valueProps}
        onValueChange={handleRootValueChange}
        autoFocus={isMenuSearch ? false : undefined}
        openOnClick={isMenuSearch}
        {...(isInlineSearch && comboboxOpen ? { inputValue: searchValue } : {})}
        onInputValueChange={handleRootInputValueChange}
      >
        {label ? <Combobox.Label>{label}</Combobox.Label> : null}

        <Combobox.Control {...multipleControlProps}>
          {multiple
            ? selectedOptions.map((option) => (
                <Tag.Root
                  key={String(option.value)}
                  size="sm"
                  colorPalette="blue"
                  variant="subtle"
                >
                  <Tag.Label>{getOptionLabelNode(option)}</Tag.Label>
                  <Tag.EndElement>
                    <Tag.CloseTrigger
                      aria-label={`Remove ${getOptionLabel(option)}`}
                      onClick={handleRemoveOption(option.value)}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                    />
                  </Tag.EndElement>
                </Tag.Root>
              ))
            : null}
          {multiple ? (
            <Combobox.Input
              {...multipleInputProps}
              placeholder={selectedOptions.length > 0 ? undefined : placeholder}
              readOnly={isMenuSearch || undefined}
              cursor={isMenuSearch ? "pointer" : undefined}
            />
          ) : (
            <Box
              position="relative"
              display="flex"
              flex={1}
              alignItems="center"
              minW={0}
            >
              {showCustomSelectedLabel ? (
                <Box
                  position="absolute"
                  insetInline="3"
                  display="flex"
                  alignItems="center"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  pointerEvents="none"
                >
                  {getOptionLabelNode(singleSelectedOption)}
                </Box>
              ) : null}
              <Combobox.Input
                placeholder={showCustomSelectedLabel ? undefined : placeholder}
                readOnly={isMenuSearch || undefined}
                cursor={isMenuSearch ? "pointer" : undefined}
                color={showCustomSelectedLabel ? "transparent" : undefined}
                caretColor={
                  showCustomSelectedLabel ? "transparent" : undefined
                }
                flex={1}
                aria-label={
                  showCustomSelectedLabel
                    ? getOptionLabel(singleSelectedOption)
                    : undefined
                }
              />
            </Box>
          )}
          <Combobox.IndicatorGroup>
            {loading && !isLoadingMore ? <Spinner size="xs" /> : null}
            <Combobox.ClearTrigger />
            <Combobox.Trigger />
          </Combobox.IndicatorGroup>
        </Combobox.Control>

        {comboboxOpen ? (
          <Portal>
            <Combobox.Positioner>
              <Combobox.Content {...{ [DYNAMIC_SELECT_POPUP_ATTR]: "" }}>
                {isMenuSearch ? (
                  <ChakraComboboxPopupSection
                    focusContainedInput
                    flexShrink={0}
                    px={3}
                    pt={2}
                    pb={2}
                  >
                    <ChakraMenuSearchInput
                      autoFocus
                      shouldFocus={comboboxOpen}
                      {...menuSearchInputProps}
                      value={searchValue}
                      onChange={handleMenuSearchChange}
                      disabled={searchDisabled}
                    />
                  </ChakraComboboxPopupSection>
                ) : null}

                {isMenuSearch ? (
                  <Box borderTopWidth="1px" flexShrink={0} />
                ) : null}

                {!loading && options.length === 0 && emptyMessage ? (
                  <Combobox.Empty>{emptyMessage}</Combobox.Empty>
                ) : null}

                {options.length > 0 ? (
                  <Fragment>
                    <Box
                      maxH={listHeight}
                      overflowY="auto"
                      overflowX="hidden"
                      onScroll={handlePopupScroll}
                    >
                      {collection.items.map((item) => (
                        <Combobox.Item item={item} key={String(item.value)}>
                          {getOptionLabelNode(item)}
                          <Combobox.ItemIndicator />
                        </Combobox.Item>
                      ))}
                    </Box>

                    <ChakraListFooter
                      dynamicConfig={dynamicConfig}
                      totalNumber={totalNumber}
                      isLoadingMore={isLoadingMore}
                      canLoadMore={canLoadMore}
                      loadMoreConfig={loadMoreConfig}
                      handleLoadMoreClick={handleLoadMoreClick}
                      loading={loading}
                    />
                  </Fragment>
                ) : null}
              </Combobox.Content>
            </Combobox.Positioner>
          </Portal>
        ) : null}
      </Combobox.Root>
    </Box>
  );
}
