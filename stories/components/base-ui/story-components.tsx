import { Combobox } from "@base-ui/react/combobox";
import type { InputHTMLAttributes } from "react";
import type {
  BaseUiButtonSlotProps,
  BaseUiDynamicSelectComponents,
  BaseUiEmptySlotProps,
  BaseUiItemSlotProps,
  BaseUiItemTextSlotProps,
  BaseUiListFooterSlotProps,
  BaseUiLoadingOverlaySlotProps,
  BaseUiMenuSearchInputSlotProps,
  BaseUiStatusSlotProps,
} from "../../../src/base-ui";

import { LOAD_MORE_TYPE } from "../../../src/lib/constants";

import styles from "./base-ui.module.css";

function joinClassNames(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

type ClassNameProp<State = unknown> =
  | string
  | ((state: State) => string | undefined)
  | undefined;

function mergeModuleClassName<State>(
  moduleClass: string,
  className?: ClassNameProp<State>,
): string | ((state: State) => string) {
  if (typeof className === "function") {
    return (state: State) => joinClassNames(moduleClass, className(state));
  }

  return joinClassNames(moduleClass, className);
}

type CreateBaseUiStoryComponentsOptions = {
  multiple?: boolean;
};

export function createBaseUiStoryComponents(
  options: CreateBaseUiStoryComponentsOptions = {},
): BaseUiDynamicSelectComponents {
  const { multiple = false } = options;

  const components: BaseUiDynamicSelectComponents = {
    Label: ({ className, ...props }) => (
      <Combobox.Label
        className={mergeModuleClassName(styles.Label, className)}
        {...props}
      />
    ),
    InputGroup: ({ className, ...props }) => (
      <Combobox.InputGroup
        className={mergeModuleClassName(
          multiple ? styles.InputGroupMultiple : styles.InputGroup,
          className,
        )}
        {...props}
      />
    ),
    Input: ({ className, ...props }) => (
      <Combobox.Input
        className={mergeModuleClassName(
          multiple ? styles.InputMultiple : styles.Input,
          className,
        )}
        {...props}
      />
    ),
    Chips: ({ className, ...props }) => (
      <Combobox.Chips
        className={mergeModuleClassName(styles.Chips, className)}
        {...props}
      />
    ),
    Chip: ({ className, ...props }) => (
      <Combobox.Chip
        className={mergeModuleClassName(styles.Chip, className)}
        {...props}
      />
    ),
    ChipRemove: ({ className, ...props }) => (
      <Combobox.ChipRemove
        className={mergeModuleClassName(styles.ChipRemove, className)}
        {...props}
      />
    ),
    Clear: ({ className, ...props }) => (
      <Combobox.Clear
        className={mergeModuleClassName(styles.Clear, className)}
        {...props}
      />
    ),
    Trigger: ({ className, ...props }) => (
      <Combobox.Trigger
        className={mergeModuleClassName(styles.Trigger, className)}
        {...props}
      />
    ),
    Portal: (props) => <Combobox.Portal {...props} />,
    Positioner: ({ className, ...props }) => (
      <Combobox.Positioner
        className={mergeModuleClassName(styles.Positioner, className)}
        {...props}
      />
    ),
    Popup: ({ className, ...props }) => (
      <Combobox.Popup
        className={mergeModuleClassName(styles.Popup, className)}
        {...props}
      />
    ),
    List: ({ className, ...props }) => (
      <Combobox.List
        className={mergeModuleClassName(styles.List, className)}
        {...props}
      />
    ),
    Item: ({ option, className, children, ...props }: BaseUiItemSlotProps) => (
      <Combobox.Item
        className={mergeModuleClassName(styles.Item, className)}
        value={option}
        {...props}
      >
        {children}
      </Combobox.Item>
    ),
    ItemIndicator: ({ className, ...props }) => (
      <Combobox.ItemIndicator
        className={mergeModuleClassName(styles.ItemIndicator, className)}
        {...props}
      />
    ),
    ItemText: ({ option }: BaseUiItemTextSlotProps) => (
      <span className={styles.ItemText}>
        {option.label ?? String(option.value ?? "")}
      </span>
    ),
    Status: ({
      className,
      message,
      children,
      loading: _loading,
      error: _error,
      searchValue: _searchValue,
      ...props
    }: BaseUiStatusSlotProps) => (
      <Combobox.Status
        className={mergeModuleClassName(styles.Status, className)}
        {...props}
      >
        {message ?? children}
      </Combobox.Status>
    ),
    Empty: ({
      className,
      message,
      children,
      searchValue: _searchValue,
      ...props
    }: BaseUiEmptySlotProps) => (
      <Combobox.Empty
        className={mergeModuleClassName(styles.Empty, className)}
        {...props}
      >
        {message ?? children}
      </Combobox.Empty>
    ),
    MenuSearchInput: ({
      className,
      searchValue,
      onSearchChange,
      render: _render,
      style,
      ...props
    }: BaseUiMenuSearchInputSlotProps) => (
      <input
        type="search"
        autoComplete="off"
        className={joinClassNames(
          styles.MenuSearchInput,
          typeof className === "string" ? className : undefined,
        )}
        value={searchValue}
        onChange={onSearchChange}
        style={typeof style === "object" ? style : undefined}
        {...(props as InputHTMLAttributes<HTMLInputElement>)}
      />
    ),
    LoadingOverlay: ({
      loading,
      className,
    }: BaseUiLoadingOverlaySlotProps & { className?: string }) => {
      if (!loading) {
        return null;
      }

      return (
        <div
          className={joinClassNames(styles.LoadingOverlay, className)}
          role="status"
        >
          Loading...
        </div>
      );
    },
    Button: ({ className, ...props }: BaseUiButtonSlotProps) => (
      <button
        type="button"
        className={joinClassNames(styles.ListFooterButton, className)}
        {...props}
      />
    ),
    ListFooter: ({
      dynamicConfig,
      totalNumber,
      isLoadingMore,
      canLoadMore,
      loadMoreConfig,
      onLoadMoreClick,
      loading,
      Button,
    }: BaseUiListFooterSlotProps) => {
      const totalConfig = dynamicConfig?.total;
      const showFooter =
        loadMoreConfig != null || totalConfig?.path || totalConfig?.label;

      if (!showFooter) {
        return null;
      }

      const loadMoreDisabled = loading || isLoadingMore || !canLoadMore;
      const showClickLoadMore =
        !isLoadingMore && loadMoreConfig?.type === LOAD_MORE_TYPE.CLICK;

      return (
        <div className={styles.ListFooter}>
          {(totalConfig?.path || totalConfig?.label) && (
            <span className={styles.ListFooterTotal}>
              {totalConfig?.label || "Total"}:{" "}
              {loading && totalNumber === 0 ? "..." : (totalNumber ?? "-")}
            </span>
          )}
          {isLoadingMore && (
            <span>{loadMoreConfig?.loadingLabel || "Loading..."}</span>
          )}
          {showClickLoadMore && Button && (
            <Button
              onClick={onLoadMoreClick}
              onMouseDown={(event) => {
                event.stopPropagation();
              }}
              disabled={loadMoreDisabled}
            >
              {loadMoreConfig?.label || "Load More"}
            </Button>
          )}
        </div>
      );
    },
  };

  return components;
}
