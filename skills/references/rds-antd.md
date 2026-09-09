# Ant Design — AntdDynamicSelect

Entry: `@zealamic/react-dynamic-select/antd`

## Install

```bash
npm install @zealamic/react-dynamic-select antd
# yarn add / pnpm add
```

Peers: `react >= 19`, `antd >= 5`.

## Import

```tsx
import {
  AntdDynamicSelect,
  useAntdDynamicSelect,
  SEARCH_PLACEMENT,
  LOAD_MORE_TYPE,
  FETCH_TRIGGER,
} from "@zealamic/react-dynamic-select/antd";
import type { AntdDynamicSelectConfig } from "@zealamic/react-dynamic-select/antd";
```

## Quick start

```tsx
<AntdDynamicSelect
  placeholder="Select a user"
  style={{ width: 320 }}
  allowClear
  showSearch
  dynamicConfig={userListConfig}
/>
```

Extends all Ant Design `Select` props + `dynamicConfig`.

## Value

| Mode | Type |
|---|---|
| Single | `string \| number \| null` |
| Multiple | `mode="multiple"` → id array |
| labelInValue | supported |

## Search

- **Menu** (default): search input in dropdown.
- **Inline**: `search.placement: SEARCH_PLACEMENT.INLINE` **and** `showSearch={true}`.

```tsx
<AntdDynamicSelect
  showSearch
  allowClear
  dynamicConfig={{
    ...config,
    search: { placement: SEARCH_PLACEMENT.INLINE },
  }}
/>
```

## Load more / add button

```tsx
loadMore: { type: LOAD_MORE_TYPE.SCROLL }
loadMore: { type: LOAD_MORE_TYPE.CLICK }
add: { label: "Add user", placement: "start", onClick: () => {} }
total: { path: "total", hidden: true }  // hide "Total: N"; path still used for load more
isMenuFooterVisible: false              // hide footer; load-more spinner still shows as a chip
```

## Total label

Keep `total.path` for load more. Hide the footer count with `hidden: true`:

```tsx
total: { path: "total", hidden: true }
```

Hide the entire footer (total, load more, add):

```tsx
isMenuFooterVisible: false
```

## Custom option label

```tsx
option: {
  template: {
    label: ({ data }) => (
      <div>
        <div>{data.fullName}</div>
        <div style={{ fontSize: 12, color: "gray" }}>{data.email}</div>
      </div>
    ),
    value: "id",
  },
}
```

## Messages

Native `notFoundContent` overrides `dynamicConfig.messages`. Fallback uses `messages.noResults` / `messages.empty`.

## React Hook Form

```tsx
<Controller
  name="user"
  control={control}
  render={({ field }) => (
    <AntdDynamicSelect
      showSearch
      allowClear
      style={{ width: "100%" }}
      dynamicConfig={userListConfig}
      value={field.value}
      onChange={(value) => field.onChange(value ?? null)}
    />
  )}
/>
```

## Hook: useAntdDynamicSelect

Returns `options`, `loading`, `handleOpenChange`, `handlePopupScroll`, `handleLoadMoreClick`, `searchValue`, `handleInlineSearch`, `handleMenuSearchChange`, etc. Use for custom Antd Select UI.

## Notes

- Inline search requires `showSearch={true}`.
- Closing dropdown resets search and re-fetches page 1 if search was active.
- `listHeight` defaults to `200`.
- Fetch on first open unless `api.trigger: FETCH_TRIGGER.MOUNT`.
- `search.inputSearchMenuProps` → Ant Design `Input` props.
- Search inputs are disabled while load more is in progress.

See [dynamicConfig](rds-dynamic-config.md).
