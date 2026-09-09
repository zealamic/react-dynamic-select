# Headless — build your own

Entry: `@zealamic/react-dynamic-select` (no UI components).

Use for custom design systems, native markup, or wrappers not shipped in the library.

## Import

```tsx
import {
  defaultDynamicSelectConfig,
  useFetchData,
  useSearch,
  useLoadMore,
  FETCH_TRIGGER,
  LOAD_MORE_TYPE,
  SEARCH_PLACEMENT,
  mergeDynamicConfig,
  mergeOptionsWithCurrent,
  normalizeSelectValues,
  resolveCurrentOptions,
  resolveOptionFromTemplate,
  resolveSelectEmptyMessage,
  resolveSelectLoadingMessage,
  shouldShowListFooter,
  shouldShowLoadMoreStatusChip,
  shouldShowTotalLabel,
  isSelectSearchDisabled,
} from "@zealamic/react-dynamic-select";

import type {
  DynamicSelectConfig,
  ResolvedOption,
  SelectMessages,
} from "@zealamic/react-dynamic-select";
```

## Architecture pattern

All UI adapters follow:

1. `mergeDynamicConfig({ defaultConfig, config })`
2. `useFetchData(dynamicConfig)` — options, loading, fetch, load more
3. `useSearch({ debounce, onSearch })` — wire to `fetchData({ search })`
4. `useLoadMore(...)` — scroll / click pagination
5. Open state + `FETCH_TRIGGER.OPEN | MOUNT`
6. `mergeOptionsWithCurrent` for edit mode
7. Render your UI

Reference implementations:

- `src/components/antd/hooks/use-dynamic-select.ts`
- `src/components/mui/hooks/use-dynamic-select.ts`
- `src/components/chakra/hooks/use-dynamic-select.ts`
- `src/components/base-ui/hooks/use-dynamic-select.ts`

## useFetchData

| Return | Description |
|---|---|
| `options` | Accumulated options |
| `total` | Total count from API |
| `loading` | Initial fetch |
| `isLoadingMore` | Pagination fetch |
| `fetchData(override?)` | Reset page 1; pass `{ search }` |
| `fetchLoadMore()` | Next page |

## useSearch

| Return | Description |
|---|---|
| `searchValue` | Current query |
| `handleInlineSearch` | `(value: string) => void` |
| `handleMenuSearchChange` | input onChange |
| `resetSearch` | Clear + cancel debounce |

## useLoadMore

| Return | Description |
|---|---|
| `handleLoadMoreClick` | Click mode |
| `handlePopupScroll` | Scroll mode |
| `loadMoreConfig` | Resolved config or null |
| `canLoadMore` | `loadedCount < total` |

## Utilities

| Function | Purpose |
|---|---|
| `resolveOptionFromTemplate` | API item → `ResolvedOption` |
| `resolveDataFromTemplate` | Dot path / `{placeholder}` in response |
| `normalizeSelectValues` | Extract ids from value (incl. labelInValue) |
| `mergeOptionsWithCurrent` | Inject `currentData` into options |
| `resolveSelectEmptyMessage` | Empty / no-results copy |
| `resolveSelectLoadingMessage` | Loading copy |
| `shouldShowTotalLabel` | Whether to render the footer total (`hidden` is not `true`) |
| `shouldShowListFooter` | Whether to render the footer (`isMenuFooterVisible` defaults to `true`) |
| `shouldShowLoadMoreStatusChip` | Whether to show the load-more chip when the footer is hidden |
| `isSelectSearchDisabled` | Whether to disable search during load more / loading |

## Minimal custom hook skeleton

```tsx
export function useCustomDynamicSelect(props) {
  const dynamicConfig = useMemo(
    () => mergeDynamicConfig({
      defaultConfig: defaultDynamicSelectConfig,
      config: props.dynamicConfig,
    }),
    [props.dynamicConfig],
  );

  const { options, total, loading, isLoadingMore, fetchData, fetchLoadMore } =
    useFetchData(dynamicConfig);

  const [open, setOpen] = useState(false);

  const handleSearch = useCallback(
    (search: string) => fetchData({ search }),
    [fetchData],
  );

  const { searchValue, handleInlineSearch, handleMenuSearchChange, resetSearch } =
    useSearch({ debounce: dynamicConfig.search?.debounce, onSearch: handleSearch });

  const { handleLoadMoreClick, handlePopupScroll, loadMoreConfig, canLoadMore } =
    useLoadMore({
      dynamicConfig,
      fetchLoadMore,
      loading,
      isLoadingMore,
      loadedCount: options.length,
      total,
    });

  const selectedValues = useMemo(
    () => normalizeSelectValues(props.value ?? props.defaultValue, {
      mode: props.multiple ? "multiple" : undefined,
    }),
    [props.defaultValue, props.multiple, props.value],
  );

  const mergedOptions = useMemo(
    () => mergeOptionsWithCurrent({
      fetchedOptions: options,
      currentOptions: resolveCurrentOptions(dynamicConfig),
      selectedValues,
    }),
    [dynamicConfig, options, selectedValues],
  );

  // Fetch on mount or first open — see useAntdDynamicSelect for full pattern

  return {
    dynamicConfig,
    options: mergedOptions,
    loading,
    totalNumber: total,
    open,
    handleLoadMoreClick,
    handlePopupScroll,
    searchValue,
    handleInlineSearch,
    handleMenuSearchChange,
    loadMoreConfig,
    canLoadMore,
    isLoadingMore,
  };
}
```

## Checklist

- [ ] Config merge with defaults
- [ ] Fetch trigger (open vs mount)
- [ ] Search → `fetchData({ search })`; reset on close
- [ ] Load more scroll + click footer
- [ ] `currentData` + `mergeOptionsWithCurrent`
- [ ] Option template (string + React component labels)
- [ ] Footer: `total`, `loadMore`, `add` button placements
- [ ] `total.hidden` — hide footer count; keep `total.path` for pagination (`shouldShowTotalLabel`)
- [ ] `isMenuFooterVisible: false` — hide the entire footer (`shouldShowListFooter`)
- [ ] Messages via `dynamicConfig.messages` or custom UI

## When to use headless vs Base UI

| Headless | Base UI |
|---|---|
| Fully custom markup | Combobox + styled defaults |
| No Base UI dependency | Slot overrides, shadcn mapping |
| You own all a11y/UX | Faster start, override what you need |

See [dynamicConfig](rds-dynamic-config.md).
