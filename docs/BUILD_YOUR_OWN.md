# Build Your Own Dynamic Select

The main entry `@zealamic/react-dynamic-select` is a **headless** toolkit. It exports hooks, utilities, types, and constants — no UI components. Use it when you want full control over rendering (native `<select>`, Radix, custom design system, etc.).

Pre-built UI integrations live in separate entry points:

| Entry point                              | Component             |
| ---------------------------------------- | --------------------- |
| `@zealamic/react-dynamic-select/antd`    | `AntdDynamicSelect`   |
| `@zealamic/react-dynamic-select/mui`     | `MuiDynamicSelect`    |
| `@zealamic/react-dynamic-select/base-ui` | `BaseUiDynamicSelect` |

Each of those is essentially a thin wrapper around the primitives documented here.

## Import

```tsx
import {
  // Config
  defaultDynamicSelectConfig,

  // Hooks
  useFetchData,
  useSearch,
  useLoadMore,

  // Constants
  FETCH_TRIGGER,
  LOAD_MORE_TYPE,
  SEARCH_PLACEMENT,
  INVALID_VALUE,

  // Utilities
  mergeDynamicConfig,
  mergeOptionsWithCurrent,
  normalizeSelectValues,
  resolveCurrentOptions,
  resolveDataFromTemplate,
  resolveOptionFromTemplate,
  resolveLoadMoreConfig,
  getInitialPagination,
  getNextPagePagination,
  hasMoreToLoad,
} from "@zealamic/react-dynamic-select";

import type {
  DynamicSelectConfig,
  DynamicSelectHookProps,
  ResolvedOption,
  ResolvedLoadMoreConfig,
  SearchableApiParams,
  FetchTrigger,
  LoadMoreType,
  SearchPlacement,
  OptionTemplate,
  PaginationParams,
} from "@zealamic/react-dynamic-select";
```

---

## Exports reference

### Types

| Export                   | Description                                                                              |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| `DynamicSelectConfig`    | Full config shape: `api`, `list`, `total`, `option`, `search`, `loadMore`, `currentData` |
| `DynamicSelectHookProps` | `{ dynamicConfig?: DynamicSelectConfig }` — useful as a base for custom hook props       |
| `ResolvedOption`         | `{ label?: string \| null; value: string \| number \| null \| undefined }`               |
| `SearchableApiParams`    | `Record<string, any> & { search?: string }` — minimum API params constraint              |
| `OptionTemplate`         | `{ label?: string; value?: string }` — maps API item fields to options                   |
| `PaginationParams`       | `{ page, pageSize }` or `{ page, limit }`                                                |
| `FetchTrigger`           | `"mount"` \| `"open"`                                                                    |
| `LoadMoreType`           | `"click"` \| `"scroll"`                                                                  |
| `SearchPlacement`        | `"inline"` \| `"menu"`                                                                   |
| `ResolvedLoadMoreConfig` | Normalized load-more settings returned by `resolveLoadMoreConfig`                        |

### Constants

| Export                    | Value      | Description                                          |
| ------------------------- | ---------- | ---------------------------------------------------- |
| `FETCH_TRIGGER.MOUNT`     | `"mount"`  | Fetch on component mount                             |
| `FETCH_TRIGGER.OPEN`      | `"open"`   | Fetch on first dropdown open (default)               |
| `SEARCH_PLACEMENT.MENU`   | `"menu"`   | Search input inside the dropdown                     |
| `SEARCH_PLACEMENT.INLINE` | `"inline"` | Search on the main input                             |
| `LOAD_MORE_TYPE.CLICK`    | `"click"`  | Load more via button                                 |
| `LOAD_MORE_TYPE.SCROLL`   | `"scroll"` | Load more on scroll-to-bottom                        |
| `INVALID_VALUE`           | `""`       | Sentinel used internally for missing template values |

### `defaultDynamicSelectConfig`

Baseline config merged with your `dynamicConfig`. See [Dynamic config properties](https://github.com/zealamic/react-dynamic-select/blob/main/README.md#dynamic-config-properties) for defaults and property details.

---

## Hooks

### `useFetchData(dynamicConfig)`

Manages async data fetching, pagination, and option resolution.

**Returns:**

| Field           | Type                                 | Description                                                   |
| --------------- | ------------------------------------ | ------------------------------------------------------------- |
| `options`       | `ResolvedOption[]`                   | Options from the latest fetch (accumulated on load more)      |
| `total`         | `number`                             | Total record count from the API response                      |
| `loading`       | `boolean`                            | Initial fetch in progress                                     |
| `isLoadingMore` | `boolean`                            | Load-more fetch in progress                                   |
| `fetchData`     | `(overrideParams?) => Promise<void>` | Reset to page 1 and fetch. Pass `{ search: "..." }` to search |
| `fetchLoadMore` | `() => Promise<void>`                | Fetch the next page and append options                        |

**Behavior:**

- Resolves list items via `list.path` and `option.template` from the API response.
- Resolves `total` via `total.path`.
- Cancels stale requests when a newer one is in flight.
- Calls `api.onSuccess` / `api.onError` on each request.
- Runs `loadMore.afterFetch` after every successful fetch.

### `useSearch({ debounce, onSearch })`

Debounced search state for inline or menu search inputs.

**Returns:**

| Field                    | Description                                                               |
| ------------------------ | ------------------------------------------------------------------------- |
| `searchValue`            | Current search string                                                     |
| `handleInlineSearch`     | `(value: string) => void` — for inline search inputs                      |
| `handleMenuSearchChange` | `(event: ChangeEvent<HTMLInputElement>) => void` — for menu search inputs |
| `resetSearch`            | Clears search value and pending debounce                                  |

Wire `onSearch` to `fetchData({ search })`.

### `useLoadMore({ dynamicConfig, fetchLoadMore, loading, isLoadingMore, loadedCount, total, onPopupScroll? })`

Scroll and click handlers for pagination.

**Returns:**

| Field                 | Description                                                                |
| --------------------- | -------------------------------------------------------------------------- |
| `handleLoadMoreClick` | Click handler for `LOAD_MORE_TYPE.CLICK`                                   |
| `handlePopupScroll`   | Scroll handler for `LOAD_MORE_TYPE.SCROLL` (also forwards `onPopupScroll`) |
| `loadMoreConfig`      | Resolved load-more config, or `null` if disabled                           |
| `canLoadMore`         | `true` when `loadedCount < total`                                          |

---

## Utilities

### Config merging

| Function                                        | Description                              |
| ----------------------------------------------- | ---------------------------------------- |
| `mergeDynamicConfig({ defaultConfig, config })` | Deep-merges partial config into defaults |

### Pagination

| Function                            | Description                                                                |
| ----------------------------------- | -------------------------------------------------------------------------- |
| `getInitialPagination(params)`      | Returns `{ page: 1, pageSize }` or `{ page: 1, limit }` from config params |
| `getNextPagePagination(current)`    | Increments `page` by 1                                                     |
| `hasMoreToLoad(loadedCount, total)` | `total > 0 && loadedCount < total`                                         |

### Response → options

| Function                                        | Description                                                                                               |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `resolveDataFromTemplate({ template, data })`   | Reads a value from nested response data. Supports dot paths (`"data.items"`) and `"{field}"` placeholders |
| `resolveOptionFromTemplate({ template, data })` | Maps one API item to `ResolvedOption`                                                                     |
| `resolveLoadMoreConfig(loadMore)`               | Normalizes `loadMore: true \| object` to `ResolvedLoadMoreConfig \| null`                                 |

### Selected value handling

| Function                                                                      | Description                                                                    |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `resolveCurrentOptions(dynamicConfig)`                                        | Converts `currentData` to `ResolvedOption[]` using `option.template`           |
| `normalizeSelectValues(value, { mode, labelInValue })`                        | Extracts primitive ids from single/multiple/`labelInValue` select values       |
| `mergeOptionsWithCurrent({ fetchedOptions, currentOptions, selectedValues })` | Ensures pre-loaded selected options appear in the list even if not yet fetched |

---

## Step-by-step: custom hook

The built-in `useAntdDynamicSelect`, `useMuiDynamicSelect`, and `useBaseUiDynamicSelect` all follow the same pattern. Here is a minimal version you can adapt:

```tsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  defaultDynamicSelectConfig,
  FETCH_TRIGGER,
  mergeDynamicConfig,
  mergeOptionsWithCurrent,
  normalizeSelectValues,
  resolveCurrentOptions,
  useFetchData,
  useLoadMore,
  useSearch,
} from "@zealamic/react-dynamic-select";
import type {
  DynamicSelectConfig,
  ResolvedOption,
  SearchableApiParams,
} from "@zealamic/react-dynamic-select";

type UseCustomDynamicSelectOptions<
  DataType,
  ApiResponse,
  ApiParams extends SearchableApiParams,
> = {
  dynamicConfig?: DynamicSelectConfig<DataType, ApiResponse, ApiParams>;
  value?: string | number | null;
  defaultValue?: string | number | null;
  multiple?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function useCustomDynamicSelect<
  DataType = unknown,
  ApiResponse = unknown,
  ApiParams extends SearchableApiParams = SearchableApiParams,
>({
  dynamicConfig: dynamicConfigProps,
  value,
  defaultValue,
  multiple,
  onOpenChange,
}: UseCustomDynamicSelectOptions<DataType, ApiResponse, ApiParams>) {
  // 1. Merge config with defaults
  const dynamicConfig = useMemo(
    () =>
      mergeDynamicConfig({
        defaultConfig: defaultDynamicSelectConfig,
        config: dynamicConfigProps,
      }),
    [dynamicConfigProps],
  );

  // 2. Fetch data
  const { options, total, loading, isLoadingMore, fetchData, fetchLoadMore } =
    useFetchData<DataType, ApiResponse, ApiParams>(dynamicConfig);

  // 3. Open state + fetch trigger
  const [open, setOpen] = useState(false);
  const hasFetchedOnOpenRef = useRef(false);

  const handleSearch = useCallback(
    (search: string) => fetchData({ search } as Partial<ApiParams>),
    [fetchData],
  );

  // 4. Search
  const {
    searchValue,
    handleInlineSearch,
    handleMenuSearchChange,
    resetSearch,
  } = useSearch({
    debounce: dynamicConfig.search?.debounce,
    onSearch: handleSearch,
  });

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      onOpenChange?.(nextOpen);
      setOpen(nextOpen);

      if (!nextOpen) {
        resetSearch();
        if (searchValue) {
          void fetchData({ search: "" } as Partial<ApiParams>);
        }
      }
    },
    [fetchData, onOpenChange, resetSearch, searchValue],
  );

  // 5. Load more
  const {
    handleLoadMoreClick,
    handlePopupScroll,
    loadMoreConfig,
    canLoadMore,
  } = useLoadMore({
    dynamicConfig,
    fetchLoadMore,
    loading,
    isLoadingMore,
    loadedCount: options.length,
    total,
  });

  // 6. Merge pre-loaded options for edit mode
  const selectedValues = useMemo(
    () =>
      normalizeSelectValues(value ?? defaultValue, {
        mode: multiple ? "multiple" : undefined,
      }),
    [defaultValue, multiple, value],
  );

  const mergedOptions = useMemo(
    () =>
      mergeOptionsWithCurrent({
        fetchedOptions: options,
        currentOptions: resolveCurrentOptions(dynamicConfig),
        selectedValues,
      }),
    [dynamicConfig, options, selectedValues],
  );

  // 7. Fetch on mount or first open
  useEffect(() => {
    if (dynamicConfig.api.trigger === FETCH_TRIGGER.MOUNT) {
      void fetchData();
      return;
    }

    if (open && !hasFetchedOnOpenRef.current) {
      hasFetchedOnOpenRef.current = true;
      void fetchData();
    }
  }, [dynamicConfig.api.trigger, fetchData, open]);

  return {
    dynamicConfig,
    options: mergedOptions,
    loading,
    totalNumber: total,
    isLoadingMore,
    canLoadMore,
    loadMoreConfig,
    open,
    handleOpenChange,
    handlePopupScroll,
    handleLoadMoreClick,
    searchValue,
    handleInlineSearch,
    handleMenuSearchChange,
  };
}
```

---

## Step-by-step: custom component

Wire the hook to your own markup:

```tsx
import { SEARCH_PLACEMENT } from "@zealamic/react-dynamic-select";
import type { DynamicSelectConfig } from "@zealamic/react-dynamic-select";

type User = { id: number; fullName: string };
type ApiParams = { page?: number; pageSize?: number; search?: string };
type ApiResponse = { data: User[]; total: number };

const config = {
  api: {
    fetch: fetchUsers,
    params: { page: 1, pageSize: 10, search: "" },
  },
  list: { path: "data" },
  total: { path: "total" },
  option: { template: { label: "fullName", value: "id" } },
} satisfies DynamicSelectConfig<User, ApiResponse, ApiParams>;

function CustomUserSelect() {
  const [value, setValue] = useState<number | null>(null);

  const {
    options,
    loading,
    open,
    handleOpenChange,
    handlePopupScroll,
    handleLoadMoreClick,
    handleMenuSearchChange,
    searchValue,
    totalNumber,
    canLoadMore,
    loadMoreConfig,
    isLoadingMore,
    dynamicConfig,
  } = useCustomDynamicSelect({ dynamicConfig: config, value });

  const isMenuSearch =
    dynamicConfig.search?.placement === SEARCH_PLACEMENT.MENU;

  return (
    <div>
      <button type="button" onClick={() => handleOpenChange(!open)}>
        {value != null
          ? (options.find((o) => o.value === value)?.label ?? value)
          : "Select a user"}
      </button>

      {open && (
        <div>
          {isMenuSearch && (
            <input
              value={searchValue}
              onChange={handleMenuSearchChange}
              placeholder="Search..."
            />
          )}

          <div
            onScroll={handlePopupScroll}
            style={{ maxHeight: 200, overflow: "auto" }}
          >
            {loading ? (
              <p>Loading...</p>
            ) : (
              options.map((option) => (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => {
                    setValue(option.value as number);
                    handleOpenChange(false);
                  }}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>

          <footer>
            <span>Total: {totalNumber}</span>
            {loadMoreConfig?.type === "click" && canLoadMore && (
              <button
                type="button"
                onClick={handleLoadMoreClick}
                disabled={loading || isLoadingMore}
              >
                {isLoadingMore
                  ? "Loading..."
                  : (loadMoreConfig.label ?? "Load More")}
              </button>
            )}
          </footer>
        </div>
      )}
    </div>
  );
}
```

---

## Checklist

When building a custom dynamic select, make sure you handle:

1. **Config merge** — `mergeDynamicConfig` + `defaultDynamicSelectConfig`
2. **Fetch trigger** — `FETCH_TRIGGER.MOUNT` vs `FETCH_TRIGGER.OPEN`
3. **Search** — wire `useSearch` to `fetchData({ search })`; reset on close
4. **Load more** — attach `handlePopupScroll` to the scrollable list; render a button for click mode
5. **Edit mode** — pass `currentData` and use `mergeOptionsWithCurrent` so selected values display before fetch
6. **Option template** — map your API shape via `list.path`, `total.path`, and `option.template`

## See also

- [README.md](https://github.com/zealamic/react-dynamic-select/blob/main/README.md#dynamic-config-properties) — `dynamicConfig` property reference
- [MUI.md](https://github.com/zealamic/react-dynamic-select/blob/main/docs/MUI.md) — MUI integration
- [BASE-UI.md](https://github.com/zealamic/react-dynamic-select/blob/main/docs/BASE-UI.md) — Base UI headless integration with slot components
- `src/components/antd/hooks/use-dynamic-select.ts` — reference implementation
