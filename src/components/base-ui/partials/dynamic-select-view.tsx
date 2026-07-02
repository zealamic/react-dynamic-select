"use client";
import type {
  ComboboxRootChangeEventDetails,
  ComboboxRootProps,
} from "@base-ui/react/combobox";
import { Fragment, useCallback, useId, useMemo } from "react";
import type { ResolvedOption } from "@/general-types";
import { SEARCH_PLACEMENT } from "@/lib/constants";
import {
  getOptionLabel,
  isOptionEqualToValue,
  itemToStringLabel,
  itemToStringValue,
} from "../handlers";
import type { UseBaseUiDynamicSelectReturn } from "../types";
import {
  resolveBaseUiIcons,
  useResolvedBaseUiComponents,
} from "./resolve-components";

type BaseUiDynamicSelectViewProps<
  DataType = any,
  ApiResponse = any,
  ApiParams extends Record<string, unknown> = Record<string, unknown>,
> = UseBaseUiDynamicSelectReturn<DataType, ApiResponse, ApiParams, boolean>;

export function BaseUiDynamicSelectView<
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
  components,
  icons,
  placeholder,
  label,
  listHeight,
  multiple: multipleProp = false,
  value,
  defaultValue,
  onValueChange,
  onOpenChange,
  ...rootProps
}: BaseUiDynamicSelectViewProps<DataType, ApiResponse, ApiParams>) {
  const multiple = Boolean(multipleProp);
  const inputId = useId();
  const resolvedComponents = useResolvedBaseUiComponents(components, {
    multiple,
  });
  const resolvedIcons = useMemo(() => resolveBaseUiIcons(icons), [icons]);

  const isInlineSearch =
    dynamicConfig.search?.placement === SEARCH_PLACEMENT.INLINE;
  const isMenuSearch =
    dynamicConfig.search?.placement === SEARCH_PLACEMENT.MENU;

  const {
    Root,
    Label,
    InputGroup,
    Input,
    Chips,
    Value,
    Chip,
    ChipRemove,
    Clear,
    Trigger,
    Portal,
    Positioner,
    Popup,
    List,
    Status,
    Empty,
    Item,
    ItemIndicator,
    ItemText,
    MenuSearchInput,
    ListFooter,
    LoadingOverlay,
    Button,
    Separator,
  } = resolvedComponents;

  const CheckIcon = resolvedIcons.Check;
  const ClearIcon = resolvedIcons.Clear;
  const CaretDownIcon = resolvedIcons.CaretDown;
  const ChipRemoveIcon = resolvedIcons.ChipRemove;

  const handleRootOpenChange = useCallback(
    (nextOpen: boolean, eventDetails: ComboboxRootChangeEventDetails) => {
      onOpenChange?.(nextOpen, eventDetails);
      handleOpenChange(nextOpen, eventDetails);
    },
    [handleOpenChange, onOpenChange],
  );

  const handleRootInputValueChange = useCallback(
    (inputValue: string, eventDetails: ComboboxRootChangeEventDetails) => {
      if (!isInlineSearch) {
        eventDetails.cancel();
        return;
      }

      if (eventDetails.reason === "item-press") {
        return;
      }

      handleInlineSearch(inputValue);
    },
    [handleInlineSearch, isInlineSearch],
  );

  const statusMessage = useMemo(() => {
    if (loading && options.length === 0) {
      return "Loading...";
    }

    return null;
  }, [loading, options.length]);

  const emptyMessage = useMemo(() => {
    if (loading || options.length > 0) {
      return null;
    }

    if (searchValue) {
      return "No results found.";
    }

    return null;
  }, [loading, options.length, searchValue]);

  const listStyle = listHeight ? { maxHeight: listHeight } : undefined;

  const renderOptionItem = useCallback(
    (option: ResolvedOption) => {
      const itemKey = String(option.value ?? option.label ?? "");
      const itemContent = (
        <>
          <ItemIndicator>
            <CheckIcon />
          </ItemIndicator>
          <ItemText option={option} />
        </>
      );

      return (
        <Item key={itemKey} value={option} option={option}>
          {itemContent}
        </Item>
      );
    },
    [CheckIcon, Item, ItemIndicator, ItemText],
  );

  const rootPassthrough = rootProps as ComboboxRootProps<
    ResolvedOption,
    boolean
  >;

  const menuSearchInputProps = dynamicConfig.search?.inputSearchMenuProps;

  const renderSingleInput = () => (
    <Input
      id={inputId}
      placeholder={placeholder}
      style={isMenuSearch ? { cursor: "pointer" } : undefined}
    />
  );

  const renderInputChrome = () => {
    if (multiple) {
      return (
        <Chips>
          <Value>
            {(selectedValue: ResolvedOption[]) => (
              <Fragment>
                {selectedValue.map((option) => {
                  const optionLabel = getOptionLabel(option);

                  return (
                    <Chip key={String(option.value)} aria-label={optionLabel}>
                      {optionLabel}
                      <ChipRemove aria-label={`Remove ${optionLabel}`}>
                        <ChipRemoveIcon />
                      </ChipRemove>
                    </Chip>
                  );
                })}
                <Input
                  id={inputId}
                  placeholder={
                    selectedValue.length > 0 ? undefined : placeholder
                  }
                  style={isMenuSearch ? { cursor: "pointer" } : undefined}
                />
              </Fragment>
            )}
          </Value>
        </Chips>
      );
    }

    return (
      <Fragment>
        {renderSingleInput()}
        <Clear aria-label="Clear selection">
          <ClearIcon />
        </Clear>
        <Trigger aria-label="Open popup">
          <CaretDownIcon />
        </Trigger>
      </Fragment>
    );
  };

  return (
    <Root
      {...rootPassthrough}
      items={options}
      filter={null}
      multiple={multiple}
      open={open}
      onOpenChange={handleRootOpenChange}
      value={value as ComboboxRootProps<ResolvedOption, boolean>["value"]}
      defaultValue={
        defaultValue as ComboboxRootProps<
          ResolvedOption,
          boolean
        >["defaultValue"]
      }
      onValueChange={
        onValueChange as ComboboxRootProps<
          ResolvedOption,
          boolean
        >["onValueChange"]
      }
      itemToStringLabel={itemToStringLabel}
      itemToStringValue={itemToStringValue}
      isItemEqualToValue={isOptionEqualToValue}
      {...(isInlineSearch && open ? { inputValue: searchValue } : {})}
      onInputValueChange={handleRootInputValueChange}
    >
      {label ? <Label>{label}</Label> : null}

      <InputGroup>{renderInputChrome()}</InputGroup>

      <Portal>
        <Positioner sideOffset={4}>
          <Popup aria-busy={loading || undefined}>
            {isMenuSearch ? (
              <MenuSearchInput
                autoFocus
                {...menuSearchInputProps}
                searchValue={searchValue}
                onSearchChange={handleMenuSearchChange}
              />
            ) : null}

            <Separator />

            <Status
              loading={loading}
              searchValue={searchValue}
              message={statusMessage}
              style={{ display: "none" }}
            >
              {statusMessage}
            </Status>
            {!loading && options.length === 0 && (
              <Empty searchValue={searchValue} message={emptyMessage}>
                {emptyMessage}
              </Empty>
            )}

            <LoadingOverlay loading={loading && options.length === 0} />

            <List style={listStyle} onScroll={handlePopupScroll}>
              {renderOptionItem}
            </List>
            <Separator />
            <ListFooter
              loading={loading}
              isLoadingMore={isLoadingMore}
              totalNumber={totalNumber}
              canLoadMore={canLoadMore}
              loadMoreConfig={loadMoreConfig}
              onLoadMoreClick={handleLoadMoreClick}
              dynamicConfig={dynamicConfig}
              Button={Button}
            />
          </Popup>
        </Positioner>
      </Portal>
    </Root>
  );
}
