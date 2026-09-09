# dynamicConfig reference

Shared by all `@zealamic/react-dynamic-select` entry points. Deep-merged with `defaultDynamicSelectConfig`.

## Defaults (from `defaultDynamicSelectConfig`)

```ts
{
  api: { params: { page: 1, pageSize: 10, search: "" }, trigger: "open" },
  list: { path: "list" },
  total: { path: "total", label: "Total", hidden: false },
  option: { template: { label: "label", value: "value" } },
  search: { placement: "menu", debounce: 500, inputSearchMenuProps: { placeholder: "Search..." } },
  loadMore: { type: "click", threshold: 100, distance: 100, debounce: 100 },
  messages: { loading: "Loading...", empty: "No items found", noResults: "No results found." },
  isMenuFooterVisible: true,
}
```

## api

| Field | Type | Notes |
|---|---|---|
| `fetch` | `(params) => Promise<ApiResponse>` | Required for async |
| `params` | `{ page, pageSize \| limit, search, ... }` | Sent on every request |
| `trigger` | `"open"` \| `"mount"` | First fetch timing |
| `onSuccess` | `(data) => void` | After successful fetch |
| `onError` | `(error) => void` | On fetch failure |

## list / total / option

```tsx
list: { path: "data" },           // dot path to array in response
total: {
  path: "total",                  // still used for load more
  label: "Total",
  hidden: false,                  // true = hide footer count, keep path
},
option: {
  template: {
    label: "fullName",            // field, "{a} {b}", or FC
    value: "id",
  },
},
```

## currentData (edit mode)

Pre-load selected item(s) not yet in fetched list:

```tsx
currentData: presetUser,          // single
currentData: [user1, user2],      // multiple
defaultValue: presetUser.id,
```

## search

```tsx
search: {
  placement: SEARCH_PLACEMENT.MENU,  // or INLINE
  debounce: 500,
  inputSearchMenuProps: { placeholder: "Search user" },
}
```

Menu search props type varies by UI: Antd `Input`, MUI `TextField`, Chakra/Base UI `ComboboxInput`.

## loadMore

```tsx
loadMore: true,  // click mode defaults
loadMore: {
  type: LOAD_MORE_TYPE.SCROLL,  // or CLICK
  label: "Load More",
  loadingLabel: "Loading...",
  threshold: 100,
  distance: 100,
  debounce: 100,
  afterFetch: async (data) => {},
},
```

Attach scroll handler to list container; render button for click mode.

## add (footer action)

```tsx
add: {
  label: "Add user",
  placement: "start",  // or "end"
  onClick: () => {},
  icon: <PlusIcon />,
  disabled: false,
},
```

## Footer visibility

Default `true`. Set `false` to hide the entire dropdown footer (total, load more button, add):

```tsx
isMenuFooterVisible: false
```

Load more via **scroll** still works when the footer is hidden. While extra pages load, a small status chip appears at the bottom-right of the menu. Click-to-load needs the footer button.

## messages

```tsx
messages: {
  loading: "Loading...",
  empty: "No items found",
  noResults: "No results found.",
}
```

Set a key to `null` to hide that message. Variant overrides:

| Variant | Native prop (wins if set) |
|---|---|
| MUI | `noOptionsText`, `loadingText` |
| Ant Design | `notFoundContent` |

## TypeScript generics

```tsx
DynamicSelectConfig<DataType, ApiResponse, ApiParams, InputSearchProps>
```

`ApiParams` must extend `{ search?: string }`.

## Headless utilities

```tsx
import {
  mergeDynamicConfig,
  resolveOptionFromTemplate,
  mergeOptionsWithCurrent,
  resolveSelectEmptyMessage,
  resolveSelectLoadingMessage,
  resolveSelectNoOptionsMessage,
  shouldShowListFooter,
  shouldShowTotalLabel,
} from "@zealamic/react-dynamic-select";
```
